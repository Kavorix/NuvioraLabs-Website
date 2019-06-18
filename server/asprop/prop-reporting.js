/*
*   AWE SWEET PROPRIATORY METHODS: REPORTING
*
*   All methods associstaed with reporting
*/

//  DEFINE DEPENDENCIES
var moment 			= require('moment-timezone');
var wiw             = require('../wiw/wiw.js');
var firebase	    = require('../firebase/firebase.js');
var rptBldr         = require('../reportBuilder/reportBuilder.js');
var mail            = require('../mailCenter/mailCenter.js');
var stdio           = require('../stdio/stdio.js');
var ivdb            = require('../dbScripts/db-inventory.js');

//  DEFINE GLOBALS

//  DEFINE MODULE
var propReporting = {
    dailyRecaps: {
        _notifyRecapUpdates: _notifyRecapUpdates,
        _saveRecapUpdates: _saveRecapUpdates,
        _buildRecaps: _buildRecaps,
        _identifyCompletedShifts: _identifyCompletedShifts,
        update: updateDailyRecaps,
        publish: publishDailyRecaps,
        singleRecapPublish: publishSingleRecap,
        approve: approveDailyRecaps
    }
};

function _formatMonth(date) {
    var returnString = "";
    date += 1;
    if(date < 10) returnString = "0" + date
    else returnString = date;
    return returnString;
};

function _calculateDuration(start, end) {
    var startTime = moment(start);
    var endTime = moment(end);
    //console.log(startTime, endTime, endTime.diff(startTime, 'hours'));
    return endTime.diff(startTime, 'hours'); 
};

function _calculateRegHrs(duration) {
    if(duration > 8) return 8
    else return duration;
};

function _calculateOTHrs(duration) {
    if(duration > 8) return duration - 8
    else return 0;
}

/*
*   UPDATE DAILY RECAPS
*/
function updateDailyRecaps() {
    console.log('got here');

    //  DEFINE LOCAL VARIABLES
    var today = moment(new Date());
    var PST = today.tz('America/Los_Angeles');
    var start = PST.set({ 'hour': 0, 'minute': 0, 'second': 0 }).format();
    var end = PST.set({ 'hour': 23, 'minute': 59, 'second': 59 }).format();
    var dateString = PST.year() + "-" + _formatMonth(PST.month()) + "-" + PST.date();
    var shiftsPromise = wiw.get.shifts({ start: start, end: end });
    var routesPromsie = firebase.read('inventory/routing/' + dateString);

    //  NOTIFY PROGRESS
    console.log('running daily reports for ', dateString);

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCAL VARIABLES

        //  COLLECT DAY'S SHIFTS
        Promise.all([shiftsPromise, routesPromsie])
        .then(function success(allResults) {

            var shiftsObject = allResults[0];
            var routeObject = allResults[1];

            //  CHECK FOR PRESENT SHIFTS
            if(shiftsObject.shifts.length == 0) {
                //  IF NO, REJECT
                reject({complete: true, status:"no shifts"})
            } else {

                //  IF SHIFTS ARE FOUND, MOVE TO NEXT STEP
                _notifyRecapUpdates(shiftsObject, routeObject)
                .then(function success(s) {
                    resolve(s)
                }).catch(function error(e) {
                    reject(e);
                });
            
            }

        }).catch(function error(e) {
            reject(s);
        });
    });

};

/*
*   PRIVATE: NOTIFY UPDATES
*
*   This method sends notification emails to managers that recaps are ready for approval
*/
function _notifyRecapUpdates(shiftsObject, routeObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        _saveRecapUpdates(shiftsObject, routeObject)
        .then(function success(updatesList) {

            //  DEFINE LOCAL VARIABLES
            var sendOptions = {
                from: 'info@ah-nuts.com',
                to: 'info@ah-nuts.com',
                subject: 'New Daily Recaps are available',
                html: "<a href='https://awesweetv1.herokuapp.com/API/report/approveDailyRecaps'>Recap Approval Page</a>"
            };

            //  SEND THE MAIL
            mail.send(sendOptions)
            .then(function success(s) {
                resolve({mail: s, updates: updatesList});
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });

    });
};

/*
*
*/
function _saveRecapUpdates(shiftsObject, routeObject) {
    //  DEFINE LOCAL VARIABLES
    var updatePromisesList = [];

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        _buildRecaps(shiftsObject, routeObject)
        .then(function success(updatesList) {

            //  ITERATE OVER LIST
            updatesList.forEach(function(update) {

                updatePromisesList.push(ivdb.add.dailyRecapModel(update))
            });

            //  RUN ALL PROMISES
            Promise.all(updatePromisesList)
            .then(function success(resolvedUpdates) {
                resolve(updatesList);
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {
            reject(e);
        });

    });
};

/*
*   PRIVATE BUILD RECAPS
*/
function _buildRecaps(shiftsObject, routeObject) {
    //  DEFINE LOCAL VARIABLES
    var recapsList = [];

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCAL VARIABLES
        var recapsToBuildList = _identifyCompletedShifts(shiftsObject);
        var wiwToSqMap = stdio.read.json('./models/wiwUserId_to_sqEmployee_id.json');

        console.log('got this routeObject', routeObject);

        //  ITERATE OVER EACH OF THE ROUTES
        Object.keys(routeObject).forEach(function(sqId) {

            //  ITERATE OVER ROUT SHIFTS
            Object.keys(routeObject[sqId]).forEach(function(fbPushId) {

                //  DEFINE LOCAL VARIABLES
                var shiftValues = new Object({
                    instanceId: routeObject[sqId][fbPushId].instance_id,
                    approved: false,
                    hours: {
                        rate: 0,
                        reg: 0,
                        ot: 0,
                        duration: 0
                    },
                    date: "",
                    channel: "",
                    employee: "",
                    email: "",
                    subject: ""
                });

                //  ITERATE OVER SHIFTS TO FIND THE MATCH
                recapsToBuildList.forEach(function(wiwShift) {

                    //  IF THE WIW ID MATCHES THE SQUARE USER ID
                    if(wiwToSqMap[wiwShift.user_id] == sqId) {
                        //  DEFINE LOCAL VARIABLES
                        var user_id = wiwShift.user_id;
                        var site_id = wiwShift.site_id;
                        shiftValues.hours.duration  = _calculateDuration(wiwShift.start_time, wiwShift.end_time);
                        shiftValues.hours.reg       = _calculateRegHrs(shiftValues.hours.duration);
                        shiftValues.hours.ot        = _calculateOTHrs(shiftValues.hours.duration);
                        shiftValues.date            = moment(wiwShift.start_time).format().split('T')[0];
                        
                        //  ITERATE OVER THE SITES TO FIND THE CHANNEL
                        shiftsObject.sites.forEach(function(site) {
                            if(site.id == site_id) shiftValues.channel = site.name;
                        });

                        //  ITERATE OVER THE USERS TO FIND THE EMPLOYEE AND EMAIL
                        shiftsObject.users.forEach(function(user) {
                            if(user.id == user_id) {
                                shiftValues.employee    = user.first_name + " " + user.last_name;
                                shiftValues.email       = user.email;
                                shiftValues.hours.rate  = parseInt(user.hourly_rate) * 100;
                            }
                        });

                        shiftValues.subject         = "Daily Recap for " + moment(shiftValues.date).format("dddd, MMMM Do YYYY") + ": " + shiftValues.channel + " - " + shiftValues.employee;
                        

                    };

                });

                //  ADD THE UPDATES TO THE LIST
                recapsList.push(shiftValues);

            });

        });

        resolve(recapsList);

    });
};

/*
*   PRIVATE: IDENTIFY COMPLETD SHIFTS
*/
function _identifyCompletedShifts(shiftsObject) {
    //  DEFINE LOCAL VARIABLES
    var recapsToBuildList = [];
    var today = moment(new Date());
    var PST = today.tz('America/Los_Angeles');
    

    //  ITERATE OVER EACH SHIFT
    shiftsObject.shifts.forEach(function (shift) {
        //  DEFINE LOCAL VARIABLES
        var shiftEnd = moment(shift.end_time);
        var hasEnded = (PST.diff(shiftEnd) > 0);

        //  ADD ONLY SHIFTS THAT HAVE ENDED ON THIS DAY TO THE LIST
        if(hasEnded) {
            recapsToBuildList.push(shift);
        };

    });

    //  RETURN THE LIST FOR FURTHER PROCESSING
    return recapsToBuildList;
};

/*
*   PUBLISH DAILY RECAPS
*/
function publishDailyRecaps() {
    //  DEFINE LOCAL VARIABLES
    var today = moment(new Date());
    var PST = today.tz('America/Los_Angeles');
    var dateString = PST.year() + "-" + _formatMonth(PST.month()) + "-" + PST.date();
    var publishList = [];

    //  RETURN ASYNC WORK
    return new Promise(function(resolve, reject) {
        //  NOTIFY PROGRESS

        //  COLLECT ONLY TODAY'S RECAPS
        firebase.query.childValue('inventory/dailyRecaps', 'cme_date', dateString)
        .then(function success(recapsToday) {

            //  ITERATE OVER THE RECAPS
            Object.keys(recapsToday).forEach(function(key) {

                //  IF THE RECAPS ARE APPROVED, PUSH THEM TO THE LIST
                if(recapsToday[key].approved == true) {
                    recapsToday[key]['id'] = key;
                    publishList.push(recapsToday[key]);
                }
            });

            //  SEND BACK ALL RECAPS READY FOR PUBLISH
            resolve(publishList)
    
        }).catch(function error(e) {
            resolve(e);
        });
    });
};

/*
*   APPROVE DAILY RECAPS
*   
*   This method...
*/
function approveDailyRecaps() {
    //  DEFINE LOCAL VARIABLES
    
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCA VARIABLES
        ivdb.read.pendingRecaps()
        .then(function success(pendingRecapData) {
            resolve(rptBldr.emails.approveRecaps(pendingRecapData));
        }).catch(function error(e) {
            reject(e);
        });
    });

};

/*
*   PUBLISH SINGLE RECAP
*/
function publishSingleRecap(instanceId) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  1. COLLECT THE RECAP OBJECT
        //  2. SEND THE EMAIL
        //  3. UPDATE QUICKBOOKS
        //  4. DELETE THE RECORDS
        _deleteRecapRecords(instanceId)
        .then(function success(responseObject) {
            resolve(rptBldr.pages.recapPublishConf(responseObject));
        }).catch(function error(e) {
            reject(e);
        });

    });
};

function _deleteRecapRecords(instanceId) {
    //  DEFINE LOCAL VARIABLES
    var deletePromises = [];

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  1. COLLECT THE RECAP OBJECT
        //  2. SEND THE EMAIL
        //  3. UPDATE QUICKBOOKS
        _updateQuickbooks(instanceId)
        .then(function success(responseObject) {

            responseObject['cleaning'] = [];

            //  COLLECT INVENTORY INSTANCE
            firebase.read('inventory/instances/' + instanceId)
            .then(function success(instance) {

                //  ITERATE OVER ALL INSTANCES ENTRIES
                Object.keys(instance.entries).forEach(function (timestamp) {

                    Object.keys(instance.entries[timestamp]).forEach(function (entry) {

                        //  PUSH ALL OF THE TXS TO THE DELETE LIST
                        var txPath = 'inventory/txs/' + instance.entries[timestamp][entry].txId;
                        deletePromises.push(firebase.del(txPath));
                        responseObject.cleaning.push({path: txPath, status: ""});

                        //  PUSH ALL OF THE ACCST TO THE DELETE LIST
                        var acctPath = 'inventory/accts/' + instance.entries[timestamp][entry].targetAcctId;
                        deletePromises.push(firebase.del(acctPath));
                        responseObject.cleaning.push({path: acctPath, status: ""});
                    });

                });

                //  daily recap: inventory/dailyRecaps/[instanceId]
                var recapPath = 'inventory/dailyRecaps/' + instanceId;
                deletePromises.push(firebase.del(recapPath));
                responseObject.cleaning.push({path: recapPath, status: ""});

                //  instance: inventory/instances/[instanceId]
                var instancePath = 'inventory/instances/' + instanceId;
                deletePromises.push(firebase.del(instancePath));
                responseObject.cleaning.push({path: instancePath, status: ""});

                Promise.all(deletePromises)
                .then(function success(responses) {

                    //  ITERATE OVER RESPONSES
                    for(var i = 0; i < responses.length; i++) {
                        responseObject.cleaning[i].status = responses[i]; 
                    };

                    //  pass along the response object
                    resolve(responseObject);

                }).catch(function error(e) {
                    reject(e);
                });

            }).catch(function error(e) {
                reject(e);
            });
            
        }).catch(function error(e) {
            reject(e);
        });

    });
};

function _updateQuickbooks(instanceId) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  1. COLLECT THE RECAP OBJECT
        //  2. SEND THE EMAIL
        _sendRecapEmail(instanceId)
        .then(function success(responseObject) {
            //  TO DO - ADD THIS LATER SO IT UPDATES ALL THE QUICKBOOKS RECORDS
            responseObject['quickbooks'] = "Nothing Right now";
            resolve(responseObject);
        }).catch(function error(e) {
            reject(e);
        });

    });
};

function _sendRecapEmail(instanceId) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  1. COLLECT THE RECAP OBJECT
        _collectRecapObject('inventory/dailyRecaps/' + instanceId)
        .then(function success(recapObject) {

            //  DEFINE LOCAL VARIABLES
            var sendOptions = {
                from: 'info@ah-nuts.com',
                to: recapObject.email,
                cc: ['ian@ah-nuts.com'],
                subject: recapObject.subject,
                //text: "this is a test",
                html: rptBldr.emails.dailyRecap(recapObject)
            };

            //  SEND THE MAIL
            mail.send(sendOptions)
            .then(function success(response) {
                resolve({email: response});
            }).catch(function error(e) {
                reject(e);
            });            

        }).catch(function error(e) {
            reject(e);
        });

    });
};

function _collectRecapObject(path) {
    //  DEFINE LOCAL VARIABLES
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {

        //  1. COLLECT THE RECAP OBJECT
        firebase.read(path)
        .then(function success(recapObject) {
            resolve(recapObject);
        }).catch(function error(e) {
            reject(e);
        });

    });
};

//  RETURN MODULE
module.exports = propReporting;
