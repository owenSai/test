// 张树垚 2016-01-10 18:07:06 创建
// H5微信端 --- 微信分享
import api from './h5-api';
import url from '../tools/url';
import cookie from '../tools/cookie.js';
import authorization from "./authorization";

var uahref = window.location.href;
var ua = navigator.userAgent.toLowerCase();
var whitePageList = [
  "discovery", "about-us", "agreement", "app-support", "app-support-answer", "app-register", "app-landingpage", "home", "invite-registered", "invite-registered", "invite-registered2-wx", "invite-detail", "experience-gop", "invite-poster", "gift-exchange","bonus"
]
var testReg = new RegExp(whitePageList.join("|"), "g");
if (ua.match(/MicroMessenger/i) == "micromessenger" || uahref.match(testReg)) {
  //威信 及ios and打开
} else {
  authorization.go();
}


var gopToken = cookie.getCookie('gopToken');
// var base = 'www.goopal.com.cn/wx'; // 地址
var path = location.pathname;
var rootPatharr = path.split("/");
var pathName = rootPatharr.length > 1 ? rootPatharr[1] : 'wx';
var base = 'www.goopal1.com/' + pathName; // 地址
var weixin = {
  // 参数
  appId: null,
  timestamp: null,
  nonceStr: null,
  signature: null,
  title: '我是果小萌,我在果仁宝已赚嗨,送你1000元体验金',
  desc: '果仁宝会生钱的未来钱包，近30天年涨跌幅为：+12.80%',
  link: 'http://activity.goopal1.com/wx/invite-index.html',
  imgUrl: window.location.protocol + '//' + base + '/images/inviteshare_new.png',
  type: '',
  dataUrl: '',
  shareCallBack: null,
  cancelShareCallBack: null,
  loadInfoCallBack: null,
//		success: function() { // 用户确认分享后执行的回调函数
//			console.log('分享成功');
//		},
//		cancel: function() { // 用户取消分享后执行的回调函数
//			console.log('分享取消');
//		},
  /**
   * [setShare 设置微信分享]
   * @Author   张树垚
   * @DateTime 2016-01-13 16:38:42
   * @param    {[string]}         type        [分享类型, all, timeline, appMessage]
   * @param    {[json]}           options       [分享标题]
   *           {[string]}         options.title        [description]
   *           {[string]}         options.desc         [description]
   *           {[string]}         options.link         [description]
   *           {[string]}         options.imgUrl         [description]
   */
  setShare: function (options) {
    options = options || {};
    wx.onMenuShareTimeline(Object.assign({
      title: weixin.title, // 分享标题
      desc: weixin.desc, // 分享描述
      link: weixin.link, // 分享链接
      imgUrl: weixin.imgUrl, // 分享图标
      success: function () {
        console.log('分享成功');
        _czc.push(["_trackEvent", 'InviteCount', 'Share2TimeLine', 'share1', 1]);
        weixin.shareCallBack && weixin.shareCallBack();

      },
      cancel: function () {
        weixin.cancelShareCallBack && weixin.cancelShareCallBack();
        console.log('分享取消');
      },
    }, options));
    wx.onMenuShareAppMessage(Object.assign({
      title: weixin.title, // 分享标题
      desc: weixin.desc, // 分享描述
      link: weixin.link, // 分享链接
      imgUrl: weixin.imgUrl, // 分享图标
      type: weixin.type, // 分享类型,music、video或link，不填默认为link
      dataUrl: weixin.dataUrl, // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        console.log('分享成功');
        _czc.push(["_trackEvent", 'InviteCount', 'Share2Fri', 'share2', 2]);
        weixin.shareCallBack && weixin.shareCallBack();
      },
      cancel: function () {
        weixin.cancelShareCallBack && weixin.cancelShareCallBack();
        console.log('分享取消');
      },
    }, options));
  },
  pay: { // 支付
    options: { // 参数
      timestamp: '', // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: '', // 支付签名随机串，不长于 32 位
      package: '', // 统一支付接口返回的prepay_id参数值，提交格式如:prepay_id=***）
      signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: '', // 支付签名
      payUrl: '',
      success: function (res) { // 成功
        weixin.pay.onSuccess(res);
      },
      fail: function (res) { // 失败
        alert('微信支付失败:\n' + JSON.stringify(res));
        weixin.pay.onFail(res);
      },
      cancel: function (res) { // 取消
      },
      trigger: function (res) { // 菜单点击
      },
      complete: function (res) { // 完成
        weixin.pay.onComplete(res);
      },
    },
    set: function (pay_url) {
      weixin.pay.options.payUrl = pay_url;
    },
    create: function (money, callback) {
      api.createBuyinOrder({ // 创建买入订单
        gopToken: gopToken,
        orderMoney: money,
        orderSource: 'ORDER_H5'
        // payType: 'UNION_BANK_PAY'
      }).then(function (data) {
        if (data.status == 200) {
          weixin.pay.onCreate(data);
          callback && callback(data);
        } else {
          weixin.pay.onFail(data);
        }
      });
    },
    work: function () {
      // console.log('充值通道维护中,给您带来的不便敬请谅解!');
      // return false;
      location.href = weixin.pay.options.payUrl;
      return false;
    },
    onCreate: function(){},
    onSuccess: function(){},
    onFail: function(){},
    onComplete: function(){},

  },
  config: function (callBack) {
    api.weixinInfo({
      url: url.url + url.search
    }).then(function (data) {
      if (data.status == 200) {
        var returnData = data.data.signatureData;
        wx.config({
          debug: false, // 开启调试模式，调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: weixin.appId = returnData.appId, // 必填，公众号的唯一标识
          timestamp: weixin.timestamp = returnData.timestamp, // 必填，生成签名的时间戳
          nonceStr: weixin.nonceStr = returnData.nonceStr, // 必填，生成签名的随机串
          signature: weixin.signature = returnData.signature, // 必填，签名，见附录1
          jsApiList: [ // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            // 分享接口
            'onMenuShareTimeline', // 微信分享到朋友圈
            'onMenuShareAppMessage', // 分享给朋友
            'onMenuShareQQ', // 分享到QQ
            'onMenuShareWeibo', // 分享到腾讯微博
            'onMenuShareQZone', // 分享到QQ空间
            // 音频接口
            'startRecord', // 开始录音
            'stopRecord', // 停止录音
            'onVoiceRecordEnd', // 监听录音自动停止
            'playVoice', // 播放语音接口
            'pauseVoice', // 暂停播放
            'stopVoice', // 停止播放
            'onVoicePlayEnd', // 监听语音播放完毕
            'uploadVoice', // 上传语音
            'downloadVoice', // 下载语音
            // 图像接口
            'chooseImage', // 拍照或从手机相册中选图接口
            'previewImage', // 预览图片接口
            'uploadImage', // 上传图片接口
            'downloadImage', // 下载图片接口
            // 智能接口
            'translateVoice', // 识别音频并返回识别结果
            // 设备信息
            'getNetworkType', // 获取网络状态
            // 地理位置
            'openLocation', // 使用微信内置地图查看位置
            'getLocation', // 获取地理位置
            // 界面操作
            'hideOptionMenu', // 隐藏右上角菜单
            'showOptionMenu', // 显示右上角菜单
            'hideMenuItems', // 批量隐藏功能按钮
            'showMenuItems', // 批量显示功能按钮
            'hideAllNonBaseMenuItem', // 隐藏所有非基础按钮
            'showAllNonBaseMenuItem', // 显示所有功能按钮
            'closeWindow', // 关闭当前网页窗口
            // 微信扫一扫
            'scanQRCode', // 调起微信扫一扫
            // 微信支付
            'chooseWXPay', // 发起一个微信支付请求
            // 微信小店
            'openProductSpecificView', // 跳转微信商品页
            // 微信卡券
            'addCard', // 批量添加卡券
            'chooseCard', // 拉取适用卡券列表并获取用户选择信息
            'openCard', // 查看微信卡包中的卡券
            // 摇一摇周边
            'startSearchBeacons', // 开启查找周边ibeacon设备
            'stopSearchBeacons', // 关闭查找周边ibeacon设备
            'onSearchBeacons', // 监听周边ibeacon设备
          ]
        });
        callBack && callBack();
      } else { //状态码分支
        console.log(data);
      }
    });
  }
};
wx.ready(function () {
  // wx.hideOptionMenu(); // 隐藏右上角菜单接口
  wx.hideMenuItems({
    menuList: [ // 批量隐藏功能按钮接口
      // 基本类
      "menuItem:exposeArticle", // 举报
      "menuItem:setFont", // 调整字体
      "menuItem:dayMode", // 日间模式
      "menuItem:nightMode", // 夜间模式
      // "menuItem:refresh", // 刷新
      // "menuItem:profile", // 查看公众号（已添加）
      // "menuItem:addContact", // 查看公众号（未添加）
      // 传播类
      // "menuItem:share:appMessage", // 发送给朋友
      // "menuItem:share:timeline", // 分享到朋友圈
      "menuItem:share:qq", // 分享到QQ
      "menuItem:share:weiboApp", // 分享到Weibo
      // "menuItem:favorite", // 收藏
      "menuItem:share:facebook", // 分享到FB
      "menuItem:share:QZone", // 分享到 QQ 空间
      // 保护类
      "menuItem:editTag", // 编辑标签
      "menuItem:delete", // 删除
      "menuItem:copyUrl", // 复制链接
      "menuItem:originPage", // 原网页
      "menuItem:readMode", // 阅读模式
      "menuItem:openWithQQBrowser", // 在QQ浏览器中打开
      "menuItem:openWithSafari", // 在Safari中打开
      "menuItem:share:email", // 邮件
      "menuItem:share:brand", // 一些特殊公众号
    ]
  });
  //设置分享之前先确认保存了用户的uid
  var gopToken = cookie.getCookie('gopToken');
  var nickname = localStorage.getItem('nickname') ? localStorage.getItem('nickname') : '', utag = localStorage.getItem('utag') ? localStorage.getItem('utag') : '';
  var incomePercent = localStorage.getItem('incomePercent');

  var setGRBwxShare = function () {
    if (!nickname) {
      nickname = "果小萌";
    }
    if (!incomePercent) {
      api.annualizedReturns({severalDays: 30}).then(function (data) {
        var incomePercent = 10.00;
        if (data.data && data.data.annualizedReturns) {
          incomePercent = Number(data.data.annualizedReturns) > 0 ? "+" + Number(data.data.annualizedReturns) : Number(data.data.annualizedReturns);
        }
        localStorage.setItem('incomePercent', incomePercent);
        if (incomePercent > 0) {
          incomePercent = "+" + incomePercent.toString();
        }
        setShare(nickname, utag, incomePercent);
        // weixin.setShare({
        //     title: "我是" + nickname + ",送你1000元体验礼包，点击查看", // 分享标题
        //     link: weixin.link + '?uid=' + utag + '&lf=wxshare', // 分享链接,
        //     desc: '果仁宝让你每天赚点小钱，亲测靠谱。近30天年涨跌幅为：' + incomePercent + '%'
        // });
      })
    } else {
      if (incomePercent > 0) {
        incomePercent = "+" + incomePercent.toString();
      }
      setShare(nickname, utag, incomePercent);
      // weixin.setShare({
      //     title: "我是" + nickname + ",送你1000元体验礼包，点击查看", // 分享标题
      //     link: weixin.link + '?uid=' + utag + '&lf=wxshare', // 分享链接,
      //     desc: '果仁宝让你每天赚点小钱，亲测靠谱。近30天年涨跌幅为：' + incomePercent + '%'
      // })
    }

  }
  if (!utag || !nickname) {
    if (gopToken) {//根据gopToken 获取当前用户的基本信息。
      api.info({
        gopToken: gopToken
      }).then(function (data) {
        if (data.status == 200) {
          if (data.data.nickname) {
            localStorage.setItem('nickname', data.data.nickname);
            nickname = data.data.nickname;
          }
          if (data.data.usertag) {
            localStorage.setItem('utag', data.data.usertag);
            utag = data.data.usertag;
          }
        }
        setGRBwxShare();
      }, function () {
        //接口调用失败的情况
        setGRBwxShare();
      });
    } else {
      //没有登录的页面,按照默认的情况设置
      setGRBwxShare();
    }
  } else {
    //之前已经获取了nickname 和 utag
    setGRBwxShare();
  }

});
function setShare(nickname, utag, incomePercent) {
  weixin.setShare({
    title: "我是" + nickname + "，送你1000元体验礼包，点击查看", // 分享标题
    link: weixin.link + '?uid=' + utag + '&lf=wxshare', // 分享链接,
    desc: '每天领分红，比某宝赚的多，亲测靠谱。近30天年涨跌幅为：' + incomePercent + '%',
    imgUrl: window.location.protocol + '//' + base + '/images/invite2.png'
  });
  weixin.loadInfoCallBack && weixin.loadInfoCallBack();
}

weixin.config();
export default weixin;
