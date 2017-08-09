// Yeliana's Key: AIzaSyDDkn2WN4FS6NvzRPq7VQx8k7S5_3CnJ6g

import "../imports/ui/body.js";
import { MAP_KEY } from '/imports/api/datasets.js';

Meteor.startup(function() {
  GoogleMaps.load({v: '3', key: MAP_KEY});

  Session.set("userState", "create"); // create, display, edit
  Session.set("steps", []);
  Session.set("displayItin", []);
});
