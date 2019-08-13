angular
    .module('awesweet')
    .controller('adminDataSeasonController', adminDataSeasonController);

	adminDataSeasonController.$inject = ['$scope', '$location', '$routeParams', 'firebaseService', 'seasonData', 'channelData'];

/* @ngInject */
function adminDataSeasonController($scope, $location, $routeParams, firebaseService, seasonData, channelData) {
    //  DEFINE LOCAL VARIABLES
    var vm  = this;

	//  DEFINE VIEW MODEL VARIABLES
    vm.season       = seasonData
    vm.channel      = channelData
    
    //  DEFINE VIEW MODEL FUNCTIONS


    //console.info('in adminDataChannelsController');	    //  TODO: TAKE THIS OUT LATER


}