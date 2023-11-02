export default {
    login: '/tytech-account/account/login',
    loginByPhone: '/tytech-account/account/loginByPhone',
    register: '/tytech-account/account/register',
    logout: '/tytech-account/account/logout',
    resetPassword: '/tytech-account/account/resetPassword',
    verifyCodeImage: '/tytech-account/account/authcode/image',
    smsCode: '/tytech-account/account/sendSmsAuthCode',
    userList: '/tytech-account/account/list',
    updateUserStatus: '/tytech-account/account/updateStatus/{id}',
    userRole: '/tytech-account/account/role/{id}',
    updateUserRole: '/tytech-account/account/role/update',
    modifyUserInfo: '/tytech-account/account/update/{id}',
    deleteUser: '/tytech-account/account/delete/{id}',
    userInfo: '/tytech-account/account/info',
    userInfoById: '/tytech-account/account/{id}',

    // 角色
    roleList: '/tytech-account/role/list',
    roleAllList: '/tytech-account/role/listAll',
    updateRoleStatus: '/tytech-account/role/updateStatus/{id}',
    updateRole: '/tytech-account/role/update/{id}',
    createRole: '/tytech-account/role/create',
    deleteRole: '/tytech-account/role/delete',
    roleListMenu: '/tytech-account/role/listMenu/{roleId}',
    roleAllocMenu: '/tytech-account/role/allocMenu',

    // 资源
    resourceList: '/tytech-account/resource/list',
    updateResource: '/tytech-account/resource/update/{id}',
    createResource: '/tytech-account/resource/create',
    deleteResource: '/tytech-account/resource/delete/{id}',
    resourceAllList: '/tytech-account/resource/listAll',
    initResourceRolesMap: '/tytech-account/resource/initResourceRolesMap',
    resCategoryAllList: '/tytech-account/resourceCategory/listAll',
    deleteResCategory: '/tytech-account/resourceCategory/delete/{id}',
    updateResCategory: '/tytech-account/resourceCategory/update/{id}',
    createResCategory: '/tytech-account/resourceCategory/create',

    // 菜单
    menuList: '/tytech-account/menu/list/{parentId}',
    menuInfo: '/tytech-account/menu/{id}',
    menuTreeList: '/tytech-account/menu/treeList',
    menuUpdateHidden: '/tytech-account/menu/updateHidden/{id}',
    menuDelete: '/tytech-account/menu/delete/{id}',
    menuCreate: '/tytech-account/menu/create',
    menuupdate: '/tytech-account/menu/update/{id}',

    // 商品
    productList: '/tytech-admin/product/tytechList',
    productInfo: '/tytech-admin/product/updateInfo/{id}',
    productAttribute: '/tytech-admin/productAttribute/list/{id}',

    // 订单
    generatePackageOrder: '/tytech-cost-service/order/generatePackageOrder/{id}',
    orderList: '/tytech-cost-service/order/list',
    ownOrderList: '/tytech-cost-service/order/adminList',
    cacelOrder: '/tytech-cost-service/order/cancelUserOrder',
    deleteOrder: '/tytech-cost-service/order/deleteOrder',
    orderDetail: '/tytech-cost-service/order/detail/{id}',
    orderNote: '/tytech-cost-service/order/update/note',
    nativePay: '/tytech-pay/wxpay/v3/nativePay',
    nativePayQuery: '/tytech-pay/wxpay/v3/query',

    // 套餐
    packageList: '/tytech-cost-service/product/package/list',

    // 配额
    quotaMargin: '/tytech-cost-service/product/quota/margin',
    quotaRecord: '/tytech-cost-service/product/quota/margin/record',

    // 问题反馈
    feedback: '/tytech-cost-service/dev_ops/feedback',
    feedbackModify: '/tytech-cost-service/dev_ops/feedback/{id}'
};

export function getRealPath(url = '', params = {}) {
    let path = url;

    Object.entries(params).forEach(([key, value]) => {
        const reg = new RegExp(`{${key}}`, 'g');
        path = path.replace(reg, value);
    });

    return path;
}
