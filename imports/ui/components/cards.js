import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import Sortable from 'sortablejs';

import { Itineraries } from '/imports/api/itinerary.js';

import './cards.html';

Template.cards.onCreated(function() {
  this.state = new ReactiveDict();
  Session.set("totalPrice", 0);
});

Template.cards.onRendered(function() {
  var list = document.getElementById('sortable-cards');
  var sortable = Sortable.create(list, {
    animation: 150
  });
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
    if(typeof steps !== "undefined") {
      var price = 0;
      for(var i = 0; i < steps.length; i++) {
        price += steps[i].price;
      }
      Session.set("totalPrice", price);
      return price;
    } else return 0;
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

  totalPrice: function() {
    return Session.get("totalPrice");
  }
});

Template.cardsModal.events({
  'click .ui.positive.button'(event) {
    var steps = Session.get("steps");
    var price = Session.get("totalPrice");

    var email = $('.ui.send.email.input').val();
    console.log(email);


    Meteor.call('sendItineraryToEmail',
      email,
      'jdnietov@unal.edu.co',
      steps,
      price,
      Meteor.user(),
      (error, result) => {
        alert(error.message);
      }
    );
  }
});
