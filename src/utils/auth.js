import Cookies from 'js-cookie';

const TokenKey = 'token';
const USER_NAME = 'username';

export function getToken() {
    return Cookies.get(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
}

export function getUserName() {
    return Cookies.get(USER_NAME);
}

export function setUserName(name) {
    return Cookies.set(USER_NAME, name);
}
