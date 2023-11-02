import request from '@/api/request';
import path, { getRealPath } from './path';

export function generateOrder(params) {
    return request({
        url: getRealPath(path.generatePackageOrder, { id: params.id }),
        method: 'post'
    });
}

// 用户自己名下的订单
export function getOrders(params) {
    return request({
        url: path.orderList,
        method: 'get',
        params: params
    });
}

// 支付订单，返回二维码 nativePay
export function nativePay(params) {
    return request({
        url: path.nativePay,
        method: 'post',
        data: params,
        responseType: 'arraybuffer'
    });
}

// nativePayQuery
export function getNativePayQuery(params) {
    return request({
        url: path.nativePayQuery,
        method: 'get',
        params: params
    });
}

// 取消订单
export function cacelOrder(params) {
    return request({
        url: path.cacelOrder,
        method: 'post',
        params: params
    });
}

// 系统管理员可以看到所有的订单
export function getOrderList(params) {
    return request({
        url: path.ownOrderList,
        method: 'get',
        params: params
    });
}

// 删除订单
export function deleteOrder(params) {
    return request({
        url: path.deleteOrder,
        method: 'post',
        params: params
    });
}

export function getOrderDetail(id) {
    return request({
        url: getRealPath(path.orderDetail, { id }),
        method: 'get'
    });
}

export function updateOrderNote(params) {
    return request({
        url: path.orderNote,
        method: 'post',
        params: params
    });
}
