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
    vm.seasonsList  = seasonsData;
    vm.state = {
        seasonAdder: { visible: false },
        tempSeasonName: ""
    };

    //  NOTIFY PROGRESS
    console.log('seasonsData', seasonsData);
    console.log('instnaces', instanceData);

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
    vm.instanceReroute = function(id) {
        console.log('got this id', id);
        $location.path('/admin/data/instance/' + id);
		//$scope.$apply();
    };
    vm.seasonDuration = function(start, end) {
        //  DEFINE LOCAL VARIABLES
        var a = moment(start);
        var b = moment(end);
        var days = b.diff(a, 'days');
        var weeks = b.diff(a, 'weeks');
        var months = b.diff(a, 'months');
        var returnValue = 0;

        if(days > 6) {
            if(weeks > 4) returnValue = months + " months"
            else returnValue = weeks + " weeks";
        } else {
            returnValue = days + " days";
        }

        return returnValue;
    };
    vm.seasonNav = function(key, channelId){
        console.log('season nav', key);
        $location.path('/admin/data/season/' + key + "/" + channelId);
        //$scope.$apply();
    };
    vm.addNewSeason = function(name) {
        firebaseService.create.season($routeParams.channelId, name)
        .then(function success(s) {
            //return an affirmative status code
            console.log(s)
            $location.path('/admin/data/season/' +  s + '/' + $routeParams.channelId)
        }).catch(function error(e) {
            console.log(e);
        });
        
    };

    //console.info('in adminDataChannelsController');	    //  TODO: TAKE THIS OUT LATER


}