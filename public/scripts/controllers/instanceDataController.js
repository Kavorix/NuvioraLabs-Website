angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', 'firebaseService', 'instanceData'];

/* @ngInject */
function instanceDataViewsController($scope, $log, firebaseService, instanceData) {

	//	DEFINE LOCAL VARIALES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES
	vm.state = { txsVisible: false, forecastVisible: false }
	vm.instance = instanceData;

	//	DEFINE LOCAL FUNCTIONS


	/*
	*
	*/
	function updateDBValues(instance) {
		//	DEFINE LOCAL VARIABLES
		var updates = {};
		var updatesPath = 'instances/' + instance.instance_id;
		updates[updatesPath] = JSON.parse(angular.toJson(instance));

		//	RUN UPDATE
		firebaseService.update.record(updates)
		.then(function success(s) {
			//return an affirmative status code
			console.log(s)
		}).catch(function error(e) {
			console.log(e);
		});
	}

	//	VIEW MODEL FUNCTIONS
	/*
	*	SAVE SALES NUMBERS
	*/
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
	};
	vm.updateSummary = function() {
		//	DEFINE LOCAL VARIABLES
		var updates = {};
		updates['instances/' + vm.instance.instance_id + '/txsSummary'] = JSON.parse(angular.toJson(vm.instance.txsSummary));
		
		//	NOTIFY PROGRESS
		console.log('updating summary values', vm.instance.txsSummary);

		firebaseService.update.record(updates)
		.then(function success(s) {
			console.log(s);
		}).catch(function error(e) {
			console.log(e);
		});
	}


	//	NOTIFY PROGRESS
	//$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


};