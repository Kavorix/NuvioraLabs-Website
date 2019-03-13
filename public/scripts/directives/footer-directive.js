/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('footerDirective', footerDirective);

/* @ngInject */
function footerDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/footer-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: footerDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	footerDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function footerDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES


		//	REPORT PROGRESS
		$log.info('in footer directive controller');
	}

	//pass it back
	return directive;
}
