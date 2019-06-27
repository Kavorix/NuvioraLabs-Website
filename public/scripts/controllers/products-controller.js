angular
    .module('awesweet')
    .controller('productPageController', productPageController);

	productPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function productPageController($scope, $log, $routeParams) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;
	
	//	DEFINE VIEWMOODEL VARIABLES

	$log.info('in the products controller');	    //  TODO: TAKE THIS OUT LATER
	

}