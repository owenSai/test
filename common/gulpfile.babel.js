// 张树垚 2015-09-21 16:37:50 创建
// gulp -- 我是工人阶级
import sequence from 'gulp-sequence';
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var gulp = require('gulp');
var path = require('path');
// 将svg文件生成font文件
gulp.task('h5-build-svg2font', function () {
    let svg = './svg/*.svg';
    let fontName = 'iconfont';
    return gulp.src(svg)
        .pipe(iconfontCss({
            fontName: fontName,
            path: './font/template.scss',
            targetPath: './font.scss',
            fontPath: '../font/'
        }))
        .pipe(iconfont({
            fontName: fontName, // required
            prependUnicode: true, // recommended option
            formats: ['ttf', 'eot', 'woff', 'svg'], // default, 'woff2' and 'svg' are available
            timestamp: new Date().getTime()
        }))
        .pipe(gulp.dest(path.join('./', '/font')));
});
gulp.task('h5-move-fontfile', function () {
    return gulp.src(["./font/iconfont.eot","./font/iconfont.svg","./font/iconfont.ttf","./font/iconfont.woff"])
        .pipe(gulp.dest('./components/font'));
});

gulp.task('h5-font',sequence('h5-build-svg2font','h5-move-fontfile'));