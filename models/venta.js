const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ventaSchema = new mongoose.Schema({
    tipo_venta: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    direccion: {
        type: String,
        required: false
    },
    monto: {
        type: Number,
        required: false
    },
    req_factura: {
        type: String,
        required: false
    },
    estado: {
        type: String,
        required: false
    }
});

//Export the model
module.exports = mongoose.model('Venta', ventaSchema);