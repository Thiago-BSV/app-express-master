const Usuario = require('../../model/Usuario');
const request = require('request');
// const server = require('../../bin/www');


describe("Testing API", () => {

    describe("Request", () => {

        it("Usuarios crear, obtener y borrar", (done) => {
            
            var headers = {'content-type': 'application/json'};
            var usuario = Usuario.createInstance("Kevin", "Testing API");

            request.post({
                headers:headers, 
                url:'http://localhost:8080/users', 
                body: JSON.stringify(usuario)
            }, (error, response, body) => {
                if(error) console.error('Error:', error); done();

                let data = JSON.parse(body);

                expect(data.Usuario.nombre).toBe("Kevin");
                done();
            });
        })

    });

});