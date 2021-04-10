
const dtenv = require('dotenv').config();
var nodemailer = require('nodemailer');


function sendEMail(receiver, subject, body){

  var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USEREMAIL,
      pass: process.env.PASSWORD
    }
  });

  var mailOptions = {
    from: process.env.USEREMAIL,
    to: receiver,
    subject: subject,
    text: body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}