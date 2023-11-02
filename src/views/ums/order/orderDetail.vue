<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">订单详情</span>
            </template>
        </el-page-header>

        <el-card shadow="never">
            <div>
                <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
                    <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
                    <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
                    <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
                    <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
                    <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
                </el-steps>
            </div>

            <el-card shadow="never" style="margin-top: 15px">
                <div class="operate-container">
                    <div class="order-detail-status-title">
                        <el-icon class="color-danger" style="margin-left: 20px" :size="24"><ElIconWarning /></el-icon>
                        <span class="color-danger status-text">
                            当前订单状态：{{ formatStatus_filter(order.status) }}
                        </span>
                    </div>

                    <div class="operate-button-container">
                        <el-button type="danger" @click="showCloseOrderDialog" v-show="order.status === 0">
                            取消订单
                        </el-button>
                        <el-button type="danger" @click="handleDeleteOrder" v-show="order.status === 4">
                            删除订单
                        </el-button>
                        <el-button @click="showMarkOrderDialog">备注订单</el-button>
                    </div>
                </div>
                <div style="margin-top: 20px">
                    <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
                    <span class="font-small">基本信息</span>
                </div>
                <div class="table-layout">
                    <el-row>
                        <el-col :span="4" class="table-cell-title">订单编号</el-col>
                        <el-col :span="4" class="table-cell-title">发货单流水号</el-col>
                        <el-col :span="4" class="table-cell-title">用户账号</el-col>
                        <el-col :span="4" class="table-cell-title">支付方式</el-col>
                        <el-col :span="4" class="table-cell-title">订单来源</el-col>
                        <el-col :span="4" class="table-cell-title">订单类型</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" class="table-cell">{{ order.orderSn }}</el-col>
                        <el-col :span="4" class="table-cell">暂无</el-col>
                        <el-col :span="4" class="table-cell">{{ order.memberUsername }}</el-col>
                        <el-col :span="4" class="table-cell">{{ formatPayType_filter(order.payType) }}</el-col>
                        <el-col :span="4" class="table-cell">{{ formatSourceType_filter(order.sourceType) }}</el-col>
                        <el-col :span="4" class="table-cell">{{ formatOrderType_filter(order.orderType) }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" class="table-cell-title">配送方式</el-col>
                        <el-col :span="4" class="table-cell-title">物流单号</el-col>
                        <el-col :span="4" class="table-cell-title">自动确认收货时间</el-col>
                        <el-col :span="4" class="table-cell-title">订单可得优币</el-col>
                        <el-col :span="4" class="table-cell-title">订单可得成长值</el-col>
                        <el-col :span="4" class="table-cell-title">活动信息</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" class="table-cell">{{ formatNull_filter(order.deliveryCompany) }}</el-col>
                        <el-col :span="4" class="table-cell">{{ formatNull_filter(order.deliverySn) }}</el-col>
                        <el-col :span="4" class="table-cell">{{ order.autoConfirmDay }}天</el-col>
                        <el-col :span="4" class="table-cell">{{ order.integration }}</el-col>
                        <el-col :span="4" class="table-cell">{{ order.growth }}</el-col>
                        <el-col :span="4" class="table-cell">
                            <el-popover
                                placement="top-start"
                                title="活动信息"
                                width="200"
                                trigger="hover"
                                :content="order.promotionInfo"
                            >
                                <template v-slot:reference>
                                    <span>{{ formatLongText_filter(order.promotionInfo) }}</span>
                                </template>
                            </el-popover>
                        </el-col>
                    </el-row>
                </div>
                <div style="margin-top: 20px">
                    <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
                    <span class="font-small">收货人信息</span>
                </div>
                <div class="table-layout">
                    <el-row>
                        <el-col :span="6" class="table-cell-title">收货人</el-col>
                        <el-col :span="6" class="table-cell-title">手机号码</el-col>
                        <el-col :span="6" class="table-cell-title">邮政编码</el-col>
                        <el-col :span="6" class="table-cell-title">收货地址</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" class="table-cell">{{ order.memberUsername }}</el-col>
                        <el-col :span="6" class="table-cell">{{ order.receiverPhone }}</el-col>
                        <el-col :span="6" class="table-cell">{{ order.receiverPostCode }}</el-col>
                        <el-col :span="6" class="table-cell">{{ formatAddress_filter(order) }}</el-col>
                    </el-row>
                </div>
                <div style="margin-top: 20px">
                    <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
                    <span class="font-small">商品信息</span>
                </div>
                <el-table ref="orderItemTable" :data="order.orderItemList" style="width: 100%; margin-top: 20px" border>
                    <el-table-column label="商品图片" width="120">
                        <template v-slot="scope">
                            <img :src="scope.row.productPic" style="height: 80px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称">
                        <template v-slot="scope">
                            <p>{{ scope.row.productName }}</p>
                            <p>品牌：{{ scope.row.productBrand }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格/货号" width="120">
                        <template v-slot="scope">
                            <p>价格：￥{{ scope.row.productPrice }}</p>
                            <p>货号：{{ scope.row.productSn }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性" width="120">
                        <template v-slot="scope">
                            {{ formatProductAttr_filter(scope.row.productAttr) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" width="120">
                        <template v-slot="scope">
                            {{ scope.row.productQuantity }}
                        </template>
                    </el-table-column>
                    <el-table-column label="小计" width="120">
                        <template v-slot="scope"> ￥{{ scope.row.productPrice * scope.row.productQuantity }} </template>
                    </el-table-column>
                </el-table>
                <div style="float: right; margin: 20px">
                    合计：<span class="color-danger">￥{{ order.totalAmount }}</span>
                </div>
                <div style="margin-top: 60px">
                    <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
                    <span class="font-small">费用信息</span>
                </div>
                <div class="table-layout">
                    <el-row>
                        <el-col :span="6" class="table-cell-title">商品合计</el-col>
                        <el-col :span="6" class="table-cell-title">运费</el-col>
                        <el-col :span="6" class="table-cell-title">优惠券</el-col>
                        <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" class="table-cell">￥{{ order.totalAmount }}</el-col>
                        <el-col :span="6" class="table-cell">￥{{ order.freightAmount }}</el-col>
                        <el-col :span="6" class="table-cell">-￥{{ order.couponAmount }}</el-col>
                        <el-col :span="6" class="table-cell">-￥{{ order.integrationAmount }}</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" class="table-cell-title">活动优惠</el-col>
                        <el-col :span="6" class="table-cell-title">折扣金额</el-col>
                        <el-col :span="6" class="table-cell-title">订单总金额</el-col>
                        <el-col :span="6" class="table-cell-title">应付款金额</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" class="table-cell">-￥{{ order.promotionAmount }}</el-col>
                        <el-col :span="6" class="table-cell">-￥{{ order.discountAmount }}</el-col>
                        <el-col :span="6" class="table-cell">
                            <span class="color-danger">￥{{ order.totalAmount + order.freightAmount }}</span>
                        </el-col>
                        <el-col :span="6" class="table-cell">
                            <span class="color-danger"
                                >￥{{ order.payAmount + order.freightAmount - order.discountAmount }}</span
                            >
                        </el-col>
                    </el-row>
                </div>
                <div style="margin-top: 20px">
                    <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
                    <span class="font-small">操作信息</span>
                </div>
                <el-table
                    style="margin-top: 20px; width: 100%"
                    ref="orderHistoryTable"
                    :data="order.historyList"
                    border
                >
                    <el-table-column label="操作者" width="120">
                        <template v-slot="scope">
                            {{ scope.row.operateMan }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template v-slot="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" width="120">
                        <template v-slot="scope">
                            {{ formatStatus_filter(scope.row.orderStatus) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="付款状态" width="120">
                        <template v-slot="scope">
                            {{ formatPayStatus_filter(scope.row.orderStatus) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发货状态" width="120">
                        <template v-slot="scope">
                            {{ formatDeliverStatus_filter(scope.row.orderStatus) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注">
                        <template v-slot="scope">
                            {{ scope.row.note }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-dialog
                title="备注订单"
                v-model="markOrderDialogVisible"
                width="660px"
                align-center
                :close-on-click-modal="false"
                @close="cancelMarkOrder"
            >
                <el-form :model="markInfo" label-width="90px">
                    <el-form-item label="操作备注：">
                        <el-input v-model="markInfo.note" type="textarea" rows="3" class="input-width"> </el-input>
                    </el-form-item>
                </el-form>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="cancelMarkOrder">取消</el-button>
                        <el-button type="primary" @click="handleMarkOrder">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { getOrderDetail, cacelOrder, updateOrderNote, deleteOrder } from '@/api/order';
import { formatDate } from '@/utils/date';
import { ORDER_PAY_TYPE, PAY_STATUS } from '@utils/constants';

export default {
    name: 'ownOrderDetail',
    data() {
        return {
            id: null,
            order: {},
            isLoading: false,
            markOrderDialogVisible: false,
            markInfo: { note: null }
        };
    },
    created() {
        this.id = this.$route.query.id;
        this.getOrderDetails();
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        getOrderDetails() {
            this.isLoading = true;

            getOrderDetail(this.id)
                .then((resp) => {
                    this.order = resp.data;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

        formatProductAttr_filter(value) {
            if (value) {
                let attr = JSON.parse(value);
                let result = '';

                for (let i = 0; i < attr.length; i++) {
                    if (Object.keys(attr[i]).length) {
                        result += attr[i].key;
                        result += ':';
                        result += attr[i].value;
                        result += ';';
                    }
                }

                return result;
            }
        },
        formatDeliverStatus_filter(value) {
            if (value === 0 || value === 1) {
                return '未发货';
            } else {
                return '已发货';
            }
        },
        formatPayStatus_filter(value) {
            if (value === 0) {
                return '未支付';
            } else if (value === 4) {
                return '已退款';
            } else {
                return '已支付';
            }
        },
        formatStatus_filter(value) {
            return PAY_STATUS[value];
        },
        formatAddress_filter(order) {
            let str = order.receiverProvince || '';

            if (order.receiverCity != null) {
                str += '  ' + (order.receiverCity || '');
            }

            str += '  ' + (order.receiverRegion || '');
            str += '  ' + (order.receiverDetailAddress || '');

            return str;
        },
        formatOrderType_filter(value) {
            return value === 1 ? '秒杀订单' : '正常订单';
        },
        formatSourceType_filter(value) {
            return value === 1 ? 'APP订单' : 'PC订单';
        },
        formatPayType_filter(value) {
            return ORDER_PAY_TYPE[value] || '未支付';
        },
        formatLongText_filter(value) {
            if (value === undefined || value === null || value === '') {
                return '暂无';
            } else if (value.length > 8) {
                return value.substr(0, 8) + '...';
            } else {
                return value;
            }
        },
        formatNull_filter(value) {
            if (value === undefined || value === null || value === '') {
                return '暂无';
            } else {
                return value;
            }
        },

        formatTime(time) {
            if (time == null || time === '') {
                return '';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        formatStepStatus(value) {
            if (value === 1) {
                //待发货
                return 2;
            } else if (value === 2) {
                //已发货
                return 3;
            } else if (value === 3) {
                //已完成
                return 4;
            } else {
                //待付款、已关闭、无限订单
                return 1;
            }
        },
        showCloseOrderDialog() {
            this.$confirm('确定要取消该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isLoading = true;

                cacelOrder({ orderId: this.id })
                    .then(() => {
                        this.getOrderDetails();
                        this.$message({
                            message: '取消成功！',
                            type: 'success'
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            });
        },
        showMarkOrderDialog() {
            this.markOrderDialogVisible = true;
            this.markInfo.id = this.id;
        },
        cancelMarkOrder() {
            this.markOrderDialogVisible = false;
            this.markInfo.note = '';
            this.markInfo.id = '';
        },
        handleMarkOrder() {
            this.$confirm('是否要备注订单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('id', this.markInfo.id);
                params.append('note', this.markInfo.note);
                params.append('status', this.order.status);

                updateOrderNote(params).then(() => {
                    this.markOrderDialogVisible = false;
                    this.markInfo.note = '';
                    this.markInfo.id = '';
                    this.$message({
                        type: 'success',
                        message: '订单备注成功!'
                    });
                    this.getOrderDetails();
                });
            });
        },
        handleDeleteOrder() {
            this.$confirm('确定要删除该订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.isLoading = true;

                deleteOrder({ orderId: this.id })
                    .then(() => {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.$router.back();
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            });
        }
    }
};
</script>

<style scoped>
.detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
}

.operate-container {
    background: #f2f6fc;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .order-detail-status-title {
        display: flex;
        align-items: center;

        .status-text {
            font-size: 20px;
        }
    }
}

.operate-button-container {
    float: right;
    margin-right: 20px;
}

.table-layout {
    margin-top: 20px;
    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
}

.table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
}

.table-cell-title {
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    background: #f2f6fc;
    text-align: center;
    font-size: 14px;
    color: #303133;
}
</style>
