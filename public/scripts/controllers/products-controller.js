angular
    .module('awesweet')
    .controller('productPageController', productPageController);

	productPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function productPageController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the products controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER
    

}