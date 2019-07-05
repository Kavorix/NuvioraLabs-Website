angular
    .module('awesweet')
    .controller('dataViewsController', dataViewsController);

	dataViewsController.$inject = ['$scope','$log', '$location', 'firebaseService'];

/* @ngInject */
function dataViewsController($scope, $log, $location, firebaseService) {

    //  DEFINE LOCAL VARIABLES
    var view = $location.$$path.split('/')[3];
    
    //  DEFINE VIEWMODEL VARIABLES
    var vm = this;
    vm.view ={
        'instances_by_channel': function() { if(view=='instances_by_channel') { return true; } else { return false; } }
    };
    //  LOAD DATA
    firebaseService.read.instances()
    .then(function success(instancesList) {
        vm.instances = instancesList;
        $scope.$apply();
    }).catch(function error(e) {
        $log.error(e);
    });


	$log.info('in the data views controller', view);	    //  TODO: TAKE THIS OUT LATER


}