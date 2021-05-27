/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';

gulp.task('doc:dev', function () {
  return gulp.src('./src/common/doc/*')
    .pipe(gulp.dest('./build/doc'))
});

gulp.task('doc:prod', ['doc:dev'], function () {
  return gulp
    .src('./build/doc/*')
    .pipe(gulp.dest('./public/doc'));
});
gulp.task('doc:online', ['doc:dev'], function () {
  return gulp
    .src('./build/doc/*')
    .pipe(gulp.dest('./online/doc'));
});
