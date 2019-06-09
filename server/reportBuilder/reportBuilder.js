/*
*   AWE SWEET REPORT BUILDER
*
*   These are the methods 
*/

//  DEFINE DEPENDENCIES
var handlebars 	= require('handlebars');
var stdio       = require('../stdio/stdio.js');

//  DEFINE MODULE
var rptbldr = {
    emails: {
        employeeEarnings: employeeEarningsEmail
    }
};

function employeeEarningsEmail(data) {

    //  DEFINE LOCAL VARIABLES
    var template = stdio.read.html('./templates/reports/dailyRecapEmail.htm');
    
    return template;
};

//  RETURN THE MODULE
module.exports = rptbldr;