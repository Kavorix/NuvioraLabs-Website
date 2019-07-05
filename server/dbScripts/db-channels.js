/*
*   DATABASE: CHANNELS
*
*   This handles all
*
*/

//  DECLARE DEPENDENCIES
var firebase		= require('../firebase/firebase.js');

//  DEFINE THE MODULE
var dbChannels = {
    update: update
};

/*
*   UPDATE
*
*   This is used to update the field of a channel object
*/
function update(id, values) {
    //  DEFINE LOCAL VARIABLES
    var path = 'channels/' + id;
    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        firebase.update(path, values)
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
module.exports = dbChannels;