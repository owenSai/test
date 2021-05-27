/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import webpcss from 'gulp-webpcss';
import md5 from 'gulp-md5-plus';
import glob from 'glob';
import util from '../util';
let webpack = require('webpack')
import path from 'path';


gulp.task('scss:dev',function () {
    let currfile = './common/scss/common.scss';
    return gulp
      .src(currfile)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./build/css'));
});

// gulp.task('scss:server', function () {
//     const reload = global.browserSync.reload;
//     function todo(localpath){
//         if(!localpath){
//             return gulp;
//         }
//         console.log(localpath);
//         let mainpath = localpath.match(/\/pages\/(\w+)\//)[1];
//         let entryPath = localpath.replace(/\/pages\/.*/,"/pages/"+mainpath+"/"+mainpath+".js");
//         entryPath = entryPath.replace(/^[\w|\/|\-]+src/,"./src");
//         console.log("entryPath=="+entryPath);
//         let entrys = {};
//         entrys[mainpath]= [entryPath];
//         console.log(entrys);
//         let config = webpackServerConfig;
//         config.entry = entrys
//         console.log(config);
//         // return gulp.src(entryPath)
//         //   .pipe(webpack(config))
//         //   .pipe(gulp.dest('../../build/js'))
//         //   .pipe(reload({
//         //       stream: true
//         //   }));
//
//         return gulp ;
//
//     }
//     // todo :还待完善server
//     // gulp.watch([
//     //     './src/pages/**/*.scss',
//     // ], function (event) {
//     //     let localpath = event.path;
//     //     return todo(localpath)
//     // });
//
//     return todo();
//
// });

gulp.task('scss:prod', ['scss:dev'], function () {
    return gulp.src('./build/css/*.css')
        .pipe(webpcss())
        .pipe(cleanCSS())
        .pipe(md5(6, './public/*.html'))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('scss:online', ['scss:dev'], function () {
    return gulp.src('./build/css/*.css')
        .pipe(webpcss())
        .pipe(cleanCSS())
        .pipe(md5(6, './online/*.html'))
        .pipe(gulp.dest('./online/css'));
});