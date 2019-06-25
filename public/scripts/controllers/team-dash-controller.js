angular
    .module('awesweet')
    .controller('teamDashPageController', teamDashPageController);

	teamDashPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamDashPageController($scope, $log, $routeParams) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;

    //	DEFINE VIEW MODELS
    vm.username = $routeParams.userId;
    
	$log.info('in the teamDashPageController');	    //  TODO: TAKE THIS OUT LATER


}