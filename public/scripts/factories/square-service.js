/*
*	BACKEND DATA SERVICE
*
*/

//define module
angular
    .module('awesweet')
    .factory('squareService', squareService);

//dependency injections
squareService.$inject = ['$http'];

//declare the service
/* @ngInject */
function squareService($http) {
    //  DEFINE LOCAL VARIABLES

	//define methods
	var squareService = {
        employeeList: {},
        _format: {
            employeeList: _formatEmployeeList
        },
        list: {
            employees: listEmployees,
            transactions: listTransactions
        }
    };

    function _formatEmployeeList(sqEmpList) {
        //  DEFINE LOCAL VARIABLES
        var formattedCollection = {};

        //  ITERATE OVER LIST
        sqEmpList.forEach(function(employee) {
            formattedCollection[employee.id] = employee;
        });

        //  RETURN VALUES
        return formattedCollection;
    };

    function listEmployees() {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            $http({
                method: "GET",
                url: "/square/listEmployees"
            })
            .then(function success(s) {
                //  FORMAT LIST
                var returnData = _formatEmployeeList(s.data);

                //return an affirmative status code
                resolve(returnData);
            }).catch(function error(e) {
                reject(e);
            });
        });
    };

    function listTransactions(start, end) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function(resolve, reject) {
            $http({
                method: "GET",
                url: "/square/listPayments?location=M53KQT35YKE5C&start=" + start + "&end=" + end
            })
            .then(function success(s) {
                //return an affirmative status code
                resolve(s);
            }).catch(function error(e) {
                reject(e);
            });
        });
    }; 

    //  RUN FUNCTIONS
    listEmployees()
    .then(function success(s) {
        //  SAVE LIST
        squareService.employeeList = s;

        //  NOTIFY PROGRESS
        console.log('got the employee list', s);
        
    }).catch(function error(e) {
        console.log(e);
    });

	//turn the method
    return squareService;	
};
