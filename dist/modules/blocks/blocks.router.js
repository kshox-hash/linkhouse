"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../middlewares/auth_middleware");
const blocks_controller_1 = require("./blocks.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authMiddleware);
router.get("/blocks/:userId", blocks_controller_1.blocksController.list);
router.post("/blocks/:userId", blocks_controller_1.blocksController.create);
router.delete("/blocks/:userId/:blockId", blocks_controller_1.blocksController.remove);
exports.default = router;
