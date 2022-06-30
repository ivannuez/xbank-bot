const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: false
    },
    dimensiones: {
        type: String,
        required: false
    },
    caracteristicas: {
        type: String,
        required: false
    },
    descripcion: {
        type: String,
        required: false
    },
    precio: {
        type: Number,
        required: false
    },
    estado: {
        type: String,
        required: false
    },
    imagenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Imagen',
    }, ],
});

//Export the model
module.exports = mongoose.model('Producto', productoSchema);