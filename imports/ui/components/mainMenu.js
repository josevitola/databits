import { Template } from 'meteor/templating';

import './signUpModal.js';

import './mainMenu.html';

Template.mainMenu.events({
  'click .login' () { 
    SemanticModal.generalModal('loginModal');
  },

  'click .signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});
