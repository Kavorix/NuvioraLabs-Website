angular
    .module('awesweet')
    .controller('productPageController', productPageController);

	productPageController.$inject = ['$scope','$log', '$routeParams', 'dataService'];

/* @ngInject */
function productPageController($scope, $log, $routeParams, dataService) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;
	var currIndex = 0;

	//	DEFINE VIEWMOODEL VARIABLES
	vm.productModel = dataService.GETproductData($routeParams.productId);
	vm.selectedVariant = vm.productModel.defaultVariation;
	vm.slides = [];

	$log.info('in the products controller', $routeParams);	    //  TODO: TAKE THIS OUT LATER
	
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