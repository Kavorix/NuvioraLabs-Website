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
    vm.seasonInput = false;
    
    //  DEFINE VIEW MODEL FUNCTIONS
    vm.loadChannel = function(id) {
        $location.path('/admin/data/channel/' + id);
    };
    vm.navPrevious = function() {
        //  DEFINE LOCAL VARIABLES
        var channelsList = [];
        var i = 0;
        var index = 0;
        var pathIndex = 0;
        //  iterate over channels list
        Object.keys(vm.channels).forEach(function(key) {
            channelsList.push(vm.channels[key]);
            if(key == $routeParams.channelId) index = i;
            i++;
            //console.log(key);
        });

        if ((index - 1) > 0) pathIndex = index - 1;

        //console.log('nav to previous', index, pathIndex, channelsList[pathIndex].id);
        
        $location.path('/admin/data/channel/' + channelsList[pathIndex].id)
    };
    vm.navNext = function() {
        //  DEFINE LOCAL VARIABLES
        var channelsList = [];
        var i = 0;
        var index = 0;
        var pathIndex = 0;
        //  iterate over channels list
        Object.keys(vm.channels).forEach(function(key) {
            channelsList.push(vm.channels[key]);
            if(key == $routeParams.channelId) index = i;
            i++;
            //console.log(key);
        });

        if ((index + 1) < channelsList.length) pathIndex = index + 1;

        //console.log('nav to next', index, pathIndex, channelsList[pathIndex].id);
        
        $location.path('/admin/data/channel/' + channelsList[pathIndex].id)
    };

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
            firebaseService.read.channels()
            .then(function success(channelsList) {
                vm.channels = channelsList;
                vm.channelData = channelsList[$routeParams.channelId];
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
            firebaseService.query.instance($routeParams.channelId)
            .then(function success(instancesList) {
                vm.instances = instancesList;
                $scope.$apply();
            }).catch(function error(e) {
                $log.error(e);
            });
        default:
    }




	$log.info('in the data views controller', view);	    //  TODO: TAKE THIS OUT LATER


}