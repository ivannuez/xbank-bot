var router_helper = {
    renderError: (err, res) => {
        if (err) {
            res.render('msg', {
                msg: err.message
            });
        }
    },

    sendJsonError: (err, res) => {
        if (err) {
            res.status(500).json({
                status: "error",
                msg: err.message,
            });
        }
    }
}

module.exports = router_helper;