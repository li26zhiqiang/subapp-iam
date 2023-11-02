<template>
    <div class="app-root-container">
        <router-view />
    </div>
</template>

<script>
import { getInfo } from '@/api/login';
import { gotoHome } from '@utils/util';
import { getToken } from '@utils/auth';

export default {
    name: 'App',
    created() {
        // 刷新登录界面，如果是已登录状态直接跳转到主页
        this.checkLoginStatus();
    },
    methods: {
        async checkLoginStatus() {
            const resp = await getInfo({ Authorization: getToken(), notShowError: true });

            if (resp?.data?.uuid) {
                gotoHome();
            }
        }
    }
};
</script>
