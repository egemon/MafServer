var isProd = require('../conf.js').isProd;
var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    _if = require('gulp-if'),
    add = require('gulp-add-src'),
    cssbeautify = require('gulp-cssbeautify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

// ======================  STYLES  ====================

//collects lib css files and concat them
gulp.task('css-lib', function() {
  return gulp.src([
      'client/lib/bootstrap-css/css/bootstrap.css',
      'client/lib/angular-autocomplete/style/autocomplete.css',
      'client/lib/angular-ui-grid/ui-grid.css',
    ])
    .pipe(concat('lib.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isProd, cssnano(), cssbeautify()))
    .pipe(gulp.dest('public/css'));
});

//collects custom css files and concat them
gulp.task('css-custom', function() {
  return gulp.src(['client/**/*.css','!client/lib/**/*'])
    .pipe(concat('custom.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isProd, cssnano(), cssbeautify()))
    .pipe(gulp.dest('public/css'));
});

// this task unite ng-modules and libs
gulp.task('css',['css-custom', 'css-lib'] ,function() {
  return gulp.src('public/css/lib.min.css')
    .pipe(add.append('public/css/custom.min.css'))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('public/css'));
});
