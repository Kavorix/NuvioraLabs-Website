angular
    .module('awesweet')
    .controller('loginPageController', loginPageController);

	loginPageController.$inject = ['$scope','$log'];

/* @ngInject */
function loginPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the login controller');	    //  TODO: TAKE THIS OUT LATER


}