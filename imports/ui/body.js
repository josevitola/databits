import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './components/mainMenu.js';
import './components/searchForm.js';
import './components/userMenu.js';
import './components/cards.js';
import './components/map.js';
import './components/introModal.js';
import './body.html';


if(!Meteor.user()) {
  SemanticModal.generalModal('introModal');
}

function setCrimeDataByDay(day, count) {
  var municipio = "BOGOTÁ D.C. (CT)";
  count = 0;
  $.getJSON("https://www.datos.gov.co/resource/nic7-3tzj.json" + "?MUNICIPIO=" + municipio + "$DIA=" + day, function(data) {
    $.each(data, function(i, entry) {
      count ++;
    });
  });
}
