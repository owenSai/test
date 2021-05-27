/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import clean from 'gulp-clean';

gulp.task('clean:dev', () => {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

gulp.task('clean:prod', () => {
    return gulp.src('./public', {read: false})
        .pipe(clean());
});

gulp.task('clean:online', () => {
    return gulp.src('./online', {read: false})
        .pipe(clean());
});