import Taro from '@tarojs/taro';
import { postToolsUploadToken } from '../api/index';
var CosAuth = require('../lib/cos-auth');

var uploadFile = function (cbFunction, choosen) {
    var prefix;


    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = async (callback) => {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expire) {
            callback(stsCache);
            return;
        }
        const {data} = await postToolsUploadToken()
        stsCache = data
        prefix = 'https://' + data.bucket + '.cos.' + data.region + '.myqcloud.com/';
        callback(stsCache);
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.token,
                Authorization: CosAuth({
                    SecretId: credentials.secret_id,
                    SecretKey: credentials.secret_key,
                    Method: options.Method,
                    Pathname: options.Pathname,
                })
            });
        });
    };

    // 上传文件
    var uploadFile = function (filePath) {
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        getAuthorization({Method: 'POST', Pathname: '/'}, function (AuthData) {
            var requestTask = Taro.uploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: {
                    'key': Key,
                    'success_action_status': 200,
                    'Signature': AuthData.Authorization,
                    'x-cos-security-token': AuthData.XCosSecurityToken,
                    'Content-Type': '',
                },
                success: async (res) => {
                  console.log(res)
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if (res.statusCode === 200) {
                      cbFunction(url)
                    } else {
                      Taro.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                    }
                    console.log(res.statusCode);
                    console.log(url);
                },
                fail: function (res) {
                    Taro.showModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                }
            });
            // requestTask.onProgressUpdate(function (res) {
            //     console.log('正在进度:', res);
            // });
        });
    };

    // 选择文件
    Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，这里默认用原图
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          choosen(res)
          uploadFile(res.tempFiles[0].path);
        }
    })
};

export default uploadFile;