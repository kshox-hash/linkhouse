"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrencyCLP = formatCurrencyCLP;
function formatCurrencyCLP(value) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}
