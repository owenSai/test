import path from 'path';
import glob from "glob";
import sass from 'node-sass';
import "babel-polyfill";

const PUBLIC_PATH = '';
let webpack = require('webpack');

let COMMON_PATH = path.join(__dirname, './src/common');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
const PATH_FACTORY = './src/pages';
let jsPath = path.join(PATH_FACTORY, '/**/*.js');
let entrys = getJSEntry(jsPath);

module.exports = {

        entry: entrys,
        output: {
            path: path.resolve(__dirname, 'build'),
            publicPath: PUBLIC_PATH,
            filename: 'js/[name].js',
            chunkFilename: "js/[name].[chunkHash:6].js"
        },

        module: {
            loaders: [{
                test: /\.(jpe?g|png|gif)$/i,
                loaders: ['url?limit=6000&name=./images/[name].[ext]']
            }, {
                test: /\.(tpl|html)$/,
                loader: 'html-loader'
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.scss$/,
                // loader: 'style?sourceMap!css?sourceMap!sass?sourceMap!autoprefixer?{browsers:["last 2 versions"]}'
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-autoprefixer!postcss-loader!sass-loader', {
                    publicPath: "."
                })
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }, {
                test: /\.vue$/,
                loader: 'vue'
            }, {
                test: /\.(svg|woff|ttf|eot)$/i,
                loaders: [
                    'file-loader?name=font/[name].[ext]'
                ]
            }, {
                test: /\.(mp3|wav)$/,
                loader: "file-loader?name=audio/[name].[ext]"
            }],
            resolve: {
                root: path.resolve(__dirname, 'src'),
                modulesDirectorie: ['node_modules'],
                extensions: ['', '.js', '.css', '.scss', '.png', '.jpg', '.gif'],
                alias: {
                    // 'vue$': 'vue/dist/vue.common.js'
                }
            }
        },

        vue: {
            postcss: [
                require('autoprefixer')({
                    browsers: ['last 7 versions']
                })
            ],
            publicPath: "."
        },

        plugins: [
            new ExtractTextPlugin('./css/[name].css')
        ],

        externals: {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'vue-resource': 'VueResource'
        }
    }
    /**
     * 遍历page里面所有的js路径
     * @param globPath
     * @returns {{}}
     */
function getJSEntry(globPath) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;
    files = files.filter(function(url) {
        let pathInfo = path.parse(url);
        //只提取pagas下的第一级目录
        return url.indexOf("src/pages/" + pathInfo.name + "/" + pathInfo.base) >= 0;
    });
    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.normalize(path.join(dirname, basename));

        let dirArr = dirname.split('/');

        if (basename != dirArr[dirArr.length - 1]) {
            continue;
        }
        entries[basename] = ['babel-polyfill', './' + entry];
    }

    return entries;
}
