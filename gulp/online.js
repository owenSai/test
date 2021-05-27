/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import sequence from 'gulp-sequence';

gulp.task('online', sequence(
    ['clean:dev', 'clean:prod','clean:online'],
    'html:online',
    'js:online',
    'scss:online',
    'doc:online',
    ['img:online', 'font:online']
));