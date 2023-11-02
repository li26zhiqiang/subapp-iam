<template>
    <div class="hamburger" @click="toggleClick">
        <el-icon v-if="isActive"><ElIconFold /></el-icon>
        <el-icon v-else><ElIconExpand /></el-icon>
    </div>
</template>

<script>
export default {
    components: {},
    name: 'hamburger',
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        toggleClick: {
            type: Function,
            default: null
        }
    }
};
</script>

<style scoped>
.hamburger {
    width: 100%;
    height: 32px;
    border-top: 1px solid rgba(5, 5, 5, 0.06);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 8px 8px;
    cursor: pointer;
    &:hover {
        color: #006af5;
    }
}
</style>
