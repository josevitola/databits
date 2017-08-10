import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';
import {ReactiveDict} from 'meteor/reactive-dict';

import Sortable from 'sortablejs';

import {getSessionSteps, updateSessionSteps, removeSessionStep} from '/client/lib/session.js';
import {getPinImgName} from '/imports/api/places.js';
import {openMarker, getAppMap, generateInfWinHtml} from '/imports/api/datasets.js';
import {Itineraries, getPriceFromSteps, getTimeFromSteps} from '/imports/api/itinerary.js';
import {validateEmail} from '/imports/api/users.js';
import {styleType, styleDate} from '/imports/ui/lib/stylish.js';

import './cards.html';

// FIXME update data to template, not to global variable

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
    return getSessionSteps();
  },

  isDisplaying: function() {
    return Session.get("isDisplaying");
  },

  isEditing: function() {
    return Session.get("isEditing");
  },

  getIndex: function(idx) {
    return idx + 1;
  },

  totalPrice: function() {
    return getPriceFromSteps(getSessionSteps());
  },

  totalTime: function() {
    return getTimeFromSteps(getSessionSteps());
  },

  styleType: function(type) {
    return styleType(type);
  }
});

Template.cards.events({
  'click .ui.link.fluid.card' () {
    const steps = getSessionSteps();
    let target = event.target;

    if ($(target).is(".icon") || $(target).is(".button")) {
      return;
    }

    while (!$(target).is(".ui.link.card")) {
      target = $(target).parent();
    }

    let step = steps[$(target).data("idx")];
    // centerMap(step.location);
    openMarker(generateInfWinHtml(step), new google.maps.Marker({
      position: step.location, map: getAppMap().instance, visible: false // TODO TEMPORARY SOLUTION. Actually use the associated marker
    }), step.location);
  },

  'click .intro' () {
    SemanticModal.generalModal('introModal');
  },

  'click .remove.icon' () {
    var idx = $(event.target).data("idx");

    removeSessionStep(idx);
  },

  'click .angle.down.icon' () {
    var steps = getSessionSteps();
    var idx = $(event.target).data("idx");

    if (steps.length >= 2 && idx + 1 < steps.length) {
      var aux = steps[idx + 1];
      steps[idx + 1] = steps[idx];
      steps[idx] = aux;

      updateSessionSteps(steps);
    }
  },

  'click .angle.up.icon' () {
    var steps = getSessionSteps();
    var idx = $(event.target).data("idx");

    if (steps.length >= 2 && idx - 1 >= 0) {
      var aux = steps[idx - 1];
      steps[idx - 1] = steps[idx];
      steps[idx] = aux;

      updateSessionSteps(steps);
    }
  },

  'click #createItin' () {
    Session.set("planName", $('input[name=planName]').val());
    SemanticModal.generalModal('cardsModal', {steps: Session.get("steps")});
  },

  'click #saveItin' () {
    var newName = $('input[name=planName]').val();
    var newDate = Session.get("planDate");
    var oldItin = Session.get("displayItin");

    if(newName !== oldItin.name) {
      Meteor.call('itinerary.updateName', oldItin._id, newName, (error, result) => {
        if (error) alert(error.message);
      });
    }

    if(newDate !== oldItin.date) {
      Meteor.call('itinerary.updateDate', oldItin._id, newDate, (error, result) => {
        if (error) alert(error.message);
      });
    }

    console.log(newDate);
    Session.set("isEditing", false);
  },

  'click #editItin' () {
    Session.set("isEditing", true);
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

  styleType: function(type) {
    return styleType(type);
  },

  getPinImgName: function(type) {
    return getPinImgName(type);
  },

  isEmailInvalid: function() {
    return Template.instance().checking.get() && !Template.instance().validEmail.get();
  },

  styleDate: function() {
    if(typeof Session.get("planDate") === "undefined") {
      Session.set("planDate", new Date());
    }
    return styleDate(Session.get("planDate"));
  }
});

Template.cardsModal.events({
  'click .ui.positive.button' (event) {
    event.preventDefault();

    var name = $('input[name=planName]').val();
    if (name.length == 0) {
      name = "Itinerario sin nombre";
    }

    // FIXME get date direcly from calendar, not onChange workaround
    date = Session.get("planDate");

    var steps = Session.get("steps");

    if (Meteor.user()) {
      Meteor.call('itinerary.insert', name, date, steps, (error, result) => {
        if (error)
          alert(error.message);
        }
      );
    } else {
      var email = $('.ui.send.email.input').val();

      Template.instance().validEmail.set(validateEmail(email));
      Template.instance().checking.set(true);

      if (Template.instance().validEmail.get()) {
        Meteor.call('sendItineraryToEmail', name, email, steps, (error, result) => {
          if (error)
            alert(error.message);
          }
        );
      }
    }

    $('#generalModal').modal('hide');
  }
});
