/*
*   INTUIT ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var intuit      = require('express').Router();
    var qckbks      = require('../intuit/intuit.js');

    /*
    * Get the AuthorizeUri
    */
    intuit.get('/authUri', function(req,res) {
        var authUri = qckbks.authorize()
        res.redirect(authUri);
    });

    /*
    *  Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
    */
    intuit.get('/callback', function(req,res) {
        qckbks.callback(req.url)
        .then(function success(s) {
            //return an affirmative status code
            res.redirect('/intuit/getCompanyInfo');
        }).catch(function error(e) {
            console.log(e);
        });
        
    });

    /**
    * Display the token : CAUTION : JUST for sample purposes
    */
   intuit.get('/retrieveToken', function(req, res) {
        res.send(qckbks.retrieveToken());
    });

    /**
    * Refresh the access-token
    */
    intuit.get('/refreshAccessToken', function(req,res){

        oauthClient.refresh()
            .then(function(authResponse){
                console.log('The Refresh Token is  '+ JSON.stringify(authResponse.getJson()));
                oauth2_token_json = JSON.stringify(authResponse.getJson(), null,2);
                res.send(oauth2_token_json);
            })
            .catch(function(e) {
                console.error(e);
            });


    });

    /**
     * getCompanyInfo ()
     */
    intuit.get('/getCompanyInfo', function(req,res){


        qckbks.get.companyInfo()
        .then(function success(s) {
            //return an affirmative status code
            res.send(s)
        }).catch(function error(e) {
            res.send(e);
        });
    });

    /**
     * disconnect ()
     */
    intuit.get('/disconnect', function(req,res){

        res.redirect(qckbks.disconnect())
    
    });


    return intuit;
})();