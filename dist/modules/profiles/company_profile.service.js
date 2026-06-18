"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProfileService = void 0;
const company_profile_repository_1 = require("./company_profile_repository");
const getByUserId = async (userId) => {
    if (!userId || !userId.trim()) {
        throw new Error("userId es obligatorio");
    }
    return company_profile_repository_1.companyProfileRepository.getByUserId(userId.trim());
};
const getByPublicSlug = async (publicSlug) => {
    const slug = publicSlug.trim().toLowerCase();
    if (!slug) {
        throw new Error("publicSlug es obligatorio");
    }
    return company_profile_repository_1.companyProfileRepository.getByPublicSlug(slug);
};
const upsert = async (input) => {
    if (!input.user_id || !input.user_id.trim()) {
        throw new Error("user_id es obligatorio");
    }
    if (!input.business_name || !input.business_name.trim()) {
        throw new Error("business_name es obligatorio");
    }
    const sanitizedInput = {
        user_id: input.user_id.trim(),
        business_name: input.business_name.trim(),
        rut: input.rut?.trim() ? input.rut.trim() : null,
        city: input.city?.trim() ?? "",
        address: input.address?.trim() ?? "",
        phone: input.phone?.trim() ?? "",
        brand_color: input.brand_color ?? null,
        description: input.description?.trim() || null,
        welcome_message: input.welcome_message?.trim() || null,
        instagram_url: input.instagram_url?.trim() || null,
        whatsapp_number: input.whatsapp_number?.replace(/\D/g, "") || null,
        business_hours: input.business_hours?.trim() || null,
    };
    return company_profile_repository_1.companyProfileRepository.upsert(sanitizedInput);
};
exports.companyProfileService = {
    getByUserId,
    getByPublicSlug,
    upsert,
};
