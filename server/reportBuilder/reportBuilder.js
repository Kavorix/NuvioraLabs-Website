/*
*   AWE SWEET REPORT BUILDER
*
*   These are the methods 
*/

//  DEFINE DEPENDENCIES
var handlebars 	= require('handlebars');
var stdio       = require('../stdio/stdio.js');
var moment 		= require('moment-timezone');

//  DEFINE MODULE
var rptbldr = {
    _timeToHrMarker: _timeToHrMarker,
    emails: {
        dailyRecap: dailyRecapEmail
    }
};

function _timeToHrMarker(hour) {
    //  DEFINE LOCAL VARIABLES
    var returnString = "";

    if(hour < 12) { returnString = hour + " AM"; }

    if(hour == 12) { returnString = " Noon"; }

    if(hour > 12) { returnString = (hour - 12) + " PM"; }

    return returnString;
};

/*
*   DAILY RECAP EMAIL
*
*   This method combines a template and data to return an html email
*/
function dailyRecapEmail(data) {

    //  DEFINE LOCAL VARIABLES
    var htmlSource = stdio.read.html('./templates/reports/dailyRecapEmail.hbs');
    var emailBodyTemplate = handlebars.compile(htmlSource);
    
    //  REGISTER HELPERS
    handlebars.registerHelper('formatMoney', function(value) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "$ ";

        returnString = returnString + (value / 100).toFixed(2);

        return returnString;
    });

    handlebars.registerHelper('formatPercent', function(value) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "";

        returnString = (value * 100).toFixed(0) + " %";

        return returnString;
    });

    handlebars.registerHelper('salesHrs', function(hrlyList) {
        //  DEFINE LOCAL VARIABLES
        var returnString = '';

        //  ITERATE OVER LIST
        for(var i = 0; i < hrlyList.length; i++) {

            returnString = returnString + "<tr>" +
                "<td>" + _timeToHrMarker(hrlyList[i].hour) + "</td>" +
                //"<td>" + hrlyList[i].nuts.toFixed(1) + "</td>" +
                "<td> $ "+ (hrlyList[i].sales / 100).toFixed(2)+ "</td>" +
                "<td> $" + (hrlyList[i].comm / 100).toFixed(2) + "</td>" +
                "<td> $" + (hrlyList[i].tips / 100).toFixed(2) + "</td>" +
                "<td>" + (hrlyList[i].portion * 100).toFixed(0) + " % </td>" +
                "</tr>";
            
        };

        return returnString;
    });

    handlebars.registerHelper('shiftTime', function(duration) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "";
        var hours = Math.floor(duration);
        var minutes = ((duration - Math.floor(duration)) * 60).toFixed(0);

        if(hours > 0) { returnString = returnString + hours +"h"; }

        if(hours > 0 && minutes > 0) { returnString = returnString + ", "; }

        if(minutes > 0) { returnString = returnString + minutes + "m"; }

        return returnString;
    });

    handlebars.registerHelper('cme_date', function(dateString) {
        //  DEFINE LOCAL VARIABLES
        var momentDate = moment(dateString);

        //  RETURN 
        return momentDate.format("dddd, MMMM Do");
    });

    //  COMPILE DOCUMENT
    var emailBody = emailBodyTemplate(data);

    
    
    return emailBody;
};

//  RETURN THE MODULE
module.exports = rptbldr;