/*
*   CONIFG ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var config = require('express').Router();

   //	POST: /sqrwebhook
   config.get('/firebase', function(req, res) {
        //  define local variables
        var returnString = "";

        returnString += "var config = {";
        returnString += "apiKey: '"              + process.env.AH_NUTS_FB_APIKEY                 + "',";
        returnString += "authDomain: '"          + process.env.AH_NUTS_FB_AUTHDOMAIN             + "',";
        returnString += "databaseURL: '"         + process.env.AH_NUTS_FB_DATABASEURL            + "',";
        returnString += "projectId: '"           + process.env.AH_NUTS_FB_PROJECT_ID             + "',";
        returnString += "storageBucket: '"       + process.env.AH_NUTS_FB_STORAGEBUCKET          + "',";
        returnString += "messagingSenderId: '"   + process.env.AH_NUTS_FB_MESSAGING_SENDER_ID    + "'};";
        returnString += "firebase.initializeApp(config);";

        //advise of the post body
        //console.log('firebase config GET', returnString);

        res.status(200);
        res.send(returnString);
    });

    return config;
})();