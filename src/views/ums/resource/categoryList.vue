<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">资源分类</span>
            </template>
        </el-page-header>

        <el-card shadow="never" class="operate-container">
            <el-button type="primary" class="btn-add" @click="handleAdd()">添加</el-button>
        </el-card>

        <div class="table-container">
            <el-table ref="resourceCategoryTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="创建时间">
                    <template v-slot="scope">{{ formatDateTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="排序">
                    <template v-slot="scope">{{ scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="添加分类" v-model="dialogVisible" width="660px" align-center :close-on-click-modal="false">
            <el-form :model="resourceCategory" ref="resourceCategoryForm" label-width="90px">
                <el-form-item label="名称：">
                    <el-input v-model="resourceCategory.name"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="resourceCategory.sort"></el-input>
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
import {
    listAllCate,
    createResourceCategory,
    updateResourceCategory,
    deleteResourceCategory
} from '@/api/resourceCategory';
import { formatDate } from '@/utils/date';
const defaultResourceCategory = {
    name: null,
    sort: 0
};
export default {
    name: 'resourceCategoryList',
    data() {
        return {
            list: null,
            listLoading: false,
            dialogVisible: false,
            isEdit: false,
            resourceCategory: Object.assign({}, defaultResourceCategory)
        };
    },
    created() {
        this.getList();
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        formatDateTime_filter(time) {
            if (!time) {
                return '--';
            }

            let date = new Date(time);

            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.resourceCategory = Object.assign({}, defaultResourceCategory);
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.resourceCategory = Object.assign({}, row);
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该分类吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteResourceCategory(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleDialogConfirm() {
            this.$confirm('确定要添加/修改?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateResourceCategory(this.resourceCategory.id, this.resourceCategory).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createResourceCategory(this.resourceCategory).then((response) => {
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
        getList() {
            this.listLoading = true;

            listAllCate({})
                .then((response) => {
                    this.list = response.data;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        }
    }
};
</script>
