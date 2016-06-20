var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    browserSync = browserSync.create();

gulp.task('init-browser', function() {
  browserSync.init({
    proxy: 'localhost:8080'
  });

});

function injectChanges(event) {
  console.log('change', arguments);
  return gulp.src(event.path)
    .pipe(browserSync.stream());
}

// WATCH
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('client/**/*.css', injectChanges);

  // Watch .js files
  gulp.watch('client/**/*.js', injectChanges);

  // Watch tmpls html files
  gulp.watch(['client/components/**/*.html', 'client/pages/**/*.html'], ['tmpls']);

});