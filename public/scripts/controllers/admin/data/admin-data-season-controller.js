
angular
    .module('awesweet')
    .controller('adminDataSeasonController', adminDataSeasonController);

	adminDataSeasonController.$inject = ['$scope', '$location', '$routeParams', 'firebaseService', 'seasonData', 'channelData', 'instanceData'];

/* @ngInject */
function adminDataSeasonController($scope, $location, $routeParams, firebaseService, seasonData, channelData, instanceData) {
    //  DEFINE LOCAL VARIABLES
    var vm  = this;

	//  DEFINE VIEW MODEL VARIABLES
    vm.season       = seasonData;
    vm.channel      = channelData;
    vm.instances    = instanceData;
    vm.state = {
        tempStartDate: "",
        tempEndDate: "",
        tempFreq: "",
        instancesPreview: [],
        instancesPreviewHrs: []
    }

    //  DEFINE LOCAL FUNCTIONS  
    function addPreviewInstance(date, channel, season, instance) {
        return {
            channel_id: channel.channel_id,
            channel_name: channel.channel_name,
            closes: date,
            end_time: date,
            instance: instance,
            instance_id: "",
            opens: date,
            season_id: season.seasonId,
            season_name: season.title,
            start_time: date,
            hrsModel: "",
            txsSummary: {
                filters: "",
                payments: "",
                sales: "",
                skipped: false
            },
            delVisible: false
        }
    }
    
    //  DEFINE VIEW MODEL FUNCTIONS
    vm.saveUpdates = function() { 
        //	DEFINE LOCAL VARIABLES
        var updates = {};
        //console.log('$routeParams', $routeParams);

        updates['/seasons/' + $routeParams.seasonId] = JSON.parse(angular.toJson(vm.season));
        
		//	NOTIFY PROGRESS
		console.log('updating season values', vm.season);

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
    vm.instanceReroute = function(id) {
        console.log('got this id', id);
        $location.path('/admin/data/instance/' + id);
    };
    vm.sumRent = function(rent, x) { console.log(rent, x); vm.season.seasonRent =  rent * x; };
    vm.addTemplate = function() {
        console.log('adding template', vm.season);
        //  DEFINE LOCAL VARIABLES
        var template = {
            start_time: "",
            end_time: "",
            opens: "",
            closes: ""
        };

        //  CHECK FOR 
        if(vm.season.hrsTemplates == undefined) {
            vm.season.hrsTemplates = [];
            vm.season.hrsTemplates.push(template);
        } else {
            vm.season.hrsTemplates[Object.keys(vm.season.hrsTemplates).length] = template;
        }

        console.log(vm.season);
    };
    vm.deleteTemplate = function(index) {
        vm.season.hrsTemplates[index] = null;
    };
    vm.updateInstanceHrs = function(key, instance, salesModel) {
        //  DEFINE LOCAL VARIABLE
        var updates = {};
        var datePath = instance.start_time.split("T")[0];

        updates['/instances/' + key +'/opens']       = datePath + "T" + salesModel.opens;
        updates['/instances/' + key +'/start_time']  = datePath + "T" + salesModel.start_time;
        updates['/instances/' + key +'/end_time']    = datePath + "T" + salesModel.end_time;
        updates['/instances/' + key +'/closes']      = datePath + "T" + salesModel.closes;

        firebaseService.update.record(updates)
        .then(function success(s) {
            console.log('invoice updates')
        }).catch(function error(e) {
            console.log(e);
        });
    };
    vm.buildInstancesPreview = function(start, end, freq) {
        //  NOTIFY PROGRESS
        console.log('buildInstancesPreview', start, end, freq);

        //  DEFINE LOCL VARIABLES
        var startDate = moment(start);
        var endDate = moment(end);

        //  TEST FOR VIABLE VALUES
        if(start != "" && end != "", freq !="") {
            console.log('all values good');
            //  iterate based on frequency
            switch(freq) {
                case "Daily":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'days')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.state.instancesPreview.push(
                            addPreviewInstance(
                                cursorDate.format(),                                            //  DATE
                                { channel_id: vm.channel.id, channel_name: vm.channel.title },  //  CHANNEL
                                { seasonId: $routeParams.seasonId, title: vm.season.title },             //  SEASON
                                i + 1                                                           //  INSTANCE
                            )
                        );
                        vm.state.instancesPreviewHrs.push("");
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'days')
                    };
                    
                    break;
                case "Weekly":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'weeks')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.state.instancesPreview.push(
                            addPreviewInstance(
                                cursorDate.format(),                                            //  DATE
                                { channel_id: vm.channel.id, channel_name: vm.channel.title },  //  CHANNEL
                                { seasonId: $routeParams.seasonId, title: vm.season.title },             //  SEASON
                                i + 1                                                           //  INSTANCE
                            )
                        );
                        vm.state.instancesPreviewHrs.push("");
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'week')
                    };
                    break;
                case "Bi-Weekly":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'weeks') / 2;
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.state.instancesPreview.push(
                            addPreviewInstance(
                                cursorDate.format(),                                            //  DATE
                                { channel_id: vm.channel.id, channel_name: vm.channel.title },  //  CHANNEL
                                { seasonId: $routeParams.seasonId, title: vm.season.title },             //  SEASON
                                i + 1                                                           //  INSTANCE
                            )
                        );
                        vm.state.instancesPreviewHrs.push("");
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(2, 'week')
                    };
                    break;
                case "Monthly":
                    //  DEFINE LOCAL VARIBALES
                    var iterations = endDate.diff(startDate, 'months')
                    var cursorDate = startDate;
                    //  iterate to create the list
                    for(var i = 0; i <= iterations; i++) {
                        //save the date
                        vm.state.instancesPreview.push(
                            addPreviewInstance(
                                cursorDate.format(),                                            //  DATE
                                { channel_id: vm.channel.id, channel_name: vm.channel.title },  //  CHANNEL
                                { seasonId: $routeParams.seasonId, title: vm.season.title },             //  SEASON
                                i + 1                                                           //  INSTANCE
                            )
                        );
                        vm.state.instancesPreviewHrs.push("");
                        //notify the date
                        //console.log(cursorDate.format());
                        //incriment the date
                        cursorDate = cursorDate.add(1, 'month')
                    };
                    break;
                default:
            };
        }
    };
    vm.deletePreviewInstance = function(index) {
        vm.state.instancesPreview.splice(index,1);
    };
    vm.updatePreviewHrs = function(index, preview, hrsModel) {
        //  NOTIFY PROGRESS
        console.log('updatePreviewHrs', index, preview, hrsModel);
        
        vm.state.instancesPreview[index].closes     = preview.closes.split("T")[0]      + "T" + hrsModel.closes;
        vm.state.instancesPreview[index].end_time   = preview.end_time.split("T")[0]    + "T" + hrsModel.end_time;
        vm.state.instancesPreview[index].opens      = preview.opens.split("T")[0]       + "T" + hrsModel.opens;
        vm.state.instancesPreview[index].start_time = preview.start_time.split("T")[0]  + "T" + hrsModel.start_time;
    };
    vm.saveNewInstances = function(instances){
        firebaseService.create.instancesList(instances)
        .then(function success(s) {
            console.log(s);
            $scope.$apply();
        }).catch(function error(e) {
            console.log(e);
        });
    };

    //  DEFINE LOCAL
    /*
    *   PRIVATE: IDENTIFY START
    */   
    function _identifyStart(instances) { return instances[Object.keys(instances)[0]].start_time; };

    /*
    *   PRIVATE: IDENTIFY START
    */   
    function _identifyEnd(instances) { return instances[Object.keys(instances)[Object.keys(instances).length - 1]].end_time; };

    /*
    *   PRIVATE: CALCULATE AVERAGE OCCURANCE
    */
    function _calculateAverageOcc(instances) {
        //  define local varaibles
        if(vm.season.gross_sales == undefined) vm.season.gross_sales = 0;

        //  iterate
        Object.keys(instances).forEach(function(key) {
            //  DEFINE LOCAL 
            var record = instances[key];

            if(record.txsSummary != undefined) {
                vm.season.gross_sales += record.txsSummary.sales[0].actual;
                //console.log(key, record.txsSummary.sales[0].actual);
            }
        });

        //console.log(vm.season.gross_sales);
    };
    /*
    *   PRIVEATE: IDENTIFY OCCURANCES SALES MODEL
    */
    function _identifyOccSalesModels(instances) {
        //  DEFINE LOCAL VARIABLES
        var returnObject = {};

        //  iterate over instances
        Object.keys(instances).forEach(function(key) { returnObject[key] = ""; });

        return returnObject;
    };
    
    /*
    *   INIT
    */
    function init(){
        //  DEFINE LOCAL VARIABLES
        console.log('vm.instances', vm.instances );

        //  CHECK FOR PRE-EXISTING INSTANCE DATA
        if(vm.instances != null) {

            //  ADD INSTANCES TO SEASON
            if(vm.season.hrsModels == undefined)         vm.season.hrsModels = _identifyOccSalesModels(vm.instances);

            //  CONSTANTS
            if(vm.season.isConfirmed == undefined)      vm.season.isConfirmed = false;
            if(vm.season.avgOcc == undefined)           vm.season.avgOcc = 0;
            if(vm.season.occuranceRent == undefined)    vm.season.occuranceRent = 0;

            //  GET THE BOOKEND DATES
            if(vm.season.start_date == undefined) vm.season.start_date = _identifyStart(vm.instances);
            if(vm.season.end_date == undefined) vm.season.end_date = _identifyEnd(vm.instances);

            //  OCCURANCES
            if(vm.season.occurances == undefined) vm.season.occurances = Object.keys(vm.instances).length;

            //  AVERAGES
            if(vm.season.avgOcc == undefined) vm.season.avgOcc = _calculateAverageOcc(vm.instances);

            //  GROSSES

            console.log('vm.season', vm.season);
        } else {
            
            console.log('got here');
            vm.season.start_date = "";
            vm.season.end_date = "";
            vm.season.occurances = ""
        }
        
    };

    //  RUN
    init();

    //console.info('in adminDataChannelsController');	    //  TODO: TAKE THIS OUT LATER


}