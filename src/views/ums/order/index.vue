<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="输入搜索：">
                                <el-input
                                    v-model="listQuery.orderSn"
                                    class="input-width"
                                    placeholder="订单编号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="收货人：">
                                <el-input
                                    v-model="listQuery.memberUsername"
                                    class="input-width"
                                    placeholder="收货人姓名"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提交时间：">
                                <el-date-picker
                                    class="input-width"
                                    v-model="listQuery.createTime"
                                    value-format="YYYY-MM-DD"
                                    type="date"
                                    placeholder="请选择时间"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单状态：">
                                <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单分类：">
                                <el-select
                                    v-model="listQuery.orderType"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in orderTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单来源：">
                                <el-select
                                    v-model="listQuery.sourceType"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in sourceTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <div class="filter-operation">
                                <el-button style="float: right" type="primary" @click="handleSearchList()">
                                    查询
                                </el-button>
                                <el-button style="float: right; margin-right: 16px" @click="handleResetSearch()">
                                    重置
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <div class="table-container">
                <el-table
                    ref="orderTable"
                    :data="list"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                >
                    <el-table-column label="订单编号" width="250">
                        <template v-slot="scope">{{ scope.row.orderSn }}</template>
                    </el-table-column>
                    <el-table-column label="提交时间" width="200">
                        <template v-slot="scope">{{ formatCreateTime_filter(scope.row.createTime) }}</template>
                    </el-table-column>
                    <el-table-column label="用户账号" width="150">
                        <template v-slot="scope">{{ scope.row.memberUsername }}</template>
                    </el-table-column>
                    <el-table-column label="订单金额" width="120">
                        <template v-slot="scope">￥{{ scope.row.totalAmount }}</template>
                    </el-table-column>
                    <el-table-column label="支付方式" width="120">
                        <template v-slot="scope">{{ formatPayType_filter(scope.row.payType) }}</template>
                    </el-table-column>
                    <el-table-column label="订单状态" width="120">
                        <template v-slot="scope">
                            <OrderStatus :status="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="订单来源">
                        <template v-slot="scope">{{ formatSourceType_filter(scope.row.sourceType) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleViewOrder(scope.$index, scope.row)">
                                查看
                            </el-button>
                            <el-button
                                link
                                type="danger"
                                @click="handleCloseOrder(scope.$index, scope.row)"
                                v-show="scope.row.status === 0"
                            >
                                取消
                            </el-button>
                            <el-button
                                link
                                type="danger"
                                @click="handleDeleteOrder(scope.$index, scope.row)"
                                v-show="scope.row.status === 4"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="total, sizes,prev, pager, next,jumper"
                        v-model:current-page="listQuery.pageNum"
                        :page-size="listQuery.pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :total="total"
                    >
                    </el-pagination>
                </div>
            </div>
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import OrderStatus from '@components/OrderStatus/index.vue';
import { getOrderList, cacelOrder, deleteOrder } from '@/api/order';
import { formatDate } from '@/utils/date';
import { ORDER_PAY_TYPE } from '@utils/constants';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    memberUsername: null,
    status: null,
    orderType: null,
    sourceType: null,
    createTime: null
};

export default {
    name: 'orderList',
    components: {
        OrderStatus
    },
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            listLoading: true,
            list: null,
            total: null,
            operateType: null,
            multipleSelection: [],
            statusOptions: [
                {
                    label: '待付款',
                    value: 0
                },
                {
                    label: '待发货',
                    value: 1
                },
                {
                    label: '已发货',
                    value: 2
                },
                {
                    label: '已完成',
                    value: 3
                },
                {
                    label: '已关闭',
                    value: 4
                }
            ],
            orderTypeOptions: [
                {
                    label: '正常订单',
                    value: 0
                },
                {
                    label: '秒杀订单',
                    value: 1
                }
            ],
            sourceTypeOptions: [
                {
                    label: 'PC订单',
                    value: 0
                },
                {
                    label: 'APP订单',
                    value: 1
                }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatSourceType_filter(value) {
            return value === 1 ? 'APP订单' : 'PC订单';
        },
        formatPayType_filter(value) {
            return ORDER_PAY_TYPE[value] || '未支付';
        },
        formatCreateTime_filter(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        getList() {
            this.listLoading = true;

            getOrderList(this.listQuery)
                .then((resp) => {
                    this.list = resp.data.list;
                    this.total = resp.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleViewOrder(index, row) {
            this.$router.push({ path: '/ums/order/orderDetail', query: { id: row.id } });
        },
        handleCloseOrder(index, row) {
            this.$confirm('确定要取消该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.listLoading = true;

                cacelOrder({ orderId: row.id })
                    .then(() => {
                        this.getList();
                        this.$message({
                            message: '取消成功！',
                            type: 'success'
                        });
                    })
                    .finally(() => {
                        this.listLoading = false;
                    });
            });
        },
        handleDeleteOrder(index, row) {
            this.$confirm('确定要删除该订单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.listLoading = true;

                deleteOrder({ orderId: row.id })
                    .then(() => {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.getList();
                    })
                    .finally(() => {
                        this.listLoading = false;
                    });
            });
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        }
    }
};
</script>
