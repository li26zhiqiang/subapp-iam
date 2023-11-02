import request from '@/api/request';
import path, { getRealPath } from './path';

export function fetchList(params) {
    return request({
        url: path.productList,
        method: 'get',
        params: params
    });
}

export function getProductInfo(params) {
    const { id } = params;

    return request({
        url: getRealPath(path.productInfo, { id }),
        method: 'get'
    });
}

export function getProductAttribute(params) {
    const { id, ...other } = params;

    return request({
        url: getRealPath(path.productAttribute, { id }),
        method: 'get',
        params: other
    });
}
