<template>
    <div v-if="getShow">
        <LoginFormTitle class="enter-x" />

        <Tabs v-model:activeKey="activeKey" @change="onClickTab">
            <TabPane :key="LoginStateEnum.LOGIN" tab="密码登录"></TabPane>
            <TabPane :key="LoginStateEnum.MOBILE" tab="手机登录"></TabPane>
        </Tabs>

        <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef" @keypress.enter="handleLogin">
            <FormItem name="account" class="enter-x">
                <Input
                    size="large"
                    v-model:value="formData.account"
                    :placeholder="t('sys.login.account')"
                    class="fix-auto-fill"
                />
            </FormItem>
            <FormItem name="password" class="enter-x">
                <InputPassword
                    size="large"
                    visibilityToggle
                    v-model:value="formData.password"
                    :placeholder="t('sys.login.password')"
                />
            </FormItem>
            <FormItem name="verifyCode" class="enter-x">
                <VerifyCode
                    size="large"
                    class="fix-auto-fill"
                    v-model:value="formData.verifyCode"
                    :placeholder="t('sys.login.verifyCode')"
                    :errorCode="errorCode"
                />
            </FormItem>

            <div class="login-error-message" v-if="!!errorInfo">{{ errorInfo }}</div>

            <FormItem class="enter-x">
                <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
                    {{ t('sys.login.loginButton') }}
                </Button>
            </FormItem>

            <div class="enter-x footer-operation">
                <div class="operation-item" @click="setLoginState(LoginStateEnum.REGISTER)">
                    {{ t('sys.login.registerButton') }}
                </div>

                <Divider :span="2" type="vertical" />

                <div class="operation-item" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
                    {{ t('sys.login.forgetPassword') }}
                </div>
            </div>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue';
import { Form, Input, Button, Tabs, Divider } from 'ant-design-vue';

import LoginFormTitle from './LoginFormTitle.vue';
import VerifyCode from '@components/VerifyCode/index.vue';
import { useI18ns } from '@/hooks/web/useI18ns';
import { useMessage } from '@/hooks/web/useMessage';
import * as api from '@/api/login';
import { setUserName, setToken } from '@utils/auth';
import { gotoHome } from '@utils/util';
import store from '@/store';
import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';

const FormItem = Form.Item;
const InputPassword = Input.Password;
const TabPane = Tabs.TabPane;

const formRef = ref();
const errorInfo = ref('');
const errorCode = ref();
const activeKey = ref(LoginStateEnum.LOGIN);
const loading = ref(false);
const formData = reactive({
    account: '',
    password: '',
    verifyCode: ''
});

const { t } = useI18ns();
const { notification } = useMessage();
const { setLoginState, getLoginState } = useLoginState();
const { getFormRules } = useFormRules(formData, { accountIncludeEmail: true });
const { validForm } = useFormValid(formRef);

const getShow = computed(() => {
    errorInfo.value = '';
    activeKey.value = LoginStateEnum.LOGIN;
    return unref(getLoginState) === LoginStateEnum.LOGIN;
});

async function handleLogin() {
    const data = await validForm();

    if (data) {
        try {
            loading.value = true;

            const { password, account, verifyCode } = data;
            const { data: userInfo } = await api.login(
                {
                    password: password,
                    username: account,
                    verifyCode,
                    mode: 'none' //不要默认的错误提示
                },
                {
                    temp_session_id: store.getters.sessionId
                }
            );

            const { tokenHead, token } = userInfo || {};

            notification.success({
                message: t('sys.login.loginSuccessTitle'),
                description: `${t('sys.login.loginSuccessDesc')} ${account}`,
                duration: 3
            });

            setUserName(account);
            setToken(tokenHead + token);

            // 跳转到首页
            gotoHome();
        } catch (error) {
            const err = error as unknown as AxiosError;

            errorCode.value = (err?.response?.data?.code || err?.code) + '|' + new Date().valueOf();
            errorInfo.value = err?.response?.data?.message || err?.message || err || t('sys.api.networkExceptionMsg');
        } finally {
            loading.value = false;
        }
    }
}

function onClickTab(key) {
    activeKey.value = key;
    setLoginState(key);
}
</script>

<style lang="less">
.footer-operation {
    display: flex;
    align-items: center;
    justify-content: center;

    .operation-item {
        color: #999999;
        cursor: pointer;

        &:hover {
            color: #18b3b3;
        }
    }
}
</style>
