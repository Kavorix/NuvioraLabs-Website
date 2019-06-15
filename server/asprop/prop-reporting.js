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
*   UPDATE DAILY RECAPS
*/
function updateDailyRecaps() {
    //  DEFINE LOCAL VARIABLES
    var today = moment(new Date('2019-06-13T20:00:00-07:00'));
    var PST = today.tz('America/Los_Angeles');
    var start = PST.set({ 'hour': 0, 'minute': 0, 'second': 0 }).format();
    var end = PST.set({ 'hour': 23, 'minute': 59, 'second': 59 }).format();

    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCAL VARIABLES

        //  COLLECT DAY'S SHIFTS
        wiw.get.shifts({ start: start, end: end })
        .then(function success(shiftsObject) {

            //  CHECK FOR PRESENT SHIFTS
            if(shiftsObject.shifts.length == 0) {
                //  IF NO, REJECT
                reject({complete: true, status:"no shifts"})
            } else {

                //  IF SHIFTS ARE FOUND, MOVE TO NEXT STEP
                _notifyRecapUpdates(shiftsObject)
                .then(function success(s) {
                    resolve(s)
                }).catch(function error(e) {
                    rejecct(e);
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
*   PRIVATE BUILD RECAPS
*/
function _buildRecaps(shiftsObject) {
    //  RETURN ASYNC WORK
    return new Promise(function (resolve, reject) {
        //  DEFINE LOCAL VARIABLES
        var recapsToBuildList = _identifyCompletedShifts(shiftsObject);

        //  CONNECT EACH SHIFT TO AN INSTANCE IN FIREBASE
        //  MAP WIW USER ID -> SQUARE EMPLOYEE ID for routing/[date]/SQUARE EMPLOYEE ID/[uid]/instance_id (if there is only one shift and one route easy, if there are more than one compare start and end times) 
        //  MAP WIW site_id/name -> dailyRecaps/[UID]/CME_name
        //  MAP WIW start_time -> dailyRecaps/[UID]/cme_date
        //  MAP WIW end_time - start_time -> dailyRecaps/[UID]/shifts/[index]/total_hours
        //  MAP WIW user_id/hourly_rate -> dailyRecaps/[UID]/shifts/[index]/hourly_rate
        //  MAP WIW user_id/email -> dailyRecaps/[UID]/shifts/[index]/email
        //  MAP WIW user_id/first_name -> dailyRecaps/[UID]/shifts/[index]/first_name
        //  MAP WIW user_id/last_name -> dailyRecaps/[UID]/shifts/[index]/last_name

        resolve(recapsToBuildList);

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
