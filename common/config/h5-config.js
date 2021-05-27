/**
 * [H5参数配置]
 * @Author   姜晓妮
 * @DateTime 2016-05-27 15:35:24
 *
 */

var path = location.pathname;
var rootPatharr = path.split("/");
var pathName = rootPatharr.length>1?rootPatharr[1]:'wx';
//测试环境参数配置
var paramConfig = {
    isLocalDev:false,
    // baseUri : '//goopal.goopal1.com', //开发环境
    // baseUri : '//172.16.33.2:8480',
    baseUri : '//chat.wanlefu.com/slx-account-web', //http://172.16.15.117:8022/slx-baitiao-web/
    baseUriLoan : '//chat.wanlefu.com/slx-loan-web',  //验证码的请求地址
    //baseUri : '//test123.goopal1.com',
    // baseUri : '//gopendpoint.treespaper`.com', //QA环境
    main : '//www.goopal1.com/'+pathName+'/',
    // guorenbaoUrl : '//www.goopal1.com/wx/',  //h5 提测环境
    // guorenbaoUrlDev : '//www.goopal1.com/t_wx/', //APP 调用的测试环境
    // appid : 'wxe91980c4944999fe', //QA appid
    // appid : 'wx675e32b0765061ba', // 开发 appid
    // countAPIDomain:"//172.16.33.10:8089",
    // countAPPID:"huafeihuodong",
    // eventCountAPPID:"invitation2",
    // guorenMarketUrl:"//exchange.goopal1.com/",
    // guorenMarketUrl:"//exchange.treespaper.com/",
    // guorenshichangURL:"http://exchange.treespaper.com/auth/"
};
if (location.href.indexOf('localhost') > 0) {
    paramConfig.isLocalDev = true;
}
if (paramConfig.isLocalDev) {
    paramConfig.baseUri='';
}

export default paramConfig;