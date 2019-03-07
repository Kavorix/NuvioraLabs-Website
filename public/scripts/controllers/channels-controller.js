angular
    .module('awesweet')
    .controller('channelsPageController', channelsPageController);

	channelsPageController.$inject = ['$scope','$log'];

/* @ngInject */
function channelsPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the channels controller');	    //  TODO: TAKE THIS OUT LATER


}