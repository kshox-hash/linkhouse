"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPreference = createPreference;
exports.getPaymentById = getPaymentById;
const mercadopago_1 = require("mercadopago");
const APP_URL = process.env.PUBLIC_BASE_URL;
async function createPreference(input) {
    const client = new mercadopago_1.MercadoPagoConfig({
        accessToken: input.accessToken,
    });
    const preference = new mercadopago_1.Preference(client);
    const statementDescriptor = input.businessName
        ? input.businessName.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 22).trim()
        : undefined;
    const result = await preference.create({
        body: {
            items: [
                {
                    id: input.bookingId,
                    title: input.title,
                    description: input.description,
                    quantity: 1,
                    unit_price: input.amount,
                    currency_id: "CLP",
                },
            ],
            external_reference: input.bookingId,
            binary_mode: true,
            ...(input.customerEmail && {
                payer: {
                    name: input.customerName ?? "",
                    email: input.customerEmail,
                },
            }),
            ...(statementDescriptor && { statement_descriptor: statementDescriptor }),
            back_urls: {
                success: `${APP_URL}/payment/success`,
                failure: `${APP_URL}/payment/failure`,
                pending: `${APP_URL}/payment/pending`,
            },
            auto_return: "approved",
            notification_url: `${APP_URL}/api/payments/webhook`,
            ...(input.marketplaceFee && input.marketplaceFee > 0
                ? { marketplace_fee: input.marketplaceFee }
                : {}),
        },
    });
    return {
        preferenceId: result.id,
        checkoutUrl: result.init_point,
        sandboxUrl: result.sandbox_init_point,
    };
}
async function getPaymentById(accessToken, paymentId) {
    const client = new mercadopago_1.MercadoPagoConfig({
        accessToken,
    });
    const payment = new mercadopago_1.Payment(client);
    return payment.get({
        id: paymentId,
    });
}
