/*
*   INTUIT CENTER
*
*   This module handles email
*/

//  DEFINE DEPENDENCIES
var OAuthClient     = require('intuit-oauth');
var QuickBooks      = require('node-quickbooks');

//  DEFINE GLOBAL VARIABLES
var oauthClient = new OAuthClient({
    clientId: 'Q0GOutIokYQH9aWc4U46GKyrHFV4UbouaTVDKxQ5jNG7KMLGeP',
    clientSecret: 'tuFXbXSbp5q34vEQySj6N6oE0MV0mBjMD9I6ftEw',
    environment: 'sandbox',
    redirectUri: 'https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl'
});
//var qbo = new QuickBooks(consumerKey,
//    consumerSecret,
//    oauthToken,
//    oauthTokenSecret,
//    realmId,
//    false, // use the sandbox?
//    true, // enable debugging?
//    minorversion); // set minorversion

//  DEFINE MODULE
var qbMod = {
    authorize: authorize
};

function authorize() {
    return oauthClient.authorizeUri({scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId],state:'testState'});  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
};

//  RETURN THE MODULE
module.exports = qbMod;

