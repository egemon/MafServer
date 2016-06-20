var isProd = require('../conf.js').isProd;
var gulp = require('gulp'),
    _if = require('gulp-if'),
    concat = require('gulp-concat'),
    add = require('gulp-add-src'),
    beautify = require('gulp-beautify'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    templateCache = require('gulp-angular-templatecache');

    // ========== JS TASKS =============
// lints js code with jshint
gulp.task('lint', function () {
    return gulp.src(['client/**/*.js', '!client/lib/**/*'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// create tamplate cache
gulp.task('tmpls', function () {
  return gulp.src([
      'client/components/**/*.html',
      'client/pages/**/*.html',
    ])
    .pipe(templateCache())
    .pipe(gulp.dest('client/configs'));
});

// this task build all angular modules to ng.min,js
gulp.task('js-ng-app', ['tmpls'], function () {
    return gulp.src(['client/**/*module.js', '!client/lib/**', '!client/app.js'])
    .pipe(add.append(['client/**/*.js', '!client/**/*module.js', '!client/lib/**', '!client/app.js']))
    .pipe(concat('ng.js'))
    .pipe(_if(isProd, uglify(), beautify()))
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
    .pipe(_if(isProd, uglify(), beautify()))
    .pipe(rename('libs.min.js'))
    .pipe(gulp.dest('public/js'));
});

// this task unite ng-modules and libs
gulp.task('js',['js-ng-app'] ,function() {
  return gulp.src('public/js/libs.min.js')
    .pipe(add.append('public/js/ng.min.js'))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'));
});
