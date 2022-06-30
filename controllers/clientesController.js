var Cliente = require("../models/cliente");
var router = require("express").Router();
var router_helper = require("../helpers/router_helper");


router.get("/", (req, res) => {
    Cliente.find({}).exec((err, clientes) => {
        router_helper.renderError(err, res);
        res.render("clientes/index", {
            clientes: clientes,
        });
    });
});

router.get("/show/:id", (req, res) => {
    Cliente.findOne({
        _id: req.params.id,
    }).exec((err, cliente) => {
        router_helper.renderError(err, res);
        res.render("clientes/form", {
            cliente: cliente,
            action: "view",
            form_active: true
        });
    });
});

router.get("/create", (req, res) => {
    res.render("clientes/form", {
        action: "create",
    });
});
router.post("/create", (req, res) => {
    console.log(req.body);
    var cliente = new Cliente(req.body);
    cliente.save((err) => {
        router_helper.sendJsonError(err, res);
        res.status(200).json({
            status: "ok",
            msg: "/clientes/show/" + cliente._id,
        });
    });
});

router.get("/edit/:id", (req, res) => {
    Cliente.findOne({
        _id: req.params.id,
    }).exec((err, cliente) => {
        router_helper.renderError(err, res);
        res.render("clientes/form", {
            cliente: cliente,
            action: "edit",
            form_active: false,
        });
    });
});
router.post("/edit", (req, res) => {
    Cliente.findByIdAndUpdate(
        req.body._id, {
            $set: req.body,
        }, {
            new: true,
        },
        (err, cliente) => {
            router_helper.sendJsonError(err, res);
            res.status(200).json({
                status: "ok",
                msg: "/clientes/show/" + cliente._id,
            });
        }
    );
});

router.get("/delete/:id", (req, res) => {
    Cliente.remove({
            _id: req.params.id,
        },
        (err) => {
            router_helper.renderError(err, res);
            res.redirect("/clientes");
        }
    );
});

module.exports = router;