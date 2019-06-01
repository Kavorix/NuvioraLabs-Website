/*
*   STANDARD INPUT AND OUTPUT
*   
*   This module handles standard loading, saving, etc
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var fs 		= require('fs');
var path 	= require('path');

//  DEFINE MODULE
var stdio = {
    read: {
        json: readJson
    },
    write: {
        json: writeJson
    }
};

/*
*   READ JSON
*/
function readJson(filepath) {
    //  DEFINE LOCAL VARIABLES
    var readpath = path.join(__dirname, '..', filepath);

	var file = fs.readFileSync(readpath, 'utf8');

	return JSON.parse(file);
};

/*
*   READ JSON
*/
function writeJson(filepath, data) {
    //  DEFINE LOCAL VARIABLES
	var writepath = path.join(__dirname, '..', filepath);

	fs.writeFile(writepath, JSON.stringify(data, null, '\t'), 'utf8', function (err) {
		if (err) {
		    return console.log(err);
		}

		console.log("The file was saved!");	
	});
};

//  RETURN THE MODULE
module.exports = stdio;
