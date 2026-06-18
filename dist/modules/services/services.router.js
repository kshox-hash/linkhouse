"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const services_controller_1 = require("./services.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
router.get("/services/:userId", services_controller_1.servicesController.list);
router.post("/services/:userId", services_controller_1.servicesController.create);
router.put("/services/:userId/:serviceId", services_controller_1.servicesController.update);
router.delete("/services/:userId/:serviceId", services_controller_1.servicesController.remove);
exports.default = router;
