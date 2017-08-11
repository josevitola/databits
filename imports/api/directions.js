export const getRequestObject = function(lat, lng, destLat, destLng) {
  return {
    origin: lat + ',' + lng,
    destination: destLat + ',' + destLng,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  }
}
