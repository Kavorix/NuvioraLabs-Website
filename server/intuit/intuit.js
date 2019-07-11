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
    redirectUri:    'http://localhost:3000/intuit/callback' //process.env.AH_NUTS_INTUIT_REDIRECT_URI,
});
var oauth2_token_json = null;

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
    callback: callback,
    retrieveToken: retrieveToken,
    get: {
        companyInfo: getCompanyInfo
    },
    disconnect: disconnect,
    test: test
};

function authorize() {
    return oauthClient.authorizeUri({scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId],state:'testState'});  // can be an array of multiple scopes ex : {scope:[OAuthClient.scopes.Accounting,OAuthClient.scopes.OpenId]}
};

function callback(url) {
    return new Promise(function(resolve, reject) {
        oauthClient.createToken(url)
        .then(function(authResponse) {
            oauth2_token_json = JSON.stringify(authResponse.getJson(), null,2);
            //console.log(oauth2_token_json.refresh_token);
            resolve();
        })
        .catch(function(e) {
            console.error(e);
        });

    });

}

function retrieveToken() {
    //  ITERATE OVER TOKEN
    var jsonKey = JSON.parse(oauth2_token_json);
    Object.keys(jsonKey).forEach(function(key) {
        console.log(key, jsonKey[key]);
    })
    return oauth2_token_json;
}

function getCompanyInfo() {
    var companyID = oauthClient.getToken().realmId;

    var url = oauthClient.environment == 'sandbox' ? OAuthClient.environment.sandbox : OAuthClient.environment.production ;

    return new Promise(function (resolve, reject) {

        oauthClient.makeApiCall({url: url + 'v3/company/' + companyID +'/companyinfo/' + companyID})
        .then(function(authResponse){
            console.log("The response for API call is :"+JSON.stringify(authResponse));
            resolve(JSON.parse(authResponse.text()));
        })
        .catch(function(e) {
            reject(e);
        });
    });

};

function disconnect() {
    console.log('The disconnect called ');
    return oauthClient.authorizeUri({scope:[OAuthClient.scopes.OpenId,OAuthClient.scopes.Email],state:'intuit-test'});
};

function test() {
    console.log(oauthClient)
}

//  RETURN THE MODULE
module.exports = qbMod;

