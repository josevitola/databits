import { Mongo } from 'meteor/mongo';

Place = new Mongo.Collection('places');

export const Places = Place;
