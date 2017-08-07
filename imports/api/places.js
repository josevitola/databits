import { Mongo } from 'meteor/mongo';

Place = new Mongo.Collection('places');

export const Places = Place;

export const getPinImgName = function(type) {
  if (type == "restaurant") {
    return "rest";
  } else if (type == "museum") {
    return "muse";
  } else if (type == "theatre") {
    return "teat";
  }
}
