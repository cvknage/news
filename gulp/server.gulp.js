'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect');

gulp.task('server', function () {
    console.log(process.cwd());
    connect.server({
        root: ['app', process.cwd()],
        port: 8080,
        host: 'localhost',
        livereload: true
    });
});
