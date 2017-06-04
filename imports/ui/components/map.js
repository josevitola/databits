import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {setPlacesInfo} from '../../api/datasets.js';
import {showMarkers} from '../../api/datasets.js';

import './map.html';

var MAP_ZOOM = 16;
var candelariaLatLng = {
  lat: 4.5964417,
  lng: -74.0765273
};

// Data Arrays
var restData = [];
var musData = [];
var theData = [];
// Marker arrays
var restMarkers = [];
var musMarkers = [];
var theMarkers = [];

var initialMarker;
Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {
    // var latLng = Geolocation.latLng();
    initialMarker = new google.maps.Marker({map: map.instance, position: candelariaLatLng, draggable: true, animation: google.maps.Animation.DROP, icon: "map_icons/start_m.png"});
    var infowindow = new google.maps.InfoWindow({addres: "", content: '<center>¿Dónde inicia tu recorrido?<br><b>Arrástrame</b></center>'+'<br><button class="ui labeled icon green addStart start button right floated"><i class="plus icon"></i>Empezar</button>'});
    infowindow.open(map.instance, initialMarker);
    google.maps.event.addListener(initialMarker, 'click', function(){
      infowindow.open(map.instance, initialMarker);
    });

    setPlacesInfo("ghc6-jiw3.json", restData, 'food_m.png', map.instance, infowindow);
    setPlacesInfo("mdh3-rurf.json", musData, 'museum_m.png', map.instance, infowindow);
    setPlacesInfo("h3hv-wumd.json", theData, 'theater_m.png', map.instance, infowindow);
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
      return {center: candelariaLatLng, zoom: MAP_ZOOM};
    }
  },
  getPlacesInfo: () => {
    if (GoogleMaps.loaded()) {
      setPlacesInfo("https://www.datos.gov.co/resource/ghc6-jiw3.json", restsData, restsMarkers);
      console.log(restsData);
    } else
      console.log("false");
    }
  });

Template.map.events({
  'click .ui.add.step.button' (event) {
    const target = event.target;
    var name = $(target).data("name");
    var phone = $(target).data("phone");
    var address = $(target).data("address");
    var web = $(target).data("web");
    var price = $(target).data("price");

    var step = {
      name: name,
      phone: phone,
      address: address,
      webpage: web,
      price: price
    };


    var steps = Session.get("steps");
    if(typeof steps === "undefined") {
      steps = [];
    }

    steps.push(step);

    Session.set("steps", steps);
  },


  'click .ui.addStart.start.button' (event) {
    var latt = initialMarker.position.lat();
    var lngg = initialMarker.position.lng();
    var latlng = {lat: latt, lng: lngg};

    // var address;
    // var geocoder = new google.maps.Geocoder;
    // console.log(initialMarker.getPosition());
    // geocoder.geocode({'location': latlng}, function(results, status) {
    //   if (status === 'OK') {
    //     if (results[1]) {
    //       address = results[1].formatted_address;
    //     } else {
    //       window.alert('No results found');
    //     }
    //   } else {
    //     window.alert('Geocoder failed due to: ' + status);
    //   }
    // });
    // console.log(address);


    var start = {
      latlng: latlng
    };

    Session.set("start", start);
  }
})
