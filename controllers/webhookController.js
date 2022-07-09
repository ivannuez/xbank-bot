var router = require("express").Router();

var conversation_helper = require("../helpers/conversation_helper");

router.get("/", (req, res) => {
    const verify_token = "xBank";

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === verify_token) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


router.post("/", async (req, res) => {
    let conversartion_id_req;

    //console.log(JSON.stringify(req.body, null, 2));
    try {
        conversartion_id_req = req.body.entry[0].changes[0].value.statuses[0].conversation.id;
    } catch (e) {}

    //VERIFICAMOS SI ES CONVERSACION O MENSAJE
    if (conversartion_id_req) {
        console.log("RECIBIMOS UNA CONVERSACION " + conversartion_id_req);
        conversation_helper.processIdConversationExist(conversartion_id_req, req);
    } else {
        console.log("RECIBIMOS UN MENSAJE");
        conversation_helper.processIdConversationNoExist(req);
    }

    res.sendStatus(200);
});

module.exports = router;