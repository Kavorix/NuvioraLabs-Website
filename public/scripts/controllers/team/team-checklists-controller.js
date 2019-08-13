angular
    .module('awesweet')
    .controller('teamChecklistsPageController', teamChecklistsPageController);

	teamChecklistsPageController.$inject = ['$scope','$log', '$routeParams', 'dataService'];

/* @ngInject */
function teamChecklistsPageController($scope, $log, $routeParams, dataService) {

    //  DEFINE LOCAL VARIABLES
    var vm = this;

    //  DEFINE VIEW MODEL VARIABLES
    vm.listType = $routeParams.type;
    vm.list = {};

    dataService.GETaChecklist($routeParams.listId).then(function success(s) {
        console.log('SUCCESS'); console.log(s);
        vm.list = s;
        $scope.$apply();
    }).catch(function error(e) {
        console.log('ERROR'); console.log(e);
        vm.list = e;
        $scope.$apply();
    });

    //define view model variable
	

	$log.info('in the team checklists controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER


}