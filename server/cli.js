
//	DEFINE DEPENDENCIES
var cldb        = require('./dbScripts/db-team-checklists.js');
var ivdb        = require('./dbScripts/db-inventory.js');
var firebase	= require('./firebase/firebase.js');
var asprop      = require('./asprop.js'); 
var squareV1    = require('./square/square_V1.js');
var fs 		    = require('fs');
var path 	    = require('path');
var moment      = require('moment');
var stdio       = require('./stdio/stdio.js');


/*asprop.sqPushUpdates({ entity_id: 'P9XiUrSZ722VvylioHMkKQB', event_type: 'PAYMENT_UPDATED',merchant_id: 'FCGJQY3GC9BNW',location_id: 'M53KQT35YKE5C' })
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/


ivdb.map.txToOp([
    {
        "name": "Kit Marker",
        "quantity": 1,
        "itemization_type": "ITEM",
        "item_detail": {
            "category_name": "Data",
            "sku": "",
            "item_id": "WNIMUOOTOCTAQC26CEHRC745",
            "item_variation_id": "4271E368-4929-4B37-9728-8156D02A2048"
        },
        "item_variation_name": "Kit One (1)",
        "total_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "single_quantity_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "gross_sales_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "discount_money": {
            "amount": 0,
            "currency_code": "USD"
        },
        "net_sales_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "taxes": [],
        "discounts": [],
        "modifiers": []
    },
    {
        "name": "Loading - Full Batches",
        "quantity": 1,
        "itemization_type": "ITEM",
        "item_detail": {
            "category_name": "Data",
            "sku": "",
            "item_id": "IMBQNGQHFAJ6UXFPJWWTRK75",
            "item_variation_id": "D7RE5HEGOXJOE6GLNNDM4HJS"
        },
        "item_variation_name": "Gallon Pecans",
        "total_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "single_quantity_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "gross_sales_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "discount_money": {
            "amount": 0,
            "currency_code": "USD"
        },
        "net_sales_money": {
            "amount": 700,
            "currency_code": "USD"
        },
        "taxes": [],
        "discounts": [],
        "modifiers": []
    }
])
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});


/*ivdb.run.entryOperation('-Lfog4noAvg_ccCmkX3m', '-LfvzdamPdlmy_QMujwL', moment(new Date()).format())
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

//  TO-DO: might need this later, hold on to it
/*ivdb.add.instance('TestInstance', '2019-05-27', 'testing')
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

/*asprop.sqPushUpdates({"location_id": "M53KQT35YKE5C", "entity_id": "YmsX65meD8SlFz53TAkVOvMF"})
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/


/*cldb.inventory.add.operations({
    type: "mfg",
    name: "Cook Full SW Pecan",
    discription: "record the cooking of a full batch of swalty pecans",
    components: {
        1: { "class": "-LfoWAp3bJQprLA0REU4", "acct": "Staged Half Baches: Pecans", "discription": "", "debits":2, "credits":0, "units_id":"-LfoOrkKKemIoGGWeURx", "units": "no of" },
        2: { "class": "-LfoXHSFAnpRdxtdSNDz", "acct": "Swalty Mix", "discription": "Liquid", "debits":4, "credits":0, "units_id":"-LfoOjFkJi-_rNWrugmM", "units": "oz of" },
        3: { "class": "-LfoXHSFAnpRdxtdSNDz", "acct": "Swalty Mix", "discription": "spritz", "debits":0.25, "credits":0, "units_id":"-LfoOjFkJi-_rNWrugmM", "units": "oz of" },
        4: { "class": "-LfoV4xFHX6CXULyzewB", "acct": "Salt", "discription": "", "debits":0.33333333333333, "credits":0, "units_id":"-LfoOjFkJi-_rNWrugmM", "units": "oz of" },
        5: { "class": "-LfoTn0Y5HOp5pKAp8_a", "acct": "Cooked Swalty Pecans", "discription": "", "debits":0, "credits":33, "units_id":"-LfoOjFkJi-_rNWrugmM", "units": "oz of" },
        6: { "class": "-LfoZ4gVkx9Dl4n621Uq", "acct": "Batches Cooked: Fulls: Swalty Pecans", "discription": "", "debits":0, "credits":1, "units_id":"-LfoOrkKKemIoGGWeURx", "units": "no of" }
    }
}).then(function(s) { console.log(s); })*/

/*
{ "class": "", "acct": "", "discription": "", "debits":0, "credits":0, "units_id":"", "units": "" }
*/

/*cldb.inventory.add.acct_classes({
    units_id: "-LfoOrkKKemIoGGWeURx",
    units: "no of",
    name: "Mixes",
    category: "Sales Analysis",
    isSubAcct: true,
    parentAcct: "-Lfo_apUUjXTeQdoUUId"
}).then(function(s) { console.log(s); })*/
