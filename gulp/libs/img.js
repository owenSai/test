/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/18
 */

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import md5 from 'gulp-md5-plus';
import webp from 'gulp-webp';
import filter from "gulp-filter";

import util from '../util';
gulp.task("img:base",function(){
    //将common里的图片全部拷贝到build文件下
  return gulp.src([
    './common/images/*'
  ])
    .pipe(util.removeDirname())
    .pipe(gulp.dest('./build/images'));
});


gulp.task('img:dev',["img:base"], function () {
  return gulp.src([
    './src/pages/**/images/*',
    './src/components/**/images/*',
    './common/components/**/images/*',
    './common/images/*'
    // './src/include/**/*.{png,gif,jpg,jpeg,ico}'
  ])
    .pipe(util.removeDirname())
    .pipe(filter(function (f) {
      return f.stat && f.stat.size >= 10000
    }))
    .pipe(gulp.dest('./build/images'));
});

gulp.task('img:server', function () {

  const reload = global.browserSync.reload;
  const files = [
    './src/pages/**/images/*.{png,gif,jpg,jpeg,ico}'
    // './src/include/**/*.{png,gif,jpg,jpeg,ico}'
  ];

  function todo(path = files) {
    return gulp.src(path)
      .pipe(util.removeDirname())
      .pipe(gulp.dest('./build/images'))
      .pipe(reload({stream: true}))
  }

  gulp.watch(files, function (event) {
    return todo(event.path);
  });

  return todo();

});

gulp.task('img:prod-min', ['img:dev'], function () {
  return gulp.src([
    './build/images/*'
  ])
    .pipe(imagemin())
    .pipe(md5(6, ['./public/*.html', './public/css/*.css', './public/js/*.js']))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('img:online-min', ['img:dev'], function () {
  return gulp.src([
    './build/images/*'
  ])
    .pipe(imagemin())
    .pipe(md5(6, ['./online/*.html', './online/css/*.css', './online/js/*.js']))
    .pipe(gulp.dest('./online/images'));
});

// 图片生成之后, 立即生成对应的webp格式的图片
gulp.task('img:prod-webp', ['img:prod-min'], function () {
  return gulp.src('./build/images/*.{png,jpg,jpeg,ico}')
    .pipe(webp())
    .pipe(md5(6, ['./public/*.html', './public/css/*.css', './public/js/*.js']))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('img:online-webp', ['img:online-min'], function () {
  return gulp.src('./build/images/*.{png,jpg,jpeg,ico}')
    .pipe(webp())
    .pipe(md5(6, ['./online/*.html', './online/css/*.css', './online/js/*.js']))
    .pipe(gulp.dest('./online/images'));
});

gulp.task('img:prod', ['img:prod-webp']);
gulp.task('img:online', ['img:online-webp']);
