import {Template} from 'meteor/templating';
import {openMarker, getMuseums, getRestaurants, getTheatres} from '/imports/api/datasets.js';
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
        fields: {
          title: 'name',
          description: 'address'
        },
        searchFields: ['name'],
        searchFullText: true,
        onSelect: function(result, response) {
          openMarker(result.html, result.marker, result.location);
        }
      });

      console.log(content[0]);
    }
  }
});
