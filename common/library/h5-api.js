/**
 * h5 接口定义
 * add by gaoerjun
 * 本次接口基于VUE的http模块
 *
 */
// import authorization from './authorization'
import config from '../config/h5-config'
import cookie from '../tools/cookie'
import Vue from 'vue'
import VueResource from 'vue-resource';
import tools from "../tools/utils"
import {Tips} from "../tools/tips_st"

Vue.http.options.emulateJSON = true // 要注释掉这行，仅做参考，emulateJSON发送的是传统字符串，不是JSON
Vue.http.options.xhr = {withCredentials: true}
Vue.http.options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}

class API {
  constructor(options) {
    this.options = options; // api通用设置
    this._baseUri = options.baseUri || config.baseUri; // 服务器地址
    this._baseUriLoan = options.baseUri || config.baseUriLoan; // 服务器地址
    this._urls = {}; // 保存所有注册url
    this.map = {}; //保存所有key和url的map 和_url 保存的key value为相反值
    this.options.data = {gopToken: cookie.getCookie('token')}; //兼容老写法， 把token统一在api内获取
    this.authing = false;
  }

  /** [add regist]
   * @Author   高二军
   * @Date     2015-10-13
   * @param    {[string]}          name                     [api名称]
   * @param    {[string]}           url                      [api地址]
   * @param    {[json]}             options                  [api地址]
   *
   */

  regist(name, url, options) {

    var api = this;
    if (name in this) {
      return console.error('api名称' + name + '已存在!');
    }
    if (url in this._urls) {
      return console.error('该接口地址' + url + '已添加!');
    }
    this._urls[url] = name; // { '/voucher/myVoucherList' : 'getVoucher'};
    this.map[name] = url;
    options = options || {}; // 接口注册时的个别设置
    let $this = this;
    let postMethod = function (parmas, runTimeOptions = {}) { // 每个接口具体请
      let promise = new Promise(function (resolve, reject) {
        Object.assign(runTimeOptions, options);
        let currUrl = url.indexOf("//") >= 0 ? url : (options.flag ? ($this._baseUriLoan + url) : ($this._baseUri + url)); //这行别删
        // Object.assign(parmas, {source:"H5"});
        Vue.http.post(currUrl, parmas, runTimeOptions).then(response => {
          response.body = typeof response.body == 'string' ? JSON.parse(response.body) : response.body;//后台返回的数据有的是对象 有的是字符串
          response.body.code = response.body.code && response.body.code.slice(2);
          // get body data
          if (response.body.code == '202') {
            // authorization.go();
            $this.authing = true;
            window.location.replace('./login.html');
            return false;
          }
          resolve(response.body);
        }, response => {
          if (!$this.authing) {
            Tips("请求超时,请检查您的网络");
          }
          reject(response.body);
          return false;
        })
      })
      return promise;

    };
    let getMethod = function (parmas, runTimeOptions = {}) { // 每个接口具体请
      let promise = new Promise(function (resolve, reject) {
        Object.assign(runTimeOptions, options);
        let currUrl = url.indexOf("//") >= 0 ? url : (api._baseUri + url);
        let addParmasStr = tools.makeQueryStr(parmas);

        if (currUrl.indexOf("?") >= 0) {
          addParmasStr = "&" + addParmasStr.substring(1, addParmasStr.length - 1);
        }
        currUrl += addParmasStr;
        if ($this._urls[url] == "doproxy") { //特殊处理proxy的get请求
          currUrl = api._baseUri + url + "?reqParam=" + encodeURIComponent(JSON.stringify(parmas));
        }
        Vue.http.get(currUrl, runTimeOptions).then(response => {
          response.body.code = response.body.code && response.body.code.slice(2);
          // get body data
          if (response.body.code == '202') {
            // authorization.go();
            $this.authing = true;
            window.location.replace('./login.html');
            return false;
          }
          resolve(response.body);

        }, response => {
          if (!$this.authing) {
            Tips("请求超时,请检查您的网络");
          }
          reject(response.body);
          return false;
        })
      })
      return promise;
    }
    this[name] = postMethod;
    this[name]["get"] = getMethod;
    this[name]["post"] = postMethod;

  };
}


// var baseUri = '.'; // 同域
// let baseUri = config.baseUri; // http测试服务器

let api = new API({
  timeout: 3000
});

api.regist('getUserStatus', '/index/getUserStatus');

export default api;
