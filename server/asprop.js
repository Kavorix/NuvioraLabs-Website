/*
*   AWE SWEET PROPRIATORY METHODS
*
*   These are the methods that allow us to run our business
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var cldb        = require('./dbScripts/db-team-checklists.js');
var ivdb        = require('./dbScripts/db-inventory.js');
var squareV1    = require('./square/square_V1.js');
var fs 		    = require('fs');
var path 	    = require('path');

//  DEFINE MODULE
var asprop = {
    retreiveTemplate: retreiveTemplate,
    sqPushUpdates: sqPushUpdates,
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

//  TEST
function test() { console.log('good test for asprop'); }

//  RETURN THE MODULE
module.exports = asprop;
