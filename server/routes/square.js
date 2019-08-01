/*
*   AUTHENTICATION ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var square      = require('express').Router();
    var squareV1    = require('../square/square_V1.js');

   //	GET: /square/listTransations
   square.get('/listPayments', function(req, res) {
        
        //advise of the post body
        console.log('got this /square request', req.query);

        squareV1.listPayments(req.query.location, 'desc', req.query.start, req.query.end)
        .then(function success(s) {
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            res.status(500);
            res.send(e);
        });
        
    });

    //	GET: /square/listTransations
    square.get('/listEmployees', function(req, res) {
        
        //advise of the post body
        console.log('got this /square request', req.params.path);

        squareV1.listEmployees()
        .then(function success(s) {
            //return an affirmative status code
            res.status(200);
            res.send(s);
        }).catch(function error(e) {
            res.status(500);
            res.send(e);
        });
        
    });

    return square;
})();