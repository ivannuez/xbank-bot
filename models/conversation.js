const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var conversationSchema = new mongoose.Schema({
    id_conversation: {
        type: String,
        required: false
    },
    numero_remitente: {
        type: String,
        required: false
    },
    timestamp_inicio: {
        type: String,
        required: false
    },
    timestamp_final: {
        type: String,
        required: false
    },
    estado_conversation: {
        type: String,
        required: false
    },
    estado_flujo: {
        type: String,
        required: false
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }, ],
});

//Export the model
module.exports = mongoose.model('Conversation', conversationSchema);