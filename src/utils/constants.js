const ROOT_PATH = '/console';
const BASENAME = '/iam';
const LOGIN_PATH = '/iam/login';
const HOME_PATH = '/console/home';
const EXPERIENCE_PATH = '/console/aitools#/search';

const MENU_PATH = {
    allocResource: '/ums/role/allocResource',
    allocMenu: '/ums/role/allocMenu',
    resourceCategory: '/ums/resource/resourceCategory',
    costCenter: '/cost/center'
};

const PAY_TYPE = {
    wxpay: 'wxpay',
    alipay: 'alipay'
};

const ORDER_PAY_TYPE = {
    1: '支付宝',
    2: '微信'
};

const PAY_STATUS = {
    0: '待付款',
    1: '待发货',
    2: '已发货',
    3: '已完成',
    4: '已关闭',
    5: '无效订单'
};

const QUOTA_SUPPLIER_DESP = {
    openAiChat: { title: 'AI工具', balance: 'AI对话余额', icon: 'chat' },
    openAiDALLE: { title: 'AI绘画', balance: 'AI绘画余额', icon: 'picture' },
    techPipeLine: { title: '拓客流水线', balance: '拓客流水线余额', icon: 'pipeline' }
};

const QUOTA_MARGIN_TITLE = {
    input: '输入(个)',
    output: '输出(个)',
    times: '运行时长(分钟)',
    '256x256': '256x256(张)',
    '512x512': '512x512(张)',
    '1024x1024': '1024x1024(张)'
};

const QUOTA_ACTION_TYPE = {
    PURCHASE: { title: '购买', type: 'success' },
    CONSUME: { title: '消费', type: 'warning' }
};

const FEEDBACK_CATEGORY = {
    DEBUG: '问题反馈',
    SUGESTIONS: '优化建议',
    OTHER: '其他问题'
};

export {
    ROOT_PATH,
    HOME_PATH,
    BASENAME,
    LOGIN_PATH,
    MENU_PATH,
    EXPERIENCE_PATH,
    PAY_TYPE,
    PAY_STATUS,
    ORDER_PAY_TYPE,
    QUOTA_SUPPLIER_DESP,
    QUOTA_MARGIN_TITLE,
    QUOTA_ACTION_TYPE,
    FEEDBACK_CATEGORY
};
