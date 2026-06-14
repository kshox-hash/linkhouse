import express from "express";
import { chatPublicController } from "./chat-public.controller";

const router = express.Router();

router.get("/public/:publicSlug/products", chatPublicController.getProducts);
router.post("/public/:publicSlug/chat",    chatPublicController.answer);

export default router;
