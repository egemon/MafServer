var gulp = require('gulp');
var guppy = require('git-guppy')(gulp);
var shell = require('gulp-shell');

gulp.task('pre-push', guppy.src('pre-push', function(files, originArray, func) {
    console.log('args = ', arguments);
    return shell(['scp -r  5649a2480c1e66bce900006c@bs-mafiaclub.rhcloud.com:app-root/runtime/repo/data-base/ ./']);
}));