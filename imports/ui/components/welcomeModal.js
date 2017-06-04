import { Template } from 'meteor/templating';

import './welcomeModal.html';

Template.welcomeModal.events({
  'click button': (event) => {
    console.log(event);
    event.preventDefault();
    this.$('.ui.modal').modal('hide');
  }
});
