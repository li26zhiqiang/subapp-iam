import request from './request';
import path, { getRealPath } from './path';

export function fetchList(parentId, params) {
    return request({
        url: getRealPath(path.menuList, { parentId }),
        method: 'get',
        params: params
    });
}

export function deleteMenu(id) {
    return request({
        url: getRealPath(path.menuDelete, { id }),
        method: 'post'
    });
}

export function createMenu(data) {
    return request({
        url: path.menuCreate,
        method: 'post',
        data: data
    });
}

export function updateMenu(id, data) {
    return request({
        url: getRealPath(path.menuupdate, { id }),
        method: 'post',
        data: data
    });
}

export function getMenu(id) {
    return request({
        url: getRealPath(path.menuInfo, { id }),
        method: 'get'
    });
}

export function updateHidden(id, params) {
    return request({
        url: getRealPath(path.menuUpdateHidden, { id }),
        method: 'post',
        params: params
    });
}

export function fetchTreeList() {
    return request({
        url: path.menuTreeList,
        method: 'get'
    });
}
