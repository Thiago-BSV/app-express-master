const MongoDB = require('../config/configDataBase');
const Token = require("../model/Token");
const Usuario = require("../model/Usuario");

 
// Confirmación de email validando el Token
const get = (req, res) => {
    let token = req.params.token;

    Token.findOne({ token: token }, (errToken, token) => {
        if (errToken) return res.status(500).json({ error: errToken });
        if (!token) console.log("Ningún token encontrado")
        Usuario.findByIdAndUpdate(token._userId, { verificado: true }, (err, user) => {
            if (err) return res.status(500).json({ error: errUser });

            res.redirect("/")
        })
    })
}


module.exports = {
    get
}
