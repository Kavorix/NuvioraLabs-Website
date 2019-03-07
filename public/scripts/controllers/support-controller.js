angular
    .module('awesweet')
    .controller('supportPageController', supportPageController);

	supportPageController.$inject = ['$scope','$log'];

/* @ngInject */
function supportPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the support controller');	    //  TODO: TAKE THIS OUT LATER


}