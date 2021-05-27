/**
 * @file
 * @auth jinguangguo
 * @date 2016/8/29
 */

import gulp from 'gulp';
import scp2 from 'gulp-scp2';
import log4js from 'log4js';

const logger = log4js.getLogger();

const SERVER_HOST_TEST = '172.16.33.10';
const PORT = 9422;
const USERNAME = 'root';
const PASSWORD = 'woaichipingguo';

gulp.task('scp:wx',['prod'], () => {
    const WX_PATH = 'wx/ashare/';
    return gulp.src('./public/**/*')
        .pipe(scp2({
            host: SERVER_HOST_TEST,
            port: PORT,
            username: USERNAME,
            password: PASSWORD,
            dest: `/opt/static/${WX_PATH}`,
            watch: () => {
                logger.info(`[scp to ${WX_PATH}] file changed...`);
                // TODO 可以实时检测public文件中的变化, 然后直接push到远程
                // 在测试机自己独享的情况下使用比较好
            }
        }))
        .on('error', function(err) {
            logger.error(err);
        });
});

gulp.task('scp:t_wx', ['prod'], () => {
    const TWX_PATH = 't_wx/';
    return gulp.src('./public/**/*')
        .pipe(scp2({
            host: SERVER_HOST_TEST,
            port: PORT,
            username: USERNAME,
            password: PASSWORD,
            dest: `/opt/static/${TWX_PATH}`,
            watch: () => {
                logger.info(`[scp to ${TWX_PATH}] file changed...`);
            }
        }))
        .on('error', function(err) {
            logger.error(err);
        });
});


gulp.task('scp', ['scp:wx', 'scp:t_wx']);


