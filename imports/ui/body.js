import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Session} from 'meteor/session';

import './components/signUpModal.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/start.js';
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
  Session.set('x', ['x', Lunes, 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']);
  Session.set('Delitos', ['Delitos', 1.5, 2.0, 2.1, 1.7, 4.5, 3.2, 3.1]);

  var chart = c3.generate({
    bindto: this.find('#chart'),
    size: {
      height: 250,
      width: 300
    },
    data: {
      xs: {
        'Delitos': 'x'
      },
      columns: [['x'],['Delitos']],
      type: 'bar'
    }
  });

  this.autorun(function (tracker) {
    chart.load({columns: [
      Session.get('x'),
      Session.get('Delitos'),
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
