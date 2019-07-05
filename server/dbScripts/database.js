/*
*   DATABASE
*
*   This handles all of the database manipulation scripts
*
*/

//  DECLARE DEPENDENCIES
var cldb        = require('../dbScripts/db-team-checklists.js');
var ivdb        = require('../dbScripts/db-inventory.js');
var indb        = require('../dbScripts/db-instances.js');
var chdb        = require('../dbScripts/db-channels.js');

//  DEFINE THE MODULE
var database = {
    inventory: {},
    instances: {
        add: addInstance
    },
    checklists: {},
    channels: {
        update: updateChannel
    }
};

/*
*   ADD INSTANCE
*
*   This adds an instance
*/
function addInstance(data) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        indb.add(data)
        .then(function success(s) {
            //return an affirmative status code
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        })
    });
};

/*
*   UPDATE CHANNEL
*
*   This is used to update a channel field
*/
function updateChannel(id, values) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        chdb.update(id, values)
        .then(function success(s) {
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        })
    });
};

/*
*   TEMPLATE FUNCTION
*
*   This is used to make function creation faster
*/
function templateFunction() {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

    });
};

/*
*   TEST
*/
function test() {
    console.log('Good test for Database');
}

//  RETURN THE MODULE
module.exports = database;