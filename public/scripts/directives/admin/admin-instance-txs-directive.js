/*
*	ADMIN INSTANCE TRANSACTIONS DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('adminInstanceTxsDirective', adminInstanceTxsDirective);

/* @ngInject */
function adminInstanceTxsDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/admin-instance-txs.directive.htm',
		replace: true,
		scope: {
			instance: "=",
			update: "&",
			activeTxs: "=" 
		},
		link: linkFunc,
		controller: adminInstanceTxsDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {
	}

	adminInstanceTxsDirectiveController.$inject = ['$scope', '$log', 'squareService', '$timeout', 'firebaseService'];
	
	/* @ngInject */
	function adminInstanceTxsDirectiveController($scope, $log, squareService, $timeout, firebaseService) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES
		vm.txsSummary = firebaseService.templates.instanceFilters();
		vm.activeTxs = $scope.vm.activeTxs;
		
		//	LOAD DEPENDANT VALES
		$timeout(function() {
			console.log($scope.vm);
			vm.formattedDateTime = formatDateTime($scope.vm.instance);
			loadsqTxs($scope.vm.instance.start_time, $scope.vm.instance.end_time)
		});

		//	DEFINE VIEW MODEL FUNCTIONS
		vm.activeToday = function(key) {
			console.log(key);
			if(key == 'mmIrwp5oGAYi_58pRFAh') return true
			else return false
		};
		vm.typeDisplay = function(txs) {
			//	DEFINE LOCAL VARIABLES
			var returnString = "";

			//iterate over list
			txs.forEach(function(tx) {
				returnString += tx.name + " ";
			});

			return returnString;
		};
		vm.orderDisply = function(txs) {
			//	DEFINE LOCAL VARIABLES
			var returnArray=[];

			//iterate over list
			txs.forEach(function(tx) {
				var orderString = "(" + tx.quantity + "x) " + tx.name + " - " + tx.item_variation_name;
				returnArray.push(orderString);
			});

			return returnArray;
		};
		vm.reFilter = function() {
			//	DEFINE LOCAL VARIABLES

			//	NOTIFY PROGRESS
			console.log('refiltering', vm.txsSummary.filters);
			
			//	FILTER LIST
			vm.activeTxs = filterTxs(vm.allTxs, vm.txsSummary.filters);

			//	UPDATE SUMMARY
			//console.log('updating summary');
			vm.txsSummary = summarizeTxs(vm.activeTxs, vm.txsSummary);

		};
		vm.saveSummary = function() {
			//	DEFINE LOCAL VARIABLES
			
			//	NOTIFY PROGRESS
			console.log('saving summary', vm.txsSummary);

			// PASS THE VALUES UP THE CHAIN
			$scope.vm.instance.txsSummary = vm.txsSummary

			$scope.vm.update();
		};
		vm.adjustmentUpdate = function(section, line) {
			//	DEFINE LOCAL VARIABLES
			var editPath = section + line;

			//	NOTIFY PROGRESS
			console.log('updating adjustment', section, line);

			//	Adjust given line
			vm.txsSummary[section][line].actual = calculateActual(section, line);

			switch(editPath) {
				case 'sales0':
					//	ADJUST NET SALES
					vm.txsSummary[section][3].adjustment = vm.txsSummary[section][line].adjustment;
					vm.txsSummary[section][3].actual = calculateActual(section, 3);

					//	ADJUST TOTAL SALES
					vm.txsSummary[section][5].adjustment = vm.txsSummary[section][line].adjustment;
					vm.txsSummary[section][5].actual = calculateActual(section, 5);
					break;
				default:
					//	ADJUST TOTAL COLLECTED
					vm.txsSummary[section][0].adjustment += parseFloat(vm.txsSummary[section][line].adjustment);
					vm.txsSummary[section][0].actual = calculateActual(section, 0);

					//	ADJUST NET TOTAL
					vm.txsSummary[section][5].adjustment += parseFloat(vm.txsSummary[section][line].adjustment);
					vm.txsSummary[section][5].actual = calculateActual(section, 5);
					break;
			};

		};
		vm.markSkipped = function() {
			if(vm.txsSummary.skipped) console.log('marking as skipped');
			else console.log('not skipped');
			
			// RUN FILTER
			vm.reFilter();
		};

		//	DEFINE LOCAL FUNCTIONS
		/*
		*	FORMAT DATE TIME
		*/
		function formatDateTime(instance) {
			
			//	DEFINE LOCAL VARIABLES
			return {
				date: new Date(instance.start_time),
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
		*	IDENTIFY EMPLOYEES
		*/
		function identifyEmployees(txs, sqEmpList) {
			//	DEFINE LOCAL VARABLES
			var employeesCollection = {};

			//	ITERATE OVER THE LIST
			txs.forEach(function(tx) {
				//	DEFINE LOCAL VARIABLES
				var employee_id = "";

				//	ITERATE OVER TENDER
				tx.tender.forEach(function(step) {
					
					employee_id = step.employee_id
					//console.log(step);
					//	EMPLOYEE COLLECTION
					if(employee_id != undefined && employeesCollection[employee_id] == undefined) {
						employeesCollection[employee_id] = {
							active: true,
							first_name: sqEmpList[employee_id].first_name,
							last_name: sqEmpList[employee_id].last_name,
							devices: {}
						};
					}

				});

				//	add Device
				if(employee_id != undefined) employeesCollection[employee_id].devices[tx.device.name] = true;
			});

			//	NOTIFY PROGRES
			//console.log('employeesCollection', employeesCollection);

			//	RETURN VALUES
			return employeesCollection;
		};

		/*
		*	IDENITYF DEVICES
		*/
		function identifyDevices(txs) {
			//	DEFINE LOCAL VARIABLES
			var devicesCollection = {};

			//	ITERATE OVER THE LIST
			txs.forEach(function(tx) {
				if(tx.device.name == undefined) devicesCollection[tx.device.id] = {name: "(Undefined)", active: false}
				else devicesCollection[tx.device.id] = {name: tx.device.name, active: true}
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
		*	LOAD SQUARE EMPLOYEES
		*/
		function loadSqEmployees() {
			squareService.list.employees()
			.then(function success(s) {
				vm.employeeList = s;
				console.log(s);
				$scope.$apply();
			}).catch(function error(e) {
				console.log(e);
			});
		};

		/*
		*	LOAD SQUARE TRANSACTIONS
		*/
		function loadsqTxs(start, end) {
			//	DEFINE LOCAL VARIABLES
			var sqPromises = [
				squareService.list.transactions(start, end),
				squareService.list.employees()
			];
			
			Promise.all(sqPromises)
			.then(function success(sqrData) {
				//	DEFINE LOCAL VARIABLES
				var allTxs = sqrData[0].data;
				var sqEmployees = sqrData[1];

				// 	ASSIGN ACTIVE EMPLOYEES LIST
				vm.activeEmployees = identifyEmployees(allTxs, sqEmployees);
				vm.activeDevices = identifyDevices(allTxs);
				
				//	ASSIGN ALL TXS LIST
				vm.allTxs = allTxs;

				console.log('vm.instance.txsSummary',vm.instance.txsSummary);
				//	LOAD SAVED FILTERS/SUMMARY
				if(vm.instance.txsSummary != undefined) {
					if(vm.instance.txsSummary.filters != '') {
						//	NOTIFY PROGRESS
						console.log('found saved filters')
						vm.txsSummary 		= vm.instance.txsSummary;
						vm.activeEmployees 	= vm.instance.txsSummary.filters.employees;
						vm.activeDevices 	= vm.instance.txsSummary.filters.devices;
					} else {
						//	NOTIFY PROGRESS
						console.log('no saved filters');
						//	ASSIGN EMPLOYEE FILTERS
						vm.txsSummary.filters.employees 	= vm.activeEmployees;
						vm.txsSummary.filters.devices 		= vm.activeDevices;
					}
				} else {
					//	NOTIFY PROGRESS
					console.log('no saved filters');
					//	ASSIGN EMPLOYEE FILTERS
					vm.txsSummary.filters.employees 	= vm.activeEmployees;
					vm.txsSummary.filters.devices 		= vm.activeDevices;
				}


				//	FILTER LIST
				vm.activeTxs = filterTxs(allTxs, vm.txsSummary.filters);

				//	UPDATE SUMMARY
				//console.log('updating summary');
				vm.txsSummary = summarizeTxs(vm.activeTxs, vm.txsSummary);

				//	APPLY CHANGES
				$scope.$apply();

			}).catch(function error(e) {
				console.log(e);
			});
		};

		/*
		*	FILTER TRANSACTIONS
		*/
		function filterTxs(allTxs, filters) {
			//	DEFINE LOCAL VARIABLES
			var newTxList = [];

			//	NOTIFY PROGRES
			console.log('filters', filters);

			//	ITERATE OVER TRANSACTIONS
			allTxs.forEach(function(tx) {
				//	check for employee first
				if(filters.employees[tx.tender[0].employee_id] != undefined) {
					//
					if(filters.employees[tx.tender[0].employee_id].active) {
						//	THEN CHECK FOR DEVICE FILTERING
						if(filters.devices[tx.device.id].active) {
							//	FINALLY CHECK AGAINST THE INDUAL DEVICE
							newTxList.push(tx);
						}
						
					}
				}

			});

			return newTxList;
		};

		/*
		*	SUMMARIZE TRANSACTIONS
		*/
		function summarizeTxs(activeTxs, summary) {
			//	DEFINE LOCAL VARIABLES
			var returnObject = summary;
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

			if(!summary.skipped) {
				//	ITERATE OVER TRANSACTIONS
				activeTxs.forEach(function(tx) {
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

				//	NOTIFY PROGRESS
				//console.log(returnSum);

				//	SALES VALUES: REPORTED
				returnObject.sales[0].reported = returnSum.gross;		// Gross Sales
				returnObject.sales[1].reported = returnSum.returns;		// Refunds
				returnObject.sales[2].reported = returnSum.discounts;	// discountds
				returnObject.sales[3].reported = returnSum.net;			// net
				returnObject.sales[4].reported = returnSum.tips;		// tips
				returnObject.sales[5].reported = returnSum.total;		// total
				//	SALES VALUES: ACTUAL
				for(var i = 0; i < Object.keys(returnObject.sales).length; i++) {
					returnObject.sales[i].actual =  calculateActual('sales', i);
				};

				//	PAYMENT VALUES: REPORTED
				returnObject.payments[0].reported = returnSum.totalCollected;		// totalcollected
				returnObject.payments[1].reported = returnSum.cash;					// CASH
				returnObject.payments[2].reported = returnSum.card;					// CRDIT
				returnObject.payments[3].reported = returnSum.other;				// OTHER
				returnObject.payments[4].reported = returnSum.fees;					// FEES
				returnObject.payments[5].reported = returnSum.payNet;				// netPay
				//	PAYMENT VALUES: ACTUAL
				for(var i = 0; i < Object.keys(returnObject.payments).length; i++) {
					returnObject.payments[i].actual =  calculateActual('payments', i);
				};				
			} else {
				var template = firebaseService.templates.instanceFilters();

				Object.keys(returnObject.filters.employees).forEach(function(key) {
					returnObject.filters.employees[key].active = false;
				});
				returnObject.sales = template.sales;
				returnObject.payments = template.payments;
			}
			
			return returnObject;
		};

		/*
		*	CALCULATE ACTUAL
		*/
		function calculateActual(section, line) {
			return vm.txsSummary[section][line].reported + (vm.txsSummary[section][line].adjustment * 100);
		};

 		function init() {
			//	DEFINE LOCAL VARIABLES
			//loadSqEmployees();
		}
		
		//	RUN
		init();

		//	NOTIFY PROGRESS
		//$log.info('in adminInstanceTxsDirectiveController', $scope.vm);
	}

	//pass it back
	return directive;
}
