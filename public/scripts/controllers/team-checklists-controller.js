angular
    .module('awesweet')
    .controller('teamChecklistsPageController', teamChecklistsPageController);

	teamChecklistsPageController.$inject = ['$scope','$log', '$routeParams'];

/* @ngInject */
function teamChecklistsPageController($scope, $log, $routeParams) {

	//define view model variable
	var vm = this;

	$log.info('in the team checklists controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}