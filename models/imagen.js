var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imagenSchema = new Schema({
    file: String,
    mimetype: String
});

module.exports = mongoose.model("Imagen", imagenSchema);