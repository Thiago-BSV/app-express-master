const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Usuario"
    },
    token: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now,
        expires: 86000
    }
})


module.exports = mongoose.model("Token", TokenSchema);
