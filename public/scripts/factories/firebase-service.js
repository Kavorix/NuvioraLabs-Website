/*
*	FIREBASE SERVICE
*
*/

//  DEFINE MODULE
angular
    .module('awesweet')
    .factory('firebaseService', firebaseService);

//  DEPENDENCY INJECTION
firebaseService.$inject = ['$log', '$http', '$firebase', '$firebaseObject', '$firebaseArray'];

//  DECLARE THE SERVICE
/* @ngInject */
function firebaseService($log, $http, $firebase, $firebaseObject, $firebaseArray) {

    //  DECLARE GLOBALS

    //  DEFINE METHODS
    var firebaseMod = {
        create: {
            emailUser: create_user_email
        },
        authenticate: {
            email: email_authentication
        },
        query: {
            instanceAccts: queryInstanceAccts
        }
    };

    /*
    *   EMAIL AUTHENTICATION
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function create_user_email(email, password) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGIRESS
        $log.info('authenticating email');

        //  return new async work
        return new Promise(function (resolve, reject) {

            //  AUTHENTICATE WITH FIREBASE
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function sucess(s) {
                //  PASS THE RESULT BACK
                resolve(s);
            }).catch(function(e) {
                reject(e);
            });
            
        });
    };

    /*
    *   EMAIL AUTHENTICATION
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function email_authentication(email, password) {
        //  DEFINE LOCAL VARIABLES

        //  NOTIFY PROGIRESS
        $log.info('authenticating email');

        //  return new async work
        return new Promise(function (resolve, reject) {

            //  AUTHENTICATE WITH FIREBASE
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function sucess(s) {
                //  PASS THE RESULT BACK
                resolve(s);
			}).catch(function(e) {
				reject(e);
            });
            
        });
    };

    /*
    *   EMAIL AUTHENTICATION
    *   
    *   This method takes a username (email) and password, and returns a sucess or failure 
    */
    function queryInstanceAccts(instanceId) {
        //  DEFINE LOCAL VARIABLES
        //  RETURN ASYNC WORK
        return new Promise(function (resolve, reject) {

            var instanceAccts = firebase.database().ref('inventory/accts').orderByChild('instance_id').equalTo(instanceId);

            instanceAccts.once("value")
            .then(function(snapshot) {
                resolve(snapshot.val());
            })
            .catch(function(e) {
                reject(e);
            });
        });
    };

    //  RETURN THE METHOD
    return firebaseMod;
};