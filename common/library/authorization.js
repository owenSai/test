// 张树垚 2015-12-27 16:23:25 创建
// H5微信端 --- 微信授权链接

import get from '../tools/get'
import url from '../tools/url'
import config from '../config/h5-config'
import Cookie from '../tools/cookie';
import platform from "../tools/platform";
import gotoAPPAuth from "./appCompat";

var isAuthing = false;

export default {
  go: function () {
    if(isAuthing){
        return ;
    }
    isAuthing = true;
    if(platform.isAPP){ //如果是APP则调用app的授权
      gotoAPPAuth();
      return false;
    }
    // h5 通过微信授权页面
    let locationPath = location.pathname;
    let pathArr =locationPath.split("/");
    let basePath = pathArr.length>=2?pathArr[1]:pathArr[0];

    var redirectUrl = "http://www.goopal1.com/"+basePath+"/" ;
    Cookie.setCookie("redirectUrl", location.href);
    for (var i = 0; i < 10; i++) {
      var stateObj = {foo: "bar" + i};
      history.pushState(stateObj, "page " + i, "./home.html");
    }
    var authUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.appid + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
    setTimeout(function () {
      window.location.href = authUrl;
    }, 100);
  },
  getInfoDate: function () { // info 特有的参数
    return '?from=' + cookie.getCookie('from') + '&type=' +cookie.getCookie('type') + '&id=' + cookie.getCookie('id');
  },
  get: function () { // 获取回跳后要跳转的链接
    var state = (get.data.state || '').trim().toLowerCase();
    // alert(state);
    // info  home state
    switch (state) {
      case '': // 为空
      case 'index': // 为首页
      case 'state': // 为默认
        state = 'home';
    }
    // alert(state === 'info' ? './' + state + '.html' + this.getInfoDate() : './' + state + '.html');
    return state === 'info' ? './' + state + '.html' + this.getInfoDate() : './' + state + '.html';
  },
  goGet: function () { // 进入回跳后要跳转的链接   已经授权绑定'
    var redirectUrl = Cookie.getCookie("redirectUrl");
    Cookie.setCookie("redirectUrl",null);
    if(!redirectUrl || redirectUrl.indexOf("http://www.goopal1.com")!=0 || redirectUrl.indexOf("index.html")>0){
        location.href = "http://www.goopal1.com/wx/home.html";
        return ;
    }
    if (redirectUrl && redirectUrl.indexOf("home.html") <0) {
      for (var i = 0; i < 10; i++) {
        var stateObj = {foo: "bar" + i};
        history.pushState(stateObj, "page " + i, "./home.html");
      }
    }
    window.location.href = redirectUrl;
  },
}