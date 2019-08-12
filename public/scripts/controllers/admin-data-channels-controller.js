angular
    .module('awesweet')
    .controller('adminDataChannelsController', adminDataChannelsController);

	adminDataChannelsController.$inject = ['$scope', '$location', '$routeParams', 'firebaseService', 'seasonsData', 'channelsData', 'instanceData'];

/* @ngInject */
function adminDataChannelsController($scope, $location, $routeParams, firebaseService, seasonsData, channelsData, instanceData) {
    //  DEFINE LOCAL VARIABLES
    var vm  = this;

	//  DEFINE VIEW MODEL VARIABLES
    vm.channels     = channelsData;
    vm.channelData  = channelsData[$routeParams.channelId];
    vm.instances    = instanceData;

    //  DEFINE VIEW MODEL FUNCTIONS
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

    //console.info('in adminDataChannelsController');	    //  TODO: TAKE THIS OUT LATER


}