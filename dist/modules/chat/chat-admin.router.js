"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const multer = require("multer");
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const chat_admin_controller_1 = require("./chat-admin.controller");
const router = express_1.default.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Solo se aceptan archivos PDF."));
        }
    },
});
router.post("/chat/:userId/upload", auth_middleware_1.authMiddleware, upload.single("pdf"), chat_admin_controller_1.chatAdminController.uploadPdf);
router.get("/chat/:userId/sources", auth_middleware_1.authMiddleware, chat_admin_controller_1.chatAdminController.listSources);
router.delete("/chat/:userId/sources/:sourceId", auth_middleware_1.authMiddleware, chat_admin_controller_1.chatAdminController.deleteSource);
exports.default = router;
