import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Itineraries } from '/imports/api/itinerary.js';

import './userMenu.html';

Template.userMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

Template.userMenu.helpers({
  itinCount: function() {
    var it = Itineraries.find({belongsTo: Meteor.userId()}).fetch();
    return it.length;
  }
});

Template.myItinerariesModal.helpers({
  itineraries: function() {
    var it = Itineraries.find({belongsTo: Meteor.userId()}).fetch();
    console.log(it);
    return it;
  },
});

Template.userMenu.events({
  'click .logout.item'() {
    Meteor.logout(() => {
      location.reload();
    });
  },

  'click .itineraries.item'() {
    console.log("item");
    SemanticModal.generalModal('myItinerariesModal');
  }
})
