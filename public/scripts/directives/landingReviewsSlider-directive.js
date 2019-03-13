/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('landingReviewsSliderDirective', landingReviewsSliderDirective);

/* @ngInject */
function landingReviewsSliderDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/landingReviewsSlider-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: landingReviewsSliderDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	landingReviewsSliderDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function landingReviewsSliderDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES


		//	REPORT PROGRESS
		$log.info('in landing reviews slider directive controller');
	}

	//pass it back
	return directive;
}
