import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

import './start.html';

Template.start.onCreated(function() {
  this.state = new ReactiveDict();
});

Template.start.helpers({
  start: function() {
    var start = Session.get("start");
    return start;
  },
  exist: function() {
    return Session.get("start") != "empty";
  }
});

Template.start.events({
  'click .remove.icon'() {
    Session.set("start", "empty");
  }
})
