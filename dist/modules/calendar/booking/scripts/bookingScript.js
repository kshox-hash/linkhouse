"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBookingScript = renderBookingScript;
const bookingState_1 = require("./bookingState");
const bookingDom_1 = require("./bookingDom");
const bookingHelpers_1 = require("./bookingHelpers");
const bookingStepNavigation_1 = require("./bookingStepNavigation");
const bookingDateRenderer_1 = require("./bookingDateRenderer");
const bookingTimeRenderer_1 = require("./bookingTimeRenderer");
const bookingSubmitHandler_1 = require("./bookingSubmitHandler");
const bookingSlotsLoader_1 = require("./bookingSlotsLoader");
const bookingServiceLoader_1 = require("./bookingServiceLoader");
const bookingIcons_1 = require("../bookingIcons");
function renderBookingScript(config) {
    return `
const PUBLIC_SLUG = ${JSON.stringify(config.publicSlug)};
const SUCCESS = ${JSON.stringify(config.successMessage)};

${(0, bookingState_1.bookingStateScript)()}
${(0, bookingDom_1.bookingDomScript)()}
${(0, bookingHelpers_1.bookingHelpersScript)()}
${(0, bookingIcons_1.bookingIconsScript)()}
${(0, bookingStepNavigation_1.bookingStepNavigationScript)()}
${(0, bookingDateRenderer_1.bookingDateRendererScript)()}
${(0, bookingTimeRenderer_1.bookingTimeRendererScript)()}
${(0, bookingSubmitHandler_1.bookingSubmitHandlerScript)()}
${(0, bookingSlotsLoader_1.bookingSlotsLoaderScript)()}
${(0, bookingServiceLoader_1.bookingServiceLoaderScript)()}

initStepNavigation();
initSubmitHandler();
loadServices();
`;
}
