'use strict';

var gulp = require('gulp');

// Set the config to use across the gulp build.
gulp.config = {
    app: {
        module: 'typeScriptTest'
    },
    paths: {
        src: {
            app: 'app',
            index: 'app/index.html',
            scss: 'app/app.scss',
            img: 'app/**/images/**/*',
            resources: 'app/resources/**/*',
            fonts: '**/*.{eot,ttf,woff,woff2}'
        },
        target: {
            base: 'target',
            tmp: {
                base: 'target/tmp',
                js: 'target/tmp/js',
                partials: 'target/tmp/partials',
                styles: 'target/tmp/styles',
                resources: 'target/tmp/resources',
                fonts: 'target/tmp/fonts',
                img: 'target/tmp/images'
            },
            dist: {
                base: 'target/dist',
                resources: 'target/dist/resources',
                fonts: 'target/dist/fonts',
                img: 'target/dist/images'
            }
        }
    }
};

// Require all our gulp files, which each register their tasks when called
require('require-dir')('./gulp');

// Register dafault gulp task
gulp.task('default', ['build', 'watch', 'server', 'lint-js']);

gulp.task('dist', ['package']);
