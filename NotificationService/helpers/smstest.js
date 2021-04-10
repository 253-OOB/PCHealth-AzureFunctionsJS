
const dotenv = require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const Twilio =  require("twilio");
 

module.exports.sendSMS = (number, body) => {

    const client = new Twilio(accountSid, authToken);

    client.messages.create({
		from: twilioNumber,
		to: number,
		body: body
    }).then( (message) => {

    	console.log("Message sent");

  	});

};

module.exports.sendEmail = (email, subject, body) => {



};