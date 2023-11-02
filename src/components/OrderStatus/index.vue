<template>
    <div :class="`status type-${status}`">
        {{ PAY_STATUS[status] }}
    </div>
</template>

<script setup>
import { PAY_STATUS } from '@utils/constants';

const props = defineProps({
    status: Number
});
</script>

<style lang="less">
.status {
    color: #ffffff;
    padding: 0 8px;
    width: 80px;
    text-align: center;

    // 待付款
    &.type-0 {
        background: #ffb800;
    }

    // 待发货
    &.type-1 {
        background: #52c41a;
    }

    // 已发货
    &.type-2 {
        background: #faad14;
    }

    // 已完成
    &.type-3 {
        background: #0e9f4f;
    }

    // 已关闭
    &.type-4 {
        background: #409eff;
    }

    // 无效订单
    &.type-5 {
        background: #909399;
    }
}
</style>
