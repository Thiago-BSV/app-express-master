const MongoDB = require('../config/configDataBase');
const Pois = require("../model/Pois");

 
const get = (req, res) => {
    let pois_id = req.params.pois_id;

    if (pois_id) {
        Pois.findByUUID(pois_id, function(err, pois) {
            if (err) res.send(err);
            res.status(200).json({
                Pois: pois
            });
        });
    }
    else {
        Pois.getPois(function(err, pois) {
            if (err) res.send(err);
            res.status(200).json({
                Pois: pois
            });
        });
    }
}

const post = (req, res) => {
    var pois = new Pois({
        titulo: req.body.titulo, 
        lat: req.body.lat,
        long: req.body.long
    });
    Pois.add(pois, function(err, p) {
        if (err) res.send(err);
        res.status(201).json({
            Pois: p
        });
    })
} 

const del = (req, res) => {
    let pois_id = req.body.pois_id;
    Pois.removeByUUID(pois_id, function(err, del) {
        if (err) res.send(err);
        res.status(200).send(del)
    })
} 

module.exports = {
    get,
    post,
    del
}
