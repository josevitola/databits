import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Session} from 'meteor/session';

import './components/signUpModal.js';
import './components/mainMenu.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './body.html';

function initLoginMessage(template) {
  template.$('.message .close').on('click', function() {
    $(this).closest('.message').transition('fade');
  });
}

function setCrimeDataByDay(day, count) {
  var municipio = "BOGOTÁ D.C. (CT)";
  count = 0;
  $.getJSON("https://www.datos.gov.co/resource/nic7-3tzj.json" + "?MUNICIPIO=" + municipio + "$DIA=" + day, function(data) {
    $.each(data, function(i, entry) {
      count ++;
    });
  });
}

Template.body.onRendered(function bodyOnRendered() {
  initLoginMessage(this);
  $('.ui.sticky').sticky({});

  this.$('.ui.accordion').accordion();
});

Template.body.events({
  'click .login' () {
    SemanticModal.generalModal('loginModal');
  },

  'click .signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});
