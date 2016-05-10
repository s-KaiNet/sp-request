module.exports = function (gulp, $) {
  'use strict';

  var tsconfig = require('./../../tsconfig.json');

gulp.task('clean', function () {
  return $.del(['./lib/**/*']);
});

  gulp.task('prepublish', ['clean'], function () {
    var tsSourcesResult = gulp.src(['./src/**/*.ts', './typings/main.d.ts'])
      .pipe($.tsc(tsconfig.compilerOptions));

    return tsSourcesResult.js
      .pipe(gulp.dest('./lib/src'));
  });
};