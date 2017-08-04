import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { beautifyDate, beautifyType, formatTime } from '/imports/ui/lib/beautify.js';
import { Itineraries } from '/imports/api/itinerary.js';

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

  getItinDate: function(itin) {
    return beautifyDate(itin.createdAt) + " a las " + formatTime(itin.createdAt);
  },

  beautifyType: function(type) {
    return beautifyType(type);
  }
});

Template.myItinerariesModal.events({
  'click .itin.remove'() {
    var id = $(event.target).data('id');
    Meteor.call('removeItinerary', id, (error, result) => {
      if(error) alert(error.message);
    });
  }
});
