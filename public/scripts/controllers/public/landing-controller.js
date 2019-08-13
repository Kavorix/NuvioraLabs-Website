angular
    .module('awesweet')
    .controller('landingPageController', landingPageController);

	landingPageController.$inject = ['$scope','$log'];

/* @ngInject */
function landingPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the landing controller');	    //  TODO: TAKE THIS OUT LATER


}
