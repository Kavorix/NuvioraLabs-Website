angular
    .module('awesweet')
    .controller('inventoryInstancePageController', inventoryInstancePageController);

	inventoryInstancePageController.$inject = ['$scope','$log', '$firebaseObject'];

/* @ngInject */
function inventoryInstancePageController($scope, $log, $firebaseObject) {

	//define view model variable
    var vm = this;
    vm.obj = $firebaseObject(firebase.database().ref().child('inventory/accts'));
    
    //obj.$bindTo(vm, "data").then(function() {
    //    console.log(vm.data); // { foo: "bar" }
        //$scope.data.foo = "baz";  // will be saved to the database
        //ref.set({ foo: "baz" });  // this would update the database and $scope.data
    //});


	$log.info('in the inventory instance page controller');	    //  TODO: TAKE THIS OUT LATER


}