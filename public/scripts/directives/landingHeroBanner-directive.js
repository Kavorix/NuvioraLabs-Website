/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('landingHeroBannerDirective', landingHeroBannerDirective);

/* @ngInject */
function landingHeroBannerDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/landingHeroBanner-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: landingHeroBannerDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	landingHeroBannerDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function landingHeroBannerDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES


		//	REPORT PROGRESS
		$log.info('in landing hero banner directive controller');
	}

	//pass it back
	return directive;
}
