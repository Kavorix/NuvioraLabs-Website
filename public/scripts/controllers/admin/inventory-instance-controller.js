angular
    .module('awesweet')
    .controller('inventoryInstancePageController', inventoryInstancePageController);

	inventoryInstancePageController.$inject = ['$scope','$log'];

/* @ngInject */
function inventoryInstancePageController($scope, $log) {

	//define view model variable
    var vm = this;


	$log.info('in the inventory instance page controller');	    //  TODO: TAKE THIS OUT LATER


}