/*
*   AUTHENTICATION ROUTES MODULE
*/

module.exports = (function() {
    'use strict';
    //  DEFINE DEPENDENCIES
    var assets      = require('express').Router();
    var stdio       = require('../stdio/stdio.js');

   //	POST: /sqrwebhook
   assets.get('/:path/:file', function(req, res) {
        
        //advise of the post body
        console.log('got this /assets request', req.params.path);

        var returnScript = stdio.read.html('./assets/'+ req.params.path + "/" + req.params.file);

        res.status(200);
        res.send(returnScript);
    });

    return assets;
})();