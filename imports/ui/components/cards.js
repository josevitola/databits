import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

import './cards.html';

Template.cards.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.cards.helpers({
  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },

  getIndex: function(idx) {
    return idx + 1;
  }
});

Template.cards.events({
  'click .remove.icon'() {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if(idx > -1) {
      steps.splice(idx, 1);
    }

    Session.set("steps", steps);
  },

  'click .angle.down.icon'() {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if(steps.length >= 2 && idx+1 < steps.length) {
      var aux = steps[idx+1];
      steps[idx+1] = steps[idx];
      steps[idx] = aux;

      Session.set("steps", steps);
    }
  },

  'click .angle.up.icon'() {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if(steps.length >= 2 && idx-1 >= 0) {
      var aux = steps[idx-1];
      steps[idx-1] = steps[idx];
      steps[idx] = aux;

      Session.set("steps", steps);
    }
  },

  'click .ui.end.steps.button'() {
    SemanticModal.generalModal('cardsModal');
  }
});

Template.cardsModal.helpers({
  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },
});
