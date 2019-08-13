angular
    .module('awesweet')
    .controller('reviewsPageController', reviewsPageController);

	reviewsPageController.$inject = ['$scope','$log'];

/* @ngInject */
function reviewsPageController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the reviews controller');	    //  TODO: TAKE THIS OUT LATER


}