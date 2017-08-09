import { Session } from 'meteor/session';

export const validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const isCreating = function() {
  return Session.get("userState") == "create";
}

export const isDisplaying = function() {
  return Session.get("userState") == "display";
}

export const isEditing = function() {
  return Session.get("userState") == "edit";
}
