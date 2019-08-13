/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('landingChannelsBannerDirective', landingChannelsBannerDirective);

/* @ngInject */
function landingChannelsBannerDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/landingChannelsBanner-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: landingChannelsBannerDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	landingChannelsBannerDirectiveController.$inject = ['$scope', '$log'];
	
	/* @ngInject */
	function landingChannelsBannerDirectiveController($scope, $log) {
		//	DEFINE LOCAL VARIABLES
		var vm = this;

		//	DEFINE VIEW MODEL VARIABLES


		//	REPORT PROGRESS
		$log.info('in landing channels banner directive controller');
	}

	//pass it back
	return directive;
}
