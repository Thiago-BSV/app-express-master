// import MapaInteractivo from '@usig-gcba/mapa-interactivo';

const mapaInteractivo = new MapaInteractivo("mapa-id", { 
    center: [-34.62, -58.44],
    zoomControl: true,
    maxZoom: 18,
    minZoom: 10,
});

mapaInteractivo.map.setView([-34.62, -58.44], 13);

var icon = L.icon({
    iconUrl: '../images/marker-icon-violeta.png',
});

// Cargamos los puntos iniciales en el mapa
$.ajax({
    type: "GET",
    dataType: "json",
    url: "/pois",
    success: function(response_api) {

        response_api.Pois.forEach( (value, index) => {
            var marker = L.marker([value.lat, value.long], {icon: icon});

            marker.addTo(mapaInteractivo.map)
            .bindPopup(`
                <div class="fichaMarkerMapa">
                    <h5>${value.titulo}</h5>
                    <button onclick="eliminar_punto('${value.pois_id}', ${marker._leaflet_id})" class="waves-effect waves-light btn-small red darken-4">Eliminar</button>
                </div>`
            );
            
        });

    }
})

function agregar_punto() {
    let titulo_pois = document.getElementById("titulo_pois").value;
    let direccion_pois = document.getElementById("direccion_pois").value;

    // Consultamos el servicio de USIG para traducir una dirección en latitud y longitud
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "https://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=" + direccion_pois + "&maxOptions=1&geocodificar=TRUE",
        success: function(response_usig) {

            let data = {
                titulo: titulo_pois,
                lat: response_usig.direccionesNormalizadas[0].coordenadas.y,
                long: response_usig.direccionesNormalizadas[0].coordenadas.x
            };

            // Agregamos el punto al back
            $.ajax({
                type: "POST",
                dataType: "json",
                data: data,
                url: "/pois",
                success: function(response_api) {

                    var marker = L.marker([response_api.Pois.lat, response_api.Pois.long], {icon: icon});
                    
                    marker.addTo(mapaInteractivo.map)
                    .bindPopup(`
                        <div class="fichaMarkerMapa">
                            <h5>${response_api.Pois.titulo}</h5>
                            <button onclick="eliminar_punto('${response_api.Pois.pois_id}', ${marker._leaflet_id})" class="waves-effect waves-light btn-small red darken-4">Eliminar</button>
                        </div>`
                    );

                }
            })
        }
    });

}


function eliminar_punto(pois_id, marker_id) {

    let data = {
        pois_id: pois_id
    };

    $.ajax({
        type: "DELETE",
        dataType: "json",
        data: data,
        url: "http://localhost:8080/pois/eliminar",
        success: function(response_api) {

            // Borramos el marker del mapa
            mapaInteractivo.map.eachLayer(function (layer) {
                if(layer._leaflet_id == marker_id) {
                    mapaInteractivo.map.removeLayer(layer);
                }
            });
        }
    })

}

