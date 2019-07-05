/*
*   DATABASE INSTANCES
*
*   
*
*/

//  DECLARE DEPENDENCIES
var firebase		= require('../firebase/firebase.js');

//  DEFINE THE MODULE
var dbInstances = {
    add: addInstance,
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