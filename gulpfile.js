//============ SERVER PART ===================
var gulp = require('gulp');
var guppy = require('git-guppy')(gulp);
var shell = require('gulp-shell');

gulp.task('fetch', shell.task('scp -r  5649a2480c1e66bce900006c@bs-mafiaclub.rhcloud.com:app-root/runtime/repo/data-base/ ./', {
    verbose: true
}));

gulp.task('pre-push', ['fetch'] , guppy.src('pre-push', function(files, originArray, func) {
    console.log('Doing nothing here args = ', arguments);
}));



//=================== CLIENT PART  ===================
var isProduction = false;
var dest = 'public';
var gulp = require('gulp'),
    _if = require('gulp-if'),
    cssnano = require('gulp-cssnano'),
    cssbeautify = require('gulp-cssbeautify'),
    jshint = require('gulp-jshint'),
    beautify = require('gulp-beautify'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    browserify = require('gulp-browserify'),
    add = require('gulp-add-src'),
    htmlmin = require('gulp-htmlmin'),
    templateCache = require('gulp-angular-templatecache'),
    runSequence = require('run-sequence'),
    del = require('del');

// var jsFiles =
// ========== JS TASKS =============
// lints js code with jshint
gulp.task('lint', function () {
    return gulp.src(['client/**/*.js', '!client/lib/**/*'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// create tamplate cache
gulp.task('tmpls', ['lint'], function () {
  return gulp.src([
      'client/components/**/*.html',
      'client/pages/**/*.html',
    ])
    .pipe(templateCache())
    .pipe(gulp.dest('client/configs'));
});

// this task build all angular modules to ng.min,js
gulp.task('js-ng-app', [], function () {
    return gulp.src(['client/**/*module.js', '!client/lib/**', '!client/app.js'])
    .pipe(add.append(['client/**/*.js', '!client/**/*module.js', '!client/lib/**', '!client/app.js']))
    .pipe(concat('ng.js'))
    .pipe(_if(isProduction, uglify(), beautify()))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js'));
});

//this task collect all libs
gulp.task('js-lib', function () {
  return gulp.src(['client/app.js'])
    .pipe(browserify({
        debug: true,
        insertGlobals: true
    }))
    .pipe(_if(isProduction, uglify(), beautify()))
    .pipe(rename('libs.min.js'))
    .pipe(gulp.dest('public/js'));
});

// this task unite ng-modules and libs
gulp.task('js',['js-ng-app', 'js-lib'] ,function() {
  return gulp.src('public/js/libs.min.js')
    .pipe(add.append('public/js/ng.min.js'))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'));
});



// ============ OTHER ASSESTS TASK ============
// copies fonts from src to dest
gulp.task('font', function () {
    return gulp.src(['client/assets/fonts/**'])
    .pipe(gulp.dest('public/fonts'));
});

// this task minify images
gulp.task('img', function() {
  return gulp.src('client/assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/img'));
});

// minifies html
gulp.task('html', function () {
    return gulp.src(['client/app.html'])
    .pipe(_if(isProduction, htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('public'));
});

//collects lib css files and concat them
gulp.task('css-lib', function() {
  return gulp.src([
      'client/lib/bootstrap-css/css/bootstrap.css',
      'client/lib/angular-autocomplete/style/autocomplete.css',
    ])
    .pipe(concat('lib.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isProduction, cssnano(), cssbeautify()))
    .pipe(gulp.dest('public/css'));
});

//collects custom css files and concat them
gulp.task('css-custom', function() {
  return gulp.src(['client/**/*.css','!client/lib/**/*'])
    .pipe(concat('custom.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isProduction, cssnano(), cssbeautify()))
    .pipe(gulp.dest('public/css'));
});

// this task unite ng-modules and libs
gulp.task('css',['css-custom', 'css-lib'] ,function() {
  return gulp.src('public/css/lib.min.css')
    .pipe(add.append('public/css/custom.min.css'))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('public/css'));
});

gulp.task('clean', function() {
    return del(['dest']);
});

gulp.task('all', [ 'js', 'css', 'img', 'html', 'font']);

gulp.task('default', ['clean'], function() {
  runSequence('all', 'watch');
});



//GENERAL WATCHER
function reactOn(task) {
  return function reacter() {
    runSequence(task);
  };
}

// watchers
gulp.task('watch', function() {
  // Create LiveReload server
 livereload.listen({
  start: true,
  port: 8030,
  host: 'localhost'
 });

  // Watch .scss files
  gulp.watch('client/**/*.css', reactOn('css'));

  // Watch .js files
  gulp.watch(['client/**/*.js', '!client/configs/templates.js'], reactOn('js'));

  // Watch .js files
  gulp.watch(['client/configs/templates.js'], reactOn('js'));

  // Watch image files
  gulp.watch('client/assets/img/**/*', reactOn('img'));

  // Watch main html files
  gulp.watch('client/app.html', reactOn('html'));

  // Watch main tmpls files
  // gulp.watch([
  //     'client/components/**/*.html',
  //     'client/pages/**/*.html',
  //   ], reactOn('tmpls'));

  // Watch any files in dest/, reload on change
  // gulp.watch(['dest/**']);
});

// gulp.task('deploy', function () {
//   return gulp.src('dest/**/**')
//     .pipe(gulp.dest('../bs/public/'));
// });
