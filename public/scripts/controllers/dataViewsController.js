angular
    .module('awesweet')
    .controller('dataViewsController', dataViewsController);

	dataViewsController.$inject = ['$scope','$log', '$location', "$routeParams", 'firebaseService'];

/* @ngInject */
function dataViewsController($scope, $log, $location, $routeParams, firebaseService) {

    //  DEFINE LOCAL VARIABLES
    var view = $location.$$path.split('/')[3];
    
    //  DEFINE VIEWMODEL VARIABLES
    var vm = this;

    //  DEFINE VIEW MODEL FUNCTIONS
    vm.loadChannel = function(id) {
        $location.path('/admin/data/channel/' + id);
    }

    //  LOAD DATA
    switch(view) {
        case "instances_by_channel":
            firebaseService.read.instances()
            .then(function success(instancesList) {
                vm.instances = instancesList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            break;
        case "channels":
            firebaseService.read.channels()
            .then(function success(channelsList) {
                vm.channels = channelsList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            break;
        case "channel":
            console.log('$routeParams', $routeParams);
        default:
    }




	$log.info('in the data views controller', view);	    //  TODO: TAKE THIS OUT LATER


}