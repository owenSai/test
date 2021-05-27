/**
 * @file
 * @auth jinguangguo
 * @date 2016/10/17
 */

import gulp from 'gulp';
import include from 'gulp-file-include';
import replace from 'gulp-replace';
import minifyHtml from 'gulp-htmlmin';
import glob from "glob";
import util from "../util";
import path from 'path';

var base64 = require("./base64");
var htmlcpr = require('gulp-htmlcpr');
gulp.task("html:moveImg",function(){
  let currfiles = glob.sync('./src/pages/**/*.html');
  currfiles = currfiles.filter(function (path) {
    let pathInfo = util.getFileInfo(path);
    //只提取pagas下的第一级目录
    return path.indexOf("src/pages/"+pathInfo.fileName+"/"+pathInfo.fileName+"."+pathInfo.fileType)>=0;
  });
  return gulp.src(currfiles)
    .pipe(htmlcpr({
      skipFn:function(_url,filePath){
        var reg = /\.(png|jpg|jpeg|gif)$/g;
        return !reg.test(_url);
      },
      overwritePath:function(filePathFromBase){
        return path.join('images/', path.basename(filePathFromBase));
      }
    })).pipe(gulp.dest('./build'))
})
gulp.task('html:dev',["html:moveImg"], function () {
  let currfiles = glob.sync('./src/pages/**/*.html');
  currfiles = currfiles.filter(function (path) {
    let pathInfo = util.getFileInfo(path);
    //只提取pagas下的第一级目录
    return path.indexOf("src/pages/"+pathInfo.fileName+"/"+pathInfo.fileName+"."+pathInfo.fileType)>=0;
  });
  return gulp.src(currfiles)
    .pipe(include())
    .pipe(replace('scss', 'css'))
    .pipe(base64({
      baseDir: 'build',
      fileType: 'html',
      rule: /(.\/)?images\/\w+(\-\w+)?.png/g,
      fileMinSize:10000
    }))
    .pipe(minifyHtml({
      minifyCSS:true,
      minifyJS:true,
      removeComments:true,
      removeTagWhitespace:true,
      collapseWhitespace:true
    }))
    .pipe(gulp.dest('./build'))
});
gulp.task('html:server', function () {

  const reload = global.browserSync.reload;
  const files = './src/*.html';
  let currfiles = glob.sync('./src/pages/**/*.html');
  currfiles = currfiles.filter(function (path) {
    let pathInfo = util.getFileInfo(path);
    //只提取pagas下的第一级目录
    return path.indexOf("./src/pages/"+pathInfo.fileName+"/"+pathInfo.fileName+"."+pathInfo.fileType)>=0;
  });
  function todo(path = currfiles) {
    return gulp.src(path)
      .pipe(include())
      .pipe(replace('scss', 'css'))
      .pipe(gulp.dest('./build'))
      .pipe(reload({stream: true}))
  }

  gulp.watch([
    './src/include/*.html',
    './src/pages/**/*.html'
  ], function (event) {
    let path = event.path;

    if (path.indexOf('include') >= 0) {
      todo();
    } else if(path.indexOf("/module/")>0) {
      //修改入口的js文件
      let tempPath = path.replace(/\.\/src\/pages\/(\w+)\/(.+)$/g,"./src/pages/$1/$1.html");
      return todo(tempPath);
    }else{
      return todo(path);
    }
  });
  return todo();
});

gulp.task('html:prod', ['html:dev'], function () {
  return gulp.src('./build/*.html')
    .pipe(minifyHtml({
      empty: true, // 保留空属性
      cdata: false, // 保留scripts标签的CDATA
      comments: false, // 保留注释
      conditionals: true, // 保留条件语句
      spare: true, // 保留多余属性
      quotes: true, // 保留所有引用
      loose: false // 保留1个空白符
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('html:online', ['html:prod'], function () {
  return gulp.src('./public/*.html')
    .pipe(replace('1260054327', '1259998164'))
    .pipe(replace('9522e9785fec3e7c', 'bb54870207537ffc'))
    .pipe(replace('http://www.goopal1.com', 'https://www.guorenbao.com'))
    .pipe(replace('www.goopal1.com', 'www.guorenbao.com'))
    .pipe(replace('app.goopal1.com', 'app.objectonly.cn'))
    .pipe(replace('activity.goopal1.com', 'huodong.objectonly.com'))
    .pipe(gulp.dest('./online'));
});