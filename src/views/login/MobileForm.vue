<template>
    <div v-if="getShow">
        <LoginFormTitle class="enter-x" />

        <Tabs v-model:activeKey="activeKey" @change="onClickTab">
            <TabPane :key="LoginStateEnum.LOGIN" :tab="t('sys.login.passwordSignInFormTitle')"></TabPane>
            <TabPane :key="LoginStateEnum.MOBILE" :tab="t('sys.login.mobileSignInFormTitle')"></TabPane>
        </Tabs>

        <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
            <FormItem name="mobile" class="enter-x">
                <Input
                    size="large"
                    v-model:value="formData.mobile"
                    :placeholder="t('sys.login.mobile')"
                    class="fix-auto-fill"
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
            <FormItem name="sms" class="enter-x">
                <CountdownInput
                    size="large"
                    class="fix-auto-fill"
                    v-model:value="formData.sms"
                    :placeholder="t('sys.login.smsCode')"
                    :sendCodeApi="sendCodesms"
                />
            </FormItem>

            <FormItem class="enter-x" name="policy">
                <Checkbox v-model:checked="formData.policy" size="small">
                    {{ t('sys.login.policy') }}
                    <a href="https://tuoyunai.com/doc/userAgreement.html" target="_blank">{{
                        t('sys.login.policy1')
                    }}</a>
                    {{ t('sys.login.policy3') }}
                    <a href="https://tuoyunai.com/doc/privacyPolicy.html" target="_blank">{{
                        t('sys.login.policy2')
                    }}</a>
                </Checkbox>
            </FormItem>

            <div class="login-error-message" v-if="!!errorInfo">{{ errorInfo }}</div>

            <FormItem class="enter-x">
                <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
                    {{ t('sys.login.loginButton') }}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, unref } from 'vue';
import { Form, Input, Button, Tabs, Checkbox } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import VerifyCode from '@components/VerifyCode/index.vue';
import { CountdownInput } from '@components/CountDown';
import { useMessage } from '@/hooks/web/useMessage';
import { useI18ns } from '@/hooks/web/useI18ns';
import { loginByPhone } from '@/api/login';
import { setToken } from '@utils/auth';
import { gotoHome } from '@utils/util';
import LoginFormTitle from './LoginFormTitle.vue';
import { useLoginState, useFormRules, useFormValid, LoginStateEnum, sendSmsCode } from './useLogin';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const { t } = useI18ns();
const { getLoginState, setLoginState } = useLoginState();
const { notification } = useMessage();
const { getFormRules } = useFormRules();
const route = useRoute();

const formRef = ref();
const loading = ref(false);
const errorInfo = ref('');
const errorCode = ref();
const activeKey = ref(LoginStateEnum.MOBILE);

const formData = reactive({
    mobile: '',
    sms: '',
    verifyCode: '',
    policy: false
});

const { validForm } = useFormValid(formRef);

const getShow = computed(() => {
    errorInfo.value = '';
    activeKey.value = LoginStateEnum.MOBILE;
    return unref(getLoginState) === LoginStateEnum.MOBILE;
});

async function handleLogin() {
    const data = await validForm();

    if (data) {
        try {
            loading.value = true;

            const { mobile, sms, policy } = data;
            const { query } = route;
            const { data: tokenInfo } = await loginByPhone({
                phone: mobile,
                phoneAuthCode: sms,
                policy,
                from: query.from
            });

            const { tokenHead, token } = tokenInfo || {};

            notification.success({
                message: t('sys.login.loginSuccessTitle'),
                description: `${t('sys.login.loginSuccessDesc')} ${mobile}`,
                duration: 3
            });

            setToken(tokenHead + token);

            // 跳转到首页
            gotoHome();
        } catch (error) {
            const err = error as unknown as AxiosError;

            updateErrorMsg({
                errorCode: (err?.response?.data?.code || err?.code) + '|' + new Date().valueOf(),
                errorInfo: err?.response?.data?.message || err?.message || err || t('sys.api.networkExceptionMsg')
            });
        } finally {
            loading.value = false;
        }
    }

    console.log(data);
}

function updateErrorMsg(data) {
    errorCode.value = data.errorCode;
    errorInfo.value = data.errorInfo || t('sys.api.networkExceptionMsg');
}

async function sendCodesms() {
    return await sendSmsCode(formRef, updateErrorMsg);
}

function onClickTab(key) {
    activeKey.value = key;
    setLoginState(key);
}
</script>
