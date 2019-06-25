/*
*   WHEN I WORK MODULE
*   
*   This module handles all when i work interaction
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var WIW         = require('wheniwork').WIW;

//  DEFINE GLOBALS
var wiw         = new WIW(process.env.WIW_API_KEY, process.env.WIW_USERNAME, process.env.WIW_PASSWORD);

//  DEFINE MODULE
var whenIWork = {
    get: {
        shifts: getShifts,       //  THIS REALLY COMES WITH EVERYTHIGN I NEED
        users: getUsers
    }
};

/*
*   GET SHIFTS
*/
function getShifts(params) {
    //  DEFINE LOCAL VARIABLES


    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        wiw.get('shifts', params)
        .then(function success(s) {
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        });

    });

};

/*
*   GET USERS
*/
function getUsers(params) {
    //  DEFINE LOCAL VARIABLES


    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        wiw.get('users', params)
        .then(function success(s) {
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        });

    });

};

//  EXPORT MODULE
module.exports = whenIWork;
