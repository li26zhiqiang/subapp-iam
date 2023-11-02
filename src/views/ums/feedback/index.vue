<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="问题标题：">
                                <el-input
                                    v-model="listQuery.title"
                                    class="input-width"
                                    placeholder="请输入问题标题"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="是否解决：">
                                <el-select
                                    v-model="listQuery.resolved"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in resolvedOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="问题类别：">
                                <el-select
                                    v-model="listQuery.category"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in categoryOptions"
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
                <el-table :data="list" style="width: 100%" v-loading="listLoading" border>
                    <el-table-column label="问题标题" prop="title" width="160"></el-table-column>
                    <el-table-column label="问题描述" prop="description" width="250"></el-table-column>
                    <el-table-column label="问题类别" width="120">
                        <template v-slot="scope">{{ formatCategory(scope.row.category) }}</template>
                    </el-table-column>
                    <el-table-column label="是否已解决" width="120">
                        <template v-slot="scope">
                            <el-switch
                                inline-prompt
                                @change="onClickModifyModal(scope.row)"
                                :active-value="true"
                                :inactive-value="false"
                                active-text="是"
                                inactive-text="否"
                                v-model="scope.row.resolved"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户名" prop="tenant_name" width="120"></el-table-column>
                    <el-table-column label="完成时间" width="200">
                        <template v-slot="scope">{{ formatTime(scope.row.finished_time) }}</template>
                    </el-table-column>
                    <el-table-column label="创建时间" width="200">
                        <template v-slot="scope">{{ formatTime(scope.row.create_time) }}</template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark"></el-table-column>
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

            <el-dialog title="编辑" v-model="dialogVisible" width="660px" align-center :close-on-click-modal="false">
                <el-form :model="currentRecord" label-width="90px">
                    <el-form-item label="备注：">
                        <el-input v-model="currentRecord.remark" type="textarea" :rows="5"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="是否解决：">
                        <el-switch
                            inline-prompt
                            :active-value="true"
                            :inactive-value="false"
                            active-text="是"
                            inactive-text="否"
                            v-model="currentRecord.resolved"
                        >
                        </el-switch>
                    </el-form-item> -->
                </el-form>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="modifyFeedback()">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import { getFeedbackList, updateFeedback } from '@/api/feedback';
import { formatDate } from '@/utils/date';
import { FEEDBACK_CATEGORY } from '@utils/constants';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,

    title: null, // 过滤没有值的不要传递
    resolved: null,
    category: null
};

export default {
    name: 'feedbackList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            listLoading: true,
            list: null,
            total: null,
            resolvedOptions: [
                {
                    label: '已解决',
                    value: true
                },
                {
                    label: '未解决',
                    value: false
                }
            ],
            categoryOptions: Object.entries(FEEDBACK_CATEGORY).map(([key, value]) => {
                return { label: value, value: key };
            }),
            dialogVisible: false,
            currentRecord: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatCategory(value) {
            return FEEDBACK_CATEGORY[value] || value;
        },
        formatTime(time) {
            let date = new Date(time);
            return time ? formatDate(date, 'yyyy-MM-dd hh:mm:ss') : '--';
        },
        getList() {
            this.listLoading = true;
            const { title, resolved, category, ...other } = this.listQuery;

            getFeedbackList({
                ...other,
                ...(title ? { title } : {}),
                ...(category ? { category } : {}),
                ...(typeof resolved === 'boolean' ? { resolved } : {})
            })
                .then((resp) => {
                    this.list = resp.data.resultList;
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
        onClickModifyModal(row) {
            this.dialogVisible = true;
            this.currentRecord = { ...row };
        },
        modifyFeedback() {
            this.listLoading = true;
            const { id, remark } = this.currentRecord;

            updateFeedback(id, { remark })
                .then(() => {
                    this.$message({
                        message: '修改成功！',
                        type: 'success'
                    });
                })
                .finally(() => {
                    this.dialogVisible = false;
                    this.listLoading = false;
                    this.currentRecord = {};
                    this.getList();
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
