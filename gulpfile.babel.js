
// import './gulpfile/clean';
// import './gulpfile/h5-common';
// import './gulpfile/h5-build';
// import './gulpfile/h5-public';
// import './gulpfile/h5-online';
// import './gulpfile/h5-qa';
// import './gulpfile/scp';


import log4js from 'log4js';
import requireDir from 'require-dir';

global.logger = log4js.getLogger();
requireDir('./gulp', { recurse: true });