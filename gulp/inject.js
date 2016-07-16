var gulp = require('gulp'),
    shell = require('gulp-shell'),
    add = require('gulp-add-src'),
    inject = require('gulp-inject');

gulp.task('dev-link', shell.task(['rm -f public/client', 'ln -s ../client public/client']));

gulp.task('inject-css', function() {
    var styles = gulp.src([
        'client/lib/bootstrap-css/css/bootstrap.css',
        'client/lib/angular-autocomplete/style/autocomplete.css',
      ], {read:false})
      .pipe(add.append([
        'client/**/*.css',
        '!client/lib/**/*'
      ]));

    return gulp.src('client/dev.html')
    .pipe(inject(styles))
    .pipe(gulp.dest('client'));
});

gulp.task('inject-js', function() {
  var scripts = gulp.src([
    'client/**/*module.js',
    '!client/app.js',
    '!client/lib/**'
  ], {read:false})
  .pipe(add.append([
    'client/**/*.js',
    '!client/**/*module.js',
    '!client/lib/**',
    '!client/app.js'
  ], {read:false}));

  return gulp.src('client/dev.html')
  .pipe(inject(scripts))
  .pipe(gulp.dest('client'));
});

gulp.task('inject-all',['inject-js', 'inject-css']);