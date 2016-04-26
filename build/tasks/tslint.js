module.exports = function (gulp, $) {
  'use strict';

  gulp.task('tslint', function () {
    return gulp.src('./src/**/*.ts')
      .pipe($.tslint({
        configuration: './tslint.json'
      }))
      .pipe($.tslint.report('verbose', {
        summarizeFailureOutput: true,
        emitError: false
      }))
  });
};