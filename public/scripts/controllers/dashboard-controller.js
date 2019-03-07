angular
    .module('awesweet')
    .controller('dashboardPageController', dashboardPageController);

	dashboardPageController.$inject = ['$scope','$log'];

/* @ngInject */
function dashboardPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the dashboard controller');	    //  TODO: TAKE THIS OUT LATER


}