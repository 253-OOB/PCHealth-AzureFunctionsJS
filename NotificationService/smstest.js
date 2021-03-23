const dotenv = require('dotenv').config()
// const { getExpectedTwilioSignature } = require('twilio/lib/webhooks/webhooks');

const accountSid = process.env.ACCOUNTSID; 
const authToken = process.env.AUTHTOKEN; 
const client = require('twilio')(accountSid, authToken); 



function sendSMS(number,body){

  client.messages.create({

    body: body,  
    messagingServiceSid: process.env.MESSAGINGSERVICEID,      
    to: number

  }).then(message => console.log(message.sid)) 
    .done();

}

sendSMS('+96176433789','test');