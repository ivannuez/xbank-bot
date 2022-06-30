const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var clienteSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: false
    },
    apellidos: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    correo: {
        type: String,
        required: false
    },
    ciudad: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false
    }
});

//Export the model
module.exports = mongoose.model('Cliente', clienteSchema);