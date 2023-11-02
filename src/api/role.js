import request from './request';
import path, { getRealPath } from './path';

export function getRoleList(params) {
    return request({
        url: path.roleList,
        method: 'get',
        params: params
    });
}

export function getAllRoleList() {
    return request({
        url: path.roleAllList,
        method: 'get'
    });
}

export function createRole(data) {
    return request({
        url: getRealPath(path.createRole),
        method: 'post',
        data: data
    });
}

export function updateRole(id, data) {
    return request({
        url: getRealPath(path.updateRole, { id }),
        method: 'post',
        data: data
    });
}

export function updateStatus(id, params) {
    return request({
        url: getRealPath(path.updateRoleStatus, { id }),
        method: 'post',
        params: params
    });
}

export function deleteRole(data) {
    return request({
        url: getRealPath(path.deleteRole),
        method: 'post',
        params: data
    });
}

export function listMenuByRole(roleId) {
    return request({
        url: getRealPath(path.roleListMenu, { roleId }),
        method: 'get'
    });
}

export function listResourceByRole(roleId) {
    return request({
        url: '/tytech-account/role/listResource/' + roleId,
        method: 'get'
    });
}

export function allocMenu(data) {
    return request({
        url: path.roleAllocMenu,
        method: 'post',
        params: data
    });
}

export function allocResource(data) {
    return request({
        url: '/tytech-account/role/allocResource',
        method: 'post',
        params: data
    });
}
