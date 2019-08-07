
/*
*	FOOTER DIRECTIVE
*
*	This module is designed to 
*/

angular
    .module('awesweet')
    .directive('adminInstanceShiftsDirective', adminInstanceShiftsDirective);

/* @ngInject */
function adminInstanceShiftsDirective() {
	//define the directive
	var directive = {
		restrict: "AECM",
		templateUrl: 'views/directives/admin-instance-shifts.directive.htm',
		replace: true,
		scope: {
            instance: "=",
            saveShifts: "&"
		},
		link: linkFunc,
		controller: adminInstanceShiftsDirectiveController,
		controllerAs: 'vm',
		bindToController: true
	}

	/* @ngInject */
	function linkFunc(scope, el, attr, ctrl) {}

	adminInstanceShiftsDirectiveController.$inject = ['$scope', '$log', 'wiwService', '$timeout'];
	
	/* @ngInject */
	function adminInstanceShiftsDirectiveController($scope, $log, wiwService, $timeout) {
		//	DEFINE LOCAL VARIABLES
        var vm = this;
        vm.instance = $scope.vm.instance;
        vm.activeShifts = [];

		//	DEFINE VIEW MODEL VARIABLES
        vm.sendShifts = function() {
            //  DEFINE LOCAL VARAIBLES
            var sendableShifts = {};
            

            //  ITERATE OVER LIST
            vm.activeShifts.forEach(function(shift) {
                if(shift.status.selected) sendableShifts[shift.wiwShift_id] = shift;
            });

            //  NOTIFY PROGRES
            console.log('sending shift', sendableShifts);

            $scope.vm.saveShifts({data:sendableShifts});
        };
        //  DEFINE LOCAL FUNCTIONS
        function _formatWIWData(collection) {
            //  DEFINE LOCAL VARIABLES
            var returnObject = {};

            //  ITERATE OVER COLLECTION
            collection.forEach(function(item) {
                returnObject[item.id] = item
            });

            return returnObject;
        };
        //
        function _formatHrs(duration) {
            //  DEFINE LOCAL VARIABLES
            var reg = 0;
            var ot = 0;

            if (duration > 8) {
                reg = 8;
                ot = duration - reg;
            } else {
                reg = duration;
            };

            return {
                reg: reg,
                ot: ot
            }
        }

        /*
        *   PROCESS SHIFTS
        */
        function processShifts(data) {
            //  DEFINE LOCAL VARIABLES
            var shifts = _formatWIWData(data.shifts);
            var sites = _formatWIWData(data.sites);
            var users = _formatWIWData(data.users);
            var returnArray = [];

            //  ITERATE OVER THE SHIFTS
            Object.keys(shifts).forEach(function(key) {
                //  DEFINE LOCAL VARIABLES
                var shiftData = wiwService.templates.shiftData();

                //  ASSIGN VALUES
                shiftData.wiwShift_id           = shifts[key].id;
                shiftData.shiftTeamMember       = users[shifts[key].user_id].first_name + " " + users[shifts[key].user_id].last_name;
                shiftData.wiw_teamMember_id     = shifts[key].user_id;
                shiftData.teamMemberRate        = users[shifts[key].user_id].hourly_rate;
                shiftData.channel               = sites[shifts[key].site_id].name;
                shiftData.time.start            = moment(shifts[key].start_time).format();
                shiftData.time.end              = moment(shifts[key].end_time).format();
                shiftData.time.dHrs             = (moment(shifts[key].end_time).diff(moment(shifts[key].start_time), "minutes") / 60).toFixed(2);
                shiftData.hrs.reg               = _formatHrs(shiftData.time.dHrs).reg;
                shiftData.hrs.ot                = _formatHrs(shiftData.time.dHrs).ot;
                shiftData.pay.reg_labor         = shiftData.hrs.reg * shiftData.teamMemberRate;
                shiftData.pay.ot_labor          = shiftData.hrs.ot * (shiftData.teamMemberRate * 1.5);

                //  ADD TO ARRAY
                returnArray.push(shiftData);
            });

            console.log(returnArray);

            return returnArray;
        };

        /*
        *   GET SHIFTS
        */
        function getShifts(date) {
            
            //  DEFINE LOCAL VARIABLES
            var newDate = date.split("T")[0];
            var start = newDate + "T00:00:00-07:00";
            var end = newDate + "T23:59:59-07:00";
            var params = {
                start: start,
                end:  end
            };

            //  NOTIFY PROGRESS
            console.log(params);

            wiwService.get.shifts(params)
            .then(function success(s) {
                //  NOTIFY PROGRES
                console.log(s);

                vm.activeShifts = processShifts(s.data);

                $scope.$apply();
            }).catch(function error(e) {
                console.log(e);
            });
        }

        //  WHEN EVERYTHING HAS LOADED
        $timeout(function() {
            getShifts($scope.vm.instance.opens);
        })

		//	REPORT PROGRESS
		$log.info('in adminInstanceShiftsDirectiveController');
	}

	//pass it back
	return directive;
}
