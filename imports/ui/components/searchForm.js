import { Template } from 'meteor/templating';

import './searchForm.html';

Session.set("filters", []);

Template.searchForm.onRendered(() => {
  $('.ui.checkbox').checkbox();
});

Template.searchForm.events({
  'click .ui.checkbox' (event) {
    let filters = Session.get("filters");

    $(".filterCheckbox:checked").each(function(){
      filters.push($(this).val());
    });

    console.log(filters);
  }
});
