"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingStateScript = bookingStateScript;
function bookingStateScript() {
    return `
let allSlots = [];
let selDate = null;
let selTime = null;
let currentStep = 1;
let selServiceId = null;
let selServiceName = null;
let selServicePrice = null;
`;
}
