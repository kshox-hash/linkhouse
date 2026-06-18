"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const slug_controller_1 = require("./slug.controller");
const router = (0, express_1.Router)();
router.get("/slugs/me", auth_middleware_1.authMiddleware, slug_controller_1.getMySlugController);
router.post("/slugs", auth_middleware_1.authMiddleware, slug_controller_1.insertSlugController);
exports.default = router;
