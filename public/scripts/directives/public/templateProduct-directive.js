/*
*	CUSTOMER LIST
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('templateProductDirective', templateProductDirective);

/* @ngInject */
function templateProductDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/templateProduct-view.directive.htm',
		replace: true,
		scope: {
		},
		link: linkFunc,
		controller: templateProductDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	templateProductDirectiveController.$inject = ['$scope', '$log', '$routeParams', 'dataService'];
	
	/* @ngInject */
	function templateProductDirectiveController($scope, $log, $routeParams, dataService) {
        
        //  DEFINE LOCAL VARIABLES
        var vm = this;
        var currIndex = 0;

        //  DEFINE VIEW MODEL VARIABLES
        //vm.productId = '719520b0-4511-11e9-b633-114e0d84f88b';
        vm.productModel = dataService.GETproductData($routeParams.productId);
        vm.selectedVariant = vm.productModel.defaultVariation;
        vm.slides = [];
		

        console.log('in template product directive controller', vm.productId);
        $log.info('product model', vm.productModel, vm.slides);
        
        function addSlide(url) {
		
            vm.slides.push({
              image: url,
              text: 'just a test',
              id: currIndex++
            });
        };
    
        for (var i = 0; i < 3; i++) {
            addSlide(vm.productModel.productShotArray[i]);
        }
	}

	//pass it back
	return directive;
}