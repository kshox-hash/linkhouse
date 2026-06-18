"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_public_controller_1 = require("./chat-public.controller");
const router = express_1.default.Router();
router.get("/public/:publicSlug/products", chat_public_controller_1.chatPublicController.getProducts);
router.post("/public/:publicSlug/chat", chat_public_controller_1.chatPublicController.answer);
exports.default = router;
