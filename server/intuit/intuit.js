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
    clientId:       process.env.AH_NUTS_INTUIT_CLIENT_ID,
    clientSecret:   process.env.AH_NUTS_INTUIT_CLIENT_SECRET,
    environment:    process.env.AH_NUTS_INTUIT_ENVIRONMENT,
    redirectUri:    process.env.AH_NUTS_INTUIT_REDIRECT_URI,
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
    authorize: authorize,
    test: test
};

function authorize() {
    return oauthClient.authorizeUri({scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId],state:'testState'});  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
};

function test() {
    console.log(oauthClient)
}

//  RETURN THE MODULE
module.exports = qbMod;

