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


/*
*	DIST
*
*	This defines a single task to run the primary gulp functions.
*/
gulp.task('dist', [
	'copy-html',
	'styles',
	'scripts',
	'copy-images'
]);

/*
*	DEFAULT
*
*	This is ...
*/
gulp.task('default', [], function() {
	gulp.watch('public/styles/**/*.css', ['styles'])
		.on('change', browserSync.reload);
	gulp.watch('public/scripts/**/*.js', ['scripts'])
		.on('change', browserSync.reload);
	gulp.watch('public/views/**/*.htm', ['copy-html'])
		.on('change', browserSync.reload);
	gulp.watch('public/index.html', ['copy-html'])
		.on('change', browserSync.reload);

	browserSync.init({
		server: 'dist'
	});
});

/*
*	COPY-HTML
*
*	This defines how html files are copied into the distribution file.
*/
gulp.task('copy-html', function() {
	//copy the index file
	gulp.src('public/index.html')
		.pipe(gulp.dest('dist'));
	gulp.src('public/views/**/*.htm')
		.pipe(gulp.dest('dist/views'));
});

/*
*	STYLES
*
*	This defines how style files (CSS, maybe SASS later) are copied into the distribution file.
*/
gulp.task('styles', function() {
	gulp.src('public/styles/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('dist/styles'))
		.pipe(browserSync.stream());
});

/*
*	SCRIPTS
*
*	This defines how all script files are copied into the distribution file.
*/
gulp.task('scripts', function() {
	gulp.src([
		'public/**/*.js'
	])
	.pipe(sourcemaps.init())
	.pipe(concat('bundle.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/scripts'));
});

/*
*	COPY-IMAGES
*
*/
gulp.task('copy-images', function() {
	gulp.src('public/images/*')
		.pipe(gulp.dest('dist/images'));
});