/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import webpack from 'gulp-webpack';
import uglify from 'gulp-uglify';
import md5 from 'gulp-md5-plus';
import webpackConfig from '../../webpack.config.babel';
import gutil from 'gulp-util';
import util from '../util';
import glob from "glob";
import replace from 'gulp-replace';
import sequence from 'gulp-sequence';
import onlineReplace from "../../common/gulp-common/onlineReplace";

gulp.task('dep:dev', function () {
  return gulp.src('./common/dep/*')
    .pipe(gulp.dest('./build/dep'))
});

gulp.task('js:dev', ['dep:dev'], function () {
  let currfiles = glob.sync('./src/pages/**/*.js');
  currfiles = currfiles.filter(function (path) {
    let pathInfo = util.getFileInfo(path);
    //只提取pagas下的第一级目录
    return path.indexOf("./src/pages/" + pathInfo.fileName + "/" + pathInfo.fileName + "." + pathInfo.fileType) >= 0;
  });
  return gulp.src(currfiles)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./build'));
});

gulp.task('js:server', function () {
  return gulp;
});

gulp.task('dep-min', ['dep:dev'], function () {
  return gulp
    .src('./build/dep/*.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./public/dep'));
});
gulp.task("js:scp-chunk",["js:dev"], function () {
  return gulp
    .src("./build/**/*.chunk.*.js")
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./public'));
})

gulp.task('js:prod', ["js:scp-chunk"], function () {
  return gulp
    .src(['./build/**/*.js', "!./build/**/*.chunk.*.js"])
    .pipe(uglify().on('error', gutil.log))
    .pipe(md5(6, './public/*.html'))
    .pipe(gulp.dest('./public'));
});
gulp.task('js:online:chunk', ["js:dev"], function () {
  return gulp
    .src("./build/**/*.chunk.*.js")
    .pipe(onlineReplace())
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./online'));
});

gulp.task('js:online', ['js:online:chunk'], function () {
  return gulp
    .src(['./build/**/*.js', "!./build/**/*.chunk.*.js"])
    .pipe(onlineReplace())
    .pipe(uglify().on('error', gutil.log))
    .pipe(md5(6, './online/*.html'))
    .pipe(gulp.dest('./online'));
});