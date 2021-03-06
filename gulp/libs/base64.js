/**
 * Created by gaoerjun on 2017/3/17.
 */
var path = require('path');
var fs = require('fs');
var through = require('through2');


function toBase64(options) {
  var opts = options || {};
  var rule = opts.rule || /url\([^\)]+\)/g;
  var initFileType = opts.filetype || 'html';
  var baseDir = opts.baseDir || __dirname;
  var fileMaxSize =  opts.fileMinSize || 10000;

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
    var images = content.match(rule);
    var currentPath = baseDir;
    if (images) {
      images.forEach(function (item) {
        var filepath = fs.realpathSync(path.join(currentPath, item));
        var extname = path.extname(item).slice(1);
        var imageContent = new Buffer(fs.readFileSync(filepath));
        console.log("imageContent == "+imageContent.length+" fileMaxSize=="+fileMaxSize);
        if(imageContent.length <fileMaxSize){

          imageContent = imageContent.toString('base64');
          if (initFileType === 'css') {
            content = content.replace(item, 'url(\'data:image/' + extname.toLowerCase() + ';base64,' + imageContent + '\')');
          }
          else {
            content = content.replace(item, 'data:image/' + extname.toLowerCase() + ';base64,' + imageContent);
          }
        }
      });
    }
    file.contents = new Buffer(content);
    this.push(file);

    cb();
  })
}

module.exports = toBase64;