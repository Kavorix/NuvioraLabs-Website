angular
    .module('awesweet')
    .controller('cartPageController', cartPageController);

	cartPageController.$inject = ['$scope','$log'];

/* @ngInject */
function cartPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the cart controller');	    //  TODO: TAKE THIS OUT LATER


}