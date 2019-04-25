
var firebase		= require('../firebase/firebase.js');

//  DEFINE THE MODULE
var checklistsDBClient = {
    getAChecklist: getAChecklist,
    getAllChecklists: getAllChecklists,
    test: test
};

function getAChecklist(id) {};

/*
*   GET ALL CHECKLISTS
*
*   This function takes no parameters and returns an object that will be displayed on the team page
*/
function getAllChecklists() {
    //  NOTIFY PROGRESS
    console.log('in the getAllChecklists method');

    //  RETURN ASYNC WORK
    return new Promise(function getAllChecklistsPromise(resolve, reject) {

        firebase.read('checklists').then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            reject(e);
        });
    });

};

/*
*   TEST
*
*   This function test that everything is working propelry
*/
function test() { 
    //  NOTIFY PROGRESS
    console.log('testing the checklistsDBClient'); 

    //   TEST FIREBASE CONNECTION
    firebase.aTest().then(function success(s) {
        console.log('success', s);
    }).catch(function error(e) {
        console.log('error', e);
    });
}

//  RETURN THE MODULE
module.exports = checklistsDBClient;