"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteSendController = void 0;
const fs_1 = __importDefault(require("fs"));
const quote_service_1 = require("./quote.service");
const quote_email_service_1 = require("./quote-email.service");
const slug_service_1 = require("../slug/slug.service");
const company_profile_service_1 = require("../profiles/company_profile.service");
const quote_history_repository_1 = require("./quote-history/quote-history.repository");
exports.quoteSendController = {
    async send(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId)
                return res.status(401).json({ ok: false, message: "No autorizado" });
            const { client, products, message, templateType = "rapida", extraFields = {}, } = req.body;
            if (!client?.name?.trim() || !client?.email?.trim()) {
                return res.status(400).json({ ok: false, message: "Nombre y email del cliente son obligatorios." });
            }
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ ok: false, message: "Se requiere al menos un producto." });
            }
            // Cargar datos del negocio en paralelo
            const [slug, profile] = await Promise.all([
                (0, slug_service_1.getSlugByUserIdService)(userId).catch(() => null),
                company_profile_service_1.companyProfileService.getByUserId(userId).catch(() => null),
            ]);
            const brandName = profile?.business_name ||
                slug?.business_name ||
                slug?.public_slug ||
                "Mi negocio";
            const brandAddress = [profile?.address, profile?.city]
                .filter(Boolean)
                .join(", ") || undefined;
            const lines = products.map((p) => {
                const unitPrice = Number(p.price || 0);
                const quantity = Math.max(1, Number(p.quantity || 1));
                return {
                    name: p.title || "Servicio",
                    description: p.description || "",
                    quantity,
                    unitPrice,
                    subtotal: unitPrice * quantity,
                };
            });
            const total = lines.reduce((acc, l) => acc + l.subtotal, 0);
            const docTitle = templateType === "eventos" ? "Propuesta" : "Cotización";
            const { fileName, filePath } = await (0, quote_service_1.generateQuotePdf)({
                token: `custom-${userId}-${Date.now()}`,
                brand: brandName,
                brandRut: profile?.rut || undefined,
                brandAddress,
                brandPhone: profile?.phone || undefined,
                title: docTitle,
                subtitle: profile?.description || "",
                templateType: templateType,
                customer: {
                    name: client.name,
                    email: client.email,
                    phone: client.phone || "",
                    notes: message || "",
                },
                lines,
                total,
                extraFields,
            });
            try {
                await (0, quote_email_service_1.sendQuoteEmail)({
                    to: client.email,
                    customerName: client.name,
                    brandName,
                    pdfPath: filePath,
                    pdfFileName: fileName,
                    items: lines,
                    total,
                });
            }
            finally {
                fs_1.default.unlink(filePath, () => { });
            }
            // Guardar en historial (no bloquea la respuesta)
            (0, quote_history_repository_1.saveQuoteHistory)({
                userId,
                templateType,
                clientName: client.name,
                clientEmail: client.email,
                clientPhone: client.phone,
                items: products,
                total,
                message,
                extraFields,
            }).catch((err) => console.error("[quoteSend] historial:", err));
            return res.status(200).json({ ok: true, message: "Cotización enviada correctamente." });
        }
        catch (error) {
            return res.status(500).json({ ok: false, message: error?.message || "Error enviando cotización." });
        }
    },
};
