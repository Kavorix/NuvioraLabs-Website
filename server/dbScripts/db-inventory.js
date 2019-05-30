/*
*   DATABASE INVENTORY
*
*   This module handes all the methods associated with inventory.
*
*/

//  DECLARE DEPENDENCIES
var firebase		= require('../firebase/firebase.js');
var moment 			= require('moment-timezone');

//  DEFINE THE MODULE
var inventoryMod = {
    _copyAccts: _copyAccts,
    _validateInstancePath: _validateInstancePath,
    load: load,
    read: {
        instanceId: readInstanceId
    },
    add: {
        units: addInventoryUnits,
        operations: addInventoryOperations,
        acct_classes: addInventoryAcct_classes,
        instance: addInventoryInstances
    },
    run: {
        entryOperation: runEntryOperation
    }
};

/*
*   PRIVATE: COPY ACCTS
*
*   This function can be used to copy accounts from one place to another
*/
function _copyAccts() {
    //  DEFINE LOCAL VARIABLES
    var readPath = "inventory/acct_classes";
    var writePath = 'inventory/acct_templates/standardCME';
    var copyObject = {};

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        firebase.read(readPath).then(function success(s) {

            //iterate over all of the keys
            Object.keys(s).forEach(function(key) {
                copyObject[key] = true;
            });

            firebase.create(writePath, copyObject).then(function success(ss) {
                resolve(ss);
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });
    });

}

/*
*   PRIVATE: VALIDATE INSTANCE PATH
*/
function _validateInstancePath(timestamp, response) {
    //  DEFINE LOCAL VARIABLES
    var returnObject = {
        validPath: false,
        instanceId: "",
    };

    if(response != null) {
        
        Object.keys(response).forEach(function (key) {
            
            var start = moment(response[key].start);
            var end = moment(response[key].end);
            var txStamp = moment(timestamp);

            //  validate timestamp is between bookends
            if(start < txStamp && end > txStamp) {
                returnObject.validPath = true;
                returnObject.instanceId = response[key].instance_id;
            }

        });

    }

    //  RETURN OBJECT
    return returnObject;
}

/*
*   READ INSTANCE ID
*
*   This function checks for an instances id
*   @param  dateTime - string: this is a string of the transaction timestamp
*   @param  employeeId - string: this is the square employee id
*/
function readInstanceId(dateTime, employeeId) {
    //  DEFINE LOCAL VARIABLES
    var GMT = moment(dateTime);
    var PST = GMT.clone().tz("America/Los_Angeles");
    var date = PST.format().split("T")[0];
    var path = 'inventory/routing/' + date + "/" + employeeId;

    //  NOTIFY PROGRESS
    //console.log('got this dateTime', dateTime, date);
    //console.log('got this employeeId', employeeId);

    //  RETURN
    return new Promise(function (resolve, reject) {
        
        //  READ THE ROUTE
        firebase.read(path).then(function success(s) {

            //  VALIDATE THE RESPONSE.  
            /*  If null, then this route doesn't exist
            *   If the route does exist check the timeStamp against the endpoints
            */
           var pathValidity = _validateInstancePath(dateTime, s);
            if(pathValidity.validPath) {
                console.log('good path');
                resolve(pathValidity.instanceId);
            } else {
                //  if the path was no good, create the path and resturn the instanceId anyway
                console.log('new path create');

                var startString = date + "T00:00:00-07:00";
                var endString = date + "T23:59:59-07:00";
                var instanceId = "-LfoUDW8ITo_v23gsDss";

                //  ADD THE ROUTE TO THE OBJECT IF IT DOENS'T ALREADY EXIST
                firebase.push(path, {
                    start: startString,
                    end: endString,
                    instance_id: instanceId
                }).then(function success(ss) {
                    resolve(instanceId);
                }).catch(function error(e) {
                    reject(e);
                });

            }   

        }).catch(function error(e) {

            reject(e);

        });

    });
};

/*
*   ADD INVENTORY UNITS
*
*/
function addInventoryUnits(value) {
    //  DEFINE LOCAL VARIABLES
    var path = 'inventory/units'

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        firebase.push(path, {
            "definition": value
        }).then(function(key) { resolve(key); })
    });

};

/*
*   ADD INVENTORY OPERATIONS
*
*/
function addInventoryOperations(value) {
    //  DEFINE LOCAL VARIABLES
    var path = 'inventory/operations'

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        firebase.push(path, value).then(function(key) { resolve(key); })
    });

};

/*
*   ADD INVENTORY ACCOUNT CLASSES
*
*/
function addInventoryAcct_classes(value) {
    //  DEFINE LOCAL VARIABLES
    var path = 'inventory/acct_classes'

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        firebase.push(path, value).then(function(key) { resolve(key); })
    });

};

/*
*   LOAD
*
*/
function load(path) {
    //  RETURN PROMISE
    return new Promise(function (resolve, reject) {
        firebase.read(path).then(function success(s) {
            resolve(s);
        }).catch(function error(e){
            reject(e);
        });
    });
}

/*
*   ADD INVENTORY LEDGER INSTANCE
*
*/
function addInventoryInstances(name, date, type) {
    //  DEFINE LOCAL VARIABLES
    var instancePath = 'inventory/instances'
    var acctsPath = 'inventory/accts';
    var templatePromise = load('inventory/acct_templates/standardCME');
    var classesPromise = load('inventory/acct_classes');
    var newInstance = {
        name: name,
        created: date,
        type: type,
        entries: [],
        accts: []
    };
    var instanceId = firebase.push(instancePath, newInstance);

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  LOAD RESOURCES
        Promise.all([templatePromise, classesPromise, instanceId]).then(function success(s) {
            
            //  DEFINE LOCAL VARIABLES
            var newAcctPromises = [];
            var newAcctsCollection = {};
            var template = s[0];
            var classes = s[1];
            var instanceId = s[2].id;

            //  NOTIFY PROGRESS
            console.log('got these back');
            console.log(instanceId);

            //  ITERATE OVER ALL THE ACCTS
            Object.keys(template).forEach(function(key) {

                //  NOTIFY PROGRESS
                console.log('iterateing over the keys', key);

                if(template[key]) {
                    //  DEFINE LOCAL VARIABLES
                    var parentAcct = null;
                    var parentAcctId = null;

                    if(classes[key].isSubAcct) {
                        parentAcct = classes[classes[key].parentAcct].name;
                        parentAcctId = classes[key].parentAcct;
                    }

                    var acctObject = {
                        class: key,
                        instance_id: instanceId,
                        category: classes[key].category,
                        name: classes[key].name,
                        parent_acct: parentAcct,
                        parrent_acct_id: parentAcctId,
                        balance: 0,
                        units: classes[key].units,
                        units_id: classes[key].units_id,
                        txs: ""
                    };
                    //  ADD A PROMISE TO THE ARRAY
                    
                    //  TODO: CAN'T ADD THE PARENT ACCOUNT UNLESS IT EXISTS
                    
                    newAcctPromises.push(
                        firebase.push(acctsPath, acctObject).then(function(key) { resolve(key); })
                    );
                }
            });

            Promise.all(newAcctPromises).then(function success(ss) {
                console.log('got these ids');
                console.log('ss');
                resolve('finished adding');
            }).catch(function error(e) {
                reject(e);
            });
            
        }).catch(function error(e) {
            console.log('error', e);
            reject(e);
        });

        //  ADD THE NEW INVENTORY
        //firebase.push(path, value).then(function(key) { resolve(key); })
    });

};

/*
*   RUN ENTRY OPERATION
*
*   When an operation is initiated each step is handled here.  Usually this is called from ASPROP.  Several
*   steps must be initiated to identify which operation is being executed.  Once the id of that operation is
*   known, along with the instanceId, the operation can be run.
*
*   The steps are as follows:
*   1) load the operation componts object (async 1)
*   2) Iterate over each component
*       a)  query firebase for the accounts with the class the component is looking for (async 2)
*       b)  from the returned colletion, identify the acctId for the acct for the desired instance
*       c)  for each component write a new TX, identifiying the acct it is being executed on, save the txIds
*       d)  write the [timestampe]: [txId] into the tx field of the necessary acct
*       e)  update balance as instructed by the operation component
*       f)  add a new EntryId to the instance, listing each component step as 1: [txId], etc
*   3) return success or error 
*/
function runEntryOperation(operationId, instanceId) {
    //  DEFINE LOCAL VARIABLES
    var readPath = 'inventory/operations/' + operationId + '/components';

    //  NOTIFY PROGRESS
    console.log('running operation method');

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        //  READ THE COMPONENT OBJECT
        firebase.read(readPath)
        .then(function success(componentObject) {

            //  WRITE ALL OPERATION COMPONENTS AS TRANSACTIONS
            _writeOpComponents(componentObject, instanceId)
            .then(function success(s) {

                //  PASS BACK SUCCESSFUL OBJECT
                resolve({"success": true, message: "all records writen successfully"});

            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });
        
    });

};

//  PRIVATE: WRITE OUT COMPONENTS
function _writeOpComponents(componentObject, instanceId) {
    //  DEFINE LOCAL VARIABLE
    //  NOTIFY PROGRESS
    console.log('_writeOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  COMPILE ALL COMPONENT LISTS
        _compileOpComponents(componentObject, instanceId) 
        .then(function success(allLists) {

            //  DEFINE LOCAL VARIABLES
            var componentList       = allLists[0];
            var targetAcctsIdList   = allLists[1];
            var updateBalancesList  = allLists[2];
            var txIdsList           = allLists[3];

            //  USE THESE LISTS TO WRITE THE REQUIRED RECORDS

            //  RESOLVE WHEN COMPLETED WRITING
            resolve("SUCCESS");


        }).catch(function error(e) {
            reject(e);
        });

    });

};

//  PRIVATE: COMPILE OPERATION COMPONENTS
function _compileOpComponents(componentObject, instanceId) {
    //  DEFINE LOCAL VARIABLE
    var returnObject = [];

    //  NOTIFY PROGRESS
    console.log('_compileOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        //  COLLECTING ALL COMPONENT DATA
        _collectOpComponents(componentObject, instanceId) 
        .then(function success(allLists) {

            //  DEFINE LOCAL VARIABLES
            var componentList       = allLists[0];
            var targetAcctsIdList   = allLists[1];
            var updateBalancesList  = allLists[2];

            //  ONCE CALCULATIONS HAVE BEEN COMPLETED, RETURN THE OBJECT WITH ALL LISTS
            resolve(returnObject);

        }).catch(function error(e) {
            reject(e);
        });

    });

};

//  PRIVATE: COLLECT OPERATION COMPONENTS
function _collectOpComponents(componentObject, instanceId) {
    //  DEFINE LOCAL VARIABLE
    var componentList = [];
    var targetAcctsIdList = [];
    var updatedBalancesList = [];
    var targetAcctsIdListPromises = [];
    var returnObject = [];

    //  NOTIFY PROGRESS
    console.log('_collectOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        

        //  ITERATE OVER THE COMPONENT OBJECT
        Object.keys(componentObject).forEach(function(key) {

            //  CONVERT THE OBJECT TO A LIST BY ADDING EACH COMPONENT OBJECT TO THE LIST
            componentList.push(componentObject[key]);

            //  BUILD THE LIST OF TARGET ACCT IDS
            targetAcctsIdListPromises.push(_identifyTargetAccts(componentObject[key].class, instanceId))
        });

        // WHEN ALL PROMISES RESOLVE, THEN PASS THE VALUES UP THE CHAIN
        Promise.all(targetAcctsIdListPromises)
        .then(function success(targetAcctsIdCollection) {

            console.log('targetAcctsIdCollection', targetAcctsIdCollection);

            //  ITERATE OVER EACH OJBECT AND ADD TO THE APPROPRIATE LIST
            for(var i = 0; i < componentList.length; i++) {

                //  ADD THE TARGET ACCOUNT ID TO THE LIST
                targetAcctsIdList.push(targetAcctsIdCollection[i].targetAcctsId);

                //  ADD THE UPDATED BALANCE TO THE LIST
                updatedBalancesList.push(targetAcctsIdCollection[i].acctBalance + componentList[i].credits - componentList[i].debits);
            };

            console.log('working with all these lists');
            console.log(componentList);
            console.log(targetAcctsIdList);
            console.log(updatedBalancesList);

            //  WHEN WE HAVE EVERYTHIGN WE NEED, PASS IT BACK UP
            resolve([componentList, targetAcctsIdList, updatedBalancesList]);

        }).catch(function error(e) {
            reject(e);
        });

    });

};

/*
*   PRIVATE: IDENTIFY OPERATION COMPONENTS
*
*   This method identifies the target accts that transactions will be assigned to
*
*   @param - acctClass: string
*   @param - instanceId: string
*   @return - targetAcctsId: Object { targetAcct: "", acctBalance: "" }
*/
function _identifyTargetAccts(acctClass, instanceId) {
    //  DEFINE LOCAL VARIABLE
    var returnObject = {
        targetAcctsId: "",
        acctBalance: ""
    };

    //  NOTIFY PROGRESS
    console.log('_identifyTargetAccts');

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        firebase.query.childValue('inventory/accts', 'class', acctClass)
        .then(function success(acctsWClassObject) {

            //  ITERATE OVER ALL THE ACCOUNTS
            Object.keys(acctsWClassObject).forEach(function (key) {

                if(acctsWClassObject[key].instance_id == instanceId) {

                    //  SAVE THE KEY
                    returnObject.targetAcctsId = key;
                    
                    //  SAVE THE BALANCE
                    returnObject.acctBalance = acctsWClassObject[key].balance;
                }
            });

            //  WHEN FINISHED PASS THE RETURN OBJET BACK UP
            resolve(returnObject);

        }).catch(function error(e) {
            reject(e);
        });


    });
};

//  RETURN THE MODULE
module.exports = inventoryMod;

