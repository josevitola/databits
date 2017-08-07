import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import '/node_modules/semantic-ui-calendar/dist/calendar.min.js';

import './components/introModal.js';
import './components/mainMenu.js';
import './components/filters.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './components/search.js';
import './body.html';

Template.body.onRendered(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    SemanticModal.generalModal('introModal');
  }

  $('#mycalendar').calendar({
    type: 'date',
    firstDayOfWeek: 1,
    today: true,
    monthFirst: false,
    text: {
      days: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      today: 'Hoy',
      now: 'Ahora',
      am: 'AM',
      pm: 'PM'
    },
  });
});
