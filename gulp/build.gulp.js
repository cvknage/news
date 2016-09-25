'use strict';

var gulp = require('gulp'),
    filter = require('gulp-filter'),
    flatten = require('gulp-flatten'),
    gulpInject = require('gulp-inject'),
    htmlmin = require('gulp-htmlmin'),
    naturalSort = require('gulp-natural-sort'),
    ngHtml2js = require('gulp-ng-html2js'),
    path = require('path'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    util = require('gulp-util'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    tsify = require('tsify'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    csso = require('gulp-csso'),
    ngAnnotate = require('gulp-ng-annotate'),
    glob = require('glob');

gulp.task('build', ['inject', 'images', 'fonts', 'resources']);
gulp.task('inject', ['inject-js', 'inject-styles', 'inject-partials', 'modernizr']);

gulp.task('inject-vendor-styles', function () {
    return gulp.src(gulp.config.paths.src.index)
    .pipe(gulpInject(gulp.src([
        'node_modules/angular-material/angular-material.css'
    ], {read: false}), {
        starttag: '<!-- node_modules:css -->',
        relative: true
    }))
    .pipe(gulp.dest(gulp.config.paths.src.app));
});

gulp.task('inject-styles', ['styles', 'inject-vendor-styles'], function () {
    return gulp.src(gulp.config.paths.src.index)
    .pipe(gulpInject(gulp.src(path.join(gulp.config.paths.target.tmp.styles, '**/*.css'), {read: false}), {relative: true}))
    .pipe(gulp.dest(gulp.config.paths.src.app));
});

gulp.task('styles', ['lint-scss'], function () {
    return gulp.src(gulp.config.paths.src.scss)
    .pipe(sass())
    .pipe(gulp.dest(gulp.config.paths.target.tmp.styles));
});

gulp.task('inject-partials', ['partials'], function () {
    return gulp.src(gulp.config.paths.src.index)
    .pipe(gulpInject(
        gulp.src(path.join(gulp.config.paths.target.tmp.partials, '**/*.js'))
        .pipe(naturalSort()),
        {
            starttag: '<!-- inject:partials -->',
            relative: true
        }
    ))
    .pipe(gulp.dest(gulp.config.paths.src.app));
});

gulp.task('partials', ['lint-html'], function () {
    return gulp.src(['app/**/*.html', '!app/index.html'])
    .pipe(htmlmin({
        removeComments: true,
        removeEmptyAttributes: true,
        removeCommentsFromCDATA: true,
        collapseWhitespaces: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: false,
        collapseInlineTagWhitespace: true,
        removeTagWhitespace: true,
        caseSensitive: true
    }))
    .pipe(ngHtml2js({
        moduleName: gulp.config.app.module
    }))
    .pipe(gulp.dest(gulp.config.paths.target.tmp.partials))
    .pipe(size());
});

gulp.task('inject-js', ['build-ts'], function () {
    return gulp.src(gulp.config.paths.src.index)
    .pipe(gulpInject(
        gulp.src([
            gulp.config.paths.target.tmp.js + '/**/*.js'
        ])
        .pipe(naturalSort()),
        {
            relative: true
        }
    ))
    .pipe(gulp.dest(gulp.config.paths.src.app));
});

gulp.task('fonts', function () {
    var foldersToScan = [
            'node_modules/material-design-icons-iconfont'
        ],
        folders = foldersToScan.map(function (folder) {
            util.log('extracting fonts from ' + folder);
            return path.join(process.cwd(), folder, '**/*');
        });

    return gulp.src(folders)
    .pipe(filter(gulp.config.paths.src.fonts))
    .pipe(flatten())
    .pipe(gulp.dest(gulp.config.paths.target.tmp.fonts))
    .pipe(gulp.dest(gulp.config.paths.target.dist.fonts))
    .pipe(size());
});

gulp.task('images', function () {
    return gulp.src(gulp.config.paths.src.img)
    .pipe(gulp.dest(gulp.config.paths.target.tmp.img))
    .pipe(gulp.dest(gulp.config.paths.target.dist.img))
    .pipe(size());
});

gulp.task('resources', function () {
    return gulp.src(gulp.config.paths.src.resources)
    .pipe(gulp.dest(gulp.config.paths.target.tmp.resources))
    .pipe(gulp.dest(gulp.config.paths.target.dist.resources))
    .pipe(size());
});

/**
* Compile TypeScript with inline sourcemaps for application use.
*/
gulp.task('build-ts', ['test'], function () {
    var files = glob.sync('app/**/*.ts', { ignore: 'app/**/*_test.ts' });
    return browserify({
        basedir: '.',
        debug: true,
        entries: files,
        cache: {},
        packageCache: {}
    })
    .add('typings/index.d.ts')
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(gulp.config.paths.target.tmp.js));
});

gulp.task('package', ['build'], function () {
    var htmlFilter = filter('*.html', {restore: true}),
        jsFilter = filter('**/*.js', {restore: true}),
        cssFilter = filter('**/*.css', {restore: true}),
        filesToRevFilter = filter(['**/*.js', '**/*.css'], {restore: true});

    return gulp.src(gulp.config.paths.src.index)
        .pipe(useref())
        .pipe(filesToRevFilter)
        .pipe(rev())
        .pipe(filesToRevFilter.restore)
        .pipe(jsFilter)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(revReplace())
        .pipe(htmlFilter)
        .pipe(htmlmin({
            removeComments: true,
            removeEmptyAttributes: true,
            removeCommentsFromCDATA: true,
            collapseWhitespaces: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: false,
            collapseInlineTagWhitespace: true,
            removeTagWhitespace: true,
            caseSensitive: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(gulp.config.paths.target.dist.base))
        .pipe(size());
});
