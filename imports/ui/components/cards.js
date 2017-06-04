import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Itineraries } from '/imports/api/itinerary.js';

import './cards.html';

Template.cards.onCreated(function() {
  this.state = new ReactiveDict();
  Session.set("totalPrice", 0);
});

Template.cards.helpers({
  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },

  getIndex: function(idx) {
    return idx + 1;
  },

  totalPrice: function() {
    var steps = Session.get("steps");
    var price = 0;
    for(var i = 0; i < steps.length; i++) {
      price += steps[i].price;
    }
    Session.set("totalPrice", price);
    return price;
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


Session.set("yep", "no");
Template.cardsModal.helpers({
  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },
  isYep: function() {
    return Session.get("yep") == "yes";
  },

  totalPrice: function() {
    return Session.get("totalPrice");
  }
});

Template.cardsModal.events({
  'click .ui.yep.button'() {
    Session.set("yep", "yes");
    console.log("ingresar nombre");
  },

  'click .ui.positive.button'(event) {
    console.log("lala");

    var steps = Session.get("steps");
    var price = Session.get("totalPrice");
    console.log(steps);

    Itineraries.insert({
      belongsTo: Meteor.userId(),
      createdAt: new Date(),
      steps: steps,
      price: price
    });
  }
});
