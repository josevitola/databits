import { Template } from 'meteor/templating';

import './signUpModal.html';

import {validateEmail} from '/imports/api/users.js';

Template.signUpForm.onCreated(function() {
  this.checking = new ReactiveVar( false );
  this.isName = new ReactiveVar( false );
  this.isPass = new ReactiveVar( false );
  this.validEmail = new ReactiveVar( false );
  this.matchPass = new ReactiveVar( false );
});

Template.signUpForm.helpers({
  isEmailInvalid: function() {
    return Template.instance().checking.get() && !Template.instance().validEmail.get();
  },

  doPassMatch: function() {
    return Template.instance().checking.get() && Template.instance().isPass.get() && !Template.instance().matchPass.get();
  },

  isNotPass: function() {
    return Template.instance().checking.get() && !Template.instance().isPass.get();
  },

  isNotName: function() {
    return Template.instance().checking.get() && !Template.instance().isName.get();
  },
});


Template.signUpForm.events({
  'submit #signUpForm'(event) {
    event.preventDefault();
    var name = $('input[name=name]').val();
    var email = $('input[name=email]').val();
    var password = $('input[name=password]').val();
    var checkPassword = $('input[name=checkPassword]').val();

    if(name.length != 0) {
      Template.instance().isName.set( true );
    } else {
      Template.instance().isName.set( false );
    }

    if(password.length != 0) {
      Template.instance().isPass.set( true );
      if(password === checkPassword) {
        Template.instance().matchPass.set( true );
      } else {
        Template.instance().matchPass.set( false );
      }
    } else Template.instance().isPass.set( false );

    Template.instance().validEmail.set( validateEmail(email) );

    Template.instance().checking.set( true );

    var instance = Template.instance();
    if(instance.isName.get() &&
      instance.validEmail.get() &&
      instance.matchPass.get() &&
      instance.isPass.get()) {
      Accounts.createUser({
        email: email,
        password: password,
        profile: {
          name: name
        }
      }, () => {
        location.reload();
      });

      console.log("success");
    }
  }
});

Template.loginForm.events({
  'submit #loginForm'(event) {
    event.preventDefault();
    var email = $('input[name=loginEmail]').val();
    var password = $('input[name=loginPassword]').val();

    Meteor.loginWithPassword(email, password);

    $('#generalModal').modal('hide');
  }
});
