// Google Maps Key: AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g

// direction to LatLng
function setLatLng(direction, latlng) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
    latlng = new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
    // console.log(latlng);
  });
}

// direction to place_id
function setPlaceId(direction, placeId) {
  $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?address="+ direction +"&key=AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g", function(data) {
    placeId = data.results[0].place_id;
    // console.log(placeId);
  });
}

// import places data and markers
export const setPlacesInfo = function(url, array, markers) {
  $.getJSON(url + "?localidad=Candelaria", function(data) {
    $.each(data, function(i, entry) {
      var location, placeId;
      setLatLng(entry.direccion + " Bogotá, Colombia", location);
      setPlaceId(entry.direccion + " Bogotá, Colombia", placeId);
      // marker
      var marker = new google.maps.Marker({
        position: location,
        map: null,
        title: entry.nombre_comercial
      });
      // array item
      var item = {
        name: entry.nombre_comercial,
        address: entry.direccion,
        phone: entry.telefono,
        placeId: placeId
      }
      google.maps.event.addListener(marker, 'click', function() {
        setInfoWindow(map, '<b>'+entry.nombre_comercial+'</b><br>'+entry.direccion, marker);
      });
      markers.push(marker);
      array.push(item);
    });
  });
}
