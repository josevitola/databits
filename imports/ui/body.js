import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './components/stepCard.js';
import './components/welcomeModal.js';
import './components/map.js';
import './body.html';

function initSidebar(template) {
  template.$('.ui.sidebar').sidebar('show');
}

function initModal(template) {
  template.$('.ui.modal').show();
}

Template.body.onRendered(function bodyOnRendered() {
  initSidebar(this);
  this.$('.ui.dropdown').dropdown();
  SemanticModal.generalModal('welcomeModal');
});

Template.body.helpers({
  searchOnMap: function() {
    return Session.get("searchOnMap")=="yes";
  }
});

Template.body.events({
  'click #cancelSearchOnMapButton': (event) => {
    template.$('.ui.modal').show();
    Session.set("searchOnMap", "no");
  }
});
