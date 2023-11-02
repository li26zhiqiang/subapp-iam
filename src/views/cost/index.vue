<template>
    <div class="app-container" v-loading="state.isLoading">
        <el-card shadow="never" class="page-card" header="">
            <div class="cost-center-container">
                <div class="member-package-title">会员套餐怎么选？</div>

                <el-row :gutter="30" class="member-package-list">
                    <el-col
                        :xs="24"
                        :sm="12"
                        :md="8"
                        :lg="8"
                        :xl="8"
                        v-for="item in state.memberPkgs"
                        :key="item.id"
                        class="member-package-col"
                    >
                        <div class="member-package-item">
                            <div class="header">
                                <div class="title">
                                    {{ item.name }}
                                </div>
                                <div class="sub-title">
                                    {{ item.subtitle }}
                                </div>
                            </div>

                            <div class="body">
                                <el-divider border-style="none"><div class="attr-title">功能清单</div></el-divider>
                                <div class="attr-description">
                                    <div v-for="attr in item.attributeList" class="attr-row">
                                        <div class="left">
                                            <el-icon :size="16" :color="attr.enable ? '#52c41a' : '#909399'">
                                                <ElIconCircleCheckFilled />
                                            </el-icon>
                                            <div class="title">{{ attr.title }}({{ attr.flavor }})</div>
                                        </div>

                                        <div class="margin-content">
                                            {{ attr.marginTitle }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="footer">
                                <p class="price">
                                    {{ item.price }}
                                    <i class="unit">{{ item.priceUnit }}</i>
                                </p>

                                <div class="operation">
                                    <el-button
                                        type="primary"
                                        size="large"
                                        class="opt-button"
                                        v-if="item.price > 0"
                                        @click="onClickBuy(item)"
                                        v-loading="state.buyLoading && state.currentOrderInfo.id === item.id"
                                    >
                                        立即购买
                                    </el-button>
                                    <!-- <el-button
                                        type="primary"
                                        size="large"
                                        class="opt-button"
                                        v-if="item.price === 0"
                                        @click="onClickExperience()"
                                    >
                                        立即体验
                                    </el-button> -->
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <!-- 用作跳转的锚点 -->
                <div id="ordersTitleId"></div>
                <el-divider class="ordert-divider" border-style="none">
                    <div class="title">已购套餐</div>
                </el-divider>

                <div class="member-order-list">
                    <el-table :data="state.orderList" default-expand-all :show-header="false" style="width: 100%">
                        <el-table-column type="expand">
                            <template #default="scope">
                                <div class="list-expand-content">
                                    <div class="content-row-title" v-for="orderItem in scope.row.orderItemList">
                                        <div class="info">
                                            <img class="logo" :src="orderItem.productPic" />
                                            <div class="description">
                                                <p class="title">{{ orderItem.productName }}</p>
                                                <p class="sub-title">{{ orderItem.subTitle }}</p>
                                            </div>
                                        </div>

                                        <div class="count">
                                            {{ orderItem.productQuantity || 1 }}
                                        </div>

                                        <div class="price">
                                            <p class="original-price">
                                                ￥{{ orderItem.productPrice || orderItem.realAmount }}
                                            </p>
                                            <p>￥{{ orderItem.realAmount }}</p>
                                        </div>

                                        <!-- 保留标签用于占据位置 -->
                                        <div class="count-down" v-if="!isMobile"></div>
                                        <div class="opearation" v-if="!isMobile"></div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="">
                            <template #default="scope">
                                <div class="row-title">
                                    <div class="title" v-if="!isMobile">
                                        <div class="time">{{ scope.row.createDay }}</div>
                                        <div class="number">订单号：{{ scope.row.orderSn }}</div>
                                        <el-tooltip
                                            effect="dark"
                                            :content="scope.row.productPackageName"
                                            placement="top"
                                        >
                                            <el-text truncated class="package-name">
                                                {{ scope.row.productPackageName }}
                                            </el-text>
                                        </el-tooltip>
                                    </div>

                                    <OrderStatus :status="scope.row.status" />

                                    <p class="price">
                                        {{ scope.row.payAmount }}
                                        <i class="unit"> {{ scope.row.unit || '元' }}</i>
                                    </p>

                                    <div class="count-down" v-if="!isMobile">
                                        <TimeCountdown
                                            v-if="scope.row.status === 0 && scope.row.payAmount > 0"
                                            :timeDuration="200"
                                            :countdownTime="scope.row.countdownTime"
                                        />
                                    </div>

                                    <div class="opearation">
                                        <el-popover placement="bottom" title="" :width="230" trigger="click">
                                            <template #reference>
                                                <el-button
                                                    :plain="false"
                                                    round
                                                    type="primary"
                                                    size="small"
                                                    v-if="scope.row.status === 0 && scope.row.payAmount > 0"
                                                >
                                                    立即支付
                                                </el-button>
                                            </template>

                                            <template #default>
                                                <div class="payment-method">
                                                    <div
                                                        v-for="item in payMetods"
                                                        :key="item.key"
                                                        :class="{
                                                            'payment-method-item': true,
                                                            disabled: item.disabled
                                                        }"
                                                        @click="onClickPayMethod(scope.row, item.key)"
                                                    >
                                                        <img :class="item.class || ''" :src="item.image" />
                                                    </div>
                                                </div>
                                            </template>
                                        </el-popover>

                                        <el-button
                                            plain
                                            round
                                            size="small"
                                            v-if="scope.row.status === 0 && scope.row.payAmount > 0"
                                            @click="cancelOrder(scope.row)"
                                        >
                                            取消订单
                                        </el-button>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination
                            background
                            layout="total, prev, pager, next"
                            :pager-count="5"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            v-model:current-page="state.listQuery.pageNum"
                            :page-size="state.listQuery.pageSize"
                            :page-sizes="[10, 20, 50, 100]"
                            :total="state.listQuery.total"
                        >
                        </el-pagination>
                    </div>
                </div>

                <el-dialog
                    v-model="state.dialogPaymentVisible"
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :width="640"
                    title="套餐支付"
                    destroy-on-close
                    align-center
                >
                    <div class="payment-modal">
                        <div class="payment-method">
                            <div class="payment-method-title">选择支付方式</div>
                            <CheckCard :options="payMetods" @change="onSelectPayMethod"></CheckCard>
                        </div>

                        <div class="qrcode-container" v-show="payQrcodeVisible">
                            <div class="price">总共: {{ currentOrderPayInfo.orderInfo?.payAmount || '' }} 元</div>
                            <p id="picContainer_mix" v-loading="state.payLoading">{{ state.payMessage }}</p>
                            <el-button
                                v-if="currentOrderPayInfo?.regenerateOrderSn"
                                :icon="RefreshRight"
                                @click="onClickPayRefresh"
                            >
                                刷新
                            </el-button>
                            <div class="help" v-show="!state.payMessage">请使用微信 “扫一扫” 支付账单</div>
                        </div>
                    </div>
                </el-dialog>

                <el-dialog
                    v-model="state.dialogQrcodeVisible"
                    :close-on-press-escape="false"
                    :close-on-click-modal="false"
                    :width="460"
                    title="支付二维码"
                    destroy-on-close
                    align-center
                >
                    <div class="qrcode-container">
                        <div class="price">总共: {{ currentOrderPayInfo.orderInfo?.payAmount || '' }} 元</div>
                        <p id="picContainer_single" v-loading="state.payLoading">{{ state.payMessage }}</p>
                        <el-button
                            v-if="currentOrderPayInfo?.regenerateOrderSn"
                            :icon="RefreshRight"
                            @click="onClickPayRefresh"
                        >
                            刷新
                        </el-button>
                        <div class="help" v-show="!state.payMessage">请使用微信 “扫一扫” 支付账单</div>
                    </div>
                </el-dialog>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, onMounted, watch, onUnmounted, h, ref } from 'vue';
import { ElMessage as Message, ElMessageBox } from 'element-plus';
import { RefreshRight } from '@element-plus/icons-vue';
import { debounce } from 'lodash-es';
import moment from 'moment';

import TimeCountdown from '@components/TimeCountdown/index.vue';
import OrderStatus from '@components/OrderStatus/index.vue';
import CheckCard from '@components/CheckCard/index.vue';
import { getPackageList } from '@/api/package';
import { generateOrder, getOrders, nativePay, getNativePayQuery, cacelOrder } from '@/api/order';
import { EXPERIENCE_PATH, PAY_TYPE } from '@utils/constants';
import { arrayBufferToJSON, parseObject } from '@utils/index';
import { getFontSize } from '@utils/util';
import useMobile from '@/hooks/useMobile';

import './index.less';

const payMetods = [
    {
        key: PAY_TYPE.wxpay,
        image: '/iam/images/wxpayLogo.svg',
        class: 'wxpay'
    }
    // {
    //     key: PAY_TYPE.alipay,
    //     image: '/iam/images/alipayLogo.svg',
    //     disabled: true
    // }
];

const isMobile = useMobile();
const packageInfo = ref({});
const currentOrderPayInfo = ref({ regenerateOrderSn: false });
const payQrcodeVisible = ref(false);
const state = reactive({
    isLoading: false,
    buyLoading: false,
    payLoading: false,
    payMessage: '',
    dialogQrcodeVisible: false,
    dialogPaymentVisible: false,
    currentOrderInfo: {},
    memberPkgs: [],
    orderList: [],
    listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0
    }
});

onMounted(() => {
    initData();
    addListener();
});

onUnmounted(() => {
    removeListener();
});

watch(
    () => state.dialogQrcodeVisible,
    () => {
        if (!state.dialogQrcodeVisible) {
            // 二维码弹窗关闭，需要刷新订单列表
            getOrderList();
            currentOrderPayInfo.value = { regenerateOrderSn: false };
            payQrcodeVisible.value = false;
        }
    }
);

watch(
    () => state.dialogPaymentVisible,
    () => {
        if (!state.dialogPaymentVisible) {
            // 二维码弹窗关闭，需要刷新订单列表
            getOrderList();
            currentOrderPayInfo.value = { regenerateOrderSn: false };
            payQrcodeVisible.value = false;

            // 锚点跳转到订单列表
            document.querySelector('#ordersTitleId').scrollIntoView({ behavior: 'smooth' });
        }
    }
);

async function initData() {
    await getProductList();
    await getOrderList();
}

async function getProductList() {
    try {
        state.isLoading = true;
        const response = await getPackageList({
            pageNum: 1,
            pageSize: 100
        });

        const list = response.data.list || response.data || [];
        const pkgObj = {};

        list.forEach((item) => {
            const attributeList = parseObject(item.attribute);

            if (attributeList?.length) {
                item.attributeList = attributeList.map((attr) => {
                    attr.margin = Object.entries(attr.margin || {}).map(([key, value]) => {
                        return {
                            title: key,
                            value
                        };
                    });

                    return attr;
                });
            }

            item.productIds = parseObject(item.productIds);
            item.roleIds = parseObject(item.roleIds);
            item.priceUnit = item.priceUnit || '元/年';

            pkgObj[item.id] = item.name;
        });

        state.memberPkgs = list;
        packageInfo.value = pkgObj;
    } finally {
        state.isLoading = false;
    }
}

function getOrderList() {
    getOrders({
        status: -1,
        pageNum: state.listQuery.pageNum,
        pageSize: state.listQuery.pageSize
    }).then((resp) => {
        const { list, total } = resp?.data || {};

        list.forEach((item) => {
            item.createDay = moment(item.createTime).format('YYYY-MM-DD');
            item.countdownTime = new Date(item.createTime).getTime();
            item.productPackageName = packageInfo.value[item.productPackageId] || '';
        });

        state.orderList = list || [];
        state.listQuery.total = total || 0;
    });
}

function handleSizeChange(val) {
    state.listQuery.pageNum = 1;
    state.listQuery.pageSize = val;
    getOrderList();
}

function handleCurrentChange(val) {
    state.listQuery.pageNum = val;
    getOrderList();
}

// 页面激活时，需要刷新订单列表
function refreshOrderListOnPage() {
    if (document.visibilityState === 'visible') {
        getOrderList();
    }
}

function addListener() {
    // 监听页面激活状态
    document.addEventListener('visibilitychange', refreshOrderListOnPage);
}

function removeListener() {
    document.removeEventListener('visibilitychange', refreshOrderListOnPage);
}

// 体验
function onClickExperience() {
    window.open(EXPERIENCE_PATH);
}

// 加入购物车 + 生成订单
async function onClickBuy(packageInfos) {
    state.buyLoading = true;
    state.currentOrderInfo = { ...packageInfos };

    try {
        // 生成订单
        const resp = await generateOrder({
            id: packageInfos.id
        });

        // 打开支付窗口
        const order = resp?.data?.order || {};
        currentOrderPayInfo.value = {
            orderInfo: { ...order, productPackageName: packageInfo.value[order.productPackageId] || '' }
        };
        state.dialogPaymentVisible = true;

        // 刷新订单列表
        getOrderList();
    } catch (e) {
        console.log('e=', e);
    } finally {
        state.buyLoading = false;
    }
}

function cancelOrder(orderInfo) {
    ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        cacelOrder({ orderId: orderInfo.id })
            .then((resp) => {
                Message({
                    message: '订单取消成功！',
                    type: 'success',
                    duration: 3 * 1000
                });
            })
            .finally(() => {
                getOrderList();
            });
    });
}

// 在支付界面通过选中支付方式生成二维码
const onSelectPayMethod = (option) => {
    onClickPay({ ...currentOrderPayInfo.value?.orderInfo }, option.key, 'mix');
};

// 在订单列表通过点击支付方式生成二维码
function onClickPayMethod(orderInfo, payType) {
    if (payType === PAY_TYPE.alipay) {
        return;
    }

    state.dialogQrcodeVisible = true;
    onClickPay(orderInfo, payType, 'single');
}

// 支付订单，返回二维码
async function onClickPay(orderInfo, payType, showType) {
    state.payMessage = '';
    const orderPayInfo = { orderInfo, payType, regenerateOrderSn: currentOrderPayInfo.value?.regenerateOrderSn };
    currentOrderPayInfo.value = orderPayInfo;

    try {
        const { orderSn, productPackageName = '' } = orderInfo;
        const description =
            productPackageName.length > 50 ? productPackageName.slice(0, 51) + '...' : productPackageName;

        state.payLoading = true;

        const resp = await nativePay({
            orderSn: orderSn,
            description: '拓云科技 - ' + description,
            attach: `${window.globalInfo.user.id}_${window.globalInfo.user.tenantName}_${window.globalInfo.user.username}`,
            regenerateOrderSn: !!currentOrderPayInfo.value?.regenerateOrderSn
        });

        payQrcodeVisible.value = true;

        handleQRImage(resp, showType);
        getPayStatus({ ...orderInfo, outTradeNo: resp.headers?.outtradeno || orderInfo.orderSn });
        currentOrderPayInfo.value = { ...orderPayInfo, regenerateOrderSn: false };
    } catch (e) {
        console.log('e=', e);

        const data = arrayBufferToJSON(e.response.data);

        // 需要重试
        if (data?.code === 400) {
            state.payMessage = '二维码已失效了，请刷新重试！';
            currentOrderPayInfo.value = { ...orderPayInfo, regenerateOrderSn: true };
        } else {
            state.payMessage = '出错了，请稍后重试！';
        }
    } finally {
        state.payLoading = false;
    }
}

// 二维码失效，重新刷新
function onClickPayRefresh() {
    const { orderInfo, payType } = currentOrderPayInfo.value;
    onClickPay(orderInfo, payType);
}

// 生成二维码
function handleQRImage(resp, showType) {
    const arrayBufferView = new Uint8Array(resp.data);
    const blob = new Blob([arrayBufferView], { type: 'image/png' });
    const urlCreator = window.URL || window.webkitURL;
    const url = urlCreator.createObjectURL(blob);
    let image = new Image();

    image.onload = function () {
        const pic = document.getElementById(`picContainer_${showType}`);

        if (pic?.childNodes?.length) {
            pic?.removeChild(pic.childNodes[0]);
        }

        pic?.append(image);
        urlCreator.revokeObjectURL(url);
    };

    const size = getFontSize();
    image.src = url;
    image.width = 16.5 * size;
    image.height = 16.5 * size;
}

// 轮询当前订单的状态
async function getPayStatus(orderInfo) {
    try {
        const resp = await getNativePayQuery({ outTradeNo: orderInfo.outTradeNo });

        if (state.dialogQrcodeVisible || state.dialogPaymentVisible) {
            if (resp?.data?.trade_state === 'SUCCESS') {
                state.dialogQrcodeVisible = false;
                state.dialogPaymentVisible = false;
                document.body.click(); // 把选择支付方式的popover隐藏

                ElMessageBox.confirm(
                    h('div', { style: { 'line-height': '24px', 'font-size': '18px' } }, [
                        '订单支付成功！',
                        h('a', { href: '/console/home', style: { color: '#18b3b3' } }, '现在去使用')
                    ]),
                    '成功',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success'
                    }
                );

                getOrderList();
            } else {
                // 调用自身进行下一次轮询
                debounce(() => {
                    getPayStatus(orderInfo);
                }, 2000)();
            }
        }
    } catch (e) {
        //
    }
}
</script>
