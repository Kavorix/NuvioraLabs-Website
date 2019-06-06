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
    _updateAcctBalances: _updateAcctBalances,
    _copyAccts: _copyAccts,
    _validateInstancePath: _validateInstancePath,
    _quantifyComponents: _quantifyComponents,
    load: load,
    read: {
        instanceId: readInstanceId
    },
    add: {
        units: addInventoryUnits,
        operations: addInventoryOperations,
        acct_classes: addInventoryAcct_classes,
        instance: addInventoryInstances,
        opComponents: addOpComponents
    },
    run: {
        entryOperation: runEntryOperation
    },
    map: {
        txToOp: mapTxToOp
    },
    data: {
        formatDate: formatDate,
        formatDateLong: formatDateLong
    }
};

function formatDate(dateTime) {
    var GMT = moment(dateTime);
    var PST = GMT.clone().tz("America/Los_Angeles");
    var date = PST.format().split("T")[0];
    return date;
};

function formatDateLong(datetime) {
    var GMT = moment(datetime);
    var PST = GMT.clone().tz("America/Los_Angeles");
    return PST.format();    
}

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
    var date = formatDate(dateTime);
    var path = 'inventory/routing/' + date + "/" + employeeId;
    var instanceName = moment(date).format("MMM Do YY");

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
                console.log('good path', pathValidity.instanceId);
                resolve(pathValidity.instanceId);
            } else {
                //  if the path was no good, create the path and resturn the instanceId anyway
                
                addInventoryInstances(instanceName, date, 'CME')
                .then(function success(instanceId) {
                    
                    console.log('creating new path new path', instanceId);

                    var startString = date + "T00:00:00-07:00";
                    var endString = date + "T23:59:59-07:00";
    
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
    var opsPath = 'inventory/operations';
    var indexPath = 'inventory/opsSqTxMap';
    var txsArray = [];

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  ADD TO THE 

        firebase.push(opsPath, value).then(function(key) { resolve(key); })
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
            console.log('got these back', instanceId);
            

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
                        firebase.push(acctsPath, acctObject)
                    );
                }
            });

            Promise.all(newAcctPromises).then(function success(ss) {
                console.log('got these ids', instanceId);
                resolve(instanceId);
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
function runEntryOperation(opObject, instanceId, txTime, index) {
    //  DEFINE LOCAL VARIABLES
    var readPath = 'inventory/operations/' + opObject.target + '/components';
    var acctUpdatePromises = [];

    //  NOTIFY PROGRESS
    console.log('running operation method');

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        //  READ THE COMPONENT OBJECT
        firebase.read(readPath)
        .then(function success(componentObject) {

            if(componentObject != "") {
                //  WRITE ALL OPERATION COMPONENTS AS TRANSACTIONS
                _writeOpComponents(componentObject, opObject, instanceId, txTime, index)
                .then(function success(targetAcctsIdList) {

                    //  ONCE THE TRANSACTIONS HAVE ALL BEEN WRITEN, UPDATE THE BALANCES
                    for(var i = 0; i < targetAcctsIdList.length; i++) {

                        acctUpdatePromises.push(_updateAcctBalances(targetAcctsIdList[i]));
                    };

                    Promise.all(acctUpdatePromises)
                    .then(function success(s) {
                        //  PASS BACK SUCCESSFUL OBJECT
                        console.log("finished updating balances");
                        resolve({"success": true, message: ""});
                    }).catch(function error(e) {
                        reject(e);
                    });

    
                }).catch(function error(e) {
                    reject(e);
                });
            } else {
                resolve({"success": false, message: "no components to write"});
            }

        }).catch(function error(e) {
            reject(e);
        });
        
    });

};

//  PRIVATE: WRITE OUT COMPONENTS
//  TO-DO: ADD THE OPOBJECT SO THAT QTY IS ACCOUNTED FOR IN TRANSACTIONS
function _writeOpComponents(componentObject, opObject, instanceId, txTime, index) {
    //  DEFINE LOCAL VARIABLE
    var writePromises = [];
    var instanceEntryObject = {};

    //  NOTIFY PROGRESS
    console.log('_writeOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  COMPILE ALL COMPONENT LISTS
        _compileOpComponents(componentObject, opObject, instanceId) 
        .then(function success(allLists) {

            //  DEFINE LOCAL VARIABLES
            var componentList           = allLists[0];
            var targetAcctsIdList       = allLists[1];
            var txIdsList               = allLists[2];
            var acctTxUID               = txTime + "-" + ("00" + index).slice(-3);

            //  USE THESE LISTS TO WRITE THE REQUIRED RECORDS
            for(var i = 0; i < componentList.length; i++) {
                //  DEFINE LOCAL VARIABLES
                var acctTxObject = {};
                acctTxObject[acctTxUID] = {
                    "targetTxId": txIdsList[i],
                    "balance_change": componentList[i].credits - componentList[i].debits
                };

                //  WRITE TXID TO ACCT/TX
                var acctTxUpdatePath = "inventory/accts/" + targetAcctsIdList[i] + "/txs"
                writePromises.push(firebase.update(acctTxUpdatePath, acctTxObject));

                //  BUILD INSTANCE ENTRY OBJECT
                instanceEntryObject[i] = componentList[i];
                instanceEntryObject[i]['txId'] = txIdsList[i];
            };

            //  ADD THE INSTANCE ENTRY WRITE TO THE QUE
            var instanceEntryPath = 'inventory/instances/' + instanceId + '/entries';
            var instanceEntry = {};
            instanceEntry[txTime] = instanceEntryObject;
            writePromises.push(firebase.update(instanceEntryPath, instanceEntry));

            //  RESOLVE ALL PROMISES
            Promise.all(writePromises)
            .then(function success(s) {
                
                //  RESOLVE WHEN COMPLETED WRITING
                resolve(targetAcctsIdList);

            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });

    });

};

//  PRIVATE: COMPILE OPERATION COMPONENTS
function _compileOpComponents(componentObject, opObject, instanceId) {
    //  DEFINE LOCAL VARIABLE
    var txIdListPromises = [];
    var txIdsList = [];

    //  NOTIFY PROGRESS
    console.log('_compileOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        //  COLLECTING ALL COMPONENT DATA
        _collectOpComponents(componentObject, opObject, instanceId) 
        .then(function success(allLists) {

            //  DEFINE LOCAL VARIABLES
            var componentList       = allLists[0];
            var targetAcctsIdList   = allLists[1];

            //  ITERATE OVER ALL COMPONENTS, TURN INTO TRANSACTION OBEJCTS, SAVE, AND RECEIVE THE IDS
            for(var i = 0; i < componentList.length; i++) {
                //  DEFINE LOCAL VARIABLES
                var txObject = componentList[i];

                //  ADD THE TARGET ACCT DATA
                txObject['targetAcctId'] = targetAcctsIdList[i];

                //  ADD THE PUSH PROMISE TO THE ARRAY
                txIdListPromises.push(firebase.push('inventory/txs', txObject));
            };

            //   collect results from all promises
            Promise.all(txIdListPromises)
            .then(function success(txWriteList) {
                //  ITERATE OVER RAW LIST
                txWriteList.forEach(function(tx) {
                    txIdsList.push(tx.id);
                });

                //  PASS THE RESULT BACK UP THE CHAIN
                resolve([componentList, targetAcctsIdList, txIdsList]);

            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });

    });

};

/*
*   PRIVATE: COLLECT OPERATION COMPONENTS
*
*   This method builds most of our required lists.
*/
function _collectOpComponents(componentObject, opObject, instanceId) {
    //  DEFINE LOCAL VARIABLE
    var componentList = [];
    var targetAcctsIdList = [];
    var targetAcctsIdListPromises = [];

    //  NOTIFY PROGRESS
    console.log('_collectOpComponents');
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        

        //  ITERATE OVER THE COMPONENT OBJECT
        Object.keys(componentObject).forEach(function(key) {

            //  NOTIFY PROGRESS
            //console.log("this is the component we're looking at: " ,componentObject[key], key);

            //  CONVERT THE OBJECT TO A LIST BY ADDING EACH COMPONENT OBJECT TO THE LIST
            componentList.push(_quantifyComponents(componentObject[key], opObject));

            //  BUILD THE LIST OF TARGET ACCT IDS
            targetAcctsIdListPromises.push(_identifyTargetAccts(componentObject[key].class, instanceId))
        });

        // WHEN ALL PROMISES RESOLVE, THEN PASS THE VALUES UP THE CHAIN
        Promise.all(targetAcctsIdListPromises)
        .then(function success(targetAcctsIdCollection) {

            //console.log('targetAcctsIdCollection', targetAcctsIdCollection);

            //  ITERATE OVER EACH OJBECT AND ADD TO THE APPROPRIATE LIST
            for(var i = 0; i < componentList.length; i++) {

                //  ADD THE TARGET ACCOUNT ID TO THE LIST
                targetAcctsIdList.push(targetAcctsIdCollection[i].targetAcctsId);

            };

            //  WHEN WE HAVE EVERYTHIGN WE NEED, PASS IT BACK UP
            resolve([componentList, targetAcctsIdList]);

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
    //console.log('_identifyTargetAccts');

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        firebase.query.childValue('inventory/accts', 'class', acctClass)
        .then(function success(acctsWClassObject) {

            if(acctsWClassObject == undefined || acctsWClassObject == null) reject(acctClass);

            //  ITERATE OVER ALL THE ACCOUNTS
            Object.keys(acctsWClassObject).forEach(function(key) {

                //console.log(key);

                if(acctsWClassObject[key].instance_id == instanceId) {

                    //  SAVE THE KEY
                    returnObject.targetAcctsId = key;
                    
                    //  SAVE THE BALANCE
                    returnObject.acctBalance = acctsWClassObject[key].balance;
                }
            });

            //console.log('returnign this object', returnObject);

            //  WHEN FINISHED PASS THE RETURN OBJET BACK UP
            resolve(returnObject);

        }).catch(function error(e) {
            reject(e);
        });


    });
};

/*
*   MAP TRANSACTION TO OPERATION
*
*   This method takes a tx, breaks it apart into it's pieces, and assigns operation ids to them
*   @param - sqTx: OBJECT - contains all the elements of the square object
*   @return - operations: ARRAY - list of all the operations to execute
*/
function mapTxToOp(itemsArray) {
    //  DEFINE LOCAL VARAIBLES
    var readPath = 'inventory/opsSqTxMap';
    var returnArray = [];

    //console.log('got this array', itemsArray);

    return new Promise(function (resolve, reject) {

        firebase.read(readPath)
        .then(function success(sqTxMap) {
           
            //  ITERATE OVER EACH ITEM
            itemsArray.forEach(function (item) {

                var returnObject = {
                    target: sqTxMap[item.item_detail.item_variation_id],
                    qty: item.quantity,
                    volume: _mapVolume(item.item_detail.item_variation_id),
                    gross: item.single_quantity_money.amount,
                    discounts: item.discount_money.amount,
                    net: item.net_sales_money.amount,
                    modifiers: item.modifiers
                };
                
                if(returnObject.modifiers.length > 0) {
                    console.log('THIS IS A MIX');
                    //console.log(returnObject.volume);
                    //console.log(returnObject.modifiers.length, returnObject.modifiers);
                }

                returnArray.push(returnObject)

            });

            resolve(returnArray);

        }).catch(function error(e) {
            reject(e);
        });

        //resolve(['-Lfog4noAvg_ccCmkX3m']);
    });
};

function _mapVolume(sqId) {
    //  DEFINE LOCAL VARIABLES
    var returnValue = "";
    var volumeMap = {
        "WUF7O3UIU5K5AXTFLHDSX6LL": 4,
        "GAPGZBFTTETCYILQYCZL2V4I": 4,
        "WUF7O3UIU5K5AXTFLHDSX6LL": 8,
        "DSFEEQY3IGEC4XZPJ5JQHKIK": 8,
        "WUF7O3UIU5K5AXTFLHDSX6LL": 16,
        "UPUCCHDMVNVEGIANPUN6Y4UF": 16,
        "C5MIEQCUM4JEMCPRVEVDSCG7": 20
    };

    console.log('mapping volume', sqId, volumeMap[sqId]);

    if(volumeMap[sqId] != undefined) returnValue = volumeMap[sqId];

    return returnValue;
};

/*
*
*/
function addOpComponents(writePath, compsArray) {
    //  DEFINE LOCAL VARIABLES

    return new Promise(function (resolve, reject) {
        firebase.create(writePath, compsArray)
        .then(function success(s) {
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        });
    });

};

/*
*   PRIVATE: QUANTIFY COMPONENTS
*
*   Multiply the credits and debits by the quantity.
*   Also, if modifers are present the value needs to be split across the appropriate modifiers
*/
function _quantifyComponents(component, txValues) {
    //  DEFINE LOCAL VARIABLES
    var modifiersMap = {
        "ZPPGFZBSPNYNHDAWHTBDRICZ": "-LfoThQV3F6j9jrStgn8",     //  Cooked Swalty Cashews
        "TQ44AXR75I7WJFFHUNAI6GIB": "-LfoTkTDc5pBACaXp1f4",     //  Cooked Swalty Peanuts
        "TNU4J2OZHBNISIGQ2JS5DVR5": "-LfoTn0Y5HOp5pKAp8_a",     //  Cooked Swalty Pecans
        "JBJCJE3RGSM65UBHS7LP7CDT": "-LfoUDW8ITo_v23gsDss",     //  Cooked Drunk Pecans
        "XRHVGDT5VGJYZ5XJEYCK7XPF": "-LfoUIW1xDRKJIAaNrhb",     //  Cooked Swalty Almonds
        "LTXT4SCAXILGYKZKJI4HC5CW": "-LfoULKkXOFPk6rw48Zl",     //  Cooked Drunk Almonds
        "M744QEV6LJ7NR7TLZOREQVYN": "-LfoUP8k4u-vcl547-l-",     //  Cooked Swalty Hazelnuts
        "QQ5P2NJNK3P4UEXUELN7HFTV": "-LfoUTUs3cwzar_PqVCJ"      //  Cooked Drunk Hazelnuts
    };

    component.credits = component.credits * txValues.qty;
    component.debits = component.debits * txValues.qty;

    // NOTIFY PROGRESS
    console.log('_quantifyComponents, modifiers:', txValues.modifiers.length, " volume: ", txValues.volume);
    //console.log(txValues.modifiers);

    //  IF FLAVOR MODIFIERS ARE AT PLAY HERE
    if(txValues.modifiers.length > 0) {

        //  ITERATE OVER EACH OF THE MODIFIERS
        txValues.modifiers.forEach(function(modifier) {
            
            //  DEFINE LOCAL VARIABLES
            var currentFlavor = modifiersMap[modifier.modifier_option_id];
            var volumeSplit = txValues.volume / txValues.modifiers.length;

            if(component.class == currentFlavor) component.debits = volumeSplit;

        });
        

    }


    //  RETURN VALUE
    return component;
};

function _updateAcctBalances(acctId) {
    //  DEFINE LOCAL VARIABLES
    var acctReadWritePath = "inventory/accts/" + acctId;

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {

        //  READ THE REQUIRED RECORD
        firebase.read(acctReadWritePath)
        .then(function success(acctObj) {
            
            //  DEFINE LOCAL VARIABLES
            var currentBalance = acctObj.balance;

            //  ITERATE OVER THE TXS, PULLING OUT THE CHANGES
            Object.keys(acctObj.txs).forEach(function(key) {
                currentBalance += acctObj.txs[key].balance_change;
            });

            //  notify progress
            console.log('balance changes', currentBalance);

            firebase.update(acctReadWritePath, { "balance": currentBalance})
            .then(function success(s) {
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });
    });

};

//  RETURN THE MODULE
module.exports = inventoryMod;

