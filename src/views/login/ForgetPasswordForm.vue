<template>
    <template v-if="getShow">
        <LoginFormTitle class="enter-x" />
        <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
            <FormItem name="account" class="enter-x">
                <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.resetAccount')" />
            </FormItem>

            <FormItem name="password" class="enter-x">
                <StrengthMeter
                    size="large"
                    v-model:value="formData.password"
                    :placeholder="t('sys.login.newPassword')"
                />
            </FormItem>
            <FormItem name="confirmPassword" class="enter-x">
                <InputPassword
                    size="large"
                    visibilityToggle
                    v-model:value="formData.confirmPassword"
                    :placeholder="t('sys.login.confirmNewPassword')"
                />
            </FormItem>

            <FormItem name="mobile" class="enter-x">
                <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" />
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
                    v-model:value="formData.sms"
                    :placeholder="t('sys.login.smsCode')"
                    :sendCodeApi="sendCodesms"
                />
            </FormItem>

            <div class="login-error-message" v-if="!!errorInfo">{{ errorInfo }}</div>

            <FormItem class="enter-x">
                <Button type="primary" size="large" block @click="handleReset" :loading="loading">
                    {{ t('common.resetText') }}
                </Button>
                <Button size="large" block class="mt-4" @click="handleBackLogin">
                    {{ t('sys.login.backSignIn') }}
                </Button>
            </FormItem>
        </Form>
    </template>
</template>
<script lang="ts" setup>
import { reactive, ref, computed, unref } from 'vue';
import VerifyCode from '@components/VerifyCode/index.vue';
import { Form, Input, Button } from 'ant-design-vue';
import LoginFormTitle from './LoginFormTitle.vue';
import { StrengthMeter } from '@components/StrengthMeter';
import { CountdownInput } from '@/components/CountDown';
import { useI18ns } from '@/hooks/web/useI18ns';
import { resetPassword } from '@/api/login';
import { useMessage } from '@/hooks/web/useMessage';
import { useLoginState, useFormRules, LoginStateEnum, useFormValid, sendSmsCode } from './useLogin';

const InputPassword = Input.Password;
const FormItem = Form.Item;

const formRef = ref();
const loading = ref(false);
const errorInfo = ref('');
const errorCode = ref();
const formData = reactive({
    account: '',
    mobile: '',
    sms: '',
    password: '',
    confirmPassword: '',
    verifyCode: ''
});

const { t } = useI18ns();
const { handleBackLogin, getLoginState } = useLoginState();
const { notification } = useMessage();
const { getFormRules } = useFormRules(formData, { accountIncludeEmailPhone: true });
const { validForm } = useFormValid(formRef);

const getShow = computed(() => {
    errorInfo.value = '';
    return unref(getLoginState) === LoginStateEnum.RESET_PASSWORD;
});

async function handleReset() {
    const data = await validForm();

    // 发送注册请求
    if (data) {
        try {
            loading.value = true;
            const { password, account, mobile, sms, verifyCode } = data;

            const resp = await resetPassword({
                username: account,
                phone: mobile,
                phoneAuthCode: sms,
                newPassword: password,
                verifyCode
            });

            notification.success({
                message: t('sys.login.resetPSWSuccessTitle'),
                duration: 3
            });

            // 重置成功以后跳转到登录页面
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
