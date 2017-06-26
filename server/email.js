import { check } from 'meteor/check';

const user = "postmaster@sandbox11d7438fbdc6432fbe532aa1b1aa2637.mailgun.org";
const pass = "bd70c56c1def29482d67807d55a47b87";
const host = "smtp.mailgun.org";
const port = 587;
const url = "smtp://" + user + ":" + pass + "@" + host + ":" + port;

Meteor.startup(() => {
  process.env.MAIL_URL = url;
});

function applyTextTemplate(user, steps, price) {
  var message = "Hola, " +
    user == null ?
    Meteor.users.find({_id: user}).fetch().profile.name : "usuario" +
    "! Recientemente usaste el servicio de Puerta Bogotá " +
    "y creaste un itinerario para tu día de turista. Te lo enviamos de forma " +
    "simplificada aquí: \n\n";

  for(let i = 0; i < steps.length; i++) {
    message += steps[i].name;
    message += "\n";
  }

  message += "\n";
  message += "El total de este presupuesto fue de " + price + ".\n";
  message += "Para más funcionalidades, poder guardar tus itinerarios y compartirlos " +
    "regístrate en Puerta Bogotá.\n¡Gracias por usar nuestra aplicación!"

  return message;
}

Meteor.methods({
  sendItineraryToEmail(to, from, steps, price, user) {
    // Make sure that all arguments are strings.
    check([to, from], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    // Input
    var d = new Date();
    var subject = "Itinerario creado el " + d.toString();
    var text = applyTextTemplate(user, steps, price);

    Email.send({
      to,
      from,
      subject,
      text
    });
  }
});

console.log("email module loaded");
