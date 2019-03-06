/*
*	ROUTES-CONFIG
*
*	This module sets up all the required angular routes for this web app.
*/
angular
    .module('awesweet')
    .config(config);

/* @ngInject */
function config($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');
    $routeProvider

	//PUBLIC ROUTES
    .when('/', {
        templateUrl: 'views/landingPage.htm',      //   'views/landingPage.htm'
        controller: 'landingController',           //   'landingController'
        controllerAs: 'vm'
    })
	.otherwise({
        redirectTo: '/'
    });
}

/*
*   REQUIRED FUNCTIONS
*
*/


