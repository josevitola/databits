import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';

import {getSessionSteps, updateSessionSteps, removeSessionStep} from '/client/lib/session.js';
import {getPinImgName} from '/imports/api/places.js';
import {openMarker, getAppMap, generateInfWinHtml} from '/imports/api/datasets.js';
import {Itineraries, getPriceFromSteps, getTimeFromSteps} from '/imports/api/itinerary.js';
import {validateEmail} from '/imports/api/users.js';
import {styleType, styleDate} from '/imports/ui/lib/stylish.js';

import './card.html';

// FIXME update data to template, not to global variable

Template.card.onCreated(function() {
  this.editingCard = new ReactiveVar(false);
})

Template.card.helpers({
  isDisplaying: function() {
    return Session.get("isDisplaying");
  },

  isEditing: function() {
    return Session.get("isEditing");
  },

  isEditingCard: function() {
    return Template.instance().editingCard.get();
  },

  isPoint: function(type) {
    return type == "new";
  },

  getIndex: function(idx) {
    return idx + 1;
  },

  styleType: function(type) {
    return styleType(type);
  }
});

Template.card.events({
  'click .ui.link.fluid.card' () {
    let target = event.target;

    if ($(target).is(".icon") || $(target).is(".button") || $(target).is("input")) {
      return;
    }

    while (!$(target).is(".ui.link.card")) {
      target = $(target).parent();
    }

    let step = getSessionSteps()[Template.instance().data.idx];
    openMarker(generateInfWinHtml(step), new google.maps.Marker({
      position: step.location, map: getAppMap().instance, visible: false // TODO TEMPORARY SOLUTION. Actually use the associated marker
    }), step.location);
  },

  'click .remove.icon' () {
    removeSessionStep(Template.instance().data.idx);
  },

  'click .angle.down.icon' () {
    var steps = getSessionSteps();
    var idx = Template.instance().data.idx;

    if (steps.length >= 2 && idx + 1 < steps.length) {
      var aux = steps[idx + 1];
      steps[idx + 1] = steps[idx];
      steps[idx] = aux;

      updateSessionSteps(steps);
    }
  },

  'click .angle.up.icon' () {
    var steps = getSessionSteps();
    var idx = Template.instance().data.idx;

    if (steps.length >= 2 && idx - 1 >= 0) {
      var aux = steps[idx - 1];
      steps[idx - 1] = steps[idx];
      steps[idx] = aux;

      updateSessionSteps(steps);
    }
  },

  'click .edit.icon' () {
    Template.instance().editingCard.set(true);
  },

  'click .check.icon' () {
    // TODO prevent user from input negative numbers
    var hours = $("#hours").val();
    var minutes = $("#minutes").val();
    var newPrice = parseInt($("#newPrice").val());
    var newName = $("#newName").val();

    if(!hours) hours = 0;
    if(!minutes) minutes = 0;

    var newTime = hours + "h " + minutes + "min";
    var idx = Template.instance().data.idx;
    var steps = getSessionSteps();

    if(newName) steps[idx].name = newName;
    steps[idx].time = newTime;
    steps[idx].price = newPrice;
    updateSessionSteps(steps);

    Template.instance().editingCard.set(false);
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
