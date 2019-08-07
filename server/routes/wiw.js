/*
*   WIW ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var WIW     = require('express').Router();
    var wiw     = require('../wiw/wiw.js');

   //	POST: /sqrwebhook
   WIW.get('/shifts', function(req, res) {
        //  DEFINE LOCAL VARIABLES
        var params = {
            start: req.query.start,
            end: req.query.end
        };

        //advise of the post body
        console.log('got this /wiw/shifts request', params);

        wiw.get.shifts(params)
        .then(function success(s) {
            //return an affirmative status code
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            res.status(400);
            res.send(e);
        });

    });

    return WIW;
})();