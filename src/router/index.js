import { createRouter, createWebHashHistory } from 'vue-router';

/* Layout */
import Layout from '@/views/layout/Layout.vue';

/**
 * hidden: true
 * alwaysShow: true
 * redirect: noredirect
 * name:'router-name'
 * meta : {
    title: 'title'
    icon: 'svg-name'
  }
 **/
export const constantRouterMap = [
    { path: '/', redirect: '/user/info' },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    }
];

export const asyncRouterMap = [
    {
        path: '/user/info',
        component: () => import('@/views/info/index.vue'),
        name: 'userInfo',
        meta: { title: '个人中心', icon: 'ums' },
        children: []
    },
    {
        path: '/cost/center',
        component: () => import('@/views/cost/index.vue'),
        name: 'costCenter',
        meta: { title: '成本中心', icon: 'ums-cost' },
        children: []
    },
    {
        path: '/personalRes/center',
        component: () => import('@/views/quota/index.vue'),
        name: 'personalRes',
        meta: { title: '资源中心', icon: 'ums-resCenter' },
        children: []
    },
    {
        path: '/ums',
        component: Layout,
        redirect: '/ums/admin',
        name: 'ums',
        meta: { title: '运维中心', icon: 'ums' },
        children: [
            {
                path: 'admin',
                name: 'admin',
                component: () => import('@/views/ums/admin/index.vue'),
                meta: { title: '用户列表', icon: 'ums-admin' }
            },
            {
                path: 'role',
                name: 'role',
                component: () => import('@/views/ums/role/index.vue'),
                meta: { title: '角色列表', icon: 'ums-role' }
            },
            {
                path: 'role/allocMenu',
                name: 'allocMenu',
                component: () => import('@/views/ums/role/allocMenu.vue'),
                meta: { title: '分配菜单' },
                hidden: true
            },
            {
                path: 'role/allocResource',
                name: 'allocResource',
                component: () => import('@/views/ums/role/allocResource.vue'),
                meta: { title: '分配资源' },
                hidden: true
            },
            {
                path: 'menu',
                name: 'menu',
                component: () => import('@/views/ums/menu/index.vue'),
                meta: { title: '菜单列表', icon: 'ums-menu' }
            },
            {
                path: 'menu/addMenu',
                name: 'addMenu',
                component: () => import('@/views/ums/menu/add.vue'),
                meta: { title: '添加菜单' },
                hidden: true
            },
            {
                path: 'menu/updateMenu',
                name: 'updateMenu',
                component: () => import('@/views/ums/menu/update.vue'),
                meta: { title: '修改菜单' },
                hidden: true
            },
            {
                path: 'resource',
                name: 'resource',
                component: () => import('@/views/ums/resource/index.vue'),
                meta: { title: '资源列表', icon: 'ums-resource' }
            },
            {
                path: 'resource/resourceCategory',
                name: 'resourceCategory',
                component: () => import('@/views/ums/resource/categoryList.vue'),
                meta: { title: '资源分类' },
                hidden: true
            },
            {
                path: 'order',
                name: 'ownOrder',
                component: () => import('@/views/ums/order/index.vue'),
                meta: { title: '订单列表', icon: 'product-list' }
            },
            {
                path: 'order/orderDetail',
                name: 'ownOrderDetail',
                component: () => import('@/views/ums/order/orderDetail.vue'),
                meta: { title: '订单详情' },
                hidden: true
            },
            {
                path: 'feedback',
                name: 'feedback',
                component: () => import('@/views/ums/feedback/index.vue'),
                meta: { title: '反馈列表', icon: 'ums-solution' }
            }
        ]
    },
    { path: '/:catchAll(.*)', redirect: '/404', hidden: true }
];

const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: constantRouterMap, // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        top: 0
    })
});

export default router;
