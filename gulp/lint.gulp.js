'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    fs = require('fs'),
    xml = require('xmlbuilder'),
    util = require('gulp-util'),
    path = require('path'),
    scsslint = require('gulp-scss-lint'),
    tslint = require('gulp-tslint'),
    htmlLint = require('gulp-htmllint'),
    _ = require('lodash');

function reportIssues(filename, issues, report, msgProperty, lineProperty, columnProperty) {
    var fileElement;
    if (issues.length > 0) {
        fileElement = report.ele('file');
        issues.forEach(function (issue) {
            var msg = _.get(issue, msgProperty),
                line = _.get(issue, lineProperty),
                column = _.get(issue, columnProperty);
            util.log(filename + ": " + util.colors.red(msg) + " line " + line + " col. " + column);
            fileElement.ele('error', {
                'message': msg,
                'line': line,
                'severity': 'error'
            });
        });
        fileElement.att('name', filename);
    }
}

gulp.task('create-target', function () {
    if (!fs.existsSync('target')) {
        fs.mkdirSync('target');
    }
});

gulp.task('lint-scss', ['create-target'], function () {
    var scssReport = xml.create('checkstyle'),
        config = {
            customReport: function (file) {
                reportIssues(file.path, file.scsslint.issues, scssReport, 'reason', 'line', 'column');
            },
            config: '.scss-lint.yml'
        },
        scssLintReportFile = fs.createWriteStream(path.join(gulp.config.paths.target.base, 'scss-lint-result.xml'));

    return gulp.src('app/**/*.scss')
    .pipe(scsslint(config))
    .on('end', function () {
        scssLintReportFile.write(scssReport.doc().end({pretty: true}));
        scssLintReportFile.end();
    });
});

gulp.task('lint-ts', ['create-target'], function () {
    var config = {configuration: 'tslint.json'},
        tsLintReportFile = fs.createWriteStream(path.join(gulp.config.paths.target.base, 'ts-lint-result.xml')),
        tsReport = xml.create('checkstyle');

    return gulp.src('app/**/*.ts')
    .on('end', function () {
        tsLintReportFile.write(tsReport.doc().end({pretty: true}));
        tsLintReportFile.end();
    })
    .pipe(tslint(config))
    .pipe(tslint.report(function (issues, file) {
        reportIssues(file.path, issues, tsReport, 'failure', 'startPosition.line', 'startPosition.position');
    }, {
        summarizeFailureOutput: true,
        emitError: false
    }));
});

gulp.task('lint-html', ['create-target'], function () {
    var config = {
            failOnError: false,
            config: '.htmllintrc'
        },
        htmlLintReportFile = fs.createWriteStream(path.join(gulp.config.paths.target.base, 'html-lint-result.xml')),
        htmlReport = xml.create('checkstyle');

    return gulp.src(['app/**/*.html', '!app/index.html'])
    .on('end', function () {
        htmlLintReportFile.write(htmlReport.doc().end({pretty: true}));
        htmlLintReportFile.end();
    })
    .pipe(htmlLint(config, function (filepath, issues) {
        reportIssues(filepath, issues, htmlReport, 'msg', 'line', 'column');
    }));
});

gulp.task('lint-js', ['create-target'], function () {
    return gulp.src(['gulpfile.js', 'gulp/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-index-html', function () {
    return gulp.src(gulp.config.paths.src.index)
    .pipe(htmlLint({
        failOnError: false,
        config: '.htmllintrc'
    }));
});
