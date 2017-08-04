import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Itinerary = new Mongo.Collection('itineraries');

Itinerary.schema = new SimpleSchema({
  userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: false},
  createdAt: {type: Date},
  steps: {type: [Object]},
  "steps.$.name": {type: String},
  "steps.$.address": {type: String},
  "steps.$.type": {type: String},
  "steps.$.location.lat": {type: Number, decimal: true},
  "steps.$.location.lng": {type: Number, decimal: true},
  "steps.$.phone": {type: String, optional: true},
  "steps.$.webpage": {type: String, optional: true},
  "steps.$.price": {type: Number, optional: true},
  "steps.$.time": {type: String, optional: true},
});

export const Itineraries = Itinerary;

Meteor.methods({
  insertItinerary( steps ) {
    var itinerary = {
      userId: this.userId,
      createdAt: new Date(),
      steps: steps
    };

    Itineraries.schema.validate(itinerary);
    Itineraries.insert(itinerary);
  },

  removeItinerary( id ) {
    // check(id, Meteor.Collection.ObjectID);
    var itinerary = Itineraries.find({"_id": id}).fetch()[0];
    if(itinerary.userId == this.userId) {
      Itineraries.remove(id);
    }
  }
});
