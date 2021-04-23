
const dtenv = require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// var nodemailer = require('nodemailer');


module.exports.sendEMail = (receiver, subject, body) => {

  const msg = {
    to: receiver, // Change to your recipient
    from: 'cmps253.oob@gmail.com', // Change to your verified sender
    subject: subject,
    text: body,
    html: 'body'
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })

  // console.log("1");

  // var transporter = nodemailer.createTransport({
  //   service: process.env.SERVICE,
  //   auth: {
  //     user: process.env.USEREMAIL,
  //     pass: process.env.PASSWORD
  //   }
  // });

  // console.log("2");

  // var mailOptions = {
  //   from: process.env.USEREMAIL,
  //   to: receiver,
  //   subject: subject,
  //   text: body
  // };

  // console.log("3");

  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log("4");
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });

  // console.log("5");

}