import { Template } from 'meteor/templating';

import './mainMenu.html';
import './signUpModal.js';


Template.mainMenu.events({
  'click .login' () {
    SemanticModal.generalModal('loginModal');
  },

  'click .signup' () {
    SemanticModal.generalModal('signUpModal');
  }
});
