angular
    .module('awesweet')
    .controller('teamPageController', teamPageController);

	teamPageController.$inject = ['$scope','$log'];

/* @ngInject */
function teamPageController($scope, $log) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES 
	vm.activeChecklists = [
		{ title: "Kit #2 Checkout", dueDate: "05/01/19",  assignedTo: "Ian McAllister", type: "Equipment Checkout", for:"Kit #1"},
		{ title: "Kit #3 Checkout", dueDate: "05/01/19",  assignedTo: "", type: "", destination:"" }
	];
	vm.completedChecklists = [
		{ title: "Kit #1 Checkout", shipDate: "05/01/19"}
	]

	//	DEFINE VIEW MODEL FUNCTIONS
	vm.listClicked = function(index) {
		console.log('clicked this list');
		console.log(vm.activeChecklists[index]);
	};


	$log.info('in the team controller');	    //  TODO: TAKE THIS OUT LATER


}