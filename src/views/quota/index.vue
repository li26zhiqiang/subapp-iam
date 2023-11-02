<template>
    <div class="app-container" v-loading="state.isLoading">
        <el-card shadow="never" class="page-card quota-container" header="">
            <el-card shadow="never" class="page-card-border page-card-padding">
                <template #header>
                    <div class="card-header">
                        <span>余额概览</span>
                    </div>
                </template>

                <el-row :gutter="30" class="member-balance-list">
                    <el-col
                        :xs="24"
                        :sm="12"
                        :md="8"
                        :lg="8"
                        :xl="8"
                        v-for="(item, index) in state.quotaMargins"
                        :key="item.id"
                        class="member-balance-col"
                    >
                        <div class="member-balance-item">
                            <svg-icon :icon-class="QUOTA_SUPPLIER_DESP[item.supplier]?.icon" class="image"></svg-icon>

                            <div class="content">
                                <div class="header">
                                    <div class="margin-list">
                                        <div class="quota" v-for="margin in item.marginList">
                                            {{ margin.title }}:
                                            <span class="value">{{ margin.value }}</span>
                                        </div>
                                    </div>

                                    <i class="flavor">
                                        {{ item.flavor }}
                                    </i>
                                </div>

                                <div class="footer">
                                    <div class="title">
                                        {{ QUOTA_SUPPLIER_DESP[item.supplier]?.balance }}
                                        <span class="buy" @click="onClickBuy"> 去购买 ></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <el-divider direction="vertical" class="balance-divider" v-if="!isMobile" />
                    </el-col>
                </el-row>

                <el-empty v-if="state.quotaMargins?.length <= 0">
                    <template #image>
                        <img src="../../assets/images/nodata.svg" />
                    </template>
                    <template #description>
                        <div class="empty-desp">
                            您还没有购买任何套餐，
                            <span class="buy" @click="onClickBuy"> 去购买 ></span>
                        </div>
                    </template>
                </el-empty>
            </el-card>

            <el-card shadow="never" class="page-card-border page-card-padding quota-record">
                <template #header>
                    <div class="card-header">
                        <span>消费记录</span>
                    </div>
                </template>

                <div class="quota-record-list">
                    <el-table :data="state.quotaRecordList">
                        <el-table-column prop="supplier" label="交易套餐" width="180" />
                        <el-table-column prop="flavor" label="套餐规格" width="180" />

                        <el-table-column prop="total" label="套餐总量" width="200">
                            <template #default="scope">
                                <div class="margin-list">
                                    <div class="quota" v-for="total in scope.row.total">
                                        {{ total.title }}:
                                        <span class="value">{{ total.value }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="used" label="交易明细" width="200">
                            <template #default="scope">
                                <div class="margin-list">
                                    <div class="quota" v-for="used in scope.row.used">
                                        {{ used.title }}:
                                        <span class="value">{{ used.value }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="margin" label="当前余额" width="200">
                            <template #default="scope">
                                <div class="margin-list">
                                    <div class="quota" v-for="margin in scope.row.margin">
                                        {{ margin.title }}:
                                        <span class="value">{{ margin.value }}</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="margin" label="交易操作" width="100">
                            <template #default="scope">
                                <el-tag
                                    class="ml-2"
                                    :type="QUOTA_ACTION_TYPE[scope.row.action_type].type"
                                    effect="light"
                                >
                                    {{ QUOTA_ACTION_TYPE[scope.row.action_type].title }}
                                </el-tag>
                            </template>
                        </el-table-column>

                        <el-table-column prop="tenant_name" label="交易人" />
                        <el-table-column prop="created" label="交易时间" width="180" />
                    </el-table>

                    <div class="pagination-container">
                        <el-pagination
                            background
                            layout="total, sizes,prev, pager, next,jumper"
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
            </el-card>
        </el-card>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';

import { getQuotaMargin, getQuotaRecord } from '@/api/quota';
import { MENU_PATH, QUOTA_SUPPLIER_DESP, QUOTA_MARGIN_TITLE, QUOTA_ACTION_TYPE } from '@utils/constants';
import { parseObject } from '@utils/index';
import useMobile from '@/hooks/useMobile';

import './index.less';

const isMobile = useMobile();
const router = useRouter();

const state = reactive({
    isLoading: false,
    buyLoading: false,
    payLoading: false,
    payMessage: '',
    currentOrderInfo: {},
    quotaMargins: [],
    quotaRecordList: [],
    listQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0
    }
});

onMounted(() => {
    getQuotaList();
    getQuotaRecordList();
});

function getQuotaList() {
    state.isLoading = true;

    getQuotaMargin()
        .then((response) => {
            response.data?.forEach((item) => {
                const obj = parseObject(item.margin);

                item.marginList = Object.entries(obj || {}).map(([key, value]) => {
                    return {
                        title: QUOTA_MARGIN_TITLE[key],
                        value
                    };
                });
            });
            
            state.quotaMargins = response.data;
        })
        .finally(() => {
            state.isLoading = false;
        });
}

function getQuotaRecordList() {
    getQuotaRecord({
        pageNo: state.listQuery.pageNum,
        pageSize: state.listQuery.pageSize
    }).then((resp) => {
        const { resultList, total } = resp?.data || {};

        resultList.forEach((item) => {
            item.created = moment(item.created).format('YYYY-MM-DD HH:mm:ss');
            item.supplier = QUOTA_SUPPLIER_DESP[item.supplier]?.title;
            item.margin = handleMargin(item.margin);
            item.total = handleMargin(item.total);
            item.used = handleMargin(item.used);
        });

        state.quotaRecordList = resultList || [];
        state.listQuery.total = total || 0;
    });
}

function handleMargin(margin) {
    const obj = parseObject(margin);

    return Object.entries(obj || {}).map(([key, value]) => {
        return {
            title: QUOTA_MARGIN_TITLE[key],
            value
        };
    });
}

function handleSizeChange(val) {
    state.listQuery.pageNum = 1;
    state.listQuery.pageSize = val;
    getQuotaRecordList();
}

function handleCurrentChange(val) {
    state.listQuery.pageNum = val;
    getQuotaRecordList();
}

// 体验
function onClickBuy() {
    router.push({ path: MENU_PATH.costCenter });
}
</script>
