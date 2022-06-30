var router = require("express").Router();

var Conversation = require("../models/conversation");
var Message = require("../models/message");

var wa_services = require("../services/wa_services");

var router_helper = require("../helpers/router_helper");
var wa_helper = require("../helpers/wa_helper");

router.get("/", (req, res) => {
    const verify_token = "xBank";

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


router.post("/", async (req, res) => {
    let conversartion_id;
    let numero_remitente;

    console.log(JSON.stringify(req.body, null, 2));
    try {
        conversartion_id = req.body.entry[0].changes[0].value.statuses[0].conversation.id;
    } catch (e) {
        console.log('NO ES UNA CONVERSACION');
    }

    //VERIFICAMOS SI ES CONVERSACION O MENSAJE
    if (conversartion_id) {
        console.log('EL BODY ES UNA CONVERSACION');
        console.log(conversartion_id);
        numero_remitente = req.body.entry[0].changes[0].value.statuses[0].recipient_id;

        let conversation_return = await Conversation.findOne({
            numero_remitente: numero_remitente,
            estado_conversation: "ACTIVO"
        });
        console.log('RECUPERAMOS LA CONVERSACION GUARDADA');
        console.log(conversation_return);

        if (conversation_return) {
            console.log('ACTUALIZAMOS LA CONVERSACION INICIAL, ADJUNTANDO SU ID DE CONVERSACION');
            await Conversation.findOneAndUpdate({
                _id: conversation_return._id
            }, {
                id_conversation: conversartion_id
            }, {
                upsert: true,
                useFindAndModify: true
            });
        } else {
            if (conversation_return.id_conversation !== conversartion_id) {
                console.log('EL ID DE CONVERSACION ES DISTINTO, ASIQUE CERRAMOS LA CONVERSACION ANTERIOR Y CREAMOS UNA NUEVA');
                //CERRAMOS EL CONVERSACION
                if (conversation_return) {
                    await Conversation.findOneAndUpdate({
                        _id: conversation_return._id
                    }, {
                        estado_conversation: "CERRADO"
                    }, {
                        upsert: true,
                        useFindAndModify: true
                    });
                }

                //CREAR CONVERSACION
                let timestamp_inicio = new Date().toISOString();
                let conversation = new Conversation({
                    id_conversation: conversartion_id,
                    numero_remitente: numero_remitente,
                    timestamp_inicio: timestamp_inicio,
                    estado_conversation: "ACTIVO"
                });
                conversation.save();
            } else {
                console.log('RECIBIMOS LA NOTIFICACION DEL MENSAJE QUE ENVIAMOS');
            }
        }

        res.sendStatus(200);
    } else {
        console.log('EL BODY ES UNA MENSAJE');
        let mensaje_inicial = false;
        let message_receiver = wa_helper.parse_msg_text(req);
        let timestamp_inicio = new Date().toISOString();

        //console.log(message_receiver);
        numero_remitente = message_receiver.contacts.wa_id;

        //GUARDAMOS EL MENSAJE
        let new_message = new Message(message_receiver);
        new_message.save();

        //OBTENEMOS PRIMERAMENTE LA CONVERSACION VIGENTE
        //PARA PODER GUARDAR LOS MENSAJES
        let conversation_return = await Conversation.findOne({
            numero_remitente: numero_remitente,
            estado_conversation: "ACTIVO"
        });
        //console.log(conversation_return);

        //EN CASO DE NO TENER UNA CONVERSACION
        //CREAMOS UNA PARA GUARDAR EL MENSAJE
        if (!conversation_return) {
            console.log('CREAMOS UNA CONVERSACION INICIAL SIN ID DE CONVERSACION');
            mensaje_inicial = true;
            conversation_return = new Conversation({
                numero_remitente: numero_remitente,
                timestamp_inicio: timestamp_inicio,
                estado_conversation: "ACTIVO"
            });
            conversation_return.save();
        }

        //AGREGAMOS EL MENSAJE EN LA LISTA DE MENSAJES
        let messages_list = conversation_return.messages;
        messages_list.push(new_message);


        //GUARDAMOS EL MENSAJE EN LA CONVERSACION
        await Conversation.findOneAndUpdate({
            _id: conversation_return._id
        }, {
            messages: messages_list
        }, {
            upsert: true,
            useFindAndModify: true
        });

        //ANALISAMOS SI EL MENSAJE QUE ENVIEMOS ES EL INICIAL
        //O DEL FLUJO
        if (mensaje_inicial) {
            wa_services.send_msg_template(message_receiver.messages.from, "");
            //wa_services.send_msg_text(message_receiver.messages.from, message_receiver.messages.text.body);
            //wa_services.send_welcome(message_receiver.messages.from, message_receiver.messages.text.body);
        } else {
            //wa_services.send_msg_template(message_receiver.messages.from, "");
            wa_services.send_msg_text(message_receiver.messages.from, message_receiver.messages.text.body);
            //wa_services.send_welcome(message_receiver.messages.from, message_receiver.messages.text.body);
        }
        res.sendStatus(200);
    }
});

module.exports = router;