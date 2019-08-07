
//	DEFINE DEPENDENCIES
var database    = require('./dbScripts/database.js');
var firebase	= require('./firebase/firebase.js');
var asprop      = require('./asprop/asprop.js'); 
var proReport   = require('./asprop/prop-reporting.js');
var squareV1    = require('./square/square_V1.js');
var wiw         = require('./wiw/wiw.js');
var qckbks      = require('./intuit/intuit.js');
var fs 		    = require('fs');
var path 	    = require('path');
var moment      = require('moment');
var stdio       = require('./stdio/stdio.js');

/*var instanceData = {
    "channel_id" : "-LdCgjSRL27Y9RruXGE4",
    "channel_name" : "Beaverton",
    "closes" : "2019-05-04T13:30:00-07:00",
    "end_time" : "2019-05-04T14:30:00-07:00",
    "instance" : 1,
    "instance_id" : "-LjF1wbcEx7TY3yBjH6W",
    "opens" : "2019-05-04T08:00:00-07:00",
    "season_id" : "-LdClddvVSB5vxBSXHOI",
    "season_name" : "Summer 2019",
    "start_time" : "2019-05-04T06:00:00-07:00",
    "summary": {

    }
}*/
  
/*firebase.update('instances/-LjF1wbcEx7TY3yBjH6W', instanceData)
.then(function success(s) {
    //return an affirmative status code
    console.log(s)
}).catch(function error(e) {
    console.log(e);
});*/

/*
firebase.del('/instances')
.then(function success(s) {
    //return an affirmative status code
    console.log(s)
}).catch(function error(e) {
    console.log(e);
});*/

//  UPDATE FIREABES FIELDS QUICKLY

/*firebase.read('seasons')
.then(function success(seasons) {
    //  iterate over the channels
    Object.keys(seasons).forEach(function(key) {

        firebase.push('channels/' + seasons[key].channelId + "/seasons", {
            "seasonId": key,
            "title": seasons[key].title
        })
        .then(function success(s) {
            //return an affirmative status code
            console.log(s)
        }).catch(function error(e) {
            console.log(e);
        });
    });
}).catch(function error(e) {
    console.log(e);
});*/

wiw.get.shifts({start: "2019-07-01T00:00:00-07:00", end: "2019-07-02T00:00:00-07:00"})
.then(function success(s) {
    //return an affirmative status code
    console.log(s)
}).catch(function error(e) {
    console.log(e);
});

/*firebase.create('forecasts', {
    0: 1
})
.then(function success(s) {
    //return an affirmative status code
    console.log(s)
}).catch(function error(e) {
    console.log(e);
});*/

//  TODO: NEED TO FIGURE OUT A WAY TO ADD ADJUSTMENT TRANSACTIONS
//  TODO: ADD HOURLY WAGE BREAK DOWN (REGULAR TIME, OT)
//  TODO: NEED TO FULL AUTOMATE THE SENDING PROCESS
//  TODO: NEED TO ADD WHEN I WORK SUPPORT

/*proReport.dailyRecaps.singleRecapPublish('-LgrdaIz2RQi6oy0fHx3')
.then(function success(s) {
    //return an affirmative status code
    console.log(s)
}).catch(function error(e) {
    console.log(e);
});*/

/*
proReport.dailyRecaps.update()
.then(function success(s) {
    console.log('success');
    console.log(s);
    //stdio.write.json('./models/example_wiw_shifts.json', s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

//  USE THIS TO SEND DAILY RECAP EMAILS
/*asprop.reports.publishDlyRecps()
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

// USE THIS TO BUILD DAILY RECAP MODELS
/*ivdb.add.dailyRecapModel(inventoryInstance)
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/




/*asprop.reports.instance('-LgpDw9V0S0ZqnY9bJsb')
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

/*ivdb.add.acct_classes({
    category: "Funds",
    isSubAcct: true,
    name: "Tips",
    parentAcct: "-LfoY7JUJV0fFDpkjh9O",
    units: "$",
    units_id: "-LfoP1XhhXWIE1djZKjd"
})
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

/*var aPush = stdio.read.json('./models/example_sq_push.json');
asprop.sqPushUpdates(aPush)
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/


/*squareV1.listModifiers('M53KQT35YKE5C')
.then(function success(s) {
    console.log('success');
    console.log(s);
    stdio.write.json('./models/modifiersList.json', s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/




/*ivdb.add.opComponents('inventory/operations/-LgGWsCjdKwfNyv_qcCw/components', theArray)
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/

/*ivdb.map.txToOp(aTransaction.itemizations)
.then(function success(s) {
    console.log('success');
    console.log(s);
}).catch(function error(e) {
    console.log('got this error');
    console.log(e);
});*/





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
