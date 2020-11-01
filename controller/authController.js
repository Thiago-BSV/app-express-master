const Usuario = require("../model/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

    authenticate: function (req, res, next) {
        Usuario.findOne({ email: req.body.email }, function (err, user) {
            if (err) {
                next(err);
            }
            else {
                if (user === null) { return res.status(401).json({ status: "error", message: "Password inválido", data: null }); }
                if (user != null && bcrypt.compareSync(req.body.password, user.password)) {
                    const token = jwt.sign({ nombre: user.nombre , email: user.email, id: user._id }, req.app.get('secretKey'), { expiresIn: '1d' });
                    res.status(200).json({ message: "Usuario encontrado!", data: { ususario: user, token: token } });
                }
                else {
                    return res.status(401).json({ status: "error", message: "Password inválido", data: null });
                }
            }
        });
    }

}
