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
        dailyRecap: dailyRecapEmail
    }
};

/*
*   DAILY RECAP EMAIL
*
*   This method combines a template and data to return an html email
*/
function dailyRecapEmail(data) {
    data = {
        "cme_date": "Sunday, June 9th",
        "CME_name": "Orenco",
        "portion": 1,
        "hrly": [
            {
                marker: "10AM",
                nuts: 13.8,
                sales: 18000,
                comm: 1177,
                tips: 892
            }
        ],
        sum: {
            nuts: 53.74,
            sales: 70000,
            comm: 4484,
            tips: 1790
        },
        results: {
            "total_hours": "6h",
            "guaranteed_pay": 6450,
            "commissions": 4484,
            "tips": 1790,
            //"cooking_bonus": "500",
            "your_earnings": 12724,
            "effective_rate": 2121
        }
    }

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

    handlebars.registerHelper('salesHrs', function(hrlyList, portion) {
        //  DEFINE LOCAL VARIABLES
        var returnString = '';

        //  ITERATE OVER LIST
        for(var i = 0; i < hrlyList.length; i++) {

            returnString = returnString + "<tr>" +
                "<td>" + hrlyList[i].marker + "</td>" +
                "<td>" + hrlyList[i].nuts.toFixed(1) + "</td>" +
                "<td> $ "+ (hrlyList[i].sales / 100).toFixed(2)+ "</td>" +
                "<td> $" + (hrlyList[i].comm / 100).toFixed(2) + "</td>" +
                "<td> $" + (hrlyList[i].tips / 100).toFixed(2) + "</td>" +
                "<td>" + (portion * 100).toFixed(0) + " % </td>" +
                "</tr>";
            
        };

        console.log(returnString);

        return returnString;
    });

    //  COMPILE DOCUMENT
    var emailBody = emailBodyTemplate(data);

    
    
    return emailBody;
};

//  RETURN THE MODULE
module.exports = rptbldr;