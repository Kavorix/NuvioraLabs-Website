/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('lineChartDirective', lineChartDirective);

/* @ngInject */
function lineChartDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/line-chart.directive.htm',
		replace: true,
		scope: {
            data: "="
		},
		link: linkFunc,
		controller: lineChartDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	lineChartDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function lineChartDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
        var vm = this;
        
        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A'];
        $scope.data = [
          [65, 59, 80, -81, 56, 55, 40]
        ];

		//	DEFINE VIEW MODEL VARIABLES


		//	REPORT PROGRESS
		$log.info('in lineChartDirective controller');
	}

	//pass it back
	return directive;
}
