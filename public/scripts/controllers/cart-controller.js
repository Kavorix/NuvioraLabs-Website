angular
    .module('awesweet')
    .controller('cartPageController', cartPageController);

	cartPageController.$inject = ['$uibModal','$log', '$document'];

/* @ngInject */
function cartPageController($uibModal, $log, $document) {

	//	DEFINE LOCAL VARIABLES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES
	vm.items = ['item1', 'item2', 'item3'];
	vm.animationsEnabled = true;
	vm.open = function (size, parentSelector) {
		var parentElem = parentSelector ? 
		  angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
		var modalInstance = $uibModal.open({
		  animation: vm.animationsEnabled,
		  ariaLabelledBy: 'modal-title',
		  ariaDescribedBy: 'modal-body',
		  templateUrl: 'myModalContent.html',
		  controller: 'ModalInstanceCtrl',
		  controllerAs: 'vm',
		  size: size,
		  appendTo: parentElem,
		  resolve: {
			items: function () {
			  return vm.items;
			}
		  }
		});

		modalInstance.result.then(function (selectedItem) {
			vm.selected = selectedItem;
		  }, function () {
			$log.info('Modal dismissed at: ' + new Date());
		  });
	};

	vm.openComponentModal = function () {
		var modalInstance = $uibModal.open({
		  animation: vm.animationsEnabled,
		  component: 'modalComponent',
		  resolve: {
			items: function () {
			  return vm.items;
			}
		  }
		});
	
		modalInstance.result.then(function (selectedItem) {
		  vm.selected = selectedItem;
		}, function () {
		  $log.info('modal-component dismissed at: ' + new Date());
		});
	};



	$log.info('in the cart controller');	    //  TODO: TAKE THIS OUT LATER

	vm.open('lg');
}

angular
    .module('awesweet')
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);

	ModalInstanceCtrl.$inject = ['$uibModalInstance','items'];

/* @ngInject */
function ModalInstanceCtrl($uibModalInstance, items) {
	var vm = this;
	vm.items = items;
	vm.selected = {
	  item: vm.items[0]
	};
  
	vm.ok = function () {
	  $uibModalInstance.close(vm.selected.item);
	};
  
	vm.cancel = function () {
	  $uibModalInstance.dismiss('cancel');
	};
}