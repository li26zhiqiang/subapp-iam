import { createRouter, createWebHistory } from 'vue-router';
import { BASENAME } from '@utils/constants';

export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/Login.vue'),
        hidden: true
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('@/views/404.vue'),
        hidden: true
    }
];

const router = createRouter({
    history: createWebHistory(BASENAME), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: constantRouterMap, // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        top: 0
    })
});

export default router;
