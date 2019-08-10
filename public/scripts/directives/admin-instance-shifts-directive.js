
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
            shifts: '=',
            activeTxs:'=',
            saveShifts: "&",
			update: "&"
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
        vm.activeShifts = {};
        vm.activeTxs = $scope.vm.activeTxs;
        vm.comType = 'algr';

		//	DEFINE VIEW MODEL VARIABLES
        vm.sendShifts = function() {
            //  DEFINE LOCAL VARAIBLES
            var sendableShifts = {};
            

            //  ITERATE OVER LIST
            //vm.activeShifts.forEach(function(shift) {
            //    if(shift.status.selected) sendableShifts[shift.wiwShift_id] = shift;
            //});

            //  NOTIFY PROGRES
            //console.log('sending shift', sendableShifts);

            $scope.vm.saveShifts({data:sendableShifts});
        };
        vm.selectShift = function(key, filters, shifts) {
            //  DEFINE LOCAL VARIABLES
            //  DEFINE VIEW MODEL VARIABLES
            vm.instance.txsSummary.filters.comTips[key].commisions = vm.instance.txsSummary.filters.shifts[key];
            vm.instance.txsSummary.filters.comTips[key].tips = vm.instance.txsSummary.filters.shifts[key];

            vm.blocks = calculatePool(filters, shifts);
            
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
            var returnObject = {};

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

                //  ADD TO OBJECT
                returnObject[key] = shiftData;

                //  ADD TO FILTER
                if(vm.instance.txsSummary.filters.shifts[key] == undefined) vm.instance.txsSummary.filters.shifts[key] = false;
                if(vm.instance.txsSummary.filters.comTips[key] == undefined) {
                    vm.instance.txsSummary.filters.comTips[key] = {};
                    vm.instance.txsSummary.filters.comTips[key].commisions = false;
                    vm.instance.txsSummary.filters.comTips[key].tips = false;
                }
            });

            console.log('activeShifts', returnObject);

            return returnObject;
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
            //console.log(params);

            wiwService.get.shifts(params)
            .then(function success(s) {
                //  NOTIFY PROGRES
                //console.log('shifts',s);

                vm.activeShifts = processShifts(s.data);

                $scope.$apply();
            }).catch(function error(e) {
                console.log(e);
            });
        }

        /*
        *   CALCULATE POOL
        */
        function calculatePool(filters, shifts) {
            //  DEFINE LOCAL VARIABLE
            var blocks = [];

            //  ITERATE OVER SHIFTS LIST
            Object.keys(filters).forEach(function(key) {
                if(filters[key]) {
                    //  add the block
                    blocks.push({
                        start: shifts[key].time.start,
                        end: shifts[key].time.end,
                        members: [],
                        total_com: 0,
                        total_tips: 0,
                        total_sales: 0
                    });
                    //  ADD THE MEMBER ID
                    blocks[blocks.length - 1].members.push(key);
                }
            });

            //  OPPERATE ACCORDING TO NUMBER OF SHIFTS
            switch(blocks.length) {
                case 0:
                    console.log('0 blocks');
                    break;
                case 1:
                    //  DEFINE LOCAL VARIABLES
                    var start = blocks[0].start;
                    var end = blocks[0].end;
                    var duration = moment(end).diff(moment(start), 'hours');

                    console.log('1 block', blocks, vm.activeTxs.length);
                    //  iterate over all active TX
                    vm.activeTxs.forEach(function(tx) {
                        var timeStamp = moment(tx.created_at)
                        if(timeStamp.isBetween(start, end)) {
                            blocks[0].total_tips += tx.tip_money.amount
                            blocks[0].total_sales += (tx.gross_sales_money.amount - tx.refunded_money.amount)
                        }
                    });

                    blocks[0].total_com = calculateCommission(vm.comType, blocks[0].total_sales, duration);

                    break;
                default:
                    console.log('multiple blocks');
                    break;
            };
            return blocks;
        };
        
        function calculateCommission(type, sales, duration) {
            //  DEFINE LOCAL VALUES
            var commission = 0;

            switch(type) {
                case "algr":
                    //  DEFINE LOCAL VARIABLES
                    var salesPHr = sales / 100 / duration;
                    var multiplier = salesPHr / 2752;
                    var comRate = multiplier * salesPHr;
                    commission = comRate * duration;
                    console.log('commission,', duration, sales, salesPHr, multiplier, comRate)
                    break;
                default: 
                    break;
            };

            
            return commission.toFixed(2) * 100
        }

        //  WHEN EVERYTHING HAS LOADED
        $timeout(function() {
            vm.shifts = $scope.vm.shifts;
            if(vm.instance.txsSummary.filters.shifts == undefined) vm.instance.txsSummary.filters.shifts = {};
            if(vm.instance.txsSummary.filters.comTips == undefined) vm.instance.txsSummary.filters.comTips = {};
            getShifts($scope.vm.instance.opens);
        })

		//	REPORT PROGRESS
		//$log.info('in adminInstanceShiftsDirectiveController');
	}

	//pass it back
	return directive;
}
