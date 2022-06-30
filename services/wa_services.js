require('dotenv').config();
const axios = require("axios").default;

var wa_services = {
    //FUNCIONA
    send_msg_template: (from, template) => {
        axios({
                headers: {
                    "Content-Type": "application/json"
                },
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
                        "name": "hello_world",
                        "language": {
                            "code": "en_US"
                        }
                    }
                },
            }).then(function (response) {
                console.log(JSON.stringify(response.data, null, 2))
                if (response.status === 200) {
                    //console.log(response.data);
                } else {

                }
            })
            .catch(function (error) {
                console.log(error);
            });;
    },
    send_msg_text: (from, msg) => {
        axios({
                headers: {
                    "Content-Type": "application/json"
                },
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
                        "body": "ask : " + msg
                    }
                },
            }).then(function (response) {
                console.log(JSON.stringify(response.data, null, 2))
                if (response.status === 200) {
                    //console.log(response.data);
                } else {

                }
            })
            .catch(function (error) {
                console.log(error);
            });;
    },
}

module.exports = wa_services;