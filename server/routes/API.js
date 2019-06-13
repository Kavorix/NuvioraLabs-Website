/*
*   API ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var cldb 		= require('../dbScripts/db-team-checklists.js');
    var ivdb        = require('../dbScripts/db-inventory.js');
    var asprop      = require('../asprop.js'); 
    var APIRoutes = require('express').Router();

    //	GET: API/data/allChecklists
    APIRoutes.get('/data/allChecklists', function(req, res) {
        
        //run the requird function
        cldb.getAllChecklists().then(function success(s) {
            
            //return an affirmative status code
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(JSON.stringify(s));

        }).catch(function error(e) {
            
            //return an error status code
            res.sendStatus(550);

        });
        
    });

    //	GET: API/data/aChecklist/:listId
    APIRoutes.get('/data/aChecklist/:listId', function(req, res) {
        
        //run the requird function
        cldb.getAChecklist(req.params.listId).then(function success(s) {
            
            //return an affirmative status code
            res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(JSON.stringify(s));

        }).catch(function error(e) {
            
            //return an error status code
            res.sendStatus(550);

        });
        
    });

    APIRoutes.get('/report/instance/:instanceId', function(req, res) {

        console.log('got this param',req.params.instanceId );
        //run the requird function
        asprop.reports.instance(req.params.instanceId).then(function success(s) {
            
            //return an affirmative status code
            //res.setHeader('Content-Type', 'application/json');
            res.status(200);
            res.send(s);

        }).catch(function error(e) {
            
            //return an error status code
            res.status(550);
            res.send(e);
        });

    });

    return APIRoutes;
})();