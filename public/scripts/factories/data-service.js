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
        GETaChecklist: GETaChecklist,
        GETallChecklists: GETallChecklists,
        GETproductData: GETproductData
    };

    /*
    *   GET A CHECKLIST
    *
    *   This provides the model for a single checklist
    */
   function GETaChecklist(id) {
        //  NOTIFY PROGRESS
        //  DECLAR LOCAL VARIABLES
        var path = '/API/data/aChecklist/' + id;

        //  RETURN ASYNC WORK
        return new Promise(function GETaChecklistPromise(resolve, reject) {
            
            $http({
				method: 'GET',
				url: path
			}).then(function successCallback(response) {
				
				resolve(response.data);
				
			}, function errorCallback(error) {
                var rejectionObject = {
                    "assignedTo" : {
                      "name" : "Ian McAllister",
                      "sqId" : "rUxLgAqsVklCN_14dfbE"
                    },
                    "completed" : false,
                    "completedDate" : "",
                    "createdDate" : "2019-04-25T10:50:38-07:00",
                    "equipment" : {
                      "10x10CPCanopy" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "California Palm, brown 10x10 frame & top",
                        "item" : "Canopy",
                        "needed" : true
                      },
                      "Honda2200i" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Honda 2200i gas powered generator",
                        "item" : "Honda Generator",
                        "needed" : true
                      },
                      "MandelprofiMini" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Mandelprofi Mini Nut Roasting Machine",
                        "item" : "Roaster",
                        "needed" : true
                      },
                      "canopyWeights" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Cement filled canopy weights",
                        "item" : "Canopy Weights (4x)",
                        "needed" : true
                      },
                      "cashBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Cash box to hold cash during markets & events",
                        "item" : "Cash Box",
                        "needed" : true
                      },
                      "cleaningBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Box with papertowels, trash bags, first aid kit, soap, bungees, large clips, and small clips",
                        "item" : "Cleaning Box",
                        "needed" : true
                      },
                      "cookingBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "All suppies required for cooking",
                        "item" : "Cooking Box",
                        "needed" : true
                      },
                      "electronicsBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Box with ipad, scale, chip reader, swipe read, power cords, and change banks folio",
                        "item" : "Electronics Box",
                        "needed" : true
                      },
                      "fileBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "File box to contain returning ziplock bags",
                        "item" : "File Box",
                        "needed" : true
                      },
                      "galWaterJugs" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Waterjugs for kettle cleaning",
                        "item" : "Gallon Water Jugs (2x)",
                        "needed" : true
                      },
                      "handwashStation" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "5 gal catch bucket and 3 gal thermos",
                        "item" : "Handwash Station",
                        "needed" : true
                      },
                      "packagingBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Box with small, average & impressive cones, stickers, twisties, scissors, tape, pens and example platters",
                        "item" : "Packaging Box",
                        "needed" : true
                      },
                      "platters20oz" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "10 platters (tops & bottoms) in a tote bag",
                        "item" : "20oz Platters (10x)",
                        "needed" : true
                      },
                      "scoopingBinsBox" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Box with all 8 cooked nut bins, cooking mat, banners, tablecloth",
                        "item" : "Scooping Bins Box",
                        "needed" : true
                      },
                      "stingerStandard" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Extension cord with 3 pronged splitter",
                        "item" : "Standard Extension Cord",
                        "needed" : true
                      },
                      "tableRisers" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "Stackable table risers in a tote bag",
                        "item" : "Table Risers",
                        "needed" : true
                      },
                      "tables" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "1 heavy duty and 3 medium duty tables",
                        "item" : "Tables (4x)",
                        "needed" : true
                      },
                      "wallsBagCP" : {
                        "confirmed" : false,
                        "confirmedAt" : "",
                        "confirmedBy" : "",
                        "discription" : "California Palm, walls bag with 4 walls",
                        "item" : "Walls Bag",
                        "needed" : true
                      }
                    },
                    "id" : "-LdCgUNtz_RU_a4oQSVa",
                    "kit" : {
                      "name" : "Kit #1",
                      "sqId" : ""
                    },
                    "rawMaterials" : {
                      "extraLiquids" : {
                        "carafeDR6c" : {
                          "discription" : "6 Cups bottle of Drunken Mixture",
                          "name" : "Bottle of Drunken Mix",
                          "qty" : 2,
                          "sqrId" : ""
                        },
                        "carafeSR6c" : {
                          "discription" : "6 Cups bottle of Swalty Vanilla Mixture",
                          "name" : "Bottle of Swalty Mix",
                          "qty" : 4,
                          "sqrId" : ""
                        }
                      },
                      "nuts" : {
                        "fullPecans":    { "name":"Pecan Full Batches", "discription":"Gallon ziplock bag, full batch of pecans & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": "" },
                        "fullAlmonds":   { "name":"Almond Full Batches", "discription":"Gallon ziplock bag, full batch of almonds & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": "" },
                        "fullCashews":   { "name":"Cashew Full Batches", "discription":"Gallon ziplock bag, full batch of cashews & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""  },
                        "fullPeanuts":   { "name":"Peanut Full Batches", "discription":"Gallon ziplock bag, full batch of peanuts & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""   },
                        "fullHazelnuts": { "name":"Hazlenut Full Batches", "discription":"Gallon ziplock bag, full batch of hazelnuts & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""   },
                        "halfPecans":    { "name":"Pecan Half Batches", "discription":"Quart ziplock bag, half batch of pecans & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""  },
                        "halfAlmonds":   { "name":"Almond Half Batches", "discription":"Quart ziplock bag, half batch of pecans & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""  },
                        "halfHazelnuts": { "name":"Hazlenut Half Batches", "discription":"Quart ziplock bag, half batch of pecans & sugar", "allocated":0, "collected":0, "difference":0, "completed":false, "completedBy":"", "completedAt":"", "sqrId": ""   }
                      }
                    },
                    "returnDate" : "2019-04-28T18:00:00-07:00",
                    "shipDate" : "2019-04-26T09:00:00-07:00",
                    "type" : "equipment",
                    "url" : "/team/checklists/equipment/-LdCgUNtz_RU_a4oQSVa"
                  };
                //console.log('sending rejction object', rejectionObject);
                //  ON ERROR SEND TEMP DATA BACK
                reject(rejectionObject);
            });
            
        });
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
                var rejectionObject = {
                    "-LdCgUNtz_RU_a4oQSVa": { id: "-LdCgUNtz_RU_a4oQSVa" ,title: "Kit #2 Checkout Updated", dueDate: "05/01/19",  assignedTo: { name: "Ian McAllister"}, type: "Equipment Checkout", for:"Kit #1", shipDate: "2019-04-26T09:00:00-07:00", url:"/team/checklists/equipment/-LdCgUNtz_RU_a4oQSVa"},
                    "somethingElse": { id:"somethingElse", title: "Kit #3 Checkout", dueDate: "05/01/19",  assignedTo: "Nary Kuch", type: "Staging", for:"Warehouse", url:"/team/checklists/staging" }            
                };
                //  ON ERROR SEND TEMP DATA BACK
                reject(rejectionObject);
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

