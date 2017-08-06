import {Template} from 'meteor/templating';

import './components/introModal.js';
import './components/mainMenu.js';
import './components/searchForm.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './body.html';


Template.body.onRendered(function() {
  $(".ui.dropdown").dropdown();

  if(!Meteor.user()) {
    // SemanticModal.generalModal('introModal');
  }
});
