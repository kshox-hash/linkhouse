"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blocksController = void 0;
const blocks_repository_1 = require("./blocks.repository");
function uid(req) {
    return String(req.params["userId"]);
}
function isForbidden(req) {
    return req.user?.userId !== uid(req);
}
exports.blocksController = {
    async list(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const blocks = await (0, blocks_repository_1.getBlocks)(uid(req));
            return res.json({ ok: true, blocks });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
    async create(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const { startAt, endAt, reason } = req.body;
            if (!startAt || !endAt) {
                return res.status(400).json({ ok: false, message: "startAt y endAt son requeridos" });
            }
            if (new Date(endAt) <= new Date(startAt)) {
                return res.status(400).json({ ok: false, message: "endAt debe ser posterior a startAt" });
            }
            const block = await (0, blocks_repository_1.createBlock)(uid(req), String(startAt), String(endAt), reason ? String(reason) : null);
            return res.status(201).json({ ok: true, block });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
    async remove(req, res) {
        try {
            if (isForbidden(req))
                return res.status(403).json({ ok: false, message: "Forbidden" });
            const id = String(req.params["blockId"]);
            await (0, blocks_repository_1.deleteBlock)(id, uid(req));
            return res.json({ ok: true });
        }
        catch (e) {
            return res.status(500).json({ ok: false, message: e?.message });
        }
    },
};
