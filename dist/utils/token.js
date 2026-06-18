"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFileName = sanitizeFileName;
function sanitizeFileName(value) {
    return String(value || "")
        .replace(/[^\w\-]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 60);
}
