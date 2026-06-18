"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("./products/products.controller");
const auth_middleware_1 = require("../../middlewares/auth_middleware"); // ajusta el path
const router = (0, express_1.Router)();
router.get("/public/:userId", products_controller_1.productsController.getActivePublic);
// Rutas protegidas
router.post("/", auth_middleware_1.authMiddleware, products_controller_1.productsController.create);
router.get("/", auth_middleware_1.authMiddleware, products_controller_1.productsController.getAll);
router.get("/:productId", auth_middleware_1.authMiddleware, products_controller_1.productsController.getById);
router.put("/:productId", auth_middleware_1.authMiddleware, products_controller_1.productsController.update);
router.delete("/:productId", auth_middleware_1.authMiddleware, products_controller_1.productsController.delete);
exports.default = router;
