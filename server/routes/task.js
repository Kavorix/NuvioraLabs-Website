/*
*   TASK ROUTES MODULE
*/

//  DEFINE DEPENDENCIES
var database    = require('../dbScripts/database.js');

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var task = require('express').Router();

   //	POST: /task/addIncidenceList
   task.post('/addIncidenceList', function(req, res) {
        //  DEFINE LOCAL VARIABLES
        var incidenceList = req.body;

        //advise of the post body
        console.log('got this body', incidenceList);

        database.instances.addList(incidenceList)
        .then(function success(s) {
            //return an affirmative status code
            res.status(200).send('it worked!');
        }).catch(function error(e) {
            console.log(e);
            res.status(500).send('error,');
        });

        
    });

    return task;
})();