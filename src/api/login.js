import request from './request';
import path, { getRealPath } from './path';
import store from '@/store';

export function login(params, headers = {}) {
    const { username, verifyCode, password } = params;

    return request({
        url: path.login,
        method: 'post',
        data: {
            username,
            password,
            imageAuthCode: verifyCode
        },
        headers
    });
}

export function loginByPhone(params) {
    const { phone, phoneAuthCode, policy, from } = params;

    return request({
        url: path.loginByPhone,
        method: 'post',
        data: {
            phone,
            phoneAuthCode,
            privacyPolicy: policy ? 1 : 0,
            ...(from ? { fromSource: from } : {})
        }
    });
}

export function register(params) {
    const { username, email, phone, sms, password, from, policy } = params;

    return request({
        url: path.register,
        method: 'post',
        data: {
            username,
            email,
            phone,
            phoneAuthCode: sms,
            password,
            privacyPolicy: policy ? 1 : 0,
            ...(from ? { fromSource: from } : {})
        }
    });
}

export function resetPassword(params) {
    const { username, newPassword, phone, phoneAuthCode } = params;

    return request({
        url: path.resetPassword,
        method: 'post',
        data: {
            username,
            newPassword,
            phone,
            phoneAuthCode
        }
    });
}

export function logout() {
    return request({
        url: path.logout,
        method: 'post'
    });
}

export function getVerifyCodeImage() {
    return request({
        url: path.verifyCodeImage,
        method: 'get',
        headers: { Accept: '*/*', 'content-type': 'image/png' },
        responseType: 'arraybuffer'
    });
}

export function getSmsCode({ telephone, verifyCode }) {
    return request({
        url: path.smsCode,
        method: 'get',
        params: { telephone, verifyCode },
        headers: {
            temp_session_id: store.getters.sessionId
        }
    });
}

export function getInfo(headers) {
    return request({
        url: path.userInfo,
        method: 'get',
        ...(headers ? { headers } : {})
    });
}

export function getUserList(params) {
    const { pageNum, pageSize, keyword } = params;

    return request({
        url: path.userList,
        method: 'get',
        params: { pageNum, pageSize, keyword }
    });
}

export function createAdmin(params) {
    return register(params);
}

export function updateAdmin(id, data) {
    return request({
        url: getRealPath(path.modifyUserInfo, { id }),
        method: 'post',
        data: data
    });
}

export function updateStatus(id, params) {
    return request({
        url: getRealPath(path.updateUserStatus, { id }),
        method: 'post',
        params: params
    });
}

export function deleteAdmin(id) {
    return request({
        url: getRealPath(path.deleteUser, { id }),
        method: 'post'
    });
}

export function getRoleByAdmin(id) {
    return request({
        url: getRealPath(path.userRole, { id }),
        method: 'get'
    });
}

export function allocRole(data) {
    return request({
        url: path.updateUserRole,
        method: 'post',
        data: data
    });
}

export function getuserInfoById(id) {
    return request({
        url: getRealPath(path.userInfoById, { id }),
        method: 'get'
    });
}
