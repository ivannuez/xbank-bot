const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var flujoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: false
    },
    tiempo_caducidad: {
        type: String,
        required: false
    },
    items: [{
        type: String,
        required: false
    }],
});

//Export the model
module.exports = mongoose.model('Flujo', flujoSchema);