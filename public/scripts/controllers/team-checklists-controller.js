angular
    .module('awesweet')
    .controller('teamChecklistsPageController', teamChecklistsPageController);

	teamChecklistsPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamChecklistsPageController($scope, $log, $routeParams) {

    //  DEFINE LOCAL VARIABLES
    var vm = this;

    //  DEFINE VIEW MODEL VARIABLES
    vm.listType = $routeParams.type;

    //define view model variable
	

	$log.info('in the team checklists controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}