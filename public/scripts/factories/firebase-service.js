/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('fireBaseService', fireBaseService);

//  DEPENDENCY INJECTION
fireBaseService.$inject = ['$http'];

//  DECLARE THE SERVICE
/* @ngInject */
function fireBaseService($http) {

    //  DEFINE METHODS
    var firebaseMod = {
        
    };

    //  RETURN THE METHOD
    return firebaseMod;
};