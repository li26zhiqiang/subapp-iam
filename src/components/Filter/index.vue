<template>
    <el-card class="filter-container" shadow="never">
        <el-row :gutter="10">
            <el-col :span="6">
                <el-form :inline="true" :model="listQuery" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input
                            v-model="listQuery.keyword"
                            class="input-width"
                            placeholder="帐号/姓名"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-form :inline="true" :model="listQuery" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input
                            v-model="listQuery.keyword"
                            class="input-width"
                            placeholder="帐号/姓名"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-form :inline="true" :model="listQuery" label-width="140px">
                    <el-form-item label="输入搜索：">
                        <el-input
                            v-model="listQuery.keyword"
                            class="input-width"
                            placeholder="帐号/姓名"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <div class="filter-operation">
                    <el-button style="float: right" type="primary" @click="handleSearchList()"> 查询 </el-button>
                    <el-button style="float: right; margin-right: 15px" @click="handleResetSearch()"> 重置 </el-button>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {};
</script>
