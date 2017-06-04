import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

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
  SemanticModal.generalModal('welcomeModal');
});
