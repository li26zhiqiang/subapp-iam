<template>
    <div class="app-container">
        <el-card shadow="never" class="page-card">
            <el-descriptions title="个人信息" border :column="isMobile ? 1 : 3" direction="horizontal">
                <el-descriptions-item label="用户名">
                    {{ info.username }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号">{{ info.phone }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ info.email }}</el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
</template>

<script>
import { getuserInfoById } from '@/api/login';

export default {
    name: 'userDesp',
    data() {
        console.log('window.globalInfo=', window.globalInfo);
        return {
            info: {},
            isLoading: false,
            isMobile: window.globalInfo?.isMobile
        };
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            this.isLoading = true;
            const id = window.globalInfo?.user?.id;

            getuserInfoById(id)
                .then((response) => {
                    const { username, phone, email, icon } = response.data;
                    this.info = { username, phone, email, icon };
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    }
};
</script>
