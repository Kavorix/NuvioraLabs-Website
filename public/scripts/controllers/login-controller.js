

angular
    .module('awesweet')
    .controller('loginPageController', loginPageController);

	loginPageController.$inject = ['$scope','$log', '$http', '$location', 'firebaseService'];

/* @ngInject */
function loginPageController($scope, $log, $http, $location, firebaseService) {

	//	DEFINE VIEW MODEL VARIABLES
	var vm = this;
	vm.username = "";
	vm.password = "";

	//	NOTIFY PROGRESS
	$log.info('in the login controller');	    //  TODO: TAKE THIS OUT LATER

	//	VIEW MODEL METHODS
	vm.submit = function(username, password) {

		//	NOTIFY PROGRESS
		console.log('submitting form', username, password);

		firebaseService.authenticate.email(username, password)
		.then(function sucess(s) {
			$log.info(s)
			//	ON SUCCESSFUL LOGIN REDIRECT DO TEAM MEMBER DASHBOARD
			$location.path('/team/'+ s.user.uid +'/dashboard');
			$scope.$apply();
			
		}).catch(function(e) {
			$log.error(e);
		});

	}
}