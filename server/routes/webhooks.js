/*
*   WEBHOOK ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var asprop 		= require('../asprop/asprop.js'); 
    var webhookRoutes = require('express').Router();

   //	POST: /sqrwebhook
   webhookRoutes.post('/square', function(req, res) {
        
        //advise of the post body
        console.log(req.body);

        if(req.body.event_type == 'TEST_NOTIFICATION') { console.log('confirming test'); res.sendStatus(200); }
        else if(req.body.event_type == 'PAYMENT_UPDATED') { 
        
        //	NOTIFY PROGRESS
        console.log('testing payment');

        //run the requird function
        asprop.sqPushUpdates(req.body).then(function success(s) {

            //	NOTIFY PROGRESS
            console.log(s);
            
            //return an affirmative status code
            res.sendStatus(200);

        }).catch(function error(e) {

            //return an error status code
            res.sendStatus(550);
            
        });


        }

    });

    return webhookRoutes;
})();