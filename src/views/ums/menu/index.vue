<template>
    <div class="app-container">
        <el-page-header v-if="parentId !== 0" @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">子菜单</span>
            </template>
        </el-page-header>

        <el-card class="operate-container" shadow="never">
            <el-button type="primary" class="btn-add" @click="handleAddMenu()">添加</el-button>
        </el-card>

        <div class="table-container">
            <el-table ref="menuTable" style="width: 100%" :data="list" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="菜单名称">
                    <template v-slot="scope">{{ scope.row.title }}</template>
                </el-table-column>
                <el-table-column label="菜单级数" width="100">
                    <template v-slot="scope">{{ levelFilter_filter(scope.row.level) }}</template>
                </el-table-column>
                <el-table-column label="前端名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="前端图标" width="100">
                    <template v-slot="scope"><svg-icon :icon-class="scope.row.icon"></svg-icon></template>
                </el-table-column>
                <el-table-column label="是否显示" width="100">
                    <template v-slot="scope">
                        <el-switch
                            @change="handleHiddenChange(scope.$index, scope.row)"
                            :active-value="0"
                            :inactive-value="1"
                            v-model="scope.row.hidden"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="100">
                    <template v-slot="scope">{{ scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="设置" width="120">
                    <template v-slot="scope">
                        <el-button
                            link
                            type="primary"
                            :disabled="disableNextLevel_filter(scope.row.level)"
                            @click="handleShowNextLevel(scope.$index, scope.row)"
                            >查看下级
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
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
                    :page-size="listQuery.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    v-model:current-page="listQuery.pageNum"
                    :total="total"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetchList, deleteMenu, updateMenu, updateHidden } from '@/api/menu';

export default {
    name: 'menuList',
    data() {
        return {
            list: null,
            total: null,
            listLoading: true,
            listQuery: {
                pageNum: 1,
                pageSize: 10
            },
            parentId: 0
        };
    },
    created() {
        this.resetParentId();
        this.getList();
    },
    watch: {
        $route(route) {
            this.resetParentId();
            this.getList();
        }
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        disableNextLevel_filter(value) {
            if (value === 0) {
                return false;
            } else {
                return true;
            }
        },
        levelFilter_filter(value) {
            if (value === 0) {
                return '一级';
            } else if (value === 1) {
                return '二级';
            }
        },
        resetParentId() {
            this.listQuery.pageNum = 1;
            if (this.$route.query.parentId) {
                this.parentId = this.$route.query.parentId;
            } else {
                this.parentId = 0;
            }
        },
        handleAddMenu() {
            this.$router.push('/ums/menu/addMenu');
        },
        getList() {
            this.listLoading = true;
            fetchList(this.parentId, this.listQuery)
                .then((response) => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
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
        },
        handleHiddenChange(index, row) {
            updateHidden(row.id, { hidden: row.hidden }).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        handleShowNextLevel(index, row) {
            this.$router.push({ path: '/ums/menu', query: { parentId: row.id } });
        },
        handleUpdate(index, row) {
            this.$router.push({ path: '/ums/menu/updateMenu', query: { id: row.id } });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该菜单吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteMenu(row.id).then((response) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        }
    }
};
</script>
