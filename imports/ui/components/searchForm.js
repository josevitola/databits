import { Template } from 'meteor/templating';

import './searchForm.html';

Session.set("filters", []);

Template.searchForm.onRendered(() => {
  $('.ui.checkbox').checkbox();
});

Template.searchForm.events({
  'click #rest-checkbox' (event) {
    $(".filterCheckbox:checked").each(function(){
      console.log('checked');
    });
    $(".filterCheckbox:unchecked").each(function(){
      console.log('unchecked');
    });
  }
});
