"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const clients_controller_1 = require("./clients.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
router.get("/clients/:userId", clients_controller_1.clientsController.list);
router.get("/clients/:userId/:email/bookings", clients_controller_1.clientsController.bookings);
router.post("/clients/:userId/email", clients_controller_1.clientsController.sendEmail);
exports.default = router;
