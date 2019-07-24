angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log'];

/* @ngInject */
function instanceDataViewsController($scope, $log) {

	//define view model variable
	var vm = this;

	$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


}