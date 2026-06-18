"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const admin_controller_1 = require("./admin.controller");
const router = express_1.default.Router();
router.get("/api/admin/is-admin", auth_middleware_1.authMiddleware, admin_controller_1.adminController.checkIsAdmin);
router.get("/api/admin/users", auth_middleware_1.authMiddleware, admin_controller_1.adminController.getUsers);
router.patch("/api/admin/users/:userId/fee", auth_middleware_1.authMiddleware, admin_controller_1.adminController.updateFee);
exports.default = router;
