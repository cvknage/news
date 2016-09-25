'use strict';

var istanbul = require('browserify-istanbul'),
    fs = require('fs'),
    tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')),
    jsFiles = tsconfig.compilerOptions.outDir + '/**/*.js';

module.exports = function (config) {
    var options = {
        basePath: '',
        frameworks: ['browserify', 'jasmine'],
        files: [
            jsFiles
        ],
        reporters: ['progress', 'junit', 'coverage'],
        junitReporter: {
            outputDir: 'target',
            outputFile: 'test-results.xml',
            suite: '',
            useBrowserName: false
        },
        coverageReporter: {
            type: 'json',
            dir: 'target',
            file: 'coverage.json',
            subdir: '.'
        },
        port: 9876,
        colors: true,
        logLevel: 'info',
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        preprocessors: {},
        browserify: {
            debug: true,
            transform: [
                istanbul({
                    ignore: ['**/*_test.js']
                })
            ]
        },
        singleRun: true,
        plugins: [
            'karma-jasmine',
            'karma-browserify',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-phantomjs-launcher'
        ]
    };

    // Add this preprocessor here so we can use a dynamic key.
    options.preprocessors[jsFiles] = ['browserify'];

    config.set(options);
};
