angular
    .module('awesweet')
    .controller('CMERecapController', CMERecapController);

	CMERecapController.$inject = ['$scope','$log', '$routeParams', 'firebaseService', "$firebaseObject", 'inventoryInstanceAcctsList'];

/* @ngInject */
function CMERecapController($scope, $log, $routeParams, firebaseService, $firebaseObject, inventoryInstanceAcctsList) {

	//  DEFINE VIEW MODEL VARIABLES
  var vm = this;
  vm.accts = {};
  vm.cookingProducts = [
    {type: "Cooked", class: "Swalty Cashews",   id: "-LfoZ07k9gErfaDpcquY", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Swalty Peanuts",   id: "-LfoZ2RPnPVyAdR9ZJip", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Swalty Pecans",    id: "-LfoZ4gVkx9Dl4n621Uq", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Drunk Pecans",     id: "-LfoZ8tY1H99aeuuWx3_", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Swalty Almonds",   id: "-LfoZDepTuRgys3jBJDa", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Drunk Almonds",    id: "-LfoZGNImiWqfdPR6-dV", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Swalty Hazelnuts", id: "-LfoZJ9SrZey6Ua-m_xe", multiplier: 32, unit: "oz"},
    {type: "Cooked", class: "Drunk Hazelnuts",  id: "-LfoZLlqLK-VQ9m2m15M", multiplier: 32, unit: "oz"}
  ];
  vm.mfgProducts = [
    {type: "Cooked", class: "Swalty Cashews",   id: "-LfoThQV3F6j9jrStgn8", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Swalty Peanuts",   id: "-LfoTkTDc5pBACaXp1f4", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Swalty Pecans",    id: "-LfoTn0Y5HOp5pKAp8_a", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Drunk Pecans",     id: "-LfoUDW8ITo_v23gsDss", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Swalty Almonds",   id: "-LfoUIW1xDRKJIAaNrhb", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Drunk Almonds",    id: "-LfoULKkXOFPk6rw48Zl", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Swalty Hazelnuts", id: "-LfoUP8k4u-vcl547-l-", multiplier: 1, unit: "oz"},
    {type: "Cooked", class: "Drunk Hazelnuts",  id: "-LfoUTUs3cwzar_PqVCJ", multiplier: 1, unit: "oz"}
  ];

  $log.info('in the checkout CMERecapController', $routeParams, inventoryInstanceAcctsList);	    //  TODO: TAKE THIS OUT LATER

}