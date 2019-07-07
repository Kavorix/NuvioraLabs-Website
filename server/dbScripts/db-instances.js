/*
*   DATABASE INSTANCES
*
*   
*
*/

//  DECLARE DEPENDENCIES
var firebase		= require('../firebase/firebase.js');
var stdio           = require('../stdio/stdio.js');
var moment          = require('moment');

//  DEFINE THE MODULE
var dbInstances = {
    add: addInstance,
    addList: addInstancesList,
    test: test
};

/*
*   ADD INSTANCE
*/
function addInstance(data) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        resolve('resolving addInstance');
    });
};

/*
*   ADD INSTANCES LIST
*/
function addInstancesList(data) {
    //  DEFINE LOCAL VARIABLES
    
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  ITERATE OVER THE LIST
        data.forEach(function (iteration) {
            //  DEFINE LOCAL VARIABLES
            var itJSON = stdio.read.json('./models/fb_instance_template.json');
            var itModel = Object.create(itJSON);
            var startTime = moment(iteration.date.split("T")[0] + "T" + iteration.itOpens);
            var endTime = moment(iteration.date.split("T")[0] + "T" + iteration.itOpens);
            
            itModel.start_time      = startTime.format();
            itModel.end_time        = endTime.format();
            itModel.opens           = startTime.format();
            itModel.closes          = endTime.format();;
            itModel.duration.time   = endTime.diff(startTime, 'hours').toFixed(2);
            itModel.duration.units  = "hrs";
            itModel.channel_id      = iteration.channel.channel_id;
            itModel.channel_name    = iteration.channel.channel_name;
            itModel.season_id       = iteration.season.seasonId;
            itModel.season_name     = iteration.season.title;

            console.log(itModel);
        });
        //  MAP THE ARRAY TO THE SAVABLE OBJECT

        //  SAVE THE OBJECT TO THE DATABSE
        resolve('resolving addInstance');
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
    console.log('Good test for DB instances');
}

//  RETURN THE MODULE
module.exports = dbInstances;