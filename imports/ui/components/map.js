import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { setPlacesInfo } from '../../api/datasets.js';

import './map.html';

var MAP_ZOOM = 13;
var bogLat = 4.6381991;
var bogLng = -74.0862351;

// Data Arrays
var restsData = [];
// Marker arrays
var restsMarkers = [];

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    var latLng = Geolocation.latLng();

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latLng.lat, latLng.lng),
      map: map.instance
    });

    setPlacesInfo("https://www.datos.gov.co/resource/ghc6-jiw3.json", restsData, restsMarkers);
    console.log(restsData);
  });
});

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Geolocation.latLng();
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM
      };
    }
  },
  getPlacesInfo: () => {
    if(GoogleMaps.loaded()) {
      setPlacesInfo("https://www.datos.gov.co/resource/ghc6-jiw3.json", restsData, restsMarkers);
      console.log(restsData);
    } else console.log("false");
  }
});
