angular
    .module('awesweet')
    .controller('teamDashPageController', teamDashPageController);

	teamDashPageController.$inject = ['$scope','$log', '$location', '$routeParams', 'firebaseService'];

/* @ngInject */
function teamDashPageController($scope, $log, $location, $routeParams, firebaseService) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;

    //	DEFINE VIEW MODEL VARIABLES
    vm.username = $routeParams.userId;

    //  LOAD DATA
    firebaseService.read.inventoryInstances()
    .then(function success(s) {
        vm.instances = s;
        $scope.$apply();
    }).catch(function error(e) {
        $log.error(e);
    });

    //  DEFINE VIEW MODEL FUNCTIONS
    vm.loadInstance = function(instanceId) {
        $location.path('/team/' + $routeParams.userId + "/CMERecap/" + instanceId);
    };
    
	$log.info('in the teamDashPageController');	    //  TODO: TAKE THIS OUT LATER


}