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
    inicio_timestamp: {
        type: String,
        required: false
    },
    final_timestamp: {
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
        type: mongoose.Schema.Types.Mixed,
        ref: 'Message',
    }],
    flujo: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Flujo',
    },
    actividades: [{
        type: mongoose.Schema.Types.Mixed,
        ref: 'Actividades',
    }],
});

//Export the model
module.exports = mongoose.model('Conversation', conversationSchema);