import { Meteor } from 'meteor/meteor';

import '/imports/startup/server/index.js';
import { Places } from '/imports/api/places.js';
import '/imports/api/itinerary.js';

Meteor.startup(() => {
  var restaurants = Places.find({type: "restaurant"}).fetch();
  var museums = Places.find({type: "museum"}).fetch();

  console.log(restaurants.length);
  console.log(museums.length);

  if(restaurants.length == 0) {
    CSV.readCsvFileLineByLine(process.env.PWD + '/server/restaurantes.csv', Meteor.bindEnvironment(function (line, index, rawParsedLine) {
      if(index != 0) {
        Places.insert({
          name: line[0],
          address: line[1],
          schedule: line[2],
          type: "restaurant",
          food: line[3],
          price: line[4]
        });
      }
   }));
  }

  if(museums.length == 0) {
    CSV.readCsvFileLineByLine(process.env.PWD + '/server/museos.csv', Meteor.bindEnvironment(function (line, index, rawParsedLine) {
      if(index != 0) {
        Places.insert({
          name: line[0],
          schedule: line[1],
          price: line[2],
          description: line[3],
          type: "museum"
        });
      }
   }));
  }
});
