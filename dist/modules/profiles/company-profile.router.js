"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const company_profile_controller_1 = require("./company_profile.controller");
const router = (0, express_1.Router)();
// Pública — no requiere auth
router.get("/public/business/:slug", company_profile_controller_1.companyProfileController.getByPublicSlug);
// Rutas privadas
router.get("/company-profile/me", auth_middleware_1.authMiddleware, company_profile_controller_1.companyProfileController.getMe);
router.post("/company-profile/me", auth_middleware_1.authMiddleware, company_profile_controller_1.companyProfileController.upsertMe);
router.get("/company-profile/:userId", auth_middleware_1.authMiddleware, company_profile_controller_1.companyProfileController.getByUserId);
router.post("/company-profile", auth_middleware_1.authMiddleware, company_profile_controller_1.companyProfileController.upsert);
exports.default = router;
