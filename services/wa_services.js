const axios = require("axios").default;

var phone_number_id_empresa = 112045928209823;
var token = "EAAHZCIpC5ZAZCoBAFr0Iq4mZCiJ4ky1MybtbyEAKkihGSWXi4wgWXC62Vn7pZCIZCMDAJXC5HpUC2qtBZAVyBHFTjIZBb9tUkD7eUtBMA7uiojOuvQZCvjFAGZCXbZBqp9V1VjK0vLPTl8ZBQnZAvpOJesLmt1k0x2oJGRYhG4J3iggYezS32rXwOJvAm3wJi4oErHPQ1c9zwXm0G5AZDZD";

var wa_services = {
    //FUNCIONA
    send_msg_template: (from, template) => {
        axios({
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                url: "https://graph.facebook.com/v12.0/" +
                    phone_number_id_empresa +
                    "/messages?access_token=" +
                    token,
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
                    phone_number_id_empresa +
                    "/messages?access_token=" +
                    token,
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