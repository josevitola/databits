import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';
import {ReactiveDict} from 'meteor/reactive-dict';

import Sortable from 'sortablejs';

import {getAppMap} from '/imports/api/datasets.js';
import {Itineraries, getPriceFromSteps, getTimeFromSteps} from '/imports/api/itinerary.js';
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
    onStart: function(evt) {
      var auxSteps = Session.get('steps');
      Session.set('auxSteps', auxSteps);
      console.log('auxSteps:', auxSteps);
    },
    onMove: function(evt, originalEvent) {
      var oldIdx = evt.dragged.getAttribute('data-step');
      var newIdx = evt.related.getAttribute('data-step');
      var auxSteps = Session.get('auxSteps');
      console.log('move:', oldIdx, newIdx);

      var aux = auxSteps[newIdx];
      auxSteps[newIdx] = auxSteps[oldIdx];
      auxSteps[oldIdx] = aux;

      Session.set('auxSteps', auxSteps);
    },
    onEnd: function(evt) {
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
    return getPriceFromSteps(Session.get("steps"));
  },

  totalTime: function() {
    return getTimeFromSteps(Session.get("steps"));
  },

  beautifyType: function(type) {
    if (type == "restaurant")
      return "Restaurante";
    else if (type == "museum")
      return "Museo";
    else if (type == "theatre")
      return "Teatro";
    }
  });

Template.cards.events({
  'click .ui.link.fluid.card' () {
    let target = event.target;

    if ($(target).is(".icon") || $(target).is(".button")) {
      return;
    }

    while (!$(target).is(".ui.link.card")) {
      target = $(target).parent();
    }

    let location = Session.get("steps")[$(target).data("step")].location;
    getAppMap().instance.panTo(new google.maps.LatLng(location.lat, location.lng));
  },

  'click .intro' () {
    SemanticModal.generalModal('introModal');
  },

  'click .remove.icon' () {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if (idx > -1) {
      steps.splice(idx, 1);
    }

    Session.set("steps", steps);
  },

  'click .angle.down.icon' () {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if (steps.length >= 2 && idx + 1 < steps.length) {
      var aux = steps[idx + 1];
      steps[idx + 1] = steps[idx];
      steps[idx] = aux;

      Session.set("steps", steps);
    }
  },

  'click .angle.up.icon' () {
    var steps = Session.get("steps");
    var idx = $(event.target).data("step");

    if (steps.length >= 2 && idx - 1 >= 0) {
      var aux = steps[idx - 1];
      steps[idx - 1] = steps[idx];
      steps[idx] = aux;

      Session.set("steps", steps);
    }
  },

  'click .ui.end.steps.button' () {
    Session.set("planName", $('input[name=planName]').val());
    SemanticModal.generalModal('cardsModal');
  }
});

Template.cardsModal.onCreated(function() {
  this.checking = new ReactiveVar(false);
  this.validEmail = new ReactiveVar(false);
});

Template.cardsModal.helpers({
  getPlanName: function() {
    let planName = Session.get("planName");
    return planName.length == 0
      ? "Itinerario sin nombre"
      : planName;
  },

  getPlanLength: function() {
    let len = Session.get("steps").length;
    if (len == 1) {
      return "1 parada";
    } else {
      return len + " paradas";
    }
  },

  steps: function() {
    var steps = Session.get("steps");
    return steps;
  },

  getPlanPrice: function() {
    return getPriceFromSteps(Session.get("steps"));
  },

  getPlanTime: function() {
    return getTimeFromSteps(Session.get("steps"));
  },

  beautifyType: function(type) {
    return beautifyType(type);
  },

  getPinImgName: function(type) {
    if (type == "restaurant") {
      return "rest";
    } else if (type == "museum") {
      return "muse";
    } else if (type == "theatre") {
      return "teat";
    }
  },

  isEmailInvalid: function() {
    return Template.instance().checking.get() && !Template.instance().validEmail.get();
  }
});

Template.cardsModal.events({
  'click .ui.positive.button' (event) {
    event.preventDefault();

    var name = $('input[name=planName]').val();
    var date = $('input[name=planDate]').val();
    var steps = Session.get("steps");

    console.log(name);

    if (Meteor.user()) {
      if(name.length === 0) name = "Itinerario sin nombre";
      Meteor.call('insertItinerary', name, steps, (error, result) => {
        if (error)
          alert(error.message);
        }
      );
    } else {
      var email = $('.ui.send.email.input').val();
      var price = Session.get("totalPrice");

      Template.instance().validEmail.set(validateEmail(email));
      Template.instance().checking.set(true);

      if (Template.instance().validEmail.get()) {
        Meteor.call('sendItineraryToEmail', email, steps, price, (error, result) => {
          if (error)
            alert(error.message);
        });
      }
    }
    
    $('#generalModal').modal('hide');
  }
});
