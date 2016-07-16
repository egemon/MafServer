require('bluebird');
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    del = require('del'),
    requireDir = require('require-dir');
var tasks = requireDir('./gulp', {recurse: true});

//  ====================== GENERAL ===============
gulp.task('clean', function() {
    return del(['public']);
});
gulp.task('dev-build', ['inject-all']);
gulp.task('build',['js', 'css', 'img', 'favicon', 'html', 'font']);
gulp.task('serve', ['dev-build'] ,function () {
    runSequence('watch', 'init-browser');
});
gulp.task('default',['clean'],function() {
    return runSequence('serve');
});


