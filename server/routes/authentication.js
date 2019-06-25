/*
*   AUTHENTICATION ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var authentication = require('express').Router();

   //	POST: /sqrwebhook
   authentication.post('/teamMemberLogin', function(req, res) {
        
        //advise of the post body
        console.log('got this body', req.body);

        res.status(200);
        res.send('it worked!');
    });

    return authentication;
})();