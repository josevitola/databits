import { Template } from 'meteor/templating';

import './searchForm.html';
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

Template.searchForm.onRendered(() => {
  $('.ui.checkbox').checkbox();
});

Template.searchForm.events({
  'click .ui.checkbox' (event) {
    console.log(getInfWin());
    let input = $(event.target).parent().find("input");

    if(input.prop('checked')) {
      if(input.val() == "restaurant") {
        if(restaurantMapData.length == 0) {
          setPlacesInfo(input.val(), restaurantMapData, 'rest-pin.png', getAppMap().instance, getInfWin());
        } else {
          setDataOnMap(restaurantMapData, getAppMap().instance);
        }
      } else if(input.val() == "museum") {
        if(museumMapData.length == 0) {
          setPlacesInfo(input.val(), museumMapData, 'muse-pin.png', getAppMap().instance, getInfWin());
        } else {
          setDataOnMap(museumMapData, getAppMap().instance);
        }
      } else if(input.val() == "theatre") {
        if(theatreMapData.length == 0) {
          setPlacesInfo(input.val(), theatreMapData, 'teat-pin.png', getAppMap().instance, getInfWin());
        } else {
          setDataOnMap(theatreMapData, getAppMap().instance);
        }
      }
    } else {
      if(input.val() == "restaurant") {
        setDataOnMap(restaurantMapData, null);
      } else if(input.val() == "museum") {
        setDataOnMap(museumMapData, null);
      } else if(input.val() == "theatre") {
        setDataOnMap(theatreMapData, null);
      }
    }
  }
});
