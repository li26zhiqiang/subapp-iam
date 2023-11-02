<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">添加菜单</span>
            </template>
        </el-page-header>

        <menu-detail :is-edit="false"></menu-detail>
    </div>
</template>

<script>
import MenuDetail from './components/MenuDetail';
export default {
    name: 'addMenu',
    components: { MenuDetail },
    methods: {
        onBack() {
            this.$router.back();
        }
    }
};
</script>
