angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', '$routeParams', 'firebaseService'];

/* @ngInject */
function instanceDataViewsController($scope, $log, $routeParams, firebaseService) {

	//	DEFINE LOCAL VARIALES
	var vm = this;
	var instanceId = $routeParams.instanceId;

	//	DEFINE VIEW MODEL VARIABLES

	//	RUN FUNCTIONS
	firebaseService.read.anInstance(instanceId)
	.then(function success(s) {
		vm.instance = s;
		vm.formatted = {
			date: new Date(vm.instance.start_time.split('T')[0]),
			start: {
				h: ((vm.instance.start_time.split('T')[1]).split('-')[0]).split(":")[0],
				m: ((vm.instance.start_time.split('T')[1]).split('-')[0]).split(":")[1]
			},
			end: {
				h:((vm.instance.end_time.split('T')[1]).split('-')[0]).split(":")[0],
				m:((vm.instance.end_time.split('T')[1]).split('-')[0]).split(":")[1],
			}
		};
		$scope.$apply();
	}).catch(function error(e) {
		console.log(e);
	});

	vm.employeeList ={
		"one": "Ian",
		"two": "Steve"
	};

	//	VIEW MODEL FUNCTIONS
	vm.saveSalesNumbers = function(financials) {
		//	DEFINE LOCAL VARIABLES
		var updates = {};

		console.log('got these financials', financials);

		//	UPDATES FALES
		financials.gross_sales = parseInt(financials.gross_sales) * 100;

		updates['instances/' + instanceId + '/financials'] = financials;

		//	SAVE CHANGES
		firebaseService.update.record(updates)
		.then(function success(s) {
			console.log(s);
		}).catch(function error(e) {
			console.log(e);
		});
	}

	//	NOTIFY PROGRESS
	$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


}