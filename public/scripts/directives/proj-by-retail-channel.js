/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('projByRetailChannel', projByRetailChannelDirective);

/* @ngInject */
function projByRetailChannelDirective(firebaseService) {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/proj-by-retail-channel-view.directive.htm',
		replace: true,
		scope: {
            start: '=',
            end: '=',
            projection: '='
		},
		link: linkFunc,
		controller: projByRetailChannelDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {

        //  QUERY DATABASE DATA
        firebaseService.query.instancesByDate(scope.vm.start, scope.vm.end)
        .then(function success(s) {
            //return an affirmative status code
            //console.log(s);
            scope.vm.channelsList = s;
            scope.$apply();
        }).catch(function error(e) {
            console.log(e);
        });

    }

	projByRetailChannelDirectiveController.$inject = ['$scope', '$log', 'firebaseService'];
	
	/* @ngInject */
	function projByRetailChannelDirectiveController($scope, $log, firebaseService) {
		//	DEFINE LOCAL VARIABLES
        var vm = this;
        
        //  DEFINE VIEW MODEL VARIABLES
        vm.channelsList = {};

        //	DEFINE VIEW MODEL VARIABLES
        
        //  NOTIFY PROGRESS

		//	REPORT PROGRESS
		$log.info('in projByRetailChannelDirectiveController');
	}

	//pass it back
	return directive;
}
