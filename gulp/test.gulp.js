'use strict';

var gulp = require('gulp'),
    remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    _ = require('lodash'),
    fs = require('fs'),
    Server = require('karma').Server;

/**
* Remap test coverage report to typeScript with remap-istanbul.
*/
gulp.task('test', ['karma'], function () {
    return gulp.src('target/coverage.json')
        .pipe(remapIstanbul({
            reports: {
                'cobertura': 'target/cobertura-coverage.xml'
            }
        })
    );
});

/**
* Run all unit tests and generate initial coverage report.
*/
gulp.task('karma', ['build-ts-for-test'], function (done) {
    new Server({
        configFile: process.cwd() + '/karma.conf.js'
    }, done).start();
});

/**
* Compile TypeScript with tsc so we can get sourcemaps for remap-istanbul when making test coverage reports.
*/
gulp.task('build-ts-for-test', ['lint-ts'], function () {
    var tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')),
        options = { // These options are specific to gulp-typescript
            declarationFiles: true
        },
        tsProject = ts.createProject(_.merge(tsconfig.compilerOptions, options)),
        tsResult = gulp.src(['app/**/*.ts', 'typings/index.d.ts'])
            .pipe(sourcemaps.init())
            .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(tsconfig.compilerOptions.outDir));
});
