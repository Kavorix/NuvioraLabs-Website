/*
*	BACKEND DATA SERVICE
*
*/

//define module
angular
    .module('awesweet')
    .factory('dataService', dataService);

//dependency injections
dataService.$inject = ['$http'];

//declare the service
/* @ngInject */
function dataService($http) {

	//define methods
	var dataService = {
	};

	//turn the method
    return dataService;	
};

