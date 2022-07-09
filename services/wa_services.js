require('dotenv').config();
const axios = require("axios").default;

const headers = {
    "Content-Type": "application/json"
};

var wa_services = {
    //FUNCIONA
    send_msg_template: async (from, template) => {
        const res = await axios({
            headers: headers,
            method: "POST",
            url: "https://graph.facebook.com/v12.0/" +
                process.env.PHONE_NUMBER_ID_EMPRESA +
                "/messages?access_token=" +
                process.env.TOKEN_WA,
            data: {
                "messaging_product": "whatsapp",
                "to": from,
                "type": "template",
                "template": {
                    "name": "iniciar_flujo_cbas",
                    "language": {
                        "code": "en_US"
                    }
                }
            },
        });
        //console.log(JSON.stringify(res.data, null, 2))
        return res;
    },
    send_msg_text: async (from, msg) => {
        const res = await axios({
            headers: headers,
            method: "POST",
            url: "https://graph.facebook.com/v12.0/" +
                process.env.PHONE_NUMBER_ID_EMPRESA +
                "/messages?access_token=" +
                process.env.TOKEN_WA,
            data: {
                "messaging_product": "whatsapp",
                "to": from,
                "preview_url": false,
                "recipient_type": "individual",
                "type": "text",
                "text": {
                    "body": msg
                }
            },
        });
        return res;
    }
}

module.exports = wa_services;