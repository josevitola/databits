import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Session} from 'meteor/session';

import { Itineraries } from '/imports/api/itinerary.js';

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
  $('.ui.sticky').sticky({});

  this.$('.ui.accordion').accordion();Session.set('x', ['x', 30, 50, 75, 100, 120]);

  Session.set('data1', ['data1', 30, 200, 100, 400, 150]);
  Session.set('data2', ['data2', 20, 180, 240, 100, 190]);
  var chart = c3.generate({
    bindto: this.find('#chart'),
      data: {
        xs: {
          'data1': 'x',
          'data2': 'x'
        },
        columns: [['x'],['data1'],['data2']]
      }
  });

  this.autorun(function (tracker) {
    chart.load({columns: [
      Session.get('x'),
      Session.get('data1'),
      Session.get('data2'),
      []
    ]});
  });
});

Template.body.events({
  'click #login' () {
    SemanticModal.generalModal('loginModal');
  },

  'click #signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});
