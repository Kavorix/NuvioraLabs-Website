
var firebase		= require('../firebase/firebase.js');

//  DEFINE THE MODULE
var checklistsDBClient = {
    processPushTx: {
        _identifyKit: _identifyPushTxKit, 
        _updateDataPoint: _updatePushTxDataPoint,
        checkItems: processPushTxByCheckingItems
    },
    checklist: {
        collectNuts: collectNuts
    },
    getAChecklist: getAChecklist,
    getAllChecklists: getAllChecklists,
    test: test
};

/*
*   (LOCAL ONLY) ITENDITY PUSH TRANSACTION KIT
*
*   This function takes the transaction, iterate over it to find a kit marker
*/
function _identifyPushTxKit(tx) {
    //  DEFINE LOCAL VARIABLES
    var returnObject = {
        hasKit: false,
        kitId: undefined
    };

    //  ITERATE OVER EACH ITEM
    tx.itemizations.forEach(function(item) {
        
        //  IDENTIFY KIT MARKET ITEM 'WNIMUOOTOCTAQC26CEHRC745' = 'KIT MARKER
        if(item.item_detail.item_id == 'WNIMUOOTOCTAQC26CEHRC745') {
            returnObject.hasKit = true;
            returnObject.kitId = item.item_detail.item_variation_id
        };

    });
    //  RETURN KIT OBJECT
    return returnObject;
}

/*
*   (LOCAL ONLY)
*
*   This function
*/
function _updatePushTxDataPoint(checklistId, itemDetails, qty, employeeId, createdAt) {
    //  DEFINE LOCAL VARIABLES

    //  RETURN ASYNC WORK
    return new Promise(function _updatePushTxDataPointPromise(resolve, reject) {

        switch(itemDetails.item_id) {
            case "L5HDYYQYHUMU5PEP6VJ3LZ7M":        //  CHECKOUT
                break;
            case "WNIMUOOTOCTAQC26CEHRC745":        //  KIT MARKER
                resolve('KIT MARKER');
                break;
            case "BILKKZAUCEZGPAPTVSZQVJAN":        //  LOADING - EXTRA LIQUIDS
                break;
            case "IMBQNGQHFAJ6UXFPJWWTRK75":        //  LOADING - FULL BATCHES
                resolve(collectNuts(checklistId, itemDetails.item_variation_id, qty, employeeId, createdAt))
                break;
            case "ETJSK2PTU3JVWNTSVLPJQQWK":        //  LOADING - HALF BATCHES
                break;
            case "KISBTFQWIV5NED7CIH63A7ND":        //  LOADING - PLATTERS
                break;
            case "APUX556C7NKW5MVGACEUMDOS":        //  RETURNING - FULL BATCHES
                break;
            case "VB32P5LHMJN3KT26YTCEJ6S7":        //  RETURNING - HALF BATCHES
                break;
        };
        //resolve([employeeId, createdAt, kitId, item_details]);
    });
};

/*
*   UPDATE CHECKLIST NUT QUANTITY
*   
*   This function
*/
function collectNuts(checklistId, nutId, qty, employeeId, createdAt) {
    //  DEFINE LOCAL VARIABLES
    var path = 'checklists/' + checklistId + '/rawMaterials/nuts/' + nutId;

    //  NOTIFY PROGRESS
    console.log('downloading path', path);

    //  RETURN ASYNC WORK
    return new Promise(function collectNutsPromise(resolve, reject) {

        //  DOWNLOAD OBJECT
        firebase.read(path).then(function success(s) {

            //  MAKE CHANGES
            s.collected += qty;
            s.difference = s.allocated - s.collected;
            if(s.difference == 0) {
                s.completed = true
                s.completedAt = createdAt;
                s.completedBy = employeeId;
            }

            //  UPDATE OBJECT
            firebase.update(path, s).then(function success(ss) {
                resolve(ss);
            }).catch(function error(ee) {
                reject(ee);
            });

        }).catch(function error(e) {
            reject(e);
        });
        
    });
}

/*
*   PROCESS PUSH TRANSACTION
*
*   This function takes a transaction and updates if need be.
*/
function processPushTxByCheckingItems(tx) {
    
    //  DEFINE LOCAL VARIABLES
    var employeeId = tx.tender[0].employee_id;
    var createdAt = tx.created_at;
    var kitId = _identifyPushTxKit(tx).kitId;
    var checklistId = '-LdCgUNtz_RU_awetQSVa';
    var allPromises = [];
    
    //  RETURN ASYNC WORK
    return new Promise(function processPushTxPromise(resolve, reject) {

        //  BAIL IF NO KIT_ID IS PRESENT
        if(kitId == undefined) reject('no kit id found');

        //  IF KIT ID WAS FOUND, ITERATE OVER ALL THE TRANSACTIONS 
        tx.itemizations.forEach(function(item) {

            //  LOOK FOR DATA POINTS & MANUFACTURING POINTS
            if(item.item_detail.category_name == 'Data') {
            //  LOOK FOR MANUFACTURING POINTS
                
                //      NOTIFY PROGRESS
                console.log('found a data point');

                //  BUILD THE CHANGE PROMISE
                allPromises.push(_updatePushTxDataPoint(checklistId, item.item_detail, item.quantity, employeeId, createdAt));

            } else if(item.item_detail.category_name == 'Manufacturing') {
                //  TODO: COME BACK TO THIS WHEN READY TO LOOK AT MANUFACTURING
                console.log('found a mfg point');
            } else {
                reject('item was not a data point');
            };
        });

        //  RUN ALL PROMISES
        Promise.all(allPromises).then(function success(s) {
            resolve(s);
        }).catch(function error(e) {
            reject(e);
        });

    });
   
};

/*
*   GET A CHECKLIST
*
*   This function takes the checklist id and returns a single checklist object
*/
function getAChecklist(id) {
    //  NOTIFY PROGRESS
    console.log('in the getAChecklist method', id);

    //  DEFINE LOCAL VARIABLES
    var path = 'checklists/' + id;

    //  RETURN ASYNC WORK
    return new Promise(function getAllChecklistsPromise(resolve, reject) {

        firebase.read(path).then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            reject(e);
        });
    });
};

/*
*   GET ALL CHECKLISTS
*
*   This function takes no parameters and returns an object that will be displayed on the team page
*/
function getAllChecklists() {
    //  NOTIFY PROGRESS
    console.log('in the getAllChecklists method');

    //  RETURN ASYNC WORK
    return new Promise(function getAllChecklistsPromise(resolve, reject) {

        firebase.read('checklists').then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            reject(e);
        });
    });

};

/*
*   TEST
*
*   This function test that everything is working propelry
*/
function test() { 
    //  NOTIFY PROGRESS
    console.log('testing the checklistsDBClient'); 

    //   TEST FIREBASE CONNECTION
    firebase.aTest().then(function success(s) {
        console.log('success', s);
    }).catch(function error(e) {
        console.log('error', e);
    });
}

//  RETURN THE MODULE
module.exports = checklistsDBClient;