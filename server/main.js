import { Meteor } from 'meteor/meteor';

import '/imports/startup/server/index.js';
import '/imports/api/itinerary.js';

Meteor.startup(() => {
  /* Imports for server-side startup go here. */
//   var user = "postmaster@sandbox11d7438fbdc6432fbe532aa1b1aa2637.mailgun.org",
//     pass = "bd70c56c1def29482d67807d55a47b87",
//     host = "smtp.mailgun.org",
//     port = 587,
//     url = "smtp://" + user + ":" + pass + "@" + host + ":" + port + "/";
//
//     console.log(url);
//
//   process.env.MAIL_URL = url;
//   Email.send({
//   to: "jdnietov@unal.edu.co",
//   from: "jdnv.123@hotmail.com",
//   subject: "Example Email",
//   text: "The contents of our email in plain text.",
// });
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
