/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('fireBaseService', fireBaseService);

//  DEPENDENCY INJECTION
fireBaseService.$inject = ['$http', '$firebase', '$firebaseObject', '$firebaseArray'];

//  DECLARE THE SERVICE
/* @ngInject */
function fireBaseService($http, $firebase, $firebaseObject, $firebaseArray) {

    //  DECLARE GLOBALS

    //  DEFINE METHODS
    var firebaseMod = {
        
    };

    //  RETURN THE METHOD
    return firebaseMod;
};