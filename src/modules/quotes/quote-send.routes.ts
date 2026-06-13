import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { quoteSendController } from "./quote-send.controller";

const router = Router();

router.post("/quotes/send", authMiddleware, quoteSendController.send);

export default router;
