
const sgMail = require('@sendgrid/mail');
const Twilio = require("twilio");
const dotenv = require("dotenv").config({path:__dirname+'/./../.env'});

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioNumber = process.env.TWILIO_PHONE_NUMBER; 

module.exports.sendSMS = async (number, body) => {
	
    const client = new Twilio(accountSid, authToken);
	
    client.messages.create({

		from: twilioNumber,
		to: number,
		body: body

    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });


};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.sendEMail = (receiver, subject, body) => {

    sgMail.send({

        to: receiver, // Change to your recipient
        from: 'cmps253.oob@gmail.com', // Change to your verified sender
        subject: subject,
        text: body,
        html: 'body'

    }).then( (res) => {

        console.log(res);

    }).catch( (err) => {
        console.log(err);
    });

}