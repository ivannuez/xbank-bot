var Message = require("../models/message");

var wa_helper_cli = {
    parse_msg_text: (req) => {
        if (req.body.object) {
            if (
                req.body.entry &&
                req.body.entry[0].changes &&
                req.body.entry[0].changes[0] &&
                req.body.entry[0].changes[0].value.messages &&
                req.body.entry[0].changes[0].value.messages[0]
            ) {
                let message = Message();
                message.id = req.body.entry[0].id;
                message.messaging_product = req.body.entry[0].changes[0].value.messaging_product;
                message.metadata.display_phone_number = req.body.entry[0].changes[0].value.metadata.display_phone_number;
                message.metadata.phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;

                message.contacts.profile_name = req.body.entry[0].changes[0].value.contacts[0].profile.name;
                message.contacts.wa_id = req.body.entry[0].changes[0].value.contacts[0].wa_id;

                message.messages.from = req.body.entry[0].changes[0].value.messages[0].from;
                message.messages.id = req.body.entry[0].changes[0].value.messages[0].id;
                message.messages.timestamp = req.body.entry[0].changes[0].value.messages[0].timestamp;
                message.messages.text.body = req.body.entry[0].changes[0].value.messages[0].text.body;
                message.messages.type = req.body.entry[0].changes[0].value.messages[0].type;

                return message;
            }
        }
    },
}

module.exports = wa_helper_cli;