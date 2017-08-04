import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import Sortable from 'sortablejs';

import { Itineraries } from '/imports/api/itinerary.js';
import {validateEmail} from '/imports/api/users.js';
import {beautifyType} from '/imports/ui/lib/beautify.js';

import './cards.html';

Template.cards.onCreated(function() {
  this.state = new ReactiveDict();
  Session.set("totalPrice", 0);
});

Template.cards.onRendered(function() {
  var el = document.getElementById('sortable-cards');
  var sortable = Sortable.create(el, {
    // handle: '.move',
    animation: 200,
    onStart: function (evt) {
      var auxSteps = Session.get('steps');
      Session.set('auxSteps', auxSteps);
        console.log('auxSteps:', auxSteps);
    },
    onMove: function (evt, originalEvent) {
      var oldIdx = evt.dragged.getAttribute('data-step');
      var newIdx = evt.related.getAttribute('data-step');
      var auxSteps = Session.get('auxSteps');
        console.log('move:', oldIdx, newIdx);

      var aux = auxSteps[newIdx];
      auxSteps[newIdx] = auxSteps[oldIdx];
      auxSteps[oldIdx] = aux;

      Session.set('auxSteps', auxSteps);
  	},
  	onEnd: function (evt) {
      var steps = Session.get('auxSteps');
      Session.set('steps', steps);
        console.log('steps', steps);
  	}
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
  },

  totalTime: function() {
    var steps = Session.get("steps");
    if(typeof steps !== "undefined") {
      var hours = 0;
      var minutes = 0;
      var time;
      for(var i = 0; i < steps.length; i++) {
        time = steps[i].time.split("h ", 2);
        hours += parseInt(time[0]);
        minutes += parseInt(time[1]);
      }

      hours += parseInt(minutes/60);
      minutes = minutes%60;

      return hours + 'h ' + minutes + 'min';
    } else return "0h 0min";
  },

  beautifyType: function(type) {
    if(type == "restaurant")
      return "Restaurante";
    else if(type == "museum")
      return "Museo";
    else if(type == "theatre")
      return "Teatro";
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

Template.cardsModal.onCreated(function() {
  this.checking = new ReactiveVar( false );
  this.validEmail = new ReactiveVar( false );
});

Template.cardsModal.helpers({
  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },

  totalPrice: function() {
    return Session.get("totalPrice");
  },

  beautifyType: function(type) {
    return beautifyType(type);
  },

  getPinImgName: function(type) {
    if(type == "restaurant") {
      return "rest";
    } else if(type == "museum") {
      return "muse";
    } else if(type == "theatre") {
      return "teat";
    }
  },

  isEmailInvalid: function() {
    return Template.instance().checking.get() && !Template.instance().validEmail.get();
  }
});

Template.cardsModal.events({
  'click .ui.positive.button'(event) {
    event.preventDefault();

    var steps = Session.get("steps");

    if(Meteor.user()) {
      Meteor.call('insertItinerary', steps, (error, result) => {
        if(error) alert(error.message);
      });
    } else {
      var email = $('.ui.send.email.input').val();
      var price = Session.get("totalPrice");

      Template.instance().validEmail.set( validateEmail(email) );
      Template.instance().checking.set( true );

      if(Template.instance().validEmail.get()) {
          Meteor.call('sendItineraryToEmail',
            email,
            steps,
            price,
            (error, result) => {
              if(error) alert(error.message);
            }
          );
        }
    }

    $('#generalModal').modal('hide');
  }
});
