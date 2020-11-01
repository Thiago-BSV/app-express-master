const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const uuid = require("uuid");
const bcrypt = require("bcrypt")
const Pois = require("./Pois.js")


const validateEmail = function(email) {
    const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return re.test(email)
}

const UsuarioSchema = new mongoose.Schema({
    user_id: { 
        type: String, 
        default: uuid.v4() 
    },
    nombre: { 
        type: String,
        trim: true,
        require: [ true, "El nombre es obligatorio." ]
    },
    apellido: { 
        type: String,
        trim: true,
        require: [ true, "El apellido es obligatorio." ]
    },
    email: {
        type: String,
        trim: true,
        require: [ true, "El email es obligatorio." ],
        lowercase: true,
        unique: true,
        validate: [ validateEmail, "Por favor, ingrese un correo electrónico válido" ],
        match: [/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/]
    },
    password: {
        type: String,
        required: [ true, "El password es obligatorio." ]
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpires: {
        type: String,
    },
    verificado: {
        type: Boolean,
        default: false
    },
    _poisIds: { 
        type: [ mongoose.Schema.Types.ObjectId ], 
        ref: 'Pois',
        default: [] 
    }
});

UsuarioSchema.statics.createInstance = function(nombre, apellido, email, password) {
    return new this({
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password
    });
}

UsuarioSchema.statics.getUsuarios = function(cb) {
    return this.find({}, cb);
}

UsuarioSchema.statics.add = function(newUser, cb) {
    this.create(newUser, cb);
}

// Busqueda por ID de Mongo
UsuarioSchema.statics.findById = function(user_id, cb) {
    return this.findOne({_id: user_id}, cb);
}

// Busqueda por UUID
UsuarioSchema.statics.findByUUID = function(user_id, cb) {
    return this.findOne({user_id: user_id}, cb);
}

UsuarioSchema.statics.removeByUUID = function(user_id, cb) {
    return this.deleteOne({user_id: user_id}, cb);
}


const saltRounds = 12;

UsuarioSchema.pre("save", function(next) {
    if(this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next();
    }
})

UsuarioSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

UsuarioSchema.plugin(uniqueValidator, { message: "El {PATH} ya existe con otro usuario." })


module.exports = mongoose.model("Usuario", UsuarioSchema);
