/**
 * Created by gaoerjun on 2017/3/17.
 */
var through = require('through2');
import replaceConfig from './repaceConfGrey';
function onlineReplace() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }
    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }
    var content = file.contents.toString();
    for(var i=0;i<replaceConfig.length;i++){
      content = content.replace(replaceConfig[i][0],replaceConfig[i][1]);
    }
    file.contents = new Buffer(content);
    this.push(file);
    cb();
  })
}

module.exports = onlineReplace;