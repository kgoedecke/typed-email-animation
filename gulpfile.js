

// Style related.
var styleSRC = './assets/less/style.less'; // Path to main .less file.
var styleDestination = './'; // Path to place the compiled CSS file.
// Defualt set to root folder.

// JS Vendor related.
var jsVendorSRC = './assets/js/vendor/*.js'; // Path to JS vendor folder.
var jsVendorDestination = './assets/js/'; // Path to place the compiled JS vendors file.
var jsVendorFile = 'vendors'; // Compiled JS vendors file name.

// CSS Vendor related.
var cssVendorSRC = './assets/css/vendor/*.css'; // Path to JS vendor folder.
var cssVendorDestination = './assets/css/'; // Path to place the compiled JS vendors file.
var cssVendorFile = 'vendors'; // Compiled JS vendors file name.

// JS Custom related.
var jsCustomSRC = './assets/js/custom/*.js'; // Path to JS custom scripts folder.
var jsCustomDestination = './assets/js/'; // Path to place the compiled JS custom scripts file.
var jsCustomFile = 'custom'; // Compiled JS custom file name.
// Default set to custom i.e. custom.js.

// Images related.
var imagesSRC = './assets/img/raw/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination = './assets/img/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Favicons related.
var faviconsSRC = './assets/favicons/**/*.{png,ico,json,xml}'; // Source folder of favicons

// Watch files paths.
var styleWatchFiles = './assets/less/**/*.less'; // Path to all *.scss files inside css folder and inside them.
var vendorJSWatchFiles = './assets/js/vendor/*.js'; // Path to all vendor JS files.
var customJSWatchFiles = './assets/js/custom/*.js'; // Path to all custom JS files.
var projectPHPWatchFiles = './**/*.php'; // Path to all PHP files.
var projectHTMLWatchFiles = './**/*.html'; // Path to all HTML files.
var imageWatchFiles = 'assets/img/raw/**/*.{jpg,png,gif,svg}';

// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
];


// Assigning modules to local variables
var browserSync = require('browser-sync').create();
var reload = browserSync.reload; // For manual browser reload.
var gulp = require('gulp');
var less = require('gulp-less');
var minifycss = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var mmq = require('gulp-merge-media-queries'); // Combine matching media queries into one media query definition.
var concat = require('gulp-concat'); // Concatenates JS files
var imagemin = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.
var lineec = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify = require('gulp-notify'); // Sends message notification to you
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var pkg = require('./package.json');

var build           = './build/',
    buildInclude    = [
                        // include common file types
                        '**/*.php',
                        '**/*.html',
                        '**/*.css',
                        '**/*.js',
                        '**/*.svg',
                        '**/*.ttf',
                        '**/*.otf',
                        '**/*.eot',
                        '**/*.woff',
                        '**/*.woff2',

                        // include specific files and folders
                        './favicons/*',

                        // exclude files and folders
                        '!gulpfile.js',
                        '!build/**/*',
                        '!node_modules/**/*',
                        '!assets/bower_components/**/*',
                        '!style.css.map',
                        '!assets/js/custom/*',
                        '!assets/css/patrials/*'
                    ];

// Configure the browserSync task
gulp.task('browser-sync', function() {
    browserSync.init({
        browser: [],
        server: {
            baseDir: "."
        }
    })
});

/**
 * Task: `styles`.
 *
 * Compiles LESS, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source less file
 *    2. Compiles LESS to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */

gulp.task('styles', function() {
    gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(less())
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))

    .pipe(sourcemaps.write(styleDestination))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination))

    .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(mmq({ log: true })) // Merge Media Queries only for .min.css version.

    .pipe(browserSync.stream()) // Reloads style.css if that is enqueued.

    .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            maxLineLen: 10
        }))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination))

    .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.stream()) // Reloads style.min.css if that is enqueued.
        .pipe(notify({ message: 'TASK: "styles" Completed! 💯', onLast: true }))
});

gulp.task('cssHeader', function () {
    cssheader.patch('./style.min.css', function(err){
        // done
    });
});

/**
 * Task: `vendorJS`.
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS vendor files
 *     2. Concatenates all the files and generates vendors.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates vendors.min.js
 */

gulp.task('vendorsJs', function() {
    gulp.src(jsVendorSRC)
        .pipe(concat(jsVendorFile + '.js'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsVendorDestination))
        .pipe(rename({
            basename: jsVendorFile,
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsVendorDestination))
        .pipe(notify({ message: 'TASK: "vendorsJs" Completed! 💯', onLast: true }));
});

/**
 * Task: `vendorCSS`.
 *
 * Concatenate and uglify vendor CSS styles.
 *
 * This task does the following:
 *     1. Gets the source folder for JS vendor files
 *     2. Concatenates all the files and generates vendors.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates vendors.min.js
 */

gulp.task('vendorsCss', function() {
    gulp.src(cssVendorSRC)
        .pipe(concat(cssVendorFile + '.css'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(cssVendorDestination))
        .pipe(rename({
            basename: cssVendorFile,
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(cssVendorDestination))
        .pipe(notify({ message: 'TASK: "vendorsCss" Completed! 💯', onLast: true }));
});

/**
 * Task: `customJS`.
 *
 * Concatenate and uglify custom JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task('customJS', function() {
    gulp.src(jsCustomSRC)
        .pipe(concat(jsCustomFile + '.js'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsCustomDestination))
        .pipe(rename({
            basename: jsCustomFile,
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(jsCustomDestination))
        .pipe(notify({ message: 'TASK: "customJs" Completed! 💯', onLast: true }));
});

gulp.task('images', function() {
    gulp.src(imagesSRC)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3, // 0-7 low-high
            interlaced: true,
            svgoPlugins: [{ removeViewBox: false }]
        }))
        .pipe(gulp.dest(imagesDestination))
        .pipe(notify({ message: 'TASK: "images" Completed! 💯', onLast: true }));
});

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */

gulp.task('default', ['styles', 'vendorsJs', 'vendorsCss', 'vendorsJs', 'customJS', 'images', 'browser-sync'], function() {
    gulp.watch(projectPHPWatchFiles, reload); // Reload on PHP file changes.
    gulp.watch(projectHTMLWatchFiles, reload); // Reload on HTML file changes.
    gulp.watch(imageWatchFiles, ['images', reload]); // Reload on images changes/insertions
    gulp.watch(styleWatchFiles, ['styles']); // Reload on SCSS file changes.
    gulp.watch(vendorJSWatchFiles, ['vendorsJs', reload]); // Reload on vendorsJs file changes.
    gulp.watch(customJSWatchFiles, ['customJS', reload]); // Reload on customJS file changes.
});

/**
 * Clean gulp cache
 */

gulp.task('clear', function() {
    cache.clearAll();
});

/**
 * Clean tasks for zip
 *
 * Being a little overzealous, but we're cleaning out the build folder, codekit-cache directory and annoying DS_Store files and Also
 * clearing out unoptimized image files in zip as those will have been moved and optimized
 */

/**
 * Build task that moves essential theme files for production-ready sites
 *
 * buildFiles copies all the files in buildInclude to build folder - check variable values at the top
 * buildImages copies all the images from img folder in assets while ignoring images inside raw folder if any
 */

gulp.task('buildFiles', function() {
    return gulp.src(buildInclude)
        .pipe(gulp.dest(build))
        .pipe(notify({ message: 'Copy from buildFiles complete', onLast: true }));
});


/**
 * Images
 *
 * Look at src/images, optimize the images and send them to the appropriate place
 */

gulp.task('buildImages', function() {
    return gulp.src(['assets/img/**/*', '!assets/images/raw/**'])
        .pipe(gulp.dest(build + 'assets/img/'))
        .pipe(notify({ message: 'Images copied to buildTheme folder', onLast: true }));
});


// ==== TASKS ==== //
/**
 * Gulp Default Task
 *
 * Compiles styles, fires-up browser sync, watches js and php files. Note browser sync task watches php files
 *
 */

// Package Distributable Theme
gulp.task('build', function(cb) {
    runSequence('styles', 'cssHeader', 'cleanup', 'vendorsJs', 'vendorsCss', 'customJS', 'buildFiles', 'buildImages', 'buildZip', 'cleanupFinal', cb);
});



gulp.task('cleanup', function() {
    return gulp.src(['./assets/bower_components', '**/.sass-cache', '**/.DS_Store'], { read: false }) // much faster
        .pipe(ignore('node_modules/**')) //Example of a directory to ignore
        .pipe(rimraf({ force: true }))
        // .pipe(notify({ message: 'Clean task complete', onLast: true }));
});
gulp.task('cleanupFinal', function() {
    return gulp.src(['./assets/bower_components', '**/.sass-cache', '**/.DS_Store'], { read: false }) // much faster
        .pipe(ignore('node_modules/**')) //Example of a directory to ignore
        .pipe(rimraf({ force: true }))
        // .pipe(notify({ message: 'Clean task complete', onLast: true }));
});