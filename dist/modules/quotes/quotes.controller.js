"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quotesSubmitController = void 0;
const fs_1 = __importDefault(require("fs"));
const slug_service_1 = require("../slug/slug.service");
const products_repository_1 = require("../quotes/products/products.repository");
const quote_service_1 = require("../quotes/quote.service");
const quote_email_service_1 = require("../quotes/quote-email.service");
const notification_service_1 = require("../notifications/notification.service");
const stadistics_service_1 = require("../stadistics/stadistics.service");
const statsService = new stadistics_service_1.StatisticsService();
exports.quotesSubmitController = {
    async submit(req, res) {
        const { publicSlug } = req.params;
        const { customer, items } = req.body;
        try {
            // 1. Validaciones básicas
            if (!publicSlug?.trim()) {
                return res.status(400).json({ ok: false, message: "Slug inválido." });
            }
            if (!customer?.name?.trim() || !customer?.phone?.trim()) {
                return res.status(400).json({ ok: false, message: "Nombre y teléfono son obligatorios." });
            }
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ ok: false, message: "Selecciona al menos un producto." });
            }
            // 2. Obtener negocio
            const slug = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!slug) {
                return res.status(404).json({ ok: false, message: "Negocio no encontrado." });
            }
            // 3. Obtener productos activos del negocio
            const allProducts = await (0, products_repository_1.getProductsRepository)(slug.user_id);
            // 4. Cruzar items seleccionados con productos reales (nunca confiar en precios del cliente)
            const lines = items
                .map((item) => {
                const product = allProducts.find((p) => String(p.id) === String(item.productId));
                if (!product || item.quantity <= 0)
                    return null;
                const unitPrice = Number(product.price || 0);
                const quantity = Math.max(1, Math.floor(item.quantity));
                return {
                    name: product.name,
                    description: product.description || "",
                    quantity,
                    unitPrice,
                    subtotal: unitPrice * quantity,
                };
            })
                .filter(Boolean);
            if (lines.length === 0) {
                return res.status(400).json({ ok: false, message: "Ningún producto válido seleccionado." });
            }
            const total = lines.reduce((acc, l) => acc + l.subtotal, 0);
            // 5. Generar PDF — adaptamos el record que espera generateQuotePdf
            const record = {
                token: `${publicSlug}-${Date.now()}`,
                config: {
                    brand: slug.business_name || slug.public_slug,
                    title: "Cotización",
                    subtitle: "",
                },
            };
            const submitBody = {
                customer: {
                    name: customer.name,
                    email: customer.email || "",
                    phone: customer.phone,
                    notes: customer.message || "",
                },
                items,
            };
            const { fileName, filePath } = await (0, quote_service_1.generateQuotePdf)({
                token: `${publicSlug}-${Date.now()}`,
                brand: slug.business_name || slug.public_slug,
                title: "Cotización",
                subtitle: "",
                customer: {
                    name: customer.name,
                    email: customer.email || "",
                    phone: customer.phone,
                    notes: customer.message || "",
                },
                lines,
                total,
            });
            if (customer.email?.trim()) {
                try {
                    console.log("[quotesSubmit] Enviando correo a:", customer.email.trim());
                    await (0, quote_email_service_1.sendQuoteEmail)({
                        to: customer.email.trim(),
                        customerName: customer.name,
                        brandName: slug.business_name || slug.public_slug,
                        pdfPath: filePath,
                        pdfFileName: fileName,
                        items: lines,
                        total,
                    });
                    console.log("[quotesSubmit] Correo enviado OK");
                }
                catch (emailError) {
                    console.error("[quotesSubmit] Error enviando correo:", emailError?.message);
                    // No bloqueamos la respuesta si falla el correo
                }
                finally {
                    fs_1.default.unlink(filePath, () => { });
                }
            }
            else {
                fs_1.default.unlink(filePath, () => { });
            }
            await notification_service_1.notificationService.quoteCreated({
                userId: slug.user_id,
                customerName: customer.name,
            });
            statsService.increment(slug.user_id, "quote_submitted").catch(() => { });
            return res.status(200).json({
                ok: true,
                message: customer.email?.trim()
                    ? "¡Cotización enviada! Revisa tu correo."
                    : "Cotización recibida. Nos contactaremos pronto.",
            });
        }
        catch (error) {
            console.error("[quotesSubmit] Error:", error?.message || error);
            console.error("[quotesSubmit] Stack:", error?.stack);
            return res.status(500).json({ ok: false, message: "Error procesando la cotización." });
        }
    }
};
