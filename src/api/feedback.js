import path, { getRealPath } from './path';
import request from './request';

export function getFeedbackList(params) {
    return request({
        url: path.feedback,
        method: 'get',
        params: params
    });
}

export function updateFeedback(id, data) {
    return request({
        url: getRealPath(path.feedbackModify, { id }),
        method: 'put',
        data: data
    });
}
