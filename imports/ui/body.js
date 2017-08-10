import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {styleShortDate} from '/imports/ui/lib/stylish.js';
import {getSessionSteps, updateSessionSteps} from '/client/lib/session.js';
import Sortable from 'sortablejs';

import '/node_modules/semantic-ui-calendar/dist/calendar.min.js';

import './components/infoMenu.js';
import './components/introModal.js';
import './components/mainMenu.js';
import './components/filters.js';
import './components/userMenu.js';
import './components/card.js';
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
      Session.set("planDate", date);
    }
  });
}

Template.body.onRendered(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    SemanticModal.generalModal('introModal');
  }

  var el = document.getElementById('sortable-cards');

  // var sortable = Sortable.create(el, {
  //   // handle: '.move',
  //   animation: 200,
  //   onStart: function(evt) {
  //     var auxSteps = getSessionSteps();
  //     Session.set('auxSteps', auxSteps);
  //     console.log('auxSteps:', auxSteps);
  //   },
  //   onMove: function(evt, originalEvent) {
  //     var oldIdx = evt.dragged.getAttribute('data-idx');
  //     var newIdx = evt.related.getAttribute('data-idx');
  //     var auxSteps = Session.get('auxSteps');
  //     console.log('move:', oldIdx, newIdx);
  //
  //     var aux = auxSteps[newIdx];
  //     auxSteps[newIdx] = auxSteps[oldIdx];
  //     auxSteps[oldIdx] = aux;
  //
  //     // Template.instance().index.set(newIdx);
  //     Session.set('auxSteps', auxSteps);
  //   },
  //   onEnd: function(evt) {
  //     var steps = Session.get('auxSteps');
  //     updateSessionSteps(steps);
  //     console.log('steps', steps);
  //   }
  // });

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

  steps: function() {
    return getSessionSteps();
  }
});

Template.body.events({
  'click .intro' () {
    SemanticModal.generalModal('introModal');
  },

  'click .big.icon'() {
    Session.set("isDisplaying", false);
    Session.set("isEditing", true);
  },

  'click #createItin' () {
    Session.set("planName", $('input[name=planName]').val());
    SemanticModal.generalModal('cardsModal', {steps: Session.get("steps")});
  },

  'click #saveItin' () {  // TODO confirm choices
    var newName = $('input[name=planName]').val();
    var newDate = Session.get("planDate");
    var oldItin = Session.get("displayItin");

    if(newName !== oldItin.name) {
      Meteor.call('itinerary.updateName', oldItin._id, newName, (error, result) => {
        if (error) alert(error.message);
      });
    }

    if(newDate !== oldItin.date) {
      Meteor.call('itinerary.updateDate', oldItin._id, newDate, (error, result) => {
        if (error) alert(error.message);
      });
    }

    Meteor.call('itinerary.updateSteps', oldItin._id, getSessionSteps(), (error, result) => {
      if(error) alert(error.message);
    })

    console.log(newDate);
    Session.set("isEditing", false);
  },

  'click #editItin' () {
    Session.set("isEditing", true);
  }
});

Template.planCalendar.onRendered(function() {
  const data = Template.instance().data;
  initCalendar();

  if(data != null && data.date != null)
    this.$('#mycalendar').calendar('set date', Template.instance().data.date);
});
