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
        templateUrl: 'views/landing-page.htm',              //  Landing Page View
        controller: 'landingPageController',                //  Landing Page Controller
        controllerAs: 'vm'
    })
    .when('/products', {
        templateUrl: 'views/products-page.htm',             //  Product Page View
        controller: 'productPageController',                //  Product Page Controller
        controllerAs: 'vm'
    })
    .when('/products/:productName/:productId', {
        templateUrl: 'views/products-page.htm',             //  Product Page View with a product Id & varient Id
        controller: 'productPageController',                //  Product Page Controller
        controllerAs: 'vm'
    })
    .when('/products/:productId', {
        templateUrl: 'views/products-page.htm',             //  Product Page View with a product Id
        controller: 'productPageController',                //  Product Page Controller
        controllerAs: 'vm'
    })
    .when('/pricing', {
        templateUrl: 'views/pricing-page.htm',              //  Pricing Page View
        controller: 'pricingPageController',                //  Pricing Page Controller
        controllerAs: 'vm'
    })
    .when('/story', {
        templateUrl: 'views/story-page.htm',                //  Story Page View
        controller: 'storyPageController',                  //  Story Page Controller
        controllerAs: 'vm'
    })
    .when('/channels', {
        templateUrl: 'views/channels-page.htm',             //  Channels Page View
        controller: 'channelsPageController',               //  Channels Page Controller
        controllerAs: 'vm'
    })
    .when('/channels/:channelId', {
        templateUrl: 'views/channels-page.htm',             //  Channels Page View & Channel Id
        controller: 'channelsPageController',               //  Channels Page Controller
        controllerAs: 'vm'
    })
    .when('/support', {
        templateUrl: 'views/support-page.htm',              //  Support Page View
        controller: 'supportPageController',                //  Support Page Controller
        controllerAs: 'vm'
    })
    .when('/reviews', {
        templateUrl: 'views/reviews-page.htm',              //  Reviews Page View
        controller: 'reviewsPageController',                //  Reviews Page Controller
        controllerAs: 'vm'
    })
    .when('/jobs', {
        templateUrl: 'views/jobs-page.htm',                 //  Jobs Page View
        controller: 'jobsPageController',                   //  Jobs Page Controller
        controllerAs: 'vm'
    })
    .when('/cart', {
        templateUrl: 'views/cart-page.htm',                 //  Cart Page View
        controller: 'cartPageController',                   //  Cart Page Controller
        controllerAs: 'vm'
    })
    .when('/checkout', {
        templateUrl: 'views/checkout-page.htm',             //  Checkout Page View
        controller: 'checkoutPageController',               //  Checkout Page Controller
        controllerAs: 'vm'
    })
    .when('/checkout/:sessionId', {
        templateUrl: 'views/checkout-page.htm',             //  Checkout Page View & Session Id
        controller: 'checkoutPageController',               //  Checkout Page Controller
        controllerAs: 'vm'
    })
    .when('/checkout/:sessionId/:ticketId', {
        templateUrl: 'views/checkout-page.htm',             //  Checkout Page View & Session Id & Ticket Id
        controller: 'checkoutPageController',               //  Checkout Page Controller
        controllerAs: 'vm'
    })
    .when('/login', {
        templateUrl: 'views/login-page.htm',                //  Login Page View
        controller: 'loginPageController',                  //  Login Page Controller
        controllerAs: 'vm'
    })
    .when('/dashboard', {
        templateUrl: 'views/dashboard-page.htm',            //  Dashboard Page View
        controller: 'dashboardPageController',              //  Dashboard Page Controller
        controllerAs: 'vm'
    })
    .when('/admin', {})                                     //  TODO: This section can be sued for various admin tasks
    .when('/admin/data/instances_by_channel', {
        templateUrl: 'views/data_instances_by_cannel.htm',
        controller: 'dataViewsController',
        controllerAs: 'vm'
    })
    .when('/admin/data/channels', {
        templateUrl: 'views/data_channels.htm',
        controller: 'dataViewsController',
        controllerAs: 'vm'
    })
    .when('/admin/data/channel/:channelId', {
        templateUrl: 'views/data_channel_view.htm',
        controller: 'dataViewsController',
        controllerAs: 'vm'
    })
    .when('/admin/inventory/instance/:instanceId', {        //  TODO: add this section to update instances
        templateUrl: 'views/inventory-instance-page.htm',
        controller: 'inventoryInstancePageController',
        controllerAs: 'vm'
    })   
    .when('/admin/inventory/operations', {})
    .when('/admin/inventory/templates', {})
    .when('/admin/inventory/reports', {
        templateUrl: "views/admin-inv-rpt-page.htm",
        controller: 'adminInvRptController',
        controllerAs: 'vm'
    })
    .when('/team', {
        templateUrl: 'views/team-page.htm',                 //  Team Page View
        controller: 'teamPageController',                   //  Team Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:userId/dashboard', {
        templateUrl: 'views/team-dash-page.htm',                 //  Team Dashboard Page View
        controller: 'teamDashPageController',                   //  Team Dashboard Page Controller
        controllerAs: 'vm'
    })
    .when('/team/:userId/CMERecap/:instanceId', {
        templateUrl: 'views/cme-recap-page.htm',                 //  Team Dashboard Page View
        controller: 'CMERecapController',                   //  Team Dashboard Page Controller
        controllerAs: 'vm',
        resolve: { /* @ngInject */
            inventoryInstanceAcctsList: function(firebaseService, $route) {
                return firebaseService.resolve.instanceAccts($route.current.params.instanceId)
            }
        }
    }) 
    .when('/team/checklists/:type/:listId', {
        templateUrl: 'views/teamChecklists-page.htm',       //  Team Page View
        controller: 'teamChecklistsPageController',         //  Team Page Controller
        controllerAs: 'vm'
    })
    .when('/team/salesSummary', {
        templateUrl: 'views/teamSalesSummary-page.htm',     //  Team sales summary Page View
        controller: 'teamSalesSummaryPageController',      //  Team sales summary Page Controller
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

