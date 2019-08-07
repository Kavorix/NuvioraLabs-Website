/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('wiwService', wiwService);

//  DEPENDENCY INJECTION
wiwService.$inject = ['$log', '$http'];

//  DECLARE THE SERVICE
/* @ngInject */
function wiwService($log, $http) {

    //  DECLARE GLOBALS

    //  DEFINE METHODS
    var wiwMod = {
        get: {
            shifts: getShifts
        },
        templates: {
            shiftData: shiftDataTemplate
        }
    };

    /*
    *   GET SHIFTS
    */
    function getShifts(params) {
        //  DEFINE LOCAL VARAIBLES
        var url = "/wiw/shifts?start=" + params.start + "&end=" + params.end;

        //  RETURN ASNYC WORK
        return new Promise(function(resolve, reject) {
            $http({
                method: "GET",
                url: url
            })
            .then(function success(s) {
                //  FORMAT LIST
                //var returnData = _formatEmployeeList(s.data);

                //return an affirmative status code
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });
        });

    };

    /*
    *   SHIFT DATA TEMPLATE
    */
    function shiftDataTemplate() {
        return new Object({
            wiwShift_id: "",
            shiftTeamMember: "",
            wiw_teamMember_id: "",
            teamMemberRate : "",
            channel_id: "",
            channel: "",
            seasons_id: "",
            season: "",
            instance_id: "",
            timecard_id: "",
            payroll_id: "",
            expense_id: "",
            status: {
                projected: false,
                executed: false,
                selected: false
            },
            time: {
                start: "",
                end: "",
                dHrs: 0.00
            },
            hrs: {
                reg: 0.00,
                ot: 0.00
            },
            pay: {
                reg_labor: 0,
                ot_labor: 0,
                tips: 0,
                comm: 0
            }
        });
    }

    //  NOTIFY PROGRESS
    console.log('loaded WIW service');

    //  RETURN THE METHOD
    return wiwMod;
};