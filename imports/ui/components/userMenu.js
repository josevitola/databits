import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './userMenu.html';

Template.userMenu.onRendered(function() {
  $('.ui.dropdown').dropdown();
});

Template.userMenu.events({
  'click .logout.item'() {
    Meteor.logout(() => {
      location.reload();
    });
  },

  'click .iteneraries.item'() {
    console.log("item");
    SemanticModal.generalModal('myItinerariesModal');
  }
})
