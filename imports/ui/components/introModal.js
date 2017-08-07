import { Template } from 'meteor/templating';

import './signUpModal.js';
import './introModal.html';

Template.introModal.events({
  'click .ui.labeled.icon.close.button'() {
    $('#generalModal').modal('hide');
  }
});

Template.introModal.onRendered(function() {
  $('#carousel').slick({
    dots: true,
    arrows: true,
    infinite: false
  });
});
