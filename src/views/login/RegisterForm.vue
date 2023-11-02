<template>
    <div v-if="getShow">
        <LoginFormTitle class="enter-x" />
        <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
            <FormItem name="account" class="enter-x">
                <Input
                    class="fix-auto-fill"
                    size="large"
                    v-model:value="formData.account"
                    :placeholder="t('sys.login.userName')"
                />
            </FormItem>
            <FormItem name="email" class="enter-x">
                <Input
                    size="large"
                    v-model:value="formData.email"
                    :placeholder="t('sys.login.email')"
                    class="fix-auto-fill"
                />
            </FormItem>

            <FormItem name="password" class="enter-x">
                <StrengthMeter size="large" v-model:value="formData.password" :placeholder="t('sys.login.password')" />
            </FormItem>
            <FormItem name="confirmPassword" class="enter-x">
                <InputPassword
                    size="large"
                    visibilityToggle
                    v-model:value="formData.confirmPassword"
                    :placeholder="t('sys.login.confirmPassword')"
                />
            </FormItem>

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

            <Button type="primary" class="enter-x" size="large" block @click="handleRegister" :loading="loading">
                {{ t('sys.login.registerButton') }}
            </Button>
            <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
                {{ t('sys.login.backSignIn') }}
            </Button>
        </Form>
    </div>
</template>
<script lang="ts" setup>
import type { AxiosError } from 'axios';
import { reactive, ref, unref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Form, Input, Button, Checkbox } from 'ant-design-vue';
import VerifyCode from '@components/VerifyCode/index.vue';
import LoginFormTitle from './LoginFormTitle.vue';
import { StrengthMeter } from '@components/StrengthMeter';
import { CountdownInput } from '@components/CountDown';
import { useMessage } from '@/hooks/web/useMessage';
import { useI18ns } from '@/hooks/web/useI18ns';
import * as api from '@/api/login';
import { useLoginState, useFormRules, useFormValid, LoginStateEnum, sendSmsCode } from './useLogin';

const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18ns();
const { handleBackLogin, getLoginState } = useLoginState();
const { notification } = useMessage();
const route = useRoute();

const formRef = ref();
const loading = ref(false);
const errorInfo = ref('');
const errorCode = ref();

const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    email: '',
    sms: '',
    policy: false,
    verifyCode: ''
});

const { getFormRules } = useFormRules(formData);
const { validForm } = useFormValid(formRef);

const getShow = computed(() => {
    errorInfo.value = '';
    return unref(getLoginState) === LoginStateEnum.REGISTER;
});

async function handleRegister() {
    const data = await validForm();

    // 发送注册请求
    if (data) {
        try {
            loading.value = true;
            const { password, account, email, mobile, sms, verifyCode, policy } = data;
            const { query } = route;

            const resp = await api.register({
                username: account,
                email: email,
                phone: mobile,
                sms,
                password: password,
                policy,
                verifyCode,
                mode: 'none', //不要默认的错误提示
                from: query.from
            });

            notification.success({
                message: t('sys.login.registerSuccessTitle'),
                duration: 3
            });

            // 注册成功以后跳转到登录页面
            handleBackLogin();
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
}

function updateErrorMsg(data) {
    errorCode.value = data.errorCode;
    errorInfo.value = data.errorInfo || t('sys.api.networkExceptionMsg');
}

async function sendCodesms() {
    return await sendSmsCode(formRef, updateErrorMsg);
}
</script>
