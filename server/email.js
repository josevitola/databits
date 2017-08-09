import { check } from 'meteor/check';
import {getPriceFromSteps} from '/imports/api/itinerary.js';
import { styleDate, formatTime } from '/imports/ui/lib/stylish.js';

const user = "postmaster@sandbox11d7438fbdc6432fbe532aa1b1aa2637.mailgun.org";
const pass = "bd70c56c1def29482d67807d55a47b87";
const host = "smtp.mailgun.org";
const port = 587;
const url = "smtp://" + user + ":" + pass + "@" + host + ":" + port;

Meteor.startup(() => {
  process.env.MAIL_URL = url;
});

function applyTextTemplate(userId, steps) {
  var username;
  if(userId == null) username = "usuario";
  else username = Meteor.users.find({_id: userId}).fetch().profile.name;
  var message = "¡Hola, " + username +
    "! Recientemente usaste el servicio de Puerta Bogotá " +
    "y creaste un itinerario para tu día de turista. Te lo enviamos de forma " +
    "simplificada aquí: \n\n";

  for(let i = 0; i < steps.length; i++) {
    message += steps[i].name;
    message += "\n";
  }

  message += "\n";
  message += "El total de este presupuesto fue de " + getPriceFromSteps(steps) + ".\n";
  message += "Para más funcionalidades, poder guardar tus itinerarios y compartirlos " +
    "regístrate en Puerta Bogotá.\n¡Gracias por usar nuestra aplicación!"

  return message;
}

Meteor.methods({
  sendItineraryToEmail(name, to, steps) {
    // Make sure that all arguments are strings.
    check(name, String);
    check(to, String);
    check(steps, [Object]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    // Input
    var from = 'Planit <jdnietov@unal.edu.co>';
    var subject = "Tu itinerario: " + name;
    var text = applyTextTemplate(this.userId, steps);

    c
    Email.send({
      to,
      from,
      subject,
      text
    });
  }
});
