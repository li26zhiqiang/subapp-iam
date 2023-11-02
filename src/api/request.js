import axios from 'axios';
import { ElMessage as Message, ElMessageBox as MessageBox } from 'element-plus';

function showMessage(res, response) {
    // 401:未登录;
    if (res.code === 401 || res.status === 401) {
        if (!response?.config?.headers?.notShowError) {
            MessageBox.confirm('您的会话已过期，请重新登录！', '请重新登录', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (typeof window.globalInfo?.gotoLogin === 'function') {
                    window.globalInfo.gotoLogin();
                }
            });
        }
    } else {
        Message({
            message: res?.data?.message || res?.message || response?.message || 'error',
            type: 'error',
            duration: 3 * 1000
        });
    }
}

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 120000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        // Do something with request error
        console.log(error); // for debug
        Promise.reject(error);
    }
);

// respone拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;

        if (response?.config?.responseType === 'arraybuffer' || response.headers['content-type'] === 'image/png') {
            return response;
        }

        if (res.code !== 200) {
            showMessage(res, response);

            // 登录校验失败
            if ([1002, 1003, 1005].includes(res.code)) {
                return Promise.reject(res);
            }

            return Promise.reject(res?.message || 'error');
        } else {
            return response.data;
        }
    },
    (error) => {
        console.log('err' + error); // for debug
        showMessage(error.response, error);

        return Promise.reject(error);
    }
);

export default service;
