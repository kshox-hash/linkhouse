import express from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { blocksController } from "./blocks.controller";

const router = express.Router();

router.get("/blocks/:userId",             authMiddleware, blocksController.list);
router.post("/blocks/:userId",            authMiddleware, blocksController.create);
router.delete("/blocks/:userId/:blockId", authMiddleware, blocksController.remove);

export default router;
