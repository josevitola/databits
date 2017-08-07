import { Template } from 'meteor/templating';

import './searchFilters.html';
import {setPlacesInfo, getInfWin, getAppMap} from '../../api/datasets.js';

let restaurantMapData = [];
let museumMapData = [];
let theatreMapData = [];

function setDataOnMap(data, map) {
  for(let i = 0; i < data.length; i++) {
    var marker = data[i].marker;
    marker.setMap(map);
    if(i == 0) console.log(marker);
  }
}

Template.searchFilters.onRendered(() => {
  $(".ui.dropdown").dropdown({
    allowReselection: true,
    allowAdditions: true,
    forceSelection: false
  });
  GoogleMaps.ready('map', (map) => {
    $('.ui.checkbox').checkbox('set checked');
  })
});

Template.searchFilters.events({
  'change .ui.museum.checkbox'() {
    if($('.ui.museum.checkbox').checkbox('is checked')) {
      if(museumMapData.length == 0) {
        setPlacesInfo("museum", museumMapData, 'muse-pin.png', getAppMap().instance, getInfWin());
      } else {
        setDataOnMap(museumMapData, getAppMap().instance);
      }
    } else {
      console.log("museum click");
      setDataOnMap(museumMapData, null);
    }
  },

  'change .ui.theatre.checkbox'() {
    if($('.ui.theatre.checkbox').checkbox('is checked')) {
      if(theatreMapData.length == 0) {
        setPlacesInfo("theatre", theatreMapData, 'teat-pin.png', getAppMap().instance, getInfWin());
      } else {
        setDataOnMap(theatreMapData, getAppMap().instance);
      }
    } else {
      setDataOnMap(theatreMapData, null);
    }
  },

  'change .ui.restaurant.checkbox'() {
    if($('.ui.restaurant.checkbox').checkbox('is checked')) {
      if(restaurantMapData.length == 0) {
        setPlacesInfo("restaurant", restaurantMapData, 'rest-pin.png', getAppMap().instance, getInfWin());
      } else {
        setDataOnMap(restaurantMapData, getAppMap().instance);
      }
    } else {
      setDataOnMap(restaurantMapData, null);
    }
  }
});
