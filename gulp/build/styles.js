var isDev = process.env.NODE_ENV !== 'production';
console.log('isDev', isDev);
var gulp = require('gulp'),
    config = require('./../../package').config,
    cssnano = require('gulp-cssnano'),
    _if = require('gulp-if'),
    add = require('gulp-add-src'),
    cssbeautify = require('gulp-cssbeautify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

// ======================  STYLES  ====================

//collects lib css files and concat them
gulp.task('css-lib', function() {
  return gulp.src(config.libs.css)
    .pipe(concat('lib.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isDev, cssbeautify(),cssnano()))
    .pipe(gulp.dest('public/css'));
});

//collects custom css files and concat them
gulp.task('css-custom', function() {
  return gulp.src(['client/**/*.css','!client/lib/**/*'])
    .pipe(concat('custom.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(_if(isDev, cssbeautify(),cssnano()))
    .pipe(gulp.dest('public/css'));
});

// this task unite ng-modules and libs
gulp.task('css',['css-custom', 'css-lib'] ,function() {
  return gulp.src('public/css/lib.min.css')
    .pipe(add.append('public/css/custom.min.css'))
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('public/css'));
});
