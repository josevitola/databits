import { Meteor } from 'meteor/meteor';

import '/imports/startup/server/index.js';
import '/imports/api/itinerary.js';

Meteor.startup(() => {
//   CSV.readCsvFileLineByLine(process.env.PWD + '/server/museos.csv', function (line, index, rawParsedLine) {
//      console.log(line.precio);
//  });
//
//  CSV.readCsvFileLineByLine(process.env.PWD + '/server/museos.csv', Meteor.bindEnvironment(function (line, index, rawParsedLine) {
//     Museums.insert({
//       nombre_del_museo: line.nombre_del_museo,
//       precio: line.precio
//     });
//   }));
});
