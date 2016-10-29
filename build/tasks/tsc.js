module.exports = function (gulp, $) {
  'use strict';

  var tsconfig = require('./../../tsconfig.json');

  gulp.task('tsc', function () {

    var tsSourcesResult = gulp.src(['src/**/*.ts'])
      .pipe($.sourcemaps.init())
      .pipe($.tsc(tsconfig.compilerOptions));

    var tsTestsResult = gulp.src(['test/**/*.ts'])
      .pipe($.sourcemaps.init())
      .pipe($.tsc(tsconfig.compilerOptions));

    var sources = tsSourcesResult.js
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./lib/src'));

    var tests = tsTestsResult.js
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./lib/test'));

      return $.merge(sources, tests);
  });
};