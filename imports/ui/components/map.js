import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './map.html';

Meteor.startup(function() {
  GoogleMaps.load();
});

Template.map.helpers({
  mapOptions: function() {
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(4.6381991, -74.0862351),
        zoom: 13
      };
    }
  }
});
