var isProd = require('../conf.js').isProd;
var gulp = require('gulp'),
    _if = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    htmlmin = require('gulp-htmlmin');

// ============ ASSESTS TASK ============
// copies fonts from src to dest
gulp.task('font', function () {
    return gulp.src(['client/fonts/**'])
    .pipe(gulp.dest('public/fonts'));
});

// this task minify images
gulp.task('img', function() {
  return gulp.src('client/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/img'));
});

// minifies html
gulp.task('html', function () {
    return gulp.src(['client/app.html'])
    .pipe(_if(isProd, htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('public'));
});

gulp.task('favicon', function() {
    return gulp.src('client/favicon.ico')
      .pipe(gulp.dest('public/'));
});