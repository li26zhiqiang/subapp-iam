<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <div>
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="资源名称：">
                                <el-input
                                    v-model="listQuery.nameKeyword"
                                    class="input-width"
                                    placeholder="资源名称"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资源路径：">
                                <el-input
                                    v-model="listQuery.urlKeyword"
                                    class="input-width"
                                    placeholder="资源路径"
                                    clearable
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="资源分类：">
                                <el-select
                                    v-model="listQuery.categoryId"
                                    placeholder="全部"
                                    clearable
                                    class="input-width"
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
                                <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()">
                                    重置
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-card>

        <el-card class="operate-container" shadow="never">
            <el-button type="primary" class="btn-add" @click="handleAdd()">添加</el-button>
            <el-button type="primary" class="btn-add" @click="handleShowCategory()">资源分类</el-button>
        </el-card>

        <div class="table-container">
            <el-table ref="resourceTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="资源名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="资源路径">
                    <template v-slot="scope">{{ scope.row.url }}</template>
                </el-table-column>
                <el-table-column label="描述">
                    <template v-slot="scope">{{ scope.row.description }}</template>
                </el-table-column>
                <el-table-column label="添加时间" width="160">
                    <template v-slot="scope">{{ formatDateTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog
            :title="isEdit ? '编辑资源' : '添加资源'"
            v-model="dialogVisible"
            width="660px"
            align-center
            :close-on-click-modal="false"
        >
            <el-form :model="resource" ref="resourceForm" label-width="90px">
                <el-form-item label="资源名称：">
                    <el-input v-model="resource.name"></el-input>
                </el-form-item>
                <el-form-item label="资源路径：">
                    <el-input v-model="resource.url"></el-input>
                </el-form-item>
                <el-form-item label="资源分类：">
                    <el-select v-model="resource.categoryId" placeholder="全部" clearable class="input-width">
                        <el-option
                            v-for="item in categoryOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input v-model="resource.description" type="textarea" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, createResource, updateResource, deleteResource } from '@/api/resource';
import { listAllCate } from '@/api/resourceCategory';
import { formatDate } from '@/utils/date';
import { MENU_PATH } from '@utils/constants';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    nameKeyword: null,
    urlKeyword: null,
    categoryId: null
};
const defaultResource = {
    id: null,
    name: null,
    url: null,
    categoryId: null,
    description: ''
};
export default {
    name: 'resourceList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
            resource: Object.assign({}, defaultResource),
            isEdit: false,
            categoryOptions: [],
            defaultCategoryId: null
        };
    },
    created() {
        this.getList();
        this.getCateList();
    },
    methods: {
        formatDateTime_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.resource = Object.assign({}, defaultResource);
            this.resource.categoryId = this.defaultCategoryId;
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该资源吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteResource(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.resource = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('确定要添加/修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateResource(this.resource.id, this.resource).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createResource(this.resource).then((response) => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                }
            });
        },
        handleShowCategory() {
            this.$router.push({ path: MENU_PATH.resourceCategory });
        },
        getList() {
            this.listLoading = true;

            fetchList(this.listQuery)
                .then((response) => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        },
        getCateList() {
            listAllCate().then((response) => {
                let cateList = response.data;

                for (let i = 0; i < cateList.length; i++) {
                    let cate = cateList[i];
                    this.categoryOptions.push({ label: cate.name, value: cate.id });
                }

                this.defaultCategoryId = cateList[0].id;
            });
        }
    }
};
</script>
