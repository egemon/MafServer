var isDev = process.env.NODE_ENV !== 'production';
console.log('isDev', isDev);

var gulp = require('gulp'),
    config = require('./../../package').config,
    _if = require('gulp-if'),
    concat = require('gulp-concat'),
    add = require('gulp-add-src'),
    beautify = require('gulp-beautify'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate'),
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
    return gulp.src(['client/**/*module.js', '!client/lib/**'])
    .pipe(add.append(['client/**/*.js', '!client/**/*module.js', '!client/lib/**']))
    .pipe(concat('ng.js'))
    .pipe(ngAnnotate())
    .pipe(_if(isDev,beautify() ,uglify()))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public/js'));
});

gulp.task('js-lib', function () {
    return gulp.src(config.libs.js)
    .pipe(concat('lib.min.js'))
    .pipe(_if(isDev,beautify() ,uglify()))
    .pipe(gulp.dest('public/js'));
});

// this task unite ng-modules and libs
gulp.task('js',['js-ng-app', 'js-lib'] ,function() {
  return gulp.src('public/js/libs.min.js')
    .pipe(add.append('public/js/ng.min.js'))
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('public/js'));
});
