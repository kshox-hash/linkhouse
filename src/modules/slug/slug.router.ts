import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth_middleware";
import { insertSlugController } from "./slug.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  insertSlugController
);

export default router;