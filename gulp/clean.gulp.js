'use strict';

var gulp = require('gulp'),
    del = require('del');

gulp.task('clean', function (done) {
    del(gulp.config.paths.target.base, done).then(function () {
        done();
    });
});
