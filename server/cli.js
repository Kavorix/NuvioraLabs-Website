

var cldb = require('./dbScripts/db-team-checklists.js');
var asprop = require('./asprop.js'); 
var squareV1    = require('./square/square_V1.js');
var fs 		= require('fs');
var path 	= require('path');

var readpath = path.join(__dirname, '.', 'models','transaction.json');

var file = fs.readFileSync(readpath, 'utf8');

cldb.processPushTx.checkItems(JSON.parse(file))
.then(function success(s) {
    console.log('SUCCESS:');
    console.log(s);
}).catch(function error(e) {
    console.log('ERROR:');
    console.log(e);   
});



/*asprop.sqPushUpdates({ entity_id: 'YmsX65meD8SlFz53TAkVOvMF',event_type: 'PAYMENT_UPDATED',merchant_id: 'FCGJQY3GC9BNW',location_id: 'M53KQT35YKE5C' } )
.then(function success(s) {
    console.log('SUCCESS:');
    console.log(s);
}).catch(function error(e) {
    console.log('ERROR:');
    console.log(e);   
});*/
