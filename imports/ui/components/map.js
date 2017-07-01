import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {setPlacesInfo} from '../../api/datasets.js';
import {showMarkers} from '../../api/datasets.js';

import './map.html';

var MAP_ZOOM = 17;
var candelariaLatLng = {
  lat: 4.5964417,
  lng: -74.0765273
};

var infowindow;

// Data Arrays
var restData = [];
var musData = [];
var theData = [];
var pointsData = [];

// Marker arrays
var restMarkers = [];
var musMarkers = [];
var theMarkers = [];


var newMarker;

Template.map.onCreated(function() {
  GoogleMaps.ready('map', function(map) {

    newMarker = new google.maps.Marker({map: map.instance, visible: false, position: candelariaLatLng, draggable: true, animation: google.maps.Animation.DROP});
    infowindow = new google.maps.InfoWindow({content: ''});
    google.maps.event.addListener(newMarker, 'click', function(){
      mewPointMarkerInfo(map.instancem, newMarker, infowindow);
    });
    google.maps.event.addListener(newMarker, 'dragend', function(){
      mewPointMarkerInfo(map.instancem, newMarker, infowindow);
    });

    google.maps.event.addListener(map.instance, 'click', function(event){
      newMarker.setPosition(event.latLng);
      if(!newMarker.getVisible()){
        newMarker.setVisible(true);
      }
      mewPointMarkerInfo(map.instancem, newMarker, infowindow);
    });

    setPlacesInfo("ghc6-jiw3.json", restData, 'rest-pin.png', map.instance, infowindow);
    setPlacesInfo("mdh3-rurf.json", musData, 'muse-pin.png', map.instance, infowindow);
    setPlacesInfo("h3hv-wumd.json", theData, 'teat-pin.png', map.instance, infowindow);
  });
});

function mewPointMarkerInfo(map, marker, infowindow){
  var id = pointsData.length +1;
  var name = "Punto " + id;
  var address = "Falta dirección";

  var lat = newMarker.position.lat();
  var lng = newMarker.position.lng();

  var html = '<center><h3>'+ name +'</h3></center>' +
              '<br><b>Dirección: </b> '+ address +
              '<br><b>Lat: </b> '+ lat +
              '<br><b>Lng: </b> '+ lng +
              '<br><br><button class="ui labeled icon green add point button right floated"' +
              'data-name="' + name +
              '" data-address="' + address +
              '" data-lat="' + lat +
              '" data-lng="' + lng +
              '"><i class="plus icon"></i>Agregar</button>';

  infowindow.setContent(html);
  infowindow.open(map, marker);
}



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
    var target = event.target;

    if(typeof $(target).data("name") === "undefined") {
      target = $(target).parent();
    }

    var name = $(target).data("name");
    var phone = $(target).data("phone");
    var address = $(target).data("address");
    var lat = $(target).data("lat");
    var lng = $(target).data("lng");
    var location = {lat: lat, lng: lng};
    console.log(location);
    var web = $(target).data("web");
    var price = $(target).data("price");

    var step = {
      name: name,
      phone: phone,
      address: address,
      location: location,
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

  'click .ui.add.point.button' (event) {
    newMarker.setVisible(false);
    //infowindow.close();

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

    const target = event.target;
    var name = $(target).data("name");
    var address = $(target).data("address");
    var lat = $(target).data("lat");
    var lng = $(target).data("lng");
    var location = {lat: lat, lng: lng};

    var marker = new google.maps.Marker({
      position: location,
      map: GoogleMaps.maps.map.instance,
      title: name,
    });
    // data item definition
    var item = {
      name: name,
      address: address,
      location: location,
      marker: marker,
      html: '<center><h3>'+ name +'</h3></center>' +
            '<br><b>Dirección: </b> '+ address +
            '<br><b>Lat: </b> '+ lat +
            '<br><b>Lng: </b> '+ lng +
            '<br><br><button class="ui labeled icon green add point button right floated"' +
            'data-name="' + name +
            '" data-address="' + address +
            '" data-lat="' + lat +
            '" data-lng="' + lng +
            '"><i class="plus icon"></i>Agregar</button>'
    }
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(item.html);
      infowindow.open(GoogleMaps.maps.map.instance, marker);
    });
    // add item to array
    pointsData.push(item);

    var step = {
      name: name,
      phone: "",
      address: address,
      location: location,
      webpage: "",
      price: 0
    };

    var steps = Session.get("steps");
    if(typeof steps === "undefined") {
      steps = [];
    }

    steps.push(step);

    Session.set("steps", steps);
  }
})
