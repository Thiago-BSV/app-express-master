const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../model/Usuario");

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        Usuario.findOne({ email: email }, function(err, usuario) {
            if (err) return done(err);
            if (!usuario) return done(null, false, { message: "Email no encontrado" });
            if (!usuario.validatePassword(password)) return done(null, false, { message: "Password incorrecto" });

            return done(null, usuario)
        })
    }
));

passport.serializeUser(function(user, cb) {
    //cb(null, user._id);
    cb(null, user);
})

passport.deserializeUser(function(user, cb) {
    cb(null, user);
    /*
    Usuario.findById(id, function(err, usuario) {
        cb(err, usuario)
    })
    */
})

module.exports = passport;
