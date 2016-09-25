'use strict';

var gulp = require('gulp'),
    modernizr = require('gulp-modernizr'),
    path = require('path');

gulp.task('modernizr', function () {
    return gulp.src([
        path.join(gulp.config.paths.src.app, '**/*.css'),
        path.join(gulp.config.paths.src.app, '**/*.scss'),
        path.join(gulp.config.paths.target.tmp.js, '**/*.js'),
        '!' + path.join(gulp.config.paths.target.tmp.js, 'modernizr.js')
        // '!target/tmp/js/'
    ])
    .pipe(modernizr('modernizr.js', {
        options: [
            'addTest',
            'html5printshiv',
            'testProp',
            'fnBind',
            'setClasses'
        ],
        'feature-detects': []
    }))
    .pipe(gulp.dest(gulp.config.paths.target.tmp.js));
});
