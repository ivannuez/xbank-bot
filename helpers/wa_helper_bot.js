require('dotenv').config();
var Message = require("../models/message");

var wa_helper_bot = {
    parse_msg_text: (req, text) => {
        let message = Message();
        message.id = req.data.messages[0].id;
        message.messaging_product = req.data.messaging_product;
        message.metadata.display_phone_number = 'xBank';
        message.metadata.phone_number_id = process.env.PHONE_NUMBER_ID_EMPRESA;

        message.contacts.profile_name = 'xBank';
        message.contacts.wa_id = process.env.PHONE_NUMBER_ID_EMPRESA;

        message.messages.from = process.env.PHONE_NUMBER_ID_EMPRESA;
        message.messages.id = req.data.messages[0].id;
        message.messages.timestamp = '0';
        message.messages.text.body = text;
        message.messages.type = "text";

        return message;
    },
}

module.exports = wa_helper_bot;