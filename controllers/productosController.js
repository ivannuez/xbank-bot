var Producto = require("../models/producto");
var Imagen = require("../models/imagen");
var router = require("express").Router();
var router_helper = require("../helpers/router_helper");
var upload_helper = require("../helpers/upload_helper");

var multer = require('multer')({
    dest: 'public/uploads'
})

router.get("/", (req, res) => {
    Producto.find({}).exec((err, productos) => {
        router_helper.renderError(err, res);
        res.render("productos/index", {
            productos: productos,
        });
    });
});

router.get("/show/:id", (req, res) => {
    Producto.findOne({
        _id: req.params.id,
    }).exec((err, producto) => {
        router_helper.renderError(err, res);
        res.render("productos/form", {
            producto: producto,
            action: "view",
            form_active: true,
        });
    });
});

router.get("/create", (req, res) => {
    res.render("productos/form", {
        action: "create",
    });
});
router.post("/create", [multer.array('images[]')], (req, res) => {
    /*var fileName = storeWithOriginalName(req.file);
    console.log(fileName);*/
    console.log(req.files);
    console.log(req.body);

    /*
    var producto = new Producto(req.body);
    producto.save((err) => {
        console.log(err);
        router_helper.sendJsonError(err, res);

        var imagen = new Imagen();

        res.status(200).json({
            status: "ok",
            msg: "/productos/show/" + producto._id,
        });
    });
    */
});

router.get("/edit/:id", (req, res) => {
    Producto.findOne({
        _id: req.params.id,
    }).exec((err, producto) => {
        router_helper.renderError(err, res);
        res.render("productos/form", {
            producto: producto,
            action: "edit",
            form_active: false,
        });
    });
});
router.post("/edit", (req, res) => {
    Producto.findByIdAndUpdate(
        req.body._id, {
            $set: req.body,
        }, {
            new: true,
        },
        (err, producto) => {
            router_helper.sendJsonError(err, res);
            res.status(200).json({
                status: "ok",
                msg: "/productos/show/" + producto._id,
            });
        }
    );
});

router.get("/delete/:id", (req, res) => {
    Producto.remove({
            _id: req.params.id,
        },
        (err) => {
            router_helper.renderError(err, res);
            res.redirect("/productos");
        }
    );
});

module.exports = router;