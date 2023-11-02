import path, { getRealPath } from './path';
import request from './request';

export function fetchList(params) {
    return request({
        url: path.resourceList,
        method: 'get',
        params: params
    });
}

export function createResource(data) {
    return request({
        url: path.createResource,
        method: 'post',
        data: data
    });
}

export function updateResource(id, data) {
    return request({
        url: getRealPath(path.updateResource, { id }),
        method: 'post',
        data: data
    });
}

export function deleteResource(id) {
    return request({
        url: getRealPath(path.deleteResource, { id }),
        method: 'post'
    });
}

export function fetchAllResourceList() {
    return request({
        url: path.resourceAllList,
        method: 'get'
    });
}
