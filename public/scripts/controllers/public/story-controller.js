angular
    .module('awesweet')
    .controller('storyPageController', storyPageController);

	storyPageController.$inject = ['$scope','$log'];

/* @ngInject */
function storyPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the story controller');	    //  TODO: TAKE THIS OUT LATER


}