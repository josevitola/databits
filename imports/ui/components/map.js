import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { setPlacesInfo } from '../../api/datasets.js';
import { showMarkers } from '../../api/datasets.js';

import './map.html';

var MAP_ZOOM = 15;
var candelariaLatLng = {lat: 4.5964417, lng: -74.0765273};

// Data Arrays
var restData = [];
var musData = [];
var theatData = [];
// Marker arrays
var restMarkers = [];
var musMarkers = [];
var theatMarkers = [];

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    // var latLng = Geolocation.latLng();
    var initialMarker = new google.maps.Marker({
      map: map.instance,
      position: candelariaLatLng,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: "map_icons/initial.png"
    });

    var infowindow = new google.maps.InfoWindow({ content: '' });

    setPlacesInfo("https://www.datos.gov.co/resource/ghc6-jiw3.json", restData, restMarkers, map.instance);

    // showMarkers(restsMarkers);
    // console.log(restsMarkers[0]);
    // for (var i = 0; i < restsMarkers.length; i++) {
    //   restsMarkers[i].setMap(map.instance);
    // }
    // restsMarkers.forEach(function(marker) {
    //   marker.setMap(map.instance);
    // });
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
        center: candelariaLatLng,
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
