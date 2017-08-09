import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { styleShortDate, styleType, formatTime } from '/imports/ui/lib/stylish.js';
import { Itineraries, getPriceFromSteps, getTimeFromSteps } from '/imports/api/itinerary.js';

import './userMenu.html';

Template.userMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

Template.userMenu.helpers({
  itinCount: function() {
    var it = Itineraries.find({userId: Meteor.userId()}).fetch();
    return it.length;
  }
});

Template.userMenu.events({
  'click .logout.item'() {
    Meteor.logout(() => {
      location.reload();
    });
  },

  'click .itineraries.item'() {
    SemanticModal.generalModal('myItinerariesModal');
  }
})

Template.myItinerariesModal.onRendered(function() {
  $('.ui.accordion').accordion();
})

Template.myItinerariesModal.helpers({
  itineraries: function() {
    var it = Itineraries.find({userId: Meteor.userId()}).fetch();
    return it;
  },

  styleShortDate: function(date) {
    return styleShortDate(date);
  },

  getTotalPrice: function(steps) {
    return getPriceFromSteps(steps);
  },

  getTotalTime: function(steps) {
    return getTimeFromSteps(steps);
  },

  styleType: function(type) {
    return styleType(type);
  }
});

Template.myItinerariesModal.events({
  'click .remove.icon'() {
    var id = $(event.target).parent().parent().parent().parent().data('id');
    Meteor.call('removeItinerary', id, (error, result) => {
      if(error) alert(error.message);
    });
  },

  'click a.header'(event) {
    var id = $(event.target).data("id");
    var it = Itineraries.find({_id: id}).fetch()[0];
    Session.set("displayItin", it);

    Session.set("isDisplaying", true);
    Session.set("isEditing", false);
    $('#generalModal').modal('hide');
  }
});
