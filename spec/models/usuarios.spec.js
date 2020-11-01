const mongoose = require('mongoose');
const Usuario = require('../../model/Usuario');
// const server = require('../../bin/www');


describe("Testing Modelo", () => {
    
    beforeEach( done => {
        mongoose.connect("mongodb://localhost/usuarios", { useNewUrlParser: true })

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "Error en la conexión"));
        db.once("open", function() {
            console.log("Conexión establecida para testing")
            done();
        });
    });

    describe("Conexión BBDD", () => {

        it("Usuarios crear, obtener y borrar", (done) => {
            
            var usuario = Usuario.createInstance("Kevin", "Testing BBDD");

            Usuario.add(usuario, function(err, newUser) {
                Usuario.findByUUID(newUser.user_id, function(err, user) {
                    expect(usuario.nombre).toBe("Kevin");

                    Usuario.removeByUUID(newUser.user_id, function(err, del) {
                        expect(del.deletedCount).toBe(1);
                        done();
                    });
                });
            })
        })

    });

});