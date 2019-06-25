angular
    .module('awesweet')
    .controller('CMERecapController', CMERecapController);

	CMERecapController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function CMERecapController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the checkout CMERecapController', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}