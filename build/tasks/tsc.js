module.exports = function (gulp, $) {
  'use strict';

  var tsconfig = require('./../../tsconfig.json');

  gulp.task('tsc', function () {

    var tsSourcesResult = gulp.src(['./src/**/*.ts', './typings/main.d.ts'])
      .pipe($.sourcemaps.init())
      .pipe($.tsc(tsconfig));

    var tsTestsResult = gulp.src(['./test/**/*.ts', './typings/main.d.ts'])
      .pipe($.sourcemaps.init())
      .pipe($.tsc(tsconfig));

    var sources = tsSourcesResult.js
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./lib/src'));

    var tests = tsTestsResult.js
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('./lib/tests'));

      return $.merge(sources, tests);
  });
};