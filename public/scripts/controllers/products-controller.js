angular
    .module('awesweet')
    .controller('productPageController', productPageController);

	productPageController.$inject = ['$scope','$log'];

/* @ngInject */
function productPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the products controller');	    //  TODO: TAKE THIS OUT LATER


}