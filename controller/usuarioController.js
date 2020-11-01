const MongoDB = require('../config/configDataBase');
const Usuario = require("../model/Usuario");
const Token = require("../model/Token");
const crypto = require("crypto");
 
const mailer = require("../config/mailer")

const get = (req, res) => {
    let user_id = req.params.user_id;

    if (user_id) {
        Usuario.findByUUID(user_id, function(err, user) {
            if (err) res.send(err);
            res.status(200).json({
                Usuario: user
            });
        });
    } else {
        Usuario.getPois(function(err, user) {
            if (err) res.send(err);
            res.status(200).json({
                Usuario: user
            });
        });
    }
}

const post = (req, res) => {
    var usuario = new Usuario({
        nombre: req.body.nombre, 
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password
    });
    Usuario.add(usuario, function(errUser, user) {
        if (errUser) res.send(errUser);

        Token.create({_userId: user._id, token: crypto.randomBytes(12).toString("hex")}, (errToken, token) => {
            if (errToken) res.send(errToken);

            const email_to = user.email;
            console.log("ENVIAR EMAIL A: ", email_to);

            const emailOption = {
                to: [ email_to ],
                from: "kevinfiorentino.1294@gmail.com",
                subject: "Kevin - Confirmación de cuenta",
                text: "Envio de emails de prueba con Nodemailer",
                html: "Confirme su cuenta haciendo click en el siguiente enlace: <a href='http://localhost:8080/token/"+token.token+"'>Activar mi cuenta!!</a>"
            }

            mailer.sendMail(emailOption, (errEmail, info) => {
                if (errEmail) res.redirect("/login");

                console.log("Un email de confirmación ha sido enviado");

                //res.redirect("login")
                res.sendFile(process.cwd()+'/public/login.html');
            })

        })
    })
}

const put = (req, res) => {

}

const del = (req, res) => {
    let user_id = req.body.user_id;
    Usuario.removeByUUID(user_id, function(err, del) {
        if (err) res.send(err);
        res.status(200).send(del)
    })
}


module.exports = {
    get,
    post,
    del
}
