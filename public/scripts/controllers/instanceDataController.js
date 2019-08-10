angular
    .module('awesweet')
    .controller('instanceDataViewsController', instanceDataViewsController);

	instanceDataViewsController.$inject = ['$scope','$log', 'firebaseService', 'instanceData', 'shiftsData'];

/* @ngInject */
function instanceDataViewsController($scope, $log, firebaseService, instanceData, shiftsData) {

	//	DEFINE LOCAL VARIALES
	var vm = this;

	//	DEFINE VIEW MODEL VARIABLES
	vm.state = { txsVisible: false, forecastVisible: false, shiftsVisible: false}
	vm.instance = instanceData;
	vm.shifts = shiftsData;
	

	//	DEFINE LOCAL FUNCTIONS

	//	VIEW MODEL FUNCTIONS
	vm.updateSummary = function() {
		//	DEFINE LOCAL VARIABLES
		var updates = {};
		updates['instances/' + vm.instance.instance_id + '/txsSummary'] = JSON.parse(angular.toJson(vm.instance.txsSummary));
		
		//	NOTIFY PROGRESS
		console.log('updating summary values', vm.instance.txsSummary);

		//	MAP VALUES 
		//vm.retailPerformance[0].act = vm.instance.txsSummary.sales[0].actual;

		//	SAVE
		firebaseService.update.record(updates)
		.then(function success(s) {
			console.log(s);
		}).catch(function error(e) {
			console.log(e);
		});
	};
	vm.saveShifts = function(newShifts) {
		//	DEFINE LOCAL VARIABLES
		var shifts = [];
		var updates = {};
		var i = 0;

		//	PULL OUT SHIFTS
		Object.keys(newShifts).forEach(function(key) {
			//	ADD VALUE
			newShifts[key].channel_id 	= vm.instance.channel_id;	//	channel ID
			newShifts[key].instance_id 	= vm.instance.instance_id;	//	instance ID
			newShifts[key].seasons 		= vm.instance.season_name;	//	season
			newShifts[key].seasons_id 	= vm.instance.season_id;	//	season ID
			newShifts[key].status.executed = true;					//	executed

			shifts.push(newShifts[key]);
		});

		//	IF THERE ARE SHIFTS,  ADD THEM TO THE RECORD
		if(shifts.length > 0) {
			shifts.forEach(function(shift) {
				var newPostKey = firebaseService.push.record('/shifts');
				
				//	PREPARE DB WRITE
				updates['/shifts/' + newPostKey] = JSON.parse(angular.toJson(shift));
				
				//	ADD SHIFTS TO LOCAL MODEL
				vm.shifts[newPostKey] = shift;
			});
		};

		//	ADD TO DATABASE
		firebaseService.update.record(updates)
		.then(function success(s) {
			//return an affirmative status code
			console.log(s, shifts);
		}).catch(function error(e) {
			console.log(e);
		});

		//	UPDATE SCOPE
		$scope.$apply();
	};


	//	LOCAL FUNCTIONS


	//	NOTIFY PROGRESS
	//$log.info('in the instance Data Views controller');	    //  TODO: TAKE THIS OUT LATER


};