"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicPortalController = void 0;
const slug_service_1 = require("../../slug/slug.service");
const quote_html_1 = require("../../quotes/quote-html");
const products_repository_1 = require("../../quotes/products/products.repository");
const company_profile_repository_1 = require("../../profiles/company_profile_repository");
const user_modules_repository_1 = require("../user-modules.repository");
const portal_screen_1 = require("./portal.screen");
const stadistics_service_1 = require("../../stadistics/stadistics.service");
const visit_tracker_1 = require("../../stadistics/visit-tracker");
const statsService = new stadistics_service_1.StatisticsService();
exports.publicPortalController = {
    async openQuotes(req, res) {
        try {
            const { publicSlug } = req.params;
            if (!publicSlug || !publicSlug.trim()) {
                return res.status(400).send("Slug público obligatorio");
            }
            //GET SLUG TO CHEK IF SHOP EXIST
            const slug = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!slug) {
                return res.status(404).send("Negocio no encontrado");
            }
            const products = await (0, products_repository_1.getProductsRepository)(slug.user_id);
            const html = (0, quote_html_1.quoteHtml)({
                brand: slug.business_name,
                title: slug.business_name,
                subTitle: "Selecciona un servicio para continuar.",
                products: products,
                publicSlug: publicSlug
            });
            return res.status(200).send(html);
        }
        catch (error) {
            return res.status(500).send("Error opening QuotesView");
        }
    },
    async open(req, res) {
        try {
            const { publicSlug } = req.params;
            if (!publicSlug || !publicSlug.trim()) {
                return res.status(400).send("Slug público obligatorio");
            }
            const slug = await (0, slug_service_1.getSlugByValueService)(publicSlug);
            if (!slug) {
                return res.status(404).send("Negocio no encontrado");
            }
            const [products, profile, enabledModules] = await Promise.all([
                (0, products_repository_1.getActiveProductsRepository)(slug.user_id),
                company_profile_repository_1.companyProfileRepository.getByUserId(slug.user_id),
                (0, user_modules_repository_1.findEnabledModulesByUserId)(slug.user_id),
            ]);
            const html = (0, portal_screen_1.renderPortalHtml)({
                businessName: slug.business_name ?? publicSlug,
                publicSlug,
                userId: slug.user_id,
                productCount: products.length,
                phone: profile?.phone ?? null,
                address: profile?.address ?? null,
                city: profile?.city ?? null,
                brandColor: profile?.brand_color ?? null,
                description: profile?.description ?? null,
                welcomeMessage: profile?.welcome_message ?? null,
                instagramUrl: profile?.instagram_url ?? null,
                whatsappNumber: profile?.whatsapp_number ?? null,
                businessHours: profile?.business_hours ?? null,
                enabledModules,
                products: products.map((p) => ({
                    id: String(p.id),
                    name: String(p.name || ""),
                    price: Number(p.price || 0),
                    description: p.description ?? null,
                })),
            });
            const ip = req.ip ?? req.socket?.remoteAddress ?? "";
            const ua = req.headers["user-agent"];
            if (!(0, visit_tracker_1.isBot)(ua) && (0, visit_tracker_1.shouldCountVisit)(ip, slug.user_id)) {
                statsService.increment(slug.user_id, "link_opens").catch(() => { });
            }
            return res.status(200).send(html);
        }
        catch (error) {
            return res.status(500).send("Error abriendo portal público");
        }
    },
};
