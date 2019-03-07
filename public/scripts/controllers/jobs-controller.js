angular
    .module('awesweet')
    .controller('jobsPageController', jobsPageController);

	jobsPageController.$inject = ['$scope','$log'];

/* @ngInject */
function jobsPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the jobs controller');	    //  TODO: TAKE THIS OUT LATER


}