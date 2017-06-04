import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './components/map.js';
import './body.html';

function initSidebar(template) {
  template.$('.ui.sidebar').sidebar('show');
}

Template.body.onRendered(function bodyOnRendered() {
  initSidebar(this);
})

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
