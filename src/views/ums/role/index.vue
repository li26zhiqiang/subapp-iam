<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <el-form :inline="true" :model="listQuery" label-width="80px">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="角色名称:">
                            <el-input
                                v-model="listQuery.keyword"
                                class="input-width"
                                placeholder="角色名称"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
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
        </el-card>

        <el-card class="operate-container" shadow="never">
            <el-button type="primary" class="btn-add" @click="handleAdd()">添加</el-button>
        </el-card>

        <div class="table-container">
            <el-table ref="roleTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="角色名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="描述">
                    <template v-slot="scope">{{ scope.row.description }}</template>
                </el-table-column>
                <el-table-column label="用户数" width="100">
                    <template v-slot="scope">{{ scope.row.adminCount }}</template>
                </el-table-column>
                <el-table-column label="添加时间" width="160">
                    <template v-slot="scope">{{ formatDateTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="是否启用" width="140">
                    <template v-slot="scope">
                        <el-switch
                            @change="handleStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                            v-model="scope.row.status"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template v-slot="scope">
                        <el-row>
                            <el-button link type="primary" @click="handleSelectMenu(scope.$index, scope.row)">
                                分配菜单
                            </el-button>
                            <el-button link type="primary" @click="handleSelectResource(scope.$index, scope.row)">
                                分配资源
                            </el-button>
                        </el-row>
                        <el-row>
                            <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">
                                编辑
                            </el-button>
                            <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </el-row>
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
            :title="isEdit ? '编辑角色' : '添加角色'"
            v-model="dialogVisible"
            width="660px"
            align-center
            :close-on-click-modal="false"
        >
            <el-form :model="role" ref="roleForm" label-width="90px">
                <el-form-item label="角色名称：">
                    <el-input v-model="role.name"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input v-model="role.description" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="role.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
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
import { getRoleList, createRole, updateRole, updateStatus, deleteRole } from '@/api/role';
import { formatDate } from '@/utils/date';
import { MENU_PATH } from '@utils/constants';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultRole = {
    id: null,
    name: null,
    description: null,
    adminCount: 0,
    status: 1
};
export default {
    name: 'roleList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
            role: Object.assign({}, defaultRole),
            isEdit: false
        };
    },
    created() {
        this.getList();
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
            this.role = Object.assign({}, defaultRole);
        },
        handleStatusChange(index, row) {
            this.$confirm('确定要修改该状态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    updateStatus(row.id, { status: row.status }).then((response) => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                    this.getList();
                });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该角色吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('ids', [row.id]);

                deleteRole(params).then((response) => {
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
            this.role = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('确定要创建/修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateRole(this.role.id, this.role).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createRole(this.role).then((response) => {
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
        handleSelectMenu(index, row) {
            this.$router.push({ path: MENU_PATH.allocMenu, query: { roleId: row.id } });
        },
        handleSelectResource(index, row) {
            this.$router.push({
                path: MENU_PATH.allocResource,
                query: { roleId: row.id }
            });
        },
        getList() {
            this.listLoading = true;

            getRoleList(this.listQuery)
                .then((response) => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        }
    }
};
</script>
