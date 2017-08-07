import {Template} from 'meteor/templating';
import {getMuseums, getRestaurants, getTheatres} from '/imports/api/datasets.js';
import './search.html';

var content = [];

Template.search.events({
  'focus input'() {
    if(content.length === 0) {
      content = content.concat(getMuseums());
      content = content.concat(getTheatres());
      content = content.concat(getRestaurants());

      $('.ui.search').search({
        source: content,
        searchFields: ['name'],
        searchFullText: false
      });

      console.log(content[0]);
    }
  }
});
