import {getAppMap} from '/imports/api/mapper.js';

export const clearDirections = function(display) {
  for(let i = 0; i < display.length; i++)
    display[i].setMap(null);
}

export const calculateAndDisplayRoute = function(requests, service, display) {
  for(let i = 0; i < requests.length; i++) {
    service.route(requests[i], function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        display[i].setDirections(response);
        display[i].setMap(getAppMap().instance);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
}

export const getRequestObject = function(lat, lng, destLat, destLng) {
  return {
    origin: lat + ',' + lng,
    destination: destLat + ',' + destLng,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  }
}
