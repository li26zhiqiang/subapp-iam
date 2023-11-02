import request from '@/api/request';
import path from './path';

export function getQuotaMargin(params = {}) {
    return request({
        url: path.quotaMargin,
        method: 'get',
        params: params
    });
}

// 消费记录
export function getQuotaRecord(params = {}) {
    return request({
        url: path.quotaRecord,
        method: 'get',
        params: params
    });
}
