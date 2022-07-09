var Conversation = require("../models/conversation");
var Actividades = require("../models/actividades");

var constantes = require("../utils/constantes");

var interprete_helper = {
    interprete: async (conversation, message) => {
        //console.log(JSON.stringify(conversation, null, 2));
        let msjReceiver = message.messages.text.body;
        let msjResponse = "";
        let listaActividades = conversation.actividades;
        let actividad = listaActividades.slice(-1)[0];
        let nextActividadMenu = "";
        //console.log(JSON.stringify(actividad, null, 2));

        //ANALIZAMOS SI ES EL PRIMER MENSAJE
        if (conversation.messages.length === 1) {
            console.log("ES EL PRIMER MENSAJE, DEBEMOS DE ENVIAR EL MENSAJE DE BIENVENIDA");
            msjResponse = actividad.texto;
        } else {
            //VERIFICAMOS QUE LA ULTIMA ACTIVAD NO SEA LA DE FINALIZAR
            if (actividad.tipo === "FINALIZAR") {
                console.log("SE FINALIZO LA CONVERSACION");
                msjResponse = "CONVERSACION FINALIZADA";
            } else {
                console.log("SE INICIO LA CONVERSACION, ANALIZAMOS LA PRIMERA ACTIVIDAD");
                console.log("Nombre Actividad : " + actividad.nombre);
                console.log("Logica valores : " + actividad.logica_valores);
                console.log("Texto recibido : " + msjReceiver);
                console.log("Posible valores : " + actividad.posibles_valores);
                let validate = false;
                let replyMsg = "";
                switch (actividad.logica_valores) {
                    case 'CONTIENE': {
                        if (actividad.posibles_valores.includes(msjReceiver)) {
                            validate = true;
                        } else {
                            replyMsg = ", valores validos : " + actividad.posibles_valores.join();
                        }
                        break;
                    }
                    case 'ES_IGUAL': {
                        if (actividad.flujo_menu.length > 0) {
                            console.log("ES IGUAL TIPO MENU");
                            const valorOpcion = actividad.flujo_menu.find(a => a.key === msjReceiver);
                            console.log(valorOpcion);
                            if (valorOpcion) {
                                nextActividadMenu = valorOpcion.actividad;
                                validate = true;
                            } else {
                                replyMsg = ", valores validos " + actividad.posibles_valores.join();
                            }
                        } else {
                            if (actividad.posibles_valores.includes(msjReceiver)) {
                                validate = true;
                            } else {
                                replyMsg = ", valores validos " + actividad.posibles_valores.join();
                            }
                        }
                        break;
                    }
                    case 'REGEX': {
                        if (constantes.REGEX_NUMERIC.test(msjReceiver)) {
                            validate = true;
                        } else {
                            replyMsg = ", el valor o el formato del mensaje no es el correcto";
                        }
                        break;
                    }
                    case 'NUMERICO': {
                        if (constantes.REGEX_NUMERIC.test(msjReceiver)) {
                            validate = true;
                        } else {
                            replyMsg = ", el valor debe de ser numerico";
                        }
                        break;
                    }
                    case 'TEXTO': {
                        if (constantes.REGEX_TEXTO.test(msjReceiver)) {
                            validate = true;
                        } else {
                            replyMsg = ", el valor esperado solo debe de contener texto";
                        }
                        break;
                    }
                    case 'NO_VACIO': {
                        if (msjReceiver.length > 0) {
                            validate = true;
                        }
                        break;
                    }
                    default: {
                        console.log('DEFAULT');
                    }
                }

                console.log("Validacion de la actividad : " + validate);
                if (validate) {
                    console.log("El valor coincide con lo esperado, se avanza con el flujo");
                    //ACTUALIZAMOS LA LISTA DE ACTIVIDADES CON EL VALOR OBTENIDO
                    console.log("lista de actividades")
                    listaActividades = listaActividades.map((x) => {
                        console.log(x);
                        if (actividad._id === x._id) {
                            console.log("actividad encontrada.")
                            x.valor = msjReceiver;
                        }
                        return x;
                    });

                    //ANALIZAR EL RUMBO DEL FLUJO CUANDO nextActividadMenu TIENE VALOR

                    //OBTENEMOS LA SIGUIENTE ACTIVIDAD DEL FLUJO
                    let next_actividad_index = conversation.flujo.items.indexOf(actividad.nombre) + 1;
                    if (next_actividad_index <= conversation.flujo.items.length) {
                        //SI YA NO HAY ACTIVIDADES EN EL FLUJO FINALIZAMOS LA CONVERSACION
                        if (typeof conversation.flujo.items[next_actividad_index] === 'undefined') {
                            await Conversation.findOneAndUpdate({
                                _id: conversation._id
                            }, {
                                actividades: listaActividades,
                                estado_conversation: "FINALIZADO"
                            });
                            msjResponse = "Gracias por la conversación, hasta pronto!";
                        } else {
                            let next_actividad_name = conversation.flujo.items[next_actividad_index];
                            console.log(next_actividad_name);

                            let next_actividad = await Actividades.findOne({
                                nombre: next_actividad_name
                            });
                            console.log("SIGUIENTE ACTIVIDAD: " + next_actividad.nombre);
                            listaActividades.push(next_actividad);

                            if (next_actividad.tipo === "FINALIZAR") {
                                await Conversation.findOneAndUpdate({
                                    _id: conversation._id
                                }, {
                                    actividades: listaActividades,
                                    estado_conversation: "FINALIZADO"
                                });
                            } else {
                                //Actualizamos la lista de Actividades de la Conversacion
                                await Conversation.findOneAndUpdate({
                                    _id: conversation._id
                                }, {
                                    actividades: listaActividades
                                });
                            }
                            msjResponse = next_actividad.texto;
                        }
                    } else {
                        //Actualizamos la lista de Actividades de la Conversacion
                        await Conversation.findOneAndUpdate({
                            _id: conversation._id
                        }, {
                            estado_conversation: "FINALIZADO"
                        });
                        msjResponse = "Gracias por la conversación, hasta pronto!";
                    }
                } else {
                    console.log("El valor no coincide enviar reply");
                    msjResponse = "El valor ingresado no es válido" + replyMsg;
                }
            }
        }

        return msjResponse;
    }
}

module.exports = interprete_helper;