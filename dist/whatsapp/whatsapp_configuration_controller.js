"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppController = void 0;
const whatsapp_configuration_repository_1 = require("./whatsapp_configuration_repository");
const whatsapp_service_1 = require("./whatsapp.service");
const sendWhatsAppController = async (req, res) => {
    try {
        const { userId, recipientPhone, messageText } = req.body;
        if (!userId || !recipientPhone || !messageText) {
            return res.status(400).json({
                ok: false,
                message: "Faltan datos",
            });
        }
        const config = await (0, whatsapp_configuration_repository_1.findWhatsAppConfigByUserId)(userId);
        if (!config) {
            return res.status(404).json({
                ok: false,
                message: "Usuario sin configuración",
            });
        }
        await (0, whatsapp_service_1.sendWhatsAppTextMessage)(recipientPhone, messageText, config.phone_number_id, config.whatsapp_access_token);
        return res.json({
            ok: true,
            message: "Mensaje enviado",
        });
    }
    catch (error) {
        console.error("Error:", error?.response?.data || error.message);
        return res.status(500).json({
            ok: false,
            message: "Error interno",
        });
    }
};
exports.sendWhatsAppController = sendWhatsAppController;
