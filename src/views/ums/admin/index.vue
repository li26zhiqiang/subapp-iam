<template>
    <div class="app-container">
        <el-card class="filter-container" shadow="never">
            <el-form :inline="true" :model="listQuery" label-width="70px">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="关键字:">
                            <el-input
                                v-model="listQuery.keyword"
                                class="input-width"
                                placeholder="帐号 / 姓名"
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
            <el-table ref="adminTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="60">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="帐号">
                    <template v-slot="scope">{{ scope.row.username }}</template>
                </el-table-column>
                <!-- <el-table-column label="姓名">
                    <template v-slot="scope">{{ scope.row.nickName }}</template>
                </el-table-column> -->
                <el-table-column label="邮箱">
                    <template v-slot="scope">{{ scope.row.email }}</template>
                </el-table-column>
                <el-table-column label="手机">
                    <template v-slot="scope">{{ scope.row.phone }}</template>
                </el-table-column>
                <el-table-column label="备注" width="200">
                    <template v-slot="scope">{{ scope.row.note }}</template>
                </el-table-column>
                <el-table-column label="添加时间" width="160">
                    <template v-slot="scope">{{ formatDateTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="最后登录" width="160">
                    <template v-slot="scope">{{ formatDateTime_filter(scope.row.loginTime) }}</template>
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
                <el-table-column label="操作" width="180">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleSelectRole(scope.$index, scope.row)"
                            >分配角色</el-button
                        >
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <!-- <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
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
            :title="isEdit ? '编辑用户' : '添加用户'"
            v-model="dialogVisible"
            width="660px"
            align-center
            :close-on-click-modal="false"
        >
            <el-form :model="admin" ref="adminForm" label-width="90px">
                <el-form-item label="帐号：">
                    <el-input v-model="admin.username"></el-input>
                </el-form-item>
                <!-- <el-form-item label="姓名：">
                    <el-input v-model="admin.nickName"></el-input>
                </el-form-item> -->
                <el-form-item label="邮箱：">
                    <el-input v-model="admin.email"></el-input>
                </el-form-item>
                <el-form-item label="手机：">
                    <el-input v-model="admin.phone"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input v-model="admin.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="admin.note" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-radio-group v-model="admin.status">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleDialogConfirm()">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog
            title="分配角色"
            v-model="allocDialogVisible"
            width="540px"
            align-center
            :close-on-click-modal="false"
        >
            <el-select v-model="allocRoleIds" multiple placeholder="请选择" style="width: 100%">
                <el-option v-for="item in allRoleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="allocDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAllocDialogConfirm()">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    getUserList,
    createAdmin,
    updateAdmin,
    updateStatus,
    deleteAdmin,
    getRoleByAdmin,
    allocRole
} from '@/api/login';
import { getAllRoleList } from '@/api/role';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultAdmin = {
    id: null,
    username: null,
    password: null,
    // nickName: null,
    email: null,
    note: null,
    status: 1
};

export default {
    name: 'adminList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
            admin: Object.assign({}, defaultAdmin),
            isEdit: false,
            allocDialogVisible: false,
            allocRoleIds: [],
            allRoleList: [],
            allocAdminId: null
        };
    },
    created() {
        this.getList();
        this.getAllRoleList();
    },
    methods: {
        formatDateTime_filter(time) {
            if (!time) {
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
            this.admin = Object.assign({}, defaultAdmin);
        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
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
            this.$confirm('确定要删除该用户吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteAdmin(row.id).then((response) => {
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
            this.admin = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('确定要修改吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateAdmin(this.admin.id, this.admin).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createAdmin(this.admin).then((response) => {
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
        handleAllocDialogConfirm() {
            this.$confirm('确定要分配角色吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('adminId', this.allocAdminId);
                params.append('roleIds', this.allocRoleIds);

                allocRole(params).then((response) => {
                    this.$message({
                        message: '分配成功！',
                        type: 'success'
                    });
                    this.allocDialogVisible = false;
                });
            });
        },
        handleSelectRole(index, row) {
            this.allocAdminId = row.id;
            this.allocDialogVisible = true;
            this.getRoleListByAdmin(row.id);
        },
        getList() {
            this.listLoading = true;

            getUserList(this.listQuery)
                .then((response) => {
                    this.list = response.data.list;
                    this.total = response.data.total;
                })
                .finally(() => {
                    this.listLoading = false;
                });
        },
        getAllRoleList() {
            getAllRoleList().then((response) => {
                this.allRoleList = response.data;
            });
        },
        getRoleListByAdmin(adminId) {
            getRoleByAdmin(adminId).then((response) => {
                let allocRoleList = response.data;
                this.allocRoleIds = [];

                if (allocRoleList !== null && allocRoleList.length > 0) {
                    for (let i = 0; i < allocRoleList.length; i++) {
                        this.allocRoleIds.push(allocRoleList[i].id);
                    }
                }
            });
        }
    }
};
</script>
