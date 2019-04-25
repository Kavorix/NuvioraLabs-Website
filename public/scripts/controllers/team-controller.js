angular
    .module('awesweet')
    .controller('teamPageController', teamPageController);

	teamPageController.$inject = ['$scope','$log', '$location', 'dataService'];

/* @ngInject */
function teamPageController($scope, $log, $location, dataService) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES 
	vm.activeChecklists= [];

	dataService.GETallChecklists().then(function success(s) {
		console.log('SUCCESS', s);
		vm.activeChecklists = s
		$scope.$apply();
	}).catch(function error(e) {
		console.log('ERROR', e);
		vm.activeChecklists = e;
		$scope.$apply();
	})

	//	DEFINE VIEW MODEL FUNCTIONS
	vm.listClicked = function(id) {
		console.log('got this id', id);
		console.log('redirecting to', vm.activeChecklists[id].url)
		$location.path(vm.activeChecklists[id].url);
	};


	$log.info('in the team controller');	    //  TODO: TAKE THIS OUT LATER


}