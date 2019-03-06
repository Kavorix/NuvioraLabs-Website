angular
    .module('awesweet')
    .controller('landingController', landingController);

landingController.$inject = ['$scope','$log'];

/* @ngInject */
function landingController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the landing controller');	    //  TODO: TAKE THIS OUT LATER

	//start the carousel


}