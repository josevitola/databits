import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Session} from 'meteor/session';

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

Meteor.startup(function() {
  var steps = [
    {
      id: 1,
      name: "Museo Nacional",
      description: "Descripción del Museo Nacional"
    }, {
      id: 2,
      name: "La Puerta Falsa",
      description: "Descripción de la Puerta Falsa"
    }
  ];
  Session.set("steps", steps);
});

Template.body.onRendered(function bodyOnRendered() {
  initLoginMessage(this);
});

Template.body.events({
  'click .ui.add.button': () => {
    console.log("click");
    SemanticModal.generalModal('tmpModal');
  },

  'click #login' () {
    SemanticModal.generalModal('loginModal');
  },

  'click #signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});

Template.tmpModal.events({
  'submit #createStepForm' (event) {
    event.preventDefault();
    var name = $('input[name=name]').val();
    var desc = $('input[name=description]').val();
    var id = 1;

    var steps = Session.get("steps");
    if (typeof steps === "undefined") {
      steps = new Array();
    } else
      id = steps.length;

    var step = {
      id: id,
      name: name,
      description: desc
    };

    var steps = Session.get("steps");
    if (typeof steps === "undefined") {
      steps = new Array();
    }

    steps.push(step);
    Session.set("steps", steps);

    $('#generalModal').modal('hide');
  }
});
