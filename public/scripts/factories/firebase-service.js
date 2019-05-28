/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('fireBaseService', fireBaseService);

//  DEPENDENCY INJECTION
fireBaseService.$inject = ['$firebase', '$firebaseObject', '$firebaseArray'];

//  DECLARE THE SERVICE
/* @ngInject */
function fireBaseService($firebase, $firebaseObject, $firebaseArray) {

    //  DEFINE METHODS
    var firebaseMod = {
        
    };

    //  RETURN THE METHOD
    return firebaseMod;
};