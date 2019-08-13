angular
    .module('awesweet')
    .controller('checkoutPageController', checkoutPageController);

	checkoutPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function checkoutPageController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the checkout controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}