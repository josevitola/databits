// Yeliana's Key: AIzaSyAjV2uXekxz_sQ6EPshNsAJ1GqnLJjIrCw
// Vito's Key: AIzaSyBrkIfbZo3xfBNw6IPkv5Gbizc4mUGWGAY
// Juan pablo's Key: AIzaSyDm_Vpi_q1K8e2afEqMjS6HEpq7CfKSmP0
// Key for Images: AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA

export const MAP_KEY = "AIzaSyDm_Vpi_q1K8e2afEqMjS6HEpq7CfKSmP0";

let infwin; // global varible for infowindow
let appMap; // global variable for map
let museumMapData = [];
let restaurantMapData = [];
let theatreMapData = [];

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
  infowindow.setContent(html);
  infowindow.open(map, marker);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export const generateInfWinHtml = function(step) {
  return '<center><h3>'+ step.name +'</h3>' +
  '<img src="' +
      'https://maps.googleapis.com/maps/api/streetview?' + 'location=' + step.name +
      ' Bogota, Colombia&size=600x300' + '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA' +
  '" class="ui medium rounded image"></img></center>' +
  '<br><b>Dirección: </b> '+ step.address +
  '<br><b>Teléfono: </b> ' + step.phone +
  '<br><b>Sitio web: </b> <a href="' + step.webpage + '">' + step.webpage + '</a>' +
  '<br><b style="color: green">Precio Promedio: $</b> ' + step.price +
  '<br><b style="color: green">Tiempo Promedio: </b> ' + step.time +
  '<br><br><button class="ui labeled icon green add step button right floated"' +
  'data-name="' + step.name + '" data-phone="' + step.phone + '" data-address="'
  + step.address + '" data-web="' + step.webpage + '" data-price="' + step.price +
  '" data-lat="' + step.location.lat + '" data-lng="' + step.location.lng + '" data-type="' + step.type +
  '" data-time="' + step.time +
  '"><i class="plus icon"></i>Agregar</button>';
}

// import places data and markers
export const setPlacesInfo = function(type, array, icon, map, infowindow) {
  var localidad, url;

  if(type == "restaurant") {
    url = "ghc6-jiw3.json";
  } else if(type == "museum") {
    url = "mdh3-rurf.json";
  } else if(type == "theatre") {
    url = "h3hv-wumd.json";
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
          var hours = parseInt(getRandomArbitrary(0, 5));
          var minutes = 0;
          if(hours == 0){
            minutes = parseInt(getRandomArbitrary(30, 59));
          }else{
            minutes = parseInt(getRandomArbitrary(0, 59));
          }
          var time = hours + 'h ' + minutes + 'min';

          // variables definition
          if(url=='ghc6-jiw3.json') {
            name = entry.nombre_comercial;
            phone = entry.telefono;
          } else {
            name = capitalizeFirstLetter(entry.nombre_del_museo);
            phone = entry.telefono_fijo;
          }

          // pagina web
          var web = entry.pagina_web;
          if(web == 'N.D') {
            web = 'No Disponible';
          }

          // marker definition
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: name,
            icon: "markers/" + icon,
            visible: true
          });
          // data item definition
          var item = {
            name: name,
            address: entry.direccion,
            location: location,
            phone: phone,
            price: price,
            time: time,
            web: web,
            placeId: placeId,
            marker: marker,
            html: '<center><h3>'+ name +'</h3>' +
            '<img src="' +
                'https://maps.googleapis.com/maps/api/streetview?' + 'location=' + name +
                ' Bogota, Colombia&size=600x300' + '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA' +
            '" class="ui medium rounded image"></img></center>' +
            '<br><b>Dirección: </b> '+ entry.direccion +
            '<br><b>Teléfono: </b> ' + phone +
            '<br><b>Sitio web: </b> <a href="' + web + '">' + web + '</a>' +
            '<br><b style="color: green">Precio Promedio: $</b> ' + price +
            '<br><b style="color: green">Tiempo Promedio: </b> ' + time +
            '<br><br><button class="ui labeled icon green add step button right floated"' +
            'data-name="' + name + '" data-phone="' + phone + '" data-address="'
            + entry.direccion + '" data-web="' + web + '" data-price="' + price +
            '" data-lat="' + lat + '" data-lng="' + lng + '" data-type="' + type +
            '" data-time="' + time +
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

export const centerMap = function(location) {
  appMap.instance.panTo(location);
}

export const openMarker = function(html, marker, location) {
  appMap.instance.panTo(location);
  infwin.setContent(html);
  infwin.open(appMap.instance, marker);
}

// import climate data
export const setClimateInfo = function(array) {
  $.getJSON("https://www.datos.gov.co/resource/ckse-r6ms.json" + "?departamento=Bogota DC", function(data) {
    $.each(data, function(i, entry) {
      console.log(entry);
    });
  });
}

export const getRestaurants = function() {
  return restaurantMapData;
}

export const getMuseums = function() {
  return museumMapData;
}

export const getTheatres = function() {
  return theatreMapData;
}

export const updateInfo = function(type, mapInstance) {
  if(type == "theatre") {
    setPlacesInfo("theatre", theatreMapData, 'teat-pin.png', mapInstance, getInfWin());
  } else if(type == "museum") {
    setPlacesInfo("museum", museumMapData, 'muse-pin.png', mapInstance, getInfWin());
  } else if(type == "restaurant") {
    setPlacesInfo("restaurant", restaurantMapData, 'rest-pin.png', mapInstance, getInfWin());
  }
}
