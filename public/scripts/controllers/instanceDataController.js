angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', 'firebaseService', 'instanceData','sqEmployeeList','squareService'];

/* @ngInject */
function instanceDataViewsController($scope, $log, firebaseService, instanceData, sqEmployeeList, squareService) {

	//	DEFINE LOCAL VARIALES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES
	vm.instance = instanceData;
	vm.sqEmployeeList = sqEmployeeList;
	vm.formattedDateTime = formatDateTime(instanceData);


	//	RUN FUNCTIONS
	loadTransactions(vm.instance.start_time, vm.instance.end_time, vm.instance.txFilters);
	
	//	DEFINE LOCAL FUNCTIONS
	/*
	*	FORMAT DATE TIME
	*/
	function formatDateTime(instance) {
		//	DEFINE LOCAL VARIABLES
		return {
			date: new Date(instance.start_time.split('T')[0]),
			start: {
				h: ((instance.start_time.split('T')[1]).split('-')[0]).split(":")[0],
				m: ((instance.start_time.split('T')[1]).split('-')[0]).split(":")[1]
			},
			end: {
				h:((instance.end_time.split('T')[1]).split('-')[0]).split(":")[0],
				m:((instance.end_time.split('T')[1]).split('-')[0]).split(":")[1],
			}
		};
	};
	
	/*
	*	SUM TRANSACTIONS 
	*/
	function sumTransactions(txs) {
		//	DEFINE LOCAL VARAIABLES
		var returnSum = {
			gross: 0,
			returns: 0,
			discounts: 0,
			net: 0,
			tips: 0,
			total: 0,
			totalCollected: 0,
			cash: 0,
			card: 0,
			other: 0,
			fees: 0,
			payNet: 0
		};

		//iterate over transactions
		txs.forEach(function(tx) {
			//	SUM UP THE EASY NUMBERS
			returnSum.gross 	+= tx.gross_sales_money.amount;
			returnSum.returns 	+= tx.refunded_money.amount;
			returnSum.discounts += tx.discount_money.amount;
			returnSum.net 		+= tx.net_sales_money.amount;
			returnSum.tips	 	+= tx.tip_money.amount;
			returnSum.total 	+= tx.total_collected_money.amount;
			returnSum.fees 		+= tx.processing_fee_money.amount;
			returnSum.payNet	+= tx.net_total_money.amount;

			//	ITERATE OVER TENDER
			tx.tender.forEach(function(payment) {
				// ALWAYS INCRIMENT TOTAL
				returnSum.totalCollected 								+= payment.total_money.amount

				//	INCRIMENT APPROPRIATE CATEGORY
				if(payment.type == "CREDIT_CARD")  	returnSum.card	 	+= payment.total_money.amount
				else if(payment.type == "CASH") 	returnSum.cash	 	+= payment.total_money.amount
				else if(payment.type == "OTHER") 	returnSum.other	 	+= payment.total_money.amount	


			});
		});

		console.log(returnSum);

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
	function loadTransactions(start, end, txFilters) {
		squareService.list.transactions(start, end)
		.then(function success(s) {
			//	ASSIGN VALUES
			vm.transactions = s.data;
			
			//	FILTER TRANSACTIONS
			vm.filterTransactions(s.data, vm.instance.summary.filters);

			//	NOTIFY PROGRESS
			console.log('got these transactions', vm.transactions);
			
		}).catch(function error(e) {
			console.log(e);
		});
	};

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
	
	/*
	*	FILTER TRANSACTIONS
	*/
	vm.filterTransactions = function(allTxs, filters) {
		//	DEFINE LOCAL VARIABLES
		var activeEmployees = {};
		var activeDevices = {};
		vm.activeTxs = [];

		//	ITERATE OVER EMPLOYEES
		Object.keys(filters.employees).forEach(function(key) {
			if(filters.employees[key].active) activeEmployees[key] = true;
		});

		//	ITERATE OVER DEVICE
		Object.keys(filters.devices).forEach(function(key) {
			if(filters.devices[key].active) activeDevices[key] = true;
		});

		//	ITERATE OVER TRANSACTIONS
		Object.keys(allTxs).forEach(function(key){
			//console.log(activeEmployees[allTxs[key].tender[0].employee_id])
			if(activeEmployees[allTxs[key].tender[0].employee_id]) vm.activeTxs.push(allTxs[key]);
		});

		var allSums = sumTransactions(vm.activeTxs);

		//	sales values
		vm.instance.summary.sales[0].reported = allSums.gross;		// Gross Sales
		vm.instance.summary.sales[1].reported = allSums.returns;	// Refunds
		vm.instance.summary.sales[2].reported = allSums.discounts;	// discountds
		vm.instance.summary.sales[3].reported = allSums.net;		// net
		vm.instance.summary.sales[4].reported = allSums.tips;		// tips
		vm.instance.summary.sales[5].reported = allSums.total;		// total

		//	PAYMENT VALUES
		vm.instance.summary.payments[0].reported = allSums.totalCollected;		// totalcollected
		vm.instance.summary.payments[1].reported = allSums.cash;				// CASH
		vm.instance.summary.payments[2].reported = allSums.card;				// CRDIT
		vm.instance.summary.payments[3].reported = allSums.other;				// OTHER
		vm.instance.summary.payments[4].reported = allSums.fees;				// FEES
		vm.instance.summary.payments[5].reported = allSums.payNet;				// netPay

		//vm.devicesList = identifyDevices(allTxs);
		//vm.employeeList = idnetifyEmployees(allTxs);

		//	APPLY UPDATES
		$scope.$apply();

		//	RETURN TRANSACTIONS
		return allTxs;
	};

	//	NOTIFY PROGRESS
	//$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


};