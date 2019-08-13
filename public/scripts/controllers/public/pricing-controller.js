angular
    .module('awesweet')
    .controller('pricingPageController', pricingPageController);

	pricingPageController.$inject = ['$scope','$log'];

/* @ngInject */
function pricingPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the pricing controller');	    //  TODO: TAKE THIS OUT LATER


}