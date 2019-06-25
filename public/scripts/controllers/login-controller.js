

angular
    .module('awesweet')
    .controller('loginPageController', loginPageController);

	loginPageController.$inject = ['$scope','$log', '$http', '$location'];

/* @ngInject */
function loginPageController($scope, $log, $http, $location) {

	//define view model variable
	var vm = this;

	$log.info('in the login controller');	    //  TODO: TAKE THIS OUT LATER

	vm.submit = function() {
		console.log('submitting form');

		$http({
			method: 'POST',
			url: 'authentication/teamMemberLogin',
			data: {
				username: vm.username,
				password: vm.password
			}
		}).then(function(response) {
			console.log('SUCCESS:', response);
			$location.path('/team/ASighobosuib/dashboard')
		}).catch(function(error) {
			console.log('ERROR', error);
		});
	}
}