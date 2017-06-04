import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';


import './cards.html';

var steps = Session.get("steps");

Template.cards.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.cards.helpers({
  steps: function() {
    steps = Session.get("steps");
    console.log(steps);
    return steps;
  },

  getStep: function(id) {
    return steps[id];
  },

  getIndex: function(idx) {
    return idx + 1;
  },
});
