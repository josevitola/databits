import {Template} from 'meteor/templating';

import './components/introModal.js';
import './components/mainMenu.js';
import './components/searchFilters.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './body.html';


Template.body.onRendered(function() {
  if(!Meteor.user() && !Meteor.loggingIn()) {
    SemanticModal.generalModal('introModal');
  }
});
