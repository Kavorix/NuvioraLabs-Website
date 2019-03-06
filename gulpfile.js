/* 	GULP FILE
*
*	This is the gulp file that facilitates the developement environment.
*/

//  DEFINE DEPENDENCIES
var gulp 	            = require('gulp');						// build tools
var autoprefixer        = require('gulp-autoprefixer');	        // allows for customization to various browsers
var browserSync         = require('browser-sync').create();	    // allows for live updating
var concat              = require('gulp-concat');				// will help shrink our public files
var uglify              = require('gulp-uglify');				// minifies public javascript
var sourcemaps          = require('gulp-sourcemaps');		    // helps place files that are minified
var ngAnnotate          = require('gulp-ng-annotate');		    // helps with angular scrips