import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {styleShortDate} from '/imports/ui/lib/stylish.js';

import '/node_modules/semantic-ui-calendar/dist/calendar.min.js';

import './components/introModal.js';
import './components/mainMenu.js';
import './components/filters.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './components/search.js';
import './body.html';

function initCalendar() {
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
    onChange: function(date, text, mode) {
      Session.set("programDate", date);
    }
  });
}

Template.body.onRendered(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    SemanticModal.generalModal('introModal');
  }

  initCalendar();
});

Template.body.helpers({
  isDisplaying: function() {
    return Session.get("isDisplaying");
  },

  isEditing: function() {
    return Session.get("isEditing");
  },

  getItinName: function() {
    return Session.get("displayItin").name;
  },

  getItinDate: function() {
    return styleShortDate(Session.get("displayItin").date);
  },

  getSteps: function() {
    if(Session.get("isDisplaying"))
      return Session.get("displayItin").steps;
    else return Session.get("steps");
  }
});

Template.body.events({
  'click .big.icon'() {
    Session.set("isDisplaying", false);
    Session.set("isEditing", true);
  }
});

Template.planCalendar.onRendered(function() {
  const data = Template.instance().data;
  initCalendar();

  if(data != null && data.date != null)
    this.$('#mycalendar').calendar('set date', Template.instance().data.date);
});
