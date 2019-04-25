

var cldb = require('./dbScripts/db-team-checklists.js');

cldb.getAllChecklists()
.then(function success(s) {
    console.log('SUCCESS:', s);
}).catch(function error(e) {
    console.log('ERROR', e);
});