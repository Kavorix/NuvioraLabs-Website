angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', 'firebaseService', 'instanceData'];

/* @ngInject */
function instanceDataViewsController($scope, $log, firebaseService, instanceData) {

	//	DEFINE LOCAL VARIALES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES
	vm.state = { txsVisible: false, forecastVisible: false, shiftsVisible: false}
	vm.instance = instanceData;
	vm.retailPerformance = [
		{ acct: "INCOME", subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false },
		{ acct: "INCOME", subacct: "Sales", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "INCOME", subacct: "Other", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "EXPENSE", subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false  },
		{ acct: "EXPENSE", subacct: "Cost Of Goods", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "EXPENSE", subacct: "Payroll", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "EXPENSE", subacct: "Rent", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "EXPENSE", subacct: "Power", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "EXPENSE", subacct: "Other", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
		{ acct: "NET", subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false  }
	];

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

		//	MAP VALUES 
		//vm.retailPerformance[0].act = vm.instance.txsSummary.sales[0].actual;

		//	SAVE
		firebaseService.update.record(updates)
		.then(function success(s) {
			console.log(s);
		}).catch(function error(e) {
			console.log(e);
		});
	};
	vm.saveShifts = function(newShifts) {
		console.log('saving shifts', newShifts);
	};

	//	LOCAL FUNCTIONS
	function mapToSummary() {
		vm.retailPerformance[1].act = vm.instance.txsSummary.sales[0].actual;

		//	SUM VALUES
		vm.retailPerformance[0].act = vm.retailPerformance[1].act + vm.retailPerformance[0].act; //Income total
		vm.retailPerformance[9].act = vm.retailPerformance[0].act - vm.retailPerformance[8].act; //Net
		
		console.log(vm.retailPerformance[0].act);
		//$scope.$apply();
	};

	//	RUN
	mapToSummary();

	//	NOTIFY PROGRESS
	//$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


};