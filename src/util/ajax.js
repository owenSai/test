/**
 * Created by tangting on 2017/6/28.
 */

// const DEFAULT_TYPE = 'POST';
const DEFAULT_TIMEOUT = 30000;

export default {

    /**
     * 发送请求
     * @param path
     * @param params
     * @returns {*}
     */
    post(path, param = {}) {
        let deferred = $.Deferred();

        $.ajax({
            url: (param.baseUri || '/ico-gate') + path,
            data: JSON.stringify(param.data),
            type: 'POST',
            dataType: 'JSON',
            headers: {
                'accept-language': 'zh-CN'
            },
            contentType: 'application/json; charset=UTF-8',
            async: true,
            timeout: DEFAULT_TIMEOUT,
            success: function (rep) {
                if (rep.error) {
                    // 报错了
                    deferred.rejectWith(this, ['服务器异常, 请稍候再试']);
                } else {
                    // 正确
                    deferred.resolveWith(this, [rep]);
                }
            },
            error: function (xhr, type) {
                deferred.rejectWith(this, ['网络异常, 请稍候再试']);
            }
        });

        return deferred.promise();
    },

    /**
     * 发送请求get
     * @param path
     * @param param
     * @param showError
     */
    get(path, param={}, showError = true) {
        // param.data = $.extend(param.data, {
        //     brokerId: DEFAULT_BROKER_ID
        // });

        let deferred = $.Deferred();

        $.ajax({
            url: (param.baseUri || '/ico-gate') + path,
            data: $.param(param.data),
            type: 'GET',
            headers: {
                'accept-language': 'zh-CN'
            },
            contentType: 'application/json; charset=UTF-8',
            async: param.async || true,
            timeout: param.timeout || DEFAULT_TIMEOUT,
            success(rep) {
                deferred.resolveWith(this, [rep]);
            },
            error(xhr, type) {
                deferred.rejectWith(this, ['网络异常, 请稍候再试']);
                //doException(xhr, showError);
            }
        });

        return deferred.promise();
    },


};