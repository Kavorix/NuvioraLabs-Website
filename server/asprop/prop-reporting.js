/*
*   AWE SWEET PROPRIATORY METHODS: REPORTING
*
*   All methods associstaed with reporting
*/

//  DEFINE DEPENDENCIES
var moment 			= require('moment-timezone');
var wiw         = require('../wiw/wiw.js');

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

/*
*   PRIVATE: IDENTIFY COMPLETD SHIFTS
*/
function _identifyCompletedShifts(shiftsObject) {
    //  DEFINE LOCAL VARIABLES
    var recapsToBuildList = [];
    var today = moment(new Date);
    var PST = today.tz('America/Los_Angeles');
    

    //  ITERATE OVER EACH SHIFT
    shiftsObject.shifts.forEach(function (shift) {
        //  DEFINE LOCAL VARIABLES
        var shiftEnd = moment(shift.end_time);
        var hasEnded = (PST.diff(shiftEnd) > 0);

        //
        if(hasEnded) {
            recapsToBuildList.push(shift);
        };

    });

    //  RETURN
    return recapsToBuildList;
}

/*
*   PRIVATE BUILD RECAPS
*/
function _buildRecaps(shiftsObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        var recapsToBuildList = _identifyCompletedShifts(shiftsObject)

        resolve(recapsToBuildList);

    });
};

/*
*
*/
function _saveRecapUpdates(shiftsObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        _buildRecaps(shiftsObject)
        .then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            rejecct(e);
        });

    });
};

/*
*   PRIVATE: NOTIFY UPDATES
*
*   This method sends notification emails to managers that recaps are ready for approval
*/
function _notifyRecapUpdates(shiftsObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        
        _saveRecapUpdates(shiftsObject)
        .then(function success(s) {
            resolve(s)
        }).catch(function error(e) {
            rejecct(e);
        });

    });
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

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCAL VARIABLES

        //  COLLECT DAY'S SHIFTS
        wiw.get.shifts({ start: start, end: end })
        .then(function success(shiftsObject) {

            _notifyRecapUpdates(shiftsObject)
            .then(function success(s) {
                resolve(s)
            }).catch(function error(e) {
                rejecct(e);
            });

        }).catch(function error(e) {
            reject(s);
        });
    });

};

//  RETURN MODULE
module.exports = propReporting;
