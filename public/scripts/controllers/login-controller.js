

angular
    .module('awesweet')
    .controller('loginPageController', loginPageController);

	loginPageController.$inject = ['$scope','$log', '$http', '$location', 'firebaseService'];

/* @ngInject */
function loginPageController($scope, $log, $http, $location, firebaseService) {

	//define view model variable
	var vm = this;

	$log.info('in the login controller');	    //  TODO: TAKE THIS OUT LATER

	vm.submit = function(username, password) {
		
		//	NOTIFY PROGRESS
		console.log('submitting form', username, password);

		firebaseService.authenticate.email(username, password)
		.then(function sucess(s) {
			//	ON SUCCESSFUL LOGIN REDIRECT DO TEAM MEMBER DASHBOARD
			$location.path('/team/'+ s.user.uid +'/dashboard');
			$scope.$apply();
			$log.info(s)
		}).catch(function(e) {
			$log.error(e);
		});

	}
}