"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBookingHtml = renderBookingHtml;
const html_1 = require("../../utils/html");
const bookingHtmlShell_1 = require("../calendar/booking/bookingHtmlShell");
const bookingStyles_1 = require("../calendar/booking/bookingStyles");
const bookingScript_1 = require("../calendar/booking/scripts/bookingScript");
function renderBookingHtml(data) {
    const viewModel = {
        publicSlug: data.publicSlug,
        title: (0, html_1.escapeHtml)(data.title || "Reservar hora"),
        brand: (0, html_1.escapeHtml)(data.brand || "Automatiza Fácil"),
        subtitle: (0, html_1.escapeHtml)(data.subtitle || "Elige el día y la hora que mejor se adapte a ti."),
        successMessage: (0, html_1.escapeHtml)(data.successMessage || "¡Hora reservada correctamente!"),
    };
    return (0, bookingHtmlShell_1.renderBookingHtmlShell)({
        ...viewModel,
        styles: (0, bookingStyles_1.renderBookingStyles)(),
        script: (0, bookingScript_1.renderBookingScript)({
            publicSlug: viewModel.publicSlug,
            successMessage: viewModel.successMessage,
        }),
    });
}
