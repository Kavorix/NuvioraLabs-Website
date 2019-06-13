/*
*   MAIL CENTER
*
*   This module handles email
*/

//  DEFINE DEPENDENCIES
var nodemailer 		= require('nodemailer');

//  DEFINE GLOBAL VARIABLES
var transporter = nodemailer.createTransport({
    host: process.env.AH_NUTS_MAIL_HOST,
    port: process.env.AH_NUTS_MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.AH_NUTS_MAIL_USER,
        pass: process.env.AH_NUTS_MAIL_PASSWORD
    }
});

//  DEFINE THE MODULE
var mailCenter = {
    send: send
};

/*
*   SEND
*/
function send(options) {
    //  DEFINE LOCAL VARIABLES
    //  NOTIFY PROGRESS
    //  RETURN ASYNC WORK
	return new Promise(function(resolve, reject) {

		//using transporter
		transporter.sendMail(options, function(error, info) {

			//
			if(error) {
				reject(error);
			} else {
				resolve(info);
			}

		});

	});
};

//  RETURN THE MODULE
module.exports = mailCenter;

