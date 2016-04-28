module.exports = function (gulp, $) {
  'use strict';

  var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

  gulp.task('test', function (callback) {
    $.rns('tsc', 'postcoverage', callback);
  });

  gulp.task('postcoverage', ['testonly'], function () {
    return gulp.src('./coverage/html/coverage-final.json')
      .pipe(remapIstanbul({
        reports: {
          'html': 'coverage/html-remap'
        }
      }));
  });

  gulp.task('testonly', ['pre-test'], function () {
    return gulp.src('./lib/tests/tests.js', { read: false })
      .pipe($.plumber())
      .pipe($.mocha({ reporter: 'list' }))
      .pipe($.istanbul.writeReports({
        dir: './coverage/html',
        reporters: ['json', 'html'],
        reportOpts: { dir: './coverage/html' }
      }));
  });

  gulp.task('pre-test', function () {
    return gulp.src(['./lib/src/**/*.js', '!./lib/src/index.js'])
      .pipe($.istanbul({
        includeUntested: true
      }))
      .pipe($.istanbul.hookRequire());
  });
};
