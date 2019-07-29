/*
*	BACKEND DATA SERVICE
*
*/

//define module
angular
    .module('awesweet')
    .factory('squareService', squareService);

//dependency injections
squareService.$inject = ['$http'];

//declare the service
/* @ngInject */
function squareService($http) {

	//define methods
	var squareService = {
        
    };

	//turn the method
    return squareService;	
};
