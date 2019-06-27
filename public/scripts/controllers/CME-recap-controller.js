angular
    .module('awesweet')
    .controller('CMERecapController', CMERecapController);

	CMERecapController.$inject = ['$scope','$log', '$routeParams', 'firebaseService', "$firebaseObject", 'inventoryInstanceAcctsList', 'dataProcessService'];

/* @ngInject */
function CMERecapController($scope, $log, $routeParams, firebaseService, $firebaseObject, inventoryInstanceAcctsList, dataProcessService) {

	//  DEFINE VIEW MODEL VARIABLES
  var vm = this;
  vm.accts = inventoryInstanceAcctsList;

  //  VIEW MODEL FNCTIONS
  vm.pullClass = function(data, acctClass) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = '';

    //  ITERATE OVER ALL DATA
    Object.keys(data).forEach(function(key) {
      if(data[key].class == acctClass) returnValue = data[key].balance;
    });

    return returnValue;
  };
  vm.processLineAccts = function(data) {
    return dataProcessService.lineData.fromAcctTxs(data)
  };

  $log.info('in the checkout CMERecapController', $routeParams, inventoryInstanceAcctsList);	    //  TODO: TAKE THIS OUT LATER

}