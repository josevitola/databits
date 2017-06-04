import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Session} from 'meteor/session';

import './components/dropdown.js';
import './components/signUpModal.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './body.html';

function initLoginMessage(template) {
  template.$('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
  });
}

Template.body.onRendered(function bodyOnRendered() {
  initLoginMessage(this);
});

Template.body.events({
  'click #login' () {
    SemanticModal.generalModal('loginModal');
  },

  'click #signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});
