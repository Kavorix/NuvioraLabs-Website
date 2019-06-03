/*
*	FIREBASE
*
*	This module serves as the connection between CNE and Firebase.com.
*/

//  DEFINE DEPENDENCIES
//var fetch 			= require('node-fetch');
var admin 			= require("firebase-admin");


//define global variables
var serviceAccount = {
	"type": 						process.env.FB_TYPE,
	"project_id": 					process.env.FB_PROJECT_ID,
	"private_key_id": 				process.env.FB_PRIVATE_KEY_ID,
	"private_key": 					process.env.FB_PRIVATE_KEY,
	"client_email": 				process.env.FB_CLIENT_EMAIL,
	"client_id": 					process.env.FB_CLIENT_ID,
	"auth_uri": 					process.env.FB_AUTH_URI,
	"token_uri": 					process.env.FB_TOKEN_URI,
	//"auth_provider_x509_cert_url": 	process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
	//"client_x509_cert_url": 		process.env.FB_CLIENT_X509_CERT_URL
};

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cnute-b75af.firebaseio.com"
});

//console.log(serviceAccount);

//define module
var firebase = {
	create: create,
	read: read,
	read_specific: {
		most_recent: read_most_recent,
		range: read_range
	},
	update: update,
	push: push,
	del: del,
	query: {
		inventoryAccts: queryInventoryAccts,
		childValue: queryChildValue
	},
	aTest: aTest
};

function create(path, data) {
	//define local variables
	var ref = admin.database().ref(path);

	console.log('creating record', path, data);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.set(data, function(error) {
		if (error) {
		  reject("Data could not be saved." + error);
		} else {
		  resolve("Data saved successfully.");
		}
		});

	});

};

/*
*	READ
*	
*	This function function collects data from firebase
*/
function read(path) {
  
	console.log('reading path', path);
	
	//define local variable
	var ref = admin.database().ref(path);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.once("value")
		.then(function(snapshot) {
		    
			//console.log(snapshot.val());

			//pass the data back
			resolve(snapshot.val());

		});

	});

};

/*
*
*/
function read_most_recent(path) {
	//notify progress
	console.log('reading most recent record', path);
	
	//TODO: FIGURE OUT HOW TO ADD ALL SORTS AND FILTERS LATER

	//define local variable
	var ref = admin.database().ref(path).orderByKey().limitToLast(1);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.once("value")
		.then(function(snapshot) {
		    
			//console.log(snapshot.val());

			//pass the data back
			resolve(snapshot.val());

		});

	});
};

/*
*
*/
function queryChildValue(path, key, value) {
	//notify progress
	console.log('queryChildValue', path, key, value);

	//define local variable
	var ref = admin.database().ref(path).orderByChild(key).equalTo(value);

	//return async work
	return new Promise(function(resolve, reject) {
		//hit the database
		ref.once("value")
		.then(function(snapshot) {
				
			//console.log(snapshot.val());

			//pass the data back
			resolve(snapshot.val());

		});
		
	});

};

/*
*
*/
function read_range(path, start, end) {
	//notify progress
	console.log('reading range records', path, start, end);
	
	//TODO: FIGURE OUT HOW TO ADD ALL SORTS AND FILTERS LATER

	//define local variable
	var ref = admin.database().ref(path).orderByKey().startAt(start).endAt(end);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.once("value")
		.then(function(snapshot) {
		    
			//console.log(snapshot.val());

			//pass the data back
			resolve(snapshot.val());

		}).catch(function error(e){
			reject(e);
		});

	});
};



/*
*	PUSH
*/
function push(path, data) {
	//define local variables
	var ref = admin.database().ref(path);

	console.log('pushing new record', path/*, data*/);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		var newPostRef = ref.push(data);
		var postId = newPostRef.key;

		newPostRef.set(data, function(error) {
		if (error) {
		  reject("Data could not be saved." + error);
		} else {
		  resolve({msg:"Data saved successfully.", id: postId});
		}
		});

	});	
};

function update(path, data) {
	//define local variables
	var ref = admin.database().ref(path);

	console.log('updating record record at, with', path/*, data*/);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.update(data, function(error) {
			if (error) {
			  reject("Data could not be saved." + error);
			} else {
			  resolve("Data saved successfully.");
			}
		});

	});	
};

/*
*	DEL
*
*	This will delete a path that isn't wanted.
*/
function del(path) {
	//define local variables
	var ref = admin.database().ref(path);

	//return async work
	return new Promise(function(resolve, reject) {

		//hit the database
		ref.set(null, function(error) {
		if (error) {
		  reject("Data could not be saved." + error);
		} else {
		  resolve("Data saved successfully.");
		}
		});

	});

};

/*
*		QUERY INVENTORY ACCOUNTS
*/
function queryInventoryAccts() {
	//	DEFINE LOCAL VARIABLES
	var ref = admin.database().ref('inventory/accts');

}

/*
*	ATEST
*
*	This function is just used for testing purposes
*/
function aTest() {
	var ref = admin.database().ref('employees');
	
	return new Promise(function(resolve, reject) {
		ref.once("value")
	    .then(function(snapshot) {
	        
	        //pass the data back
	        resolve(snapshot.val());

	    });
	});

};

//return the module
module.exports = firebase;

