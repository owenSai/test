/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import md5 from 'gulp-md5-plus';

gulp.task('font:dev', function () {
    return gulp.src([
        './common/font/*.*',
        '!./common/font/*.scss'
    ])
        .pipe(gulp.dest('./build/font'));
});

gulp.task('font:server', ['font:dev'], function () {
    const files = [
        './common/font/*.*',
        '!./common/font/*.scss'
    ];
    const reload = global.browserSync.reload;

    /**
     * 当font.scss文件发生变化
     *  1.复制字体
     *  2.重新编译scss
     */
    gulp.watch(files, function (event) {
        return gulp.src(files)
            .pipe(gulp.dest('./build/font'))
            .pipe(reload({stream: true}));
    });
});

gulp.task('font:prod', ['font:dev'], function () {
    return gulp.src([
        './build/font/*.*'
    ])
        .pipe(md5(6, './public/css/*.css'))
        .pipe(gulp.dest('./public/font'));
});

gulp.task('font:online', ['font:dev'], function () {
    return gulp.src([
        './build/font/*.*'
    ]).pipe(md5(6, './online/css/*.css'))
        .pipe(gulp.dest('./online/font'));
});
