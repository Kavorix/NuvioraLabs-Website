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
    pages: {
        recapPublishConf: recapPublishConfirmation
    },
    emails: {
        dailyRecap: dailyRecapEmail,
        approveRecaps: approveRecapsEmail
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

/*
*   APPROVE DAILY RECAP EMAIL
*
*/
function approveRecapsEmail(data) {
    //  DEFINE LOCAL VARIABLES
    var htmlSource = stdio.read.html('./templates/reports/recapsApprovalEmail.hbs');
    var emailBodyTemplate = handlebars.compile(htmlSource);

    console.log('got this data', data);

    //  REGISTER HELPERS

    /*
    *   PENDING RECAPS HELPER
    *
    *   This helper formats the table rows to display all pending reports
    */
    handlebars.registerHelper('pendingRecaps', function(data) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "";

        //  ITERATE OVER EACH OF THE RECAPS
        Object.keys(data).forEach(function (key) {

            //  ADD THE TR
            returnString += "<tr>";

            returnString += "<td style='padding-bottom: 30px'> <strong>Channel: </strong>" + data[key].CME_name;

            returnString += '<br> <strong>Date: </strong>' + data[key].cme_date;
            
            returnString += "<br> <strong>To: </strong>" + data[key].email;

            returnString += "<br> <strong>Subject: </strong>" + data[key].subject + "</td>";

            returnString += "<td style='padding-bottom: 30px'><form action='/API/report/instance/" + key + "'><input class='btn btn-primary' type='submit' value='Reveiew'></form></td>";

            returnString += "<td style='padding-bottom: 30px'><form action='/API/report/publishARecap/" + key + "'><input class='btn btn-success' type='submit' value='Submit'></form></td>";

            returnString += "</tr>";
        });


        //  RETURN 
        return returnString;
    });

    //  COMPILE DOCUMENT
    var emailBody = emailBodyTemplate({list: data});

    
    //  return html
    return emailBody;    

};

function recapPublishConfirmation(responseObject) {
    //  DEFINE LOCAL VARIABLES
    var htmlSource = stdio.read.html('./templates/reports/publishRecapsConf.hbs');
    var responseBodyTemplate = handlebars.compile(htmlSource);

    handlebars.registerHelper('emailDisplay', function(data) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "<ol>";

        //  ITERATE OVER OJECTES
        Object.keys(data).forEach(function(key) {
            returnString += "<li><strong>" + key + "</strong>: " + data[key] + "</li>";
        });

        //  RETURN
        return returnString + "</ol>";
    });
    
    handlebars.registerHelper('cleanReport', function(data) {
        //  DEFINE LOCAL VARIABLES
        var returnString = "";

        returnString += "<ol>";

        //  ITERATE OVER OBJECTS
        data.forEach(function(file){

            returnString += "<li>" + file.path + ": " + file.status + "</li>";

        });

        returnString += "</ol>";

        //  return
        return returnString;
    });

    //  COMPILE DOCUMENT
    var responseBody = responseBodyTemplate(responseObject);

    //  RETURN HTML
    return responseBody;
};

//  RETURN THE MODULE
module.exports = rptbldr;