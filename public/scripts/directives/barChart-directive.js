/*
*	BAR CHART DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('barChartDirective', barChartDirective);

/* @ngInject */
function barChartDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/bar-chart.directive.htm',
		replace: true,
		scope: {
            data: "="
		},
		link: linkFunc,
		controller: barChartDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	barChartDirectiveController.$inject = ['$scope', '$log', "$firebaseObject"];
	
	/* @ngInject */
	function barChartDirectiveController($scope, $log, $firebaseObject) {
		//	DEFINE LOCAL VARIABLES
        var vm = this;
        vm.flavors = [];
        vm.balance = [];

		//	DEFINE VIEW MODEL VARIABLES
        
        //  DEFINE PRIVATE FUNCTIONS
        function _init() {
            //  DEFINE LOCAL VARIABLES
            console.log(vm.data);
            //  ITERATE OVER VALUES
            /*Object.keys($scope.vm.data).forEach(function(key) {
                if($scope.vm.data[key].category == 'Cooked Goods') {
                    vm.flavors.push($scope.vm.data[key].name);
                    vm.balance.push($firebaseObject(firebase.database.ref().child('inventory/accts/' + key).balance));
                }
            });*/
        }

        //  RUN INIT
        _init();

	}

	//pass it back
	return directive;
}
