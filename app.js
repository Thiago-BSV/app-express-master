require('newrelic')
require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const sassMiddleware = require('node-sass-middleware');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/index');
const routesPois = require('./routes/routesPois');
const routesUsuarios = require('./routes/routesUsuarios');
const routesToken = require('./routes/routesToken');
const routesAuth = require('./routes/routesAuth');
const { assert } = require('console');

const app = express();

app.set('secretKey', 'secret_kevin_jwt');


// Configuración Express-Sessions
let store;
if (process.env.ENVIRONMENT === "development") {
    store = new session.MemoryStore;
}
else {
    store = new MongoDBStore({
        uri: process.env.MONGO_CONNECTION_STRING,
        collection: 'sessions'
    });
    store.on('error', function(err) {
        assert.ifError(error);
        assert.ok(false);
    })
}
app.use(session({
    cookie: { maxAge: 86000 }, 
    store: store,
    saveUninitialized: true,
    resave: 'true',
    secret: 'kevin_secret'
}));
// END Express Session

// Configuración de Express
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());
app.options('*', cors());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // Dominio que tengan acceso (ej. 'http://example.com')
       res.setHeader('Access-Control-Allow-Origin', '*');
    // Metodos de solicitud que deseas permitir
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
       res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})

// Rutas de la API
app.use('/', indexRouter);
//app.use('/pois', validarUsuarioJWT, routesPois);
app.use('/pois', routesPois);
app.use('/users', routesUsuarios);
app.use('/token', routesToken);
app.use('/auth', routesAuth);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
})


function validarUsuarioJWT(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        }
        else {
            req.body.userId = decoded.id;
            console.log("JWT: ", decoded);
            next();
        }
    })
}


module.exports = app;
