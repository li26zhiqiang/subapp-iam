import request from '@/api/request';
import path from './path';

export function getPackageList(params) {
    return request({
        url: path.packageList,
        method: 'get',
        params: params
    });
}
