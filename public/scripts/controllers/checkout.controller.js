angular
    .module('awesweet')
    .controller('checkoutPageController', checkoutPageController);

	checkoutPageController.$inject = ['$scope','$log'];

/* @ngInject */
function checkoutPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the checkout controller');	    //  TODO: TAKE THIS OUT LATER


}