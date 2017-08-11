import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {getAppMap} from '/imports/api/mapper.js';
import {getRequestObject} from '/imports/api/directions.js';
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

var directionsService, directionsDisplay;
var renderArray = [];

function calculateAndDisplayRoute(requests) {
  for(var i = 0; i < requests.length; i++) {
    directionsService.route(requests[i], function(response, status) {
      console.log(renderArray[i]);
      if(typeof renderArray[i] === "undefined")
        renderArray[i] = new google.maps.DirectionsRenderer({
          suppressMarkers: true
        });
        console.log(renderArray[i]);

      if (status == google.maps.DirectionsStatus.OK) {
        renderArray[i].setDirections(response);
        renderArray[i].setMap(getAppMap().instance);
      } else {
        console.log('Directions request failed due to ' + status);
      }
    });
  }
}

Template.body.onRendered(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    SemanticModal.generalModal('introModal');
  }

  GoogleMaps.ready('map', function(map) {
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });
  });

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

  this.autorun(function() {
    var steps = getSessionSteps();
    if(steps.length >= 2) {
      var requests = [];

      for(var i = 0; i < steps.length; i++) {
        if(i == (steps.length - 1)) break;
        var prevStepLoc = steps[i].location;
        var nextStepLoc = steps[i+1].location;

        console.log(prevStepLoc);
        requests.push(getRequestObject(
          prevStepLoc.lat, prevStepLoc.lng,
          nextStepLoc.lat, nextStepLoc.lng
        ));
      }

      if(GoogleMaps.loaded()) {
        calculateAndDisplayRoute(requests);
      }
    } else {
      if(GoogleMaps.loaded()) {
        while(renderArray.length != 0) {
          renderArray[renderArray.length - 1].setMap(null);
          renderArray.pop();
        }
      }
    }
  }.bind(this));
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
    $('.check.icon').click();

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
  },
});

Template.planCalendar.onRendered(function() {
  const data = Template.instance().data;

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

  if(data != null && data.date != null)
    this.$('#mycalendar').calendar('set date', Template.instance().data.date);
});
