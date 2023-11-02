import request from './request';
import path, { getRealPath } from './path';

export function listAllCate() {
    return request({
        url: path.resCategoryAllList,
        method: 'get'
    });
}

export function createResourceCategory(data) {
    return request({
        url: getRealPath(path.createResCategory),
        method: 'post',
        data: data
    });
}

export function updateResourceCategory(id, data) {
    return request({
        url: getRealPath(path.updateResCategory, { id }),
        method: 'post',
        data: data
    });
}

export function deleteResourceCategory(id) {
    return request({
        url: getRealPath(path.deleteResCategory, { id }),
        method: 'post'
    });
}
