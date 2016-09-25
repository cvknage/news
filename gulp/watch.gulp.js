'use strict';

var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['app/**/*.ts', '!app/**/*_test.ts'], ['reload-js']);
    gulp.watch(['app/**/*_test.ts'], ['test']);
    gulp.watch(['app/index.html', 'app/**/*.html'], ['reload-partials']);
    gulp.watch(['app/**/*.scss'], ['reload-styles']);
});

gulp.task('reload-js', ['inject-js'], function () {
    livereload.reload();
});
gulp.task('reload-partials', ['inject-partials'], function () {
    livereload.reload();
});
gulp.task('reload-styles', ['inject-styles'], function () {
    livereload.reload('*.css');
});
