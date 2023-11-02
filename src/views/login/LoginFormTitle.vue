<template>
    <h2 class="login-form-title mb-3 text-2xl font-bold text-center xl:text-3xl enter-x xl:text-left">
        {{ getFormTitle }}
    </h2>
</template>
<script lang="ts" setup>
import { computed, unref } from 'vue';
import { useI18ns } from '@/hooks/web/useI18ns';
import { LoginStateEnum, useLoginState } from './useLogin';

const { t } = useI18ns();

const { getLoginState } = useLoginState();

const getFormTitle = computed(() => {
    const titleObj = {
        [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
        [LoginStateEnum.LOGIN]: t('sys.login.signInFormTitle'),
        [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
        [LoginStateEnum.MOBILE]: t('sys.login.signInFormTitle')
    };
    return titleObj[unref(getLoginState)];
});
</script>
<style lang="less">
.login-form-title {
    font-size: 28px;
}
</style>
