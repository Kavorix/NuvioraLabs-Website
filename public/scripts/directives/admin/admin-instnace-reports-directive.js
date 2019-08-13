/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('adminInstanceReportsDirective', adminInstanceReportsDirective);

/* @ngInject */
function adminInstanceReportsDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/admin-instance-reports.directive.htm',
		replace: true,
		scope: {
            instance: "="
		},
		link: linkFunc,
		controller: adminInstanceReportsDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	adminInstanceReportsDirectiveController.$inject = ['$scope', '$log', '$timeout'];
	
	/* @ngInject */
	function adminInstanceReportsDirectiveController($scope, $log, $timeout) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;
        vm.retailPerformance = [
            { acct: "INCOME",  subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false },
            { acct: "INCOME",  subacct: "Sales", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "INCOME",  subacct: "Tips", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "INCOME",  subacct: "Other", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false  },
            { acct: "EXPENSE", subacct: "Cost Of Goods", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Payroll", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Rent", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Power", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Returns", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Comps", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Fees", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "EXPENSE", subacct: "Other", proj: "", act: "", diff: "", change: "", perc: "", isSub: true  },
            { acct: "NET",     subacct: "", proj: "", act: "", diff: "", change: "", perc: "", isSub: false  }
        ];
        vm.mfgReport = [
            { acct: "CONSUMED", subacct: ""},
            { acct: "CREATED",  subacct: ""},
            { acct: "REMAING",  subacct: ""}
        ];

        //	LOAD DEPENDANT VALES
		$timeout(function() {
			//console.log($scope.vm);
			var txsSummary = $scope.vm.instance.txsSummary
            
            if(txsSummary != undefined) {
    
                //	Load values
                vm.retailPerformance[1].act     = txsSummary.sales[0].actual;	    //Sales
                vm.retailPerformance[2].act     = txsSummary.sales[4].actual;	    //Tips
                vm.retailPerformance[11].act    = txsSummary.payments[4].actual;	//Fees
        
                //	SUM VALUES
                vm.retailPerformance[0].act = vm.retailPerformance[1].act + vm.retailPerformance[2].act + vm.retailPerformance[3].act; //Income total
                vm.retailPerformance[4].act = vm.retailPerformance[5].act + vm.retailPerformance[6].act + vm.retailPerformance[7].act + vm.retailPerformance[8].act + vm.retailPerformance[9].act + vm.retailPerformance[10].act + vm.retailPerformance[11].act + vm.retailPerformance[12].act; // Expenses 
                vm.retailPerformance[13].act = parseFloat(vm.retailPerformance[0].act) + parseFloat(vm.retailPerformance[4].act); //Net
    
                //	CALCULATE PERCENTAGES
                vm.retailPerformance[1].perc = (vm.retailPerformance[1].act / vm.retailPerformance[0].act).toFixed(4); //Sales of Income
                vm.retailPerformance[2].perc = (vm.retailPerformance[2].act / vm.retailPerformance[0].act).toFixed(4); //Tips of Income
                vm.retailPerformance[11].perc = (vm.retailPerformance[11].act / vm.retailPerformance[4].act).toFixed(4); //Fees of Expenses
                vm.retailPerformance[10].perc = (vm.retailPerformance[10].act / vm.retailPerformance[4].act).toFixed(4); //Fees of Expenses
                vm.retailPerformance[13].perc = (vm.retailPerformance[13].act / vm.retailPerformance[0].act).toFixed(4); //Net of income
    
                //console.log(vm.retailPerformance[0].act);
            }
		});

		//	DEFINE VIEW MODEL VARIABLES

		//	REPORT PROGRESS
        //$log.info('in adminInstanceReportsDirectiveController');
        
        //  
	}

	//pass it back
	return directive;
}
