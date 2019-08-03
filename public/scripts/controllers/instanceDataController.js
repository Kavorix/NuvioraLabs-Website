angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', '$routeParams', 'firebaseService', 'instanceData','sqEmployeeList','squareService'];

/* @ngInject */
function instanceDataViewsController($scope, $log, $routeParams, firebaseService, instanceData, sqEmployeeList, squareService) {

	//	DEFINE LOCAL VARIALES
	var vm = this;
	var instanceId = $routeParams.instanceId;

	//	DEFINE VIEW MODEL VARIABLES
	vm.instance = instanceData;
	vm.sqEmployeeList = sqEmployeeList;
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

	//	RUN FUNCTIONS
	loadTransactions(vm.instance.start_time, vm.instance.end_time);
	
	//	DEFINE LOCAL FUNCTIONS
	/*
	*	SUM TRANSACTIONS 
	*/
	function sumTransactions(txs) {
		//	DEFINE LOCAL VARAIABLES
		var returnSum = 0;

		//iterate over transactions
		txs.forEach(function(tx) {
			returnSum += tx.gross_sales_money.amount;
		});

		//	RETURN VALUES
		return returnSum;
	};
	
	/*
	*
	*/
	function identifyDevices(txs) {
		//	DEFINE LOCAL VARIABLES
		var devicesCollection = {};

		//	ITERATE OVER THE LIST
		txs.forEach(function(tx) {
			if(tx.device.name == undefined) devicesCollection[tx.device.id] = "(Undefined)"
			else devicesCollection[tx.device.id] = tx.device.name
		});

		//	NOTIFY PROGRESS
		//console.log('devices list', devicesCollection);

		//	ASSIGN SELECTION
		Object.keys(devicesCollection).forEach(function(key) {
			devicesCollection[key]['included'] = true;
		});

		//console.log('devices list', devicesCollection);

		//	RETURN VALUE
		return devicesCollection;
	};

	/*
	*
	*/
	function idnetifyEmployees(txs) {
		//	DEFINE LOCAL VARABLES
		var employeesCollection = {};

		//	ITERATE OVER THE LIST
		txs.forEach(function(tx) {
			//	ITERATE OVER TENDER
			tx.tender.forEach(function(step) {
				employeesCollection[step.employee_id] = {}
			});
		});

		//	NOTIFY PROGRES
		//console.log('employeesCollection', employeesCollection);

		//	RETURN VALUES
		return employeesCollection;
	};

	/*
	*	LOAD TRANSACTIONS
	*/	
	function loadTransactions(start, end) {
		squareService.list.transactions(start, end)
		.then(function success(s) {
			//	ASSIGN VALUES
			vm.transactions = s.data;
			vm.txsSum = sumTransactions(s.data);
			vm.devicesList = identifyDevices(s.data);
			vm.employeeList = idnetifyEmployees(s.data);
			
			console.log('got these transactions', vm.transactions);
			
			$scope.$apply();
			
		}).catch(function error(e) {
			console.log(e);
		});
	}

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
	};

	//	NOTIFY PROGRESS
	$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


}