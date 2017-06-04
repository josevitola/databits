import { Template } from 'meteor/templating';

import './signUpModal.html';

Template.signUpModal.events({
  // 'click #changeToLogin'() {
  //   console.log("close");
  //   $('#generalModal').modal('hide');
  //   SemanticModal.generalModal('loginModal');
  // },

  'submit #signUpForm'(event) {
    var name = $('input[name=name]').val();
    var email = $('input[name=email]').val();
    var password = $('input[name=password]').val();
    var checkPassword = $('input[name=checkPassword]').val();

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
    event.preventDefault();
  }
});

Template.loginModal.events({
  'submit #loginForm'(event) {
    event.preventDefault();
    var email = $('input[name=loginEmail]').val();
    var password = $('input[name=loginPassword]').val();

    Meteor.loginWithPassword(email, password);

    $('#generalModal').modal('hide');
  }
});
