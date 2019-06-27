
/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('dataProcessService', dataProcessService);

//  DEPENDENCY INJECTION
dataProcessService.$inject = ['$log'];

//  DECLARE THE SERVICE
/* @ngInject */
function dataProcessService($log) {

    //  DECLARE GLOBALS

    //  DEFINE METHODS
    var dataProcess = {
        lineData: {
            fromAcctTxs: lineDataFromAcctTxs
        }
    };

    /*
    *   LINE DATA FROM ACCT TRANSACTIONS
    */
    function lineDataFromAcctTxs(data) {
        //  DEFINE LOCAL VARIABLES
        var returnCollection = [];
        if(data.startValue == undefined) data.startValue = 0;
        var balance = data.startValue;

        returnCollection.push({ x:0, y: balance });

        //  ITERATE OVER ALL THE TXS
        Object.keys(data.txs).forEach(function(key) {
            var timeRaw = key.split('T')[1];
            var time = timeRaw.split('-')[0];
            var hrs = time.split(':')[0];
            var mins = time.split(':')[1];
            var sec = time.split(':')[2];
            var timeStamp = sec + (mins*60) + (hrs*60*60)
            //console.log(timeStamp, data.txs[key]);
            balance += parseInt(data.txs[key].balance_change);
            //var timeRaw = key.split('T')[1];
            //var time = timeRaw.split('-')[0];
            var aPoint = { x: time, y: balance };
            returnCollection.push(aPoint);
        });

        console.log('this is the return collection', returnCollection);

        return returnCollection;
    };

    //  RETURN THE METHOD
    return dataProcess;
};