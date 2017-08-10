import {Template} from 'meteor/templating';
import {getPriceFromSteps, getTimeFromSteps} from '/imports/api/itinerary.js';

import './infoMenu.html';

Template.infoMenu.helpers({
  totalPrice: function() {
    return getPriceFromSteps(Template.instance().data.steps);
  },

  totalTime: function() {
    return getTimeFromSteps(Template.instance().data.steps);
  }
})
