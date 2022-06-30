var Venta = require("../models/venta");
var router = require("express").Router();
var router_helper = require("../helpers/router_helper");


router.get("/", (req, res) => {
    Venta.find({}).exec((err, ventas) => {
        router_helper.renderError(err, res);
        res.render("ventas/index", {
            ventas: ventas,
        });
    });
});

router.get("/show/:id", (req, res) => {
    Venta.findOne({
        _id: req.params.id,
    }).exec((err, venta) => {
        router_helper.renderError(err, res);
        res.render("ventas/form", {
            venta: venta,
            action: "view",
            form_active: true,
        });
    });
});

router.get("/create", (req, res) => {
    res.render("ventas/form", {
        action: "create",
    });
});
router.post("/create", (req, res) => {
    var venta = new Venta(req.body);
    venta.save((err) => {
        router_helper.sendJsonError(err, res);
        res.status(200).json({
            status: "ok",
            msg: "/ventas/show/" + venta._id,
        });
    });
});

router.get("/edit/:id", (req, res) => {
    Venta.findOne({
        _id: req.params.id,
    }).exec((err, venta) => {
        router_helper.renderError(err, res);
        res.render("ventas/form", {
            venta: venta,
            action: "edit",
            form_active: false,
        });
    });
});
router.post("/edit", (req, res) => {
    Venta.findByIdAndUpdate(
        req.body._id, {
            $set: req.body,
        }, {
            new: true,
        },
        (err, venta) => {
            router_helper.sendJsonError(err, res);
            res.status(200).json({
                status: "ok",
                msg: "/ventas/show/" + venta._id,
            });
        }
    );
});

router.get("/delete/:id", (req, res) => {
    Venta.remove({
            _id: req.params.id,
        },
        (err) => {
            router_helper.renderError(err, res);
            res.redirect("/ventas");
        }
    );
});

module.exports = router;