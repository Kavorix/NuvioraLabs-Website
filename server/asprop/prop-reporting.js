/*
*   AWE SWEET PROPRIATORY METHODS: REPORTING
*
*   All methods associstaed with reporting
*/

//  DEFINE DEPENDENCIES
var moment 			= require('moment-timezone');
var wiw             = require('../wiw/wiw.js');
var firebase	    = require('../firebase/firebase.js');
var stdio           = require('../stdio/stdio.js');

//  DEFINE GLOBALS

//  DEFINE MODULE
var propReporting = {
    dailyRecaps: {
        _notifyRecapUpdates: _notifyRecapUpdates,
        _saveRecapUpdates: _saveRecapUpdates,
        _buildRecaps: _buildRecaps,
        _identifyCompletedShifts: _identifyCompletedShifts,
        update: updateDailyRecaps
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
    //  DEFINE LOCAL VARIABLES
    var today = moment(new Date());
    var PST = today.tz('America/Los_Angeles');
    var start = PST.set({ 'hour': 0, 'minute': 0, 'second': 0 }).format();
    var end = PST.set({ 'hour': 23, 'minute': 59, 'second': 59 }).format();
    var dateString = PST.year() + "-" + _formatMonth(PST.month()) + "-" + PST.date();
    var shiftsPromise = wiw.get.shifts({ start: start, end: end });
    var routesPromsie = firebase.read('inventory/routing/' + dateString);

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
        .then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            reject(e);
        });

    });
};

/*
*
*/
function _saveRecapUpdates(shiftsObject, routeObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        _buildRecaps(shiftsObject, routeObject)
        .then(function success(s) {
            resolve(s)
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
                    hours: {
                        rate: 0,
                        reg: 0,
                        ot: 0,
                        duration: 0
                    },
                    date: "",
                    channel: "",
                    employee: "",
                    email: ""
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
}

//  RETURN MODULE
module.exports = propReporting;
