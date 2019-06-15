/*
*   AWE SWEET PROPRIATORY METHODS
*
*   These are the methods that allow us to run our business
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var cldb        = require('../dbScripts/db-team-checklists.js');
var ivdb        = require('../dbScripts/db-inventory.js');
var squareV1    = require('../square/square_V1.js');
var rptBldr     = require('../reportBuilder/reportBuilder.js');
var mail        = require('../mailCenter/mailCenter.js');
var wiw         = require('../wiw/wiw.js');
var fs 		    = require('fs');
var path 	    = require('path');

//  DEFINE MODULE
var asprop = {
    retreiveTemplate: retreiveTemplate,
    sqPushUpdates: sqPushUpdates,
    reports: {
        emailDailyRecap: emailDailyRecapReport,
        instance: runInstanceReport,
        setupRouting: setupReportsRouting
    },
    test: test
};


/*
*   RETREIVE TEMPLATE
*
*   This function returns the requested template
*/
function retreiveTemplate(readpath) {
    return fs.readFileSync(readpath, 'utf8')
};

/*
*   SQUARE PUSH UPDATES
*
*   This function accepts square push updates, retrieves the transactions.  If necessary it updates the database
*   then it returns a response
*/
function sqPushUpdates(pushObject) {
    //  DEFINE LOCAL VARIABLES
    var opsPromiseList = [];

    //  NOTIFY PROGRESS
    console.log("sqPushUpdates got this notification:"); 
    console.log(pushObject);

    //  DEFINE LOCAL VARIABLES

    //  RETURN ASYNC WORK
    return new Promise(function sqPushUpdatesPromise(resolve, reject) {

        //  NOTIFY PROGRESS
        console.log('sqPushUpdates: squareV1.retrievePayment');

        //  DOWNLOAD SQUARE TRANSACTION
        squareV1.retrievePayment(pushObject.location_id, pushObject.entity_id)
        .then(function success(sqTx) {
            
           //var instanceIdPromise = ivdb.read.instanceId(s.created_at, s.tender[0].employee_id);
           //var sqTxToOpMapPromise = ivdb.

           //  NOTIFY PROGRESS
            console.log('sqPushUpdates: ivdb.read.instanceId', sqTx);
           
            //  AFTER THE TRANSACTION HAS BEEN OBTAINED COLLECT THE INVENTORY INSTANCES
            ivdb.read.instanceId(sqTx.created_at, sqTx.tender[0].employee_id).then(function success(instanceId) {

                //  NOTIFY PROGRESS
                console.log('sqPushUpdates: instanceId', instanceId );

                //  ONCE THE INSTANCE ID HAS BEEN IDENTIFIED, RECORDS CAN BE ADDED TO IT
                ivdb.map.txToOp(sqTx.itemizations)
                .then(function success(opsList) {
                    //  DEFINE LOCAL VARIABLES
                    //var isVariable = ()

                    //  ITERATE OVER THE LIST OF OPERATIONS
                    for(var i = 0; i < opsList.length; i++) {
                        opsPromiseList.push(
                            ivdb.run.entryOperation(opsList[i], instanceId, ivdb.data.formatDateLong(sqTx.created_at), i, (sqTx.tip_money.amount / (opsList.length)))
                        );
                    };

                    //  NOTIFY PROGRESS
                    console.log('running ', opsPromiseList.length, " operations");

                    //  FINALLY RUN ALL THE PROMISES
                    Promise.all(opsPromiseList)
                    .then(function succes(s) {

                        //  NOTIFY PROGRESS
                        console.log('sqPushUpdates: All operations run');

                        resolve(s);
                        
                    }).catch(function error(e) {
                        reject(e);
                    });
                    
                }).catch(function error(e) {
                    reject(e);
                });

            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {

            //  NOTIFY PROGRESS
            console.log('ERROR:');
            console.log(e);

            reject(e);

        });

        
    });
};

/*
*   RUN INSTANCE REPORT
*/
function runInstanceReport(instanceId) {

    //  NOTIFY PROGRESS
    console.log('running instance report');

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //   PROCESS THROUGH FIREBASE
        ivdb.read.dailyRecap(instanceId)
        .then(function success(instanceData) {
            resolve(rptBldr.emails.dailyRecap(instanceData));
        }).catch(function error(e) {
            resolve(e);
        });

    });

};

/*
*
*/
function emailDailyRecapReport(instanceId) {
    //  DEFINE LOCAL VARIABLES
    var managerCCs = ["ian@ah-nuts.com", 'steve@ah-nuts.com'];
    var employeeEmail = "iemcallister@gmail.com"; //"hgschwartz08@yahoo.com";
    var subject = "Daily Recap for Wednesday, June 12th: West Linn FM - Hannah Schwartz"

    //  NOTIFY PROGRESS
    console.log('emailing daily Recap report');

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //   PROCESS THROUGH FIREBASE
        ivdb.read.dailyRecap(instanceId)
        .then(function success(instanceData) {
            //  DEFINE LOCAL VARIABLES
            var sendOptions = {
                from: 'info@ah-nuts.com',
                to: employeeEmail,
                cc: managerCCs,
                subject: subject,
                //text: "this is a test",
                html: rptBldr.emails.dailyRecap(instanceData)
            };

            //  SEND THE MAIL
            mail.send(sendOptions)
            .then(function success(s) {
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            resolve(e);
        });

    });

};

/*
*
*/
function setupReportsRouting() {
    //  DEFINE LOCAL VARIABLES
    var wiwToSqr = stdio.read.json('../models/wiwUserId_to_sqEmployee_id.json');
    var today = moment(new Date('2019-06-13T20:00:00-07:00'));
    var PST = today.tz('America/Los_Angeles');
    var start = PST.set({ 'hour': 0, 'minute': 0, 'second': 0 }).format();
    var end = PST.set({ 'hour': 23, 'minute': 59, 'second': 59 }).format();

    //  DOWNLOAD TODAY'S SHIFTS
    wiw.get.shifts({ start: start, end: end })
    .then(function success(shiftsObject) {

        //  DEFINE LOCAL VARIABLS
        var routePromises = [];

        if(shiftsObject.shifts.length == 0) {
            reject({complete: true, status: "no shifts"});
        } else {

            //  ITERATE OVER ALL SHIFTS
            shiftsObject.shifts.forEach(function(shift) {
                //  DEFINE LOCAL VARIABLES
                var startTime = shift.start_time;
                var endTime = shift.end_time;
                var instanceDate = startTime.split("T")[0];
                var writePath = "inventory/routing/" + instanceDate + "/";

                //  ARGH, CAN'T FINISH THIS, BECAUSE WE DON'T HAVE AN INSTANCE ID

            });

        }
        
    }).catch(function error(e) {
       reject(e);
    });

    //  MAP WIW User ID to Square Employee Id

};

//  TEST
function test() { console.log('good test for asprop'); }

//  RETURN THE MODULE
module.exports = asprop;
