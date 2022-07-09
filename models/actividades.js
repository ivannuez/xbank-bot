const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var actividadesSchema = new mongoose.Schema({
    nombre: {
        type: String
    },
    tipo: {
        type: String
    },
    texto: {
        type: String
    },
    posibles_valores: [{
        type: String
    }],
    logica_valores: {
        type: String
    },
    flujo_menu: [{}],
    valor: {
        type: String
    },
});

//Export the model
module.exports = mongoose.model('Actividades', actividadesSchema);