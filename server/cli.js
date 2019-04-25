

var cldb = require('./dbScripts/db-team-checklists.js');

cldb.getAChecklist('-LdCgUNtz_RU_a4oQSVa').then(function success(s) {
    console.log('SUCCESS:');
    console.log(s);
}).catch(function error(e) {
    console.log('ERROR:');
    console.log(e);
});