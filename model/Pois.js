const mongoose = require('mongoose');
const uuid = require("uuid");


const PoisSchema = new mongoose.Schema({
    pois_id: { type: String, default: uuid.v4() },
    titulo: { type: String },
    lat: { type: String },
    long: { type: String },
});

PoisSchema.statics.createInstance = function(titulo, lat, long) {
    return new this({
        titulo: titulo,
        lat: lat,
        long: long
    });
}

PoisSchema.statics.getPois = function(cb) {
    return this.find({}, cb);
}

PoisSchema.statics.add = function(newPois, cb) {
    this.create(newPois, cb);
}

PoisSchema.statics.findByUUID = function(pois_id, cb) {
    return this.findOne({pois_id: pois_id}, cb);
}

PoisSchema.statics.removeByUUID = function(pois_id, cb) {
    return this.deleteOne({pois_id: pois_id}, cb);
}

module.exports = mongoose.model("Pois", PoisSchema);
