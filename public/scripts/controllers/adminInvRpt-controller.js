angular
    .module('awesweet')
    .controller('adminInvRptController', adminInvRptController);

	adminInvRptController.$inject = ['$scope','$log'];

/* @ngInject */
function adminInvRptController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the inventory reprts controller');	    //  TODO: TAKE THIS OUT LATER


}