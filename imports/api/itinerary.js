import { Mongo } from 'meteor/mongo';

Itinerary = new Mongo.Collection('itineraries');

export const Itineraries = Itinerary;
