var gulp = require('gulp'),
    config = require('./../package').config,
    add = require('gulp-add-src'),
    runSequence = require('run-sequence'),
    inject = require('gulp-inject');

gulp.task('inject-css', function() {
    var styles = gulp.src([
        'client/lib/bootstrap-css/css/bootstrap.css',
        'client/lib/angular-ui-grid/ui-grid.css',
      ], {read:false})
      .pipe(add.append([
        'client/**/*.css',
        '!client/lib/**/*'
      ]));

    return gulp.src('client/dev.html')
    .pipe(inject(styles, {
      relative: true,
    }))
    .pipe(gulp.dest('client'));
});

gulp.task('inject-js', function() {
  var scripts = gulp.src(config.libs.js, {read:false})
    .pipe(add.append([
        'client/**/*module.js',
    ], {read:false}))
    .pipe(add.append([
    'client/**/*.js',
    '!client/**/*module.js',
    '!client/lib/**',
  ], {read:false}));

  return gulp.src('client/dev.html')
  .pipe(inject(scripts, {
    relative: true
  }))
  .pipe(gulp.dest('client'));
});

gulp.task('inject',['inject-js'] ,function () {
  runSequence('inject-css');
});