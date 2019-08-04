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
			data: "="
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
		$timeout(function() {
			console.log($scope.vm);
			vm.formattedDateTime = formatDateTime($scope.vm.data);
			vm.summary = firebaseService.templates.instanceFilters();
			
		});
		

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

		//	REPORT PROGRESS
		$log.info('in adminInstanceTxsDirectiveController', $scope.vm);
	}

	//pass it back
	return directive;
}
