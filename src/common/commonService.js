/**
 * Created by tangting on 2017/6/28.
 */

import ajax from '../util/ajax';

export default {

    /**
     * 获取google验证二维码
     * @param param
     * @returns {*}
     */
    getGoogleQrCode(param = {}) {
        return ajax.get('/googleAuth/code', {
            data: param
        });
    },

    /**
     *
     * @param param
     * @returns {*}
     */
    login(param = {}) {
        return ajax.post('/user/login', {
            data: param
        });
    },
    /**
     * 修改登录密码
     * @param param
     * @returns {*}
     */
    modifyPwd(param = {}) {
        return ajax.post('/user/change-password', {
            data: param
        });
    },
    /**
     * 重置登录密码
     * @param param
     * @returns {*}
     */
    resetLogPwd(param = {}) {
        return ajax.post('/user/reset-password', {
            data: param
        });
    },
    /**
     * 注册接口
     * @param param
     * @returns {*}
     */
    register(param = {}){
        return ajax.post('/user/register',{
            data: param
        });
    },
    /**
     * 获取图形验证码接口
     * @param param
     * @returns {*}
     */
    getImgCodeBeforeLogin(param = {}){
        return ajax.get('/captchar/loginImageCaptchar',{
            data: param
        });
    },
    /**
     * 获取图形验证码接口
     * @param param
     * @returns {*}
     */
    getImgCode(param = {}){
        return ajax.get('/captchar/code1',{
            data: param
        });
    },
    /**
     * 图形验证码校验接口
     * @param param
     * @returns {*}
     */
    identifyingImgCode(param = {}){
        return ajax.get('/captchar/validate',{
            data:param
        })
    },
    /**
     * 发送邮箱验证码接口
     * @param param
     * @returns {*}
     */
    sendCode(param = {}){
        return ajax.get('/code/send-email',{
            data:param
        })
    },
    /**
     * 验证码校验接口
     * @param param
     * @returns {*}
     */
    identifyingCode(param = {}){
        return ajax.get('/code/check-code',{
            data:param
        })
    },
    /**
     * 获取认购人数，认购数目接口
     * @param param
     * @returns {*}
     */
    getCenterInfo(param = {}){
        return ajax.get('/context/info',{
            data:param
        })
    },
    /**
     * 认购中心信息接口
     * @param param
     * @returns {*}
     */
    getPropertyInfo(param = {}){
        return ajax.get('/userAddress/address',{
            data:param
        })
    },
    /**
     * 退出接口
     * @param param
     * @returns {*}
     */
    logOut(param = {}){
        return ajax.get('/user/logout',{
            data:param
        })
    },
    /**
     * 获取服务器当前时间
     * @param param
     * @returns {*}
     */
    getTimeNow(param = {}){
        return ajax.get('/context/date',{
            data:param
        })
    },
    /**
     * ico结果获取接口
     * @param param
     * @returns {*}
     */
    fetchIcoResult(param = {}){
        return ajax.get('/ico-result',{
            data:param
        })
    },
    /**
     * selfsell 获取是否愿意人数百分比
     * GET
     * @param flag:true or flag:false
     * @return {"oppose": "58","agree": "46"}
     */
    getAgreePercent(param = {}){
        return ajax.get('/collect/vote',{
            data:param
        })
    }

};