import { Template } from 'meteor/templating';

import './welcomeModal.html';

Session.set("searchOnMap", "no");
Template.welcomeModal.events({
  'click button': (event) => {
    console.log(event);
    event.preventDefault();
    this.$('.ui.modal').modal('hide');
  },
  'click #searchOnMapButton': (event) => {
    console.log(event);
    Session.set("searchOnMap", "yes");
  }
});
