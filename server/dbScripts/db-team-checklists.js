
var firebase		= require('../firebase/firebase.js');

//  DEFINE THE MODULE
var checklistsDBClient = {

    test: test
};

function test() { 
    console.log('testing the checklistsDBClient'); 
    firebase.aTest().then(function success(s) {
        console.log('success', s);
    }).catch(function error(e) {
        console.log('error', e);
    });
}

//  RETURN THE MODULE
module.exports = checklistsDBClient;