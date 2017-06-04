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
  }
});

Template.cards.events({
  'click .remove.icon'(event) {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step") -1;

    if(idx > -1) {
      steps.splice(idx, 1);
    }

    for(var i = idx; i < steps.length; i++) {
      steps[i].id -=1;
    }

    Session.set("steps", steps);
  }
})
