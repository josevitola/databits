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
export const setPlacesInfo = function(url, array, markers, icon, map, infowindow) {
  $.getJSON(url + "?localidad=Candelaria", function(data) {
    $.each(data, function(i, entry) {
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ entry.direccion +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
        // variables
        var location = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
        var placeId = data.results[0].place_id;
        // marker definition
        var marker = new google.maps.Marker({
          position: location,
          map: map,
          title: entry.nombre_comercial,
          icon: "map_icons/" + icon
        });
        // data item definition
        var item = {
          name: entry.nombre_comercial,
          address: entry.direccion,
          phone: entry.telefono,
          placeId: placeId,
          marker: marker,
          html: '<b>'+entry.nombre_comercial+'</b><br>'+entry.direccion
        }
        google.maps.event.addListener(marker, 'click', function() {
          setInfoWindow(map, item.html, marker, infowindow);
        });
        // add marker and item to arrays
        markers.push(marker);
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
