import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

Itinerary = new Mongo.Collection('itineraries');

Itinerary.schema = new SimpleSchema({
  userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: false},
  name: {type: String, optional: false},
  createdAt: {type: Date},
  date: {type: Date},
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
  'itinerary.insert'( name, date, steps ) {
    var itinerary = {
      userId: this.userId,
      name: name,
      createdAt: new Date(),
      date: date,
      steps: steps
    };

    Itineraries.schema.validate(itinerary);
    Itineraries.insert(itinerary);
  },

  'itinerary.remove'( id ) {
    // check(id, Meteor.Collection.ObjectID);
    var itinerary = Itineraries.find({"_id": id}).fetch()[0];
    if(itinerary.userId == this.userId) {
      Itineraries.remove(id);
    }
  },

  'itinerary.updateName'( id, newName ) {
    // TODO check id
    // check(id, Meteor.Collection.ObjectID._str);
    check(newName, String);

    let itinerary = Itineraries.find({_id: id}).fetch()[0];
    if(this.userId == itinerary.userId) {
      Itineraries.update(id, {
        $set: { name: newName }
      })
    }
  },

  'itinerary.updateDate'( id, newDate ) {
    check(newDate, Date);

    let itinerary = Itineraries.find({_id: id}).fetch()[0];
    if(this.userId == itinerary.userId) {
      Itineraries.update(id, {
        $set: { date: newDate }
      })
    }
  },

  'itinerary.updateSteps'( id, steps ) {
    Itineraries.schema.validate({steps});

    let itinerary = Itineraries.find({_id: id}).fetch()[0];
    if(this.userId == itinerary.userId) {
      Itineraries.update(id, {
        $set: { steps: steps }
      });
    }
  }
});

export const getPriceFromSteps = function(steps) {
  if (typeof steps !== "undefined") {
    var price = 0;
    for (var i = 0; i < steps.length; i++) {
      price += steps[i].price;
    }
    return price;
  } else
    return 0;
}

export const getTimeFromSteps = function(steps) {
  if (typeof steps !== "undefined") {
    var hours = 0;
    var minutes = 0;
    var time;
    for (var i = 0; i < steps.length; i++) {
      time = steps[i].time.split("h ", 2);
      hours += parseInt(time[0]);
      minutes += parseInt(time[1]);
    }

    hours += parseInt(minutes / 60);
    minutes = minutes % 60;

    return hours + 'h ' + minutes + 'min';
  } else
    return "0h 0min";
}
