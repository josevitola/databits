// Google Maps Key: AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g

// direction to LatLng
function setLatLng(direction, latlng) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
    latlng = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
  });
}

// direction to place_id
function setPlaceId(direction, placeId) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
    placeId = data.results[0].place_id;
  });
}

// set info window
function setInfoWindow(map, html, marker, infowindow) {
  infowindow.setContent(html);
  infowindow.open(map, marker);
}


// import places data and markers
export const setPlacesInfo = function(url, array, icon, map, infowindow) {
  $.getJSON("https://www.datos.gov.co/resource/" + url + "?localidad=Candelaria", function(data) {
    $.each(data, function(i, entry) {
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ entry.direccion +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
        // variables
        var location = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
        var placeId = data.results[0].place_id;
        var name, phone, address;
        // variables definition
        if(url=='ghc6-jiw3.json') {
          name = entry.nombre_comercial;
          phone = entry.telefono;
        } else {
          name = entry.nombre_del_museo;
          phone = entry.telefono_fijo;
        }
        // marker definition
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title: name,
          icon: "map_icons/" + icon
        });
        // data item definition
        var item = {
          name: name,
          address: entry.direccion,
          phone: phone,
          web: entry.pagina_web,
          placeId: placeId,
          marker: marker,
          html: '<center><h3>'+ name +'</h3>' +
          '<img src="' +
              'https://maps.googleapis.com/maps/api/streetview?' + 'location=' + entry.direccion +
              '&size=600x300' + '&key=AIzaSyDip7CRroRr9Aui972KlJZ2MKr7P-U20PA' +
          '" class="ui medium rounded image"></img></center>' +
          '<br><b>Dirección:</b> '+ name +
          '<br><b>Teléfono:</b> ' + phone +
          '<br><b>Sitio web:</b> <a href="' + entry.pagina_web + '">' + entry.pagina_web + '</a>' +
          '<br><br><button class="ui labeled icon green add step button right floated"><i class="plus icon"></i>Agregar</button>'
        }
        google.maps.event.addListener(marker, 'click', function() {
          setInfoWindow(map, item.html, marker, infowindow);
        });
        // add item to array
        array.push(item);
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
