import {Session} from 'meteor/session';

export const getSessionSteps = function() {
  if(Session.get("isDisplaying"))
    return Session.get("displayItin").steps;
  else return Session.get("steps");
}

export const updateSessionSteps = function(steps) {
  if(Session.get("isDisplaying")) {
    var itin = Session.get("displayItin");
    itin.steps = steps;
    Session.set("displayItin", itin);
  } else {
    Session.set("steps", steps);
  }
}

export const addToSessionSteps = function(step) {
  var oldSteps = getSessionSteps();
  if(typeof oldSteps === "undefined") oldSteps = [];
  oldSteps.push(step);
  updateSessionSteps(oldSteps);
}

export const removeSessionStep = function(idx) {
  var oldSteps = getSessionSteps();
  if (idx > -1) {
    oldSteps.splice(idx, 1);
  }
  updateSessionSteps(oldSteps);
}
