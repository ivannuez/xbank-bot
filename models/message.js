const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
    "id": {
        "type": "String"
    },
    "messaging_product": {
        "type": "String"
    },
    "metadata": {
        "display_phone_number": {
            "type": "String"
        },
        "phone_number_id": {
            "type": "String"
        }
    },
    "contacts": {
        "profile": {
            "name": {
                "type": "String"
            }
        },
        "wa_id": {
            "type": "String"
        }
    },
    "messages": {
        "from": {
            "type": "String"
        },
        "id": {
            "type": "String"
        },
        "timestamp": {
            "type": "String"
        },
        "text": {
            "body": {
                "type": "String"
            }
        },
        "type": {
            "type": "String"
        }
    }
});

//Export the model
module.exports = mongoose.model('Message', messageSchema);