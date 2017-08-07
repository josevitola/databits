import { Template } from 'meteor/templating';

import './filters.html';
import {getRestaurants, getTheatres, getMuseums, getInfWin, getAppMap} from '../../api/datasets.js';

function setDataOnMap(data, map) {
  for(let i = 0; i < data.length; i++) {
    var marker = data[i].marker;
    marker.setMap(map);
  }
}

Template.filters.onRendered(() => {
  $(".ui.dropdown").dropdown({
    allowReselection: true,
    allowAdditions: true,
    forceSelection: false
  });
  GoogleMaps.ready('map', (map) => {
    $('.ui.checkbox').checkbox('set checked');
  })
});

Template.filters.events({
  'change .ui.museum.checkbox'() {
    if($('.ui.museum.checkbox').checkbox('is checked')) {
      // if(museumMapData.length == 0) {
      //   setPlacesInfo("museum", museumMapData, 'muse-pin.png', getAppMap().instance, getInfWin());
      // } else {
        setDataOnMap(getMuseums(), getAppMap().instance);
      // }
    } else {
      setDataOnMap(getMuseums(), null);
    }
  },

  'change .ui.theatre.checkbox'() {
    if($('.ui.theatre.checkbox').checkbox('is checked')) {
      // if(theatreMapData.length == 0) {
      //   setPlacesInfo("theatre", theatreMapData, 'teat-pin.png', getAppMap().instance, getInfWin());
      // } else {
        setDataOnMap(getTheatres(), getAppMap().instance);
      // }
    } else {
      setDataOnMap(getTheatres(), null);
    }
  },

  'change .ui.restaurant.checkbox'() {
    if($('.ui.restaurant.checkbox').checkbox('is checked')) {
      // if(restaurantMapData.length == 0) {
      //   setPlacesInfo("restaurant", restaurantMapData, 'rest-pin.png', getAppMap().instance, getInfWin());
      // } else {
        setDataOnMap(getRestaurants(), getAppMap().instance);
      // }
    } else {
      setDataOnMap(getRestaurants(), null);
    }
  }
});
