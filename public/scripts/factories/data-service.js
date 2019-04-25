/*
*	BACKEND DATA SERVICE
*
*/

//define module
angular
    .module('awesweet')
    .factory('dataService', dataService);

//dependency injections
dataService.$inject = ['$http'];

//declare the service
/* @ngInject */
function dataService($http) {

	//define methods
	var dataService = {
        GETallChecklists: GETallChecklists,
        GETproductData: GETproductData
    };

    /*
    *   GET ALL CHECKLISTS
    *
    *   This provides all the checklists from the server
    */
    function GETallChecklists() {
        //  NOTIFY PROGRESS
        //  DECLAR LOCAL VARIABLES

        //  RETURN ASYNC WORK
        return new Promise(function GETallChecklistsPromise(resolve, reject) {
            
            $http({
				method: 'GET',
				url: '/API/data/allChecklists'
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
                //  ON ERROR SEND TEMP DATA BACK
                reject([
                    { title: "Kit #2 Checkout", dueDate: "05/01/19",  assignedTo: { name: "Ian McAllister"}, type: "Equipment Checkout", for:"Kit #1", shipDate: "2019-04-26T09:00:00-07:00", url:"/team/checklists/equipment/123"},
                    { title: "Kit #3 Checkout", dueDate: "05/01/19",  assignedTo: "Nary Kuch", type: "Staging", for:"Warehouse", url:"/team/checklists/staging" }            
                ]);
            });
            
        });

    };
    
    /*
    *   GET PRODUCT DATA
    *
    *   This provides the product data from the server.
    */
    function GETproductData(id) {
        return {
                "title": "Swalty Pecans",
                "subtitle": "Our Most Popular Sweet & Salty Pecan Recipe",
                "producer": "Ah-Nuts!",
                "variations": {
                    "ec4eb5e0-4512-11e9-acb8-d5c1e807b1b1": { "price": 999, "unit": "for a 5oz Bag", "weight": 5.0, "channel": "online" },
                    "7c99a510-4513-11e9-80a3-2d488ae95193": { "price": 1599, "unit": "for 2x 5oz Bags", "weight": 10.0, "channel": "online" },
                    "80ce9c30-4513-11e9-bd22-bb85ad32a990": { "price": 2599, "unit": "for 4x 5oz Bags", "weight": 20.0, "channel": "online" },
                    "84c32ef0-4513-11e9-93b5-91165e35a5e9": { "price": 2999, "unit": "for 5x 5oz Bags", "weight": 25.0, "channel": "online" },
                    "8926d730-4513-11e9-8b89-8f7a19e9776a": { "price": 3999, "unit": "for 7x 5oz Bags", "weight": 35.0, "channel": "online" },
                    "8de3ea10-4513-11e9-8337-d755c0c18e40": { "price": 4999, "unit": "for 9x 5oz Bags", "weight": 45.0, "channel": "online" }
                },
                "defaultVariation": "7c99a510-4513-11e9-80a3-2d488ae95193",
                "discription": "Sweet Pecans roasted and glazed in our world famous secret recipe glaze - the perfect combination of sweet vanilla with a hint of saltiness. Mmmmm!",
                "suggestions": "Great as a stand alone snack or chop them up and use them as a topping for ice cream, yogurt, salads and more!",
                "rte": "Pecans, Sugar, Vanilla, Sea Salt.",
                "certifications": {
                    "01":"Vegan",
                    "02":"Gluten Free",
                    "03":"Contains Tree Nuts"
                },
                "brandLogoUrl": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/logos/Ah-nuts_logo.png",
                "productShotUrls": {
                    "01": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps01.png",
                    "02": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps02.png",
                    "03": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps03.png"
                },
                "productShotArray": [
                    "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps01.png",
                    "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps02.png",
                    "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/SR-pecans-ps03.png"
                ],
                "productThumbsUrls": {
                    "01": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/thumbs/SR-pecans-ps03-thumb.png",
                    "02": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/thumbs/SR-pecans-ps03-thumb.png",
                    "03": "https://s3-us-west-2.amazonaws.com/awe-sweet-assets/products/thumbs/SR-pecans-ps03-thumb.png"
                }
            }
    };

	//turn the method
    return dataService;	
};

