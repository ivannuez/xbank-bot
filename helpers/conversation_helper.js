var Conversation = require("../models/conversation");
var Message = require("../models/message");
var Flujo = require("../models/flujo");
var Actividades = require("../models/actividades");

var wa_services = require("../services/wa_services");

var interprete_helper = require("../helpers/interprete_helper");
var wa_helper_cli = require("../helpers/wa_helper_cli");
var wa_helper_bot = require("../helpers/wa_helper_bot");

module.exports = {

    processIdConversationNoExist: async (req) => {
        let numero_remitente;
        let mensaje_inicial = false;
        let conversation_return;
        let messages_list;
        let new_message_receiver;
        let new_message_send;
        let message_response;
        let message_receiver = wa_helper_cli.parse_msg_text(req);
        let timestamp_inicio = new Date().toISOString();

        //console.log(message_receiver);
        numero_remitente = message_receiver.contacts.wa_id;

        //GUARDAMOS EL MENSAJE
        new_message_receiver = new Message(message_receiver);
        await new_message_receiver.save();

        //OBTENEMOS PRIMERAMENTE LA CONVERSACION VIGENTE
        //PARA PODER GUARDAR LOS MENSAJES
        conversation_return = await Conversation.findOne({
            numero_remitente: numero_remitente,
            estado_conversation: "ACTIVO"
        });

        //EN CASO DE NO TENER UNA CONVERSACION
        //CREAMOS UNA PARA GUARDAR EL MENSAJE
        //TODO: DEPENDIENDO DEL MENSAJE INICIAL INICIAMOS EL FLUJO
        if (!conversation_return) {
            //conversation_return = await initConversation(numero_remitente, timestamp_inicio);
            //DEPENDIENDO DEL MENSAJE INICIAL, VEMOS QUE FLUJO INICIAR
            let flujo = await Flujo.findOne({
                nombre: "crear_cuenta_basica"
            });
            let actividad_inicial = await Actividades.findOne({
                nombre: flujo.items[0]
            });
            //console.log(actividad_inicial);

            console.log('CREAMOS UNA CONVERSACION INICIAL SIN ID DE CONVERSACION');
            mensaje_inicial = true;
            conversation_return = new Conversation({
                numero_remitente: numero_remitente,
                timestamp_inicio: timestamp_inicio,
                estado_conversation: "ACTIVO",
                flujo: flujo,
                actividades: [actividad_inicial]
            });
            await conversation_return.save();
        }

        //AGREGAMOS EL MENSAJE EN LA LISTA DE MENSAJES
        messages_list = conversation_return.messages;
        messages_list.push(message_receiver);
        conversation_return.messages = messages_list;

        //RESOLVEMOS EN EL INTERPRETE EL MENSAJE A RESPONDER
        message_response = await interprete_helper.interprete(conversation_return, new_message_receiver);

        //console.log(JSON.stringify(conversation_return, null, 2));

        //ANALISAMOS SI EL MENSAJE QUE ENVIEMOS ES EL INICIAL
        //O DEL FLUJO
        let send_msg;
        if (mensaje_inicial) {
            send_msg = await wa_services.send_msg_template(message_receiver.messages.from, "iniciar_flujo_cbas");
        } else {
            if (message_response.includes("no es")) {
                let actividadActual = conversation_return.actividades.slice(-1)[0];
                await wa_services.send_msg_text(message_receiver.messages.from, message_response);
                send_msg = await wa_services.send_msg_text(message_receiver.messages.from, actividadActual.texto);
            } else {
                send_msg = await wa_services.send_msg_text(message_receiver.messages.from, message_response);
            }
        }


        //PARSEAMOS EL MENSAJE Y REGISTRAMOS EL MENSAJE ENVIADO
        let parse_msg_send = wa_helper_bot.parse_msg_text(send_msg, message_response);
        new_message_send = new Message(parse_msg_send);
        await new_message_send.save();
        //ACTUALIZAMOS LA LISTA DE MENSAJES DE LA CONVERSACION
        messages_list.push(parse_msg_send);


        //GUARDAMOS EL MENSAJE RECIBIDO Y ENVIADO DE LA CONVERSACION
        await Conversation.findOneAndUpdate({
            _id: conversation_return._id
        }, {
            messages: messages_list
        });
    },

    processIdConversationExist: async (conversation_id_req, req) => {
        let numero_remitente = req.body.entry[0].changes[0].value.statuses[0].recipient_id;

        let conversation_db = await Conversation.findOne({
            numero_remitente: numero_remitente,
            estado_conversation: "ACTIVO"
        });
        console.log('RECUPERAMOS LA CONVERSACION GUARDADA');

        if (conversation_db) {
            if (conversation_db.messages.length <= 2) {
                console.log('ACTUALIZAMOS LA CONVERSACION INICIAL');
                console.log('LA CONVERSACION DE DB NO TIENE ID CONVERSIONACION, ASIQUE ACTUALIZAMOS');
                await Conversation.findOneAndUpdate({
                    _id: conversation_db._id
                }, {
                    id_conversation: conversation_id_req
                });
            } else {
                if (conversation_db.id_conversation !== conversation_id_req) {
                    console.log('EL ID DE CONVERSACION ES DISTINTO, ASIQUE CERRAMOS LA CONVERSACION ANTERIOR Y CREAMOS UNA NUEVA');
                    //CERRAMOS EL CONVERSACION
                    await Conversation.findOneAndUpdate({
                        _id: conversation_db._id
                    }, {
                        estado_conversation: "CERRADO"
                    });

                    //CREAR CONVERSACION
                    let timestamp_inicio = new Date().toISOString();
                    let conversation = new Conversation({
                        id_conversation: conversation_id_req,
                        numero_remitente: numero_remitente,
                        timestamp_inicio: timestamp_inicio,
                        estado_conversation: "ACTIVO"
                    });
                    await conversation.save();
                } else {
                    console.log('RECIBIMOS LA NOTIFICACION DEL MENSAJE QUE ENVIAMOS');
                }
            }
        } else {
            console.log('NO EXISTE CONVERSACION CON ESTE NUMERO, HAY QUE CREAR');
            let timestamp_inicio = new Date().toISOString();
            let conversation = new Conversation({
                id_conversation: conversation_id_req,
                numero_remitente: numero_remitente,
                timestamp_inicio: timestamp_inicio,
                estado_conversation: "ACTIVO"
            });
            await conversation.save();
        }
    },

}