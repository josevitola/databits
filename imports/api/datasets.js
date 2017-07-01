// Yeliana's Key: AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g
// Key for Images: AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA

export const MAP_KEY = "AIzaSyBrkIfbZo3xfBNw6IPkv5Gbizc4mUGWGAY";

//  first letter to uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// direction to LatLng
function setLatLng(direction, latlng) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=" + MAP_KEY, function(data) {
    latlng = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
  });
}

// direction to place_id
function setPlaceId(direction, placeId) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=" + MAP_KEY, function(data) {
    placeId = data.results[0].place_id;
  });
}

// set info window
function setInfoWindow(map, html, marker, infowindow) {
  console.log(infowindow);
  infowindow.setContent(html);
  infowindow.open(map, marker);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// import places data and markers
export const setPlacesInfo = function(url, array, icon, map, infowindow) {
  var localidad;
  if (url=='ghc6-jiw3.json') {
    localidad = "Candelaria";
  } else {
    localidad = "CANDELARIA";
  }
  $.getJSON("https://www.datos.gov.co/resource/" + url, function(data) {
    $.each(data, function(i, entry) {
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ entry.direccion + ' Bogota, Colombia' +"&key=" + MAP_KEY, function(data) {
        // variables
        if(typeof data.results[0] !== "undefined") {
          var lat = data.results[0].geometry.location.lat;
          var lng = data.results[0].geometry.location.lng;
          var location = new google.maps.LatLng(lat, lng);
          var placeId = data.results[0].place_id;
          var name, phone, address;
          var price = parseInt(getRandomArbitrary(25, 250))*100;
          // variables definition
          if(url=='ghc6-jiw3.json') {
            name = entry.nombre_comercial;
            phone = entry.telefono;
          } else {
            name = capitalizeFirstLetter(entry.nombre_del_museo);
            phone = entry.telefono_fijo;
          }

          // marker definition
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: name,
            icon: "markers/" + icon
          });
          // data item definition
          var item = {
            name: name,
            address: entry.direccion,
            location: location,
            phone: phone,
            price: price,
            web: entry.pagina_web,
            placeId: placeId,
            marker: marker,
            html: '<center><h3>'+ name +'</h3>' +
            '<img src="' +
                'https://maps.googleapis.com/maps/api/streetview?' + 'location=' + name +
                ' Bogota, Colombia&size=600x300' + '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA' +
            '" class="ui medium rounded image"></img></center>' +
            '<br><b>Dirección: </b> '+ entry.direccion +
            '<br><b>Teléfono: </b> ' + phone +
            '<br><b>Sitio web: </b> <a href="' + entry.pagina_web + '">' + entry.pagina_web + '</a>' +
            '<br><b style="color: green">Precio Promedio: $</b> ' + price +
            '<br><br><button class="ui labeled icon green add step button right floated"' +
            'data-name="' + name + '" data-phone="' + phone + '" data-address="'
            + entry.direccion + '" data-web="' + entry.pagina_web + '" data-price="' + price + '" data-lat="' + lat + '" data-lng="' + lng +
            '"><i class="plus icon"></i>Agregar</button>'
          }
          google.maps.event.addListener(marker, 'click', function() {
            setInfoWindow(map, item.html, marker, infowindow);
          });
          // add item to array
          array.push(item);
        }
      });
    });
  });
}

export const showMarkers = function(markers) {
  var count = 0;
  markers.forEach(function(marker) {
    console.log('Ok!!!!!!!!!!!!!!');
    if (marker.map != null) {
      count ++;
    }
  });
  if (count != 0) {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
  } else {
    markers.forEach(function(marker) {
      marker.setMap(map);
    });
  }
}

// import climate data
export const setClimateInfo = function(array) {
  $.getJSON("https://www.datos.gov.co/resource/ckse-r6ms.json" + "?departamento=Bogota DC", function(data) {
    $.each(data, function(i, entry) {
      console.log(entry);
    });
  });
}


let infwin;
let appMap;

export const getAppMap = function() {
  return appMap;
}

export const setAppMap = function(map) {
  appMap = map;
}

export const getInfWin = function() {
  return infwin;
}

export const setInfWin = function(inf) {
  infwin = inf;
}
