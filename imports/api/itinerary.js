import { Mongo } from 'meteor/mongo';
console.log("mongo!");
Itinerary = new Mongo.Collection('itineraries');

// Itinerary.schema = new SimpleSchema({
//   start: {
//     type: Object,
//   },
//   steps: {
//     type: Array,
//   },
//   price: {
//     type: Number
//   }
// });

export const Itineraries = Itinerary;
