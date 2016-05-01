module.exports = function (gulp, $) {
  'use strict';

  var emitError = !!$.yargs.argv.emitError;

  gulp.task('cov', function () {
    process.env.COVERALLS_REPO_TOKEN = 'WlMegsEpUTalQIGLOXr9CqQsXUjTYjimd';
    return gulp.src('./reports/coverage/lcov.info')
      .pipe($.coveralls({ filepath: "src" }));
  });
};