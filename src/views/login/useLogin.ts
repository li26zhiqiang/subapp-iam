import type { FormInstance } from 'ant-design-vue/lib/form/Form';
import type { RuleObject, NamePath } from 'ant-design-vue/lib/form/interface';
import type { AxiosError } from 'axios';
import { ref, computed, unref, Ref } from 'vue';

import { useI18ns } from '@/hooks/web/useI18ns';
import { HOME_PATH, EXPERIENCE_PATH } from '@utils/constants';
import { getSmsCode } from '@/api/login';

export enum LoginStateEnum {
    LOGIN,
    REGISTER,
    RESET_PASSWORD,
    MOBILE,
    QR_CODE
}

const currentState = ref(LoginStateEnum.LOGIN);

// 这里也可以优化
// import { createGlobalState } from '@vueuse/core'

export function useLoginState() {
    function setLoginState(state: LoginStateEnum) {
        currentState.value = state;
    }

    const getLoginState = computed(() => currentState.value);

    function handleBackLogin() {
        setLoginState(LoginStateEnum.LOGIN);
    }

    return { setLoginState, getLoginState, handleBackLogin };
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
    const validate = computed(() => {
        const form = unref(formRef);
        return form?.validate ?? ((_nameList?: NamePath) => Promise.resolve());
    });

    async function validForm() {
        const form = unref(formRef);

        if (!form) {
            return;
        }

        const data = await form.validate();

        return data as T;
    }

    return { validate, validForm };
}

export function useFormRules(formData?: Recordable, other?: Record<string, any>) {
    const { t } = useI18ns();
    const { accountIncludeEmail, accountIncludeEmailPhone } = other || {};

    const validatePolicy = async (_: RuleObject, value: boolean) => {
        return !value ? Promise.reject(t('sys.login.policyPlaceholder')) : Promise.resolve();
    };

    const validateConfirmPassword = (password: string) => {
        return async (_: RuleObject, value: string) => {
            if (!value) {
                return Promise.reject(t('sys.login.passwordPlaceholder'));
            }

            if (value !== password) {
                return Promise.reject(t('sys.login.diffPwd'));
            }

            return Promise.resolve();
        };
    };

    const getAccountFormRule = computed(() => {
        return [
            ...createRule(t('sys.login.accountPlaceholder')),
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (value) {
                        const isValidAccount = /^[a-zA-Z][a-zA-Z0-9_-]{4,31}$/.test(value);
                        const isValidEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
                        const isValidPhone =
                            /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/.test(value);

                        if (accountIncludeEmailPhone) {
                            if (!isValidAccount && !isValidEmail && !isValidPhone) {
                                return callback(new Error(t('sys.login.accountEmailPhoneValidateMsg')));
                            }
                        } else if (accountIncludeEmail) {
                            if (!isValidAccount && !isValidEmail) {
                                return callback(new Error(t('sys.login.accountEmailValidateMsg')));
                            }
                        } else {
                            if (!isValidAccount) {
                                return callback(new Error(t('sys.login.accountValidateMsg')));
                            }
                        }
                    }

                    return callback();
                },
                trigger: 'change'
            }
        ];
    });

    const getPasswordFormRule = computed(() => {
        return [
            ...createRule(t('sys.login.passwordPlaceholder')),
            {
                validator: (rule: any, value: any, callback: any) => {
                    if (value) {
                        const isValid =
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!\"#$%&'()*+,-./:;<=>?@\[\]^_`{|}~]).{8,20}$/.test(value);

                        if (!isValid) {
                            return callback(new Error(t('sys.login.passwordValidateMsg')));
                        }
                    }

                    return callback();
                },
                trigger: 'change'
            }
        ];
    });
    const getConfirmPasswordFormRule = computed(() => {
        return [{ validator: validateConfirmPassword(formData?.password), trigger: 'change' }];
    });
    const getSmsFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));
    const getMobileFormRule = computed(() => {
        const rule = createRule(t('sys.login.mobilePlaceholder'));

        return [
            ...rule,
            {
                pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
                message: t('sys.login.mobileValidateMsg')
            }
        ];
    });
    const getEmailFormRule = computed(() => {
        const rule = createRule(t('sys.login.emailPlaceholder'));

        return [...rule, { type: 'email', message: t('sys.login.emailValidateMsg') }];
    });
    const getVerifyCodeFormRule = computed(() => createRule(t('sys.login.smsPlaceholder')));

    const getFormRules = computed(() => {
        const accountFormRule = unref(getAccountFormRule);
        const passwordFormRule = unref(getPasswordFormRule);
        const confirmPasswordFormRule = unref(getConfirmPasswordFormRule);
        const smsFormRule = unref(getSmsFormRule);
        const mobileFormRule = unref(getMobileFormRule);
        const emailFormRule = unref(getEmailFormRule);
        const verifyCodeFormRule = unref(getVerifyCodeFormRule);

        const mobileRule = {
            sms: smsFormRule,
            mobile: mobileFormRule
        };
        switch (unref(currentState)) {
            // register form rules
            case LoginStateEnum.REGISTER:
                return {
                    account: accountFormRule,
                    password: passwordFormRule,
                    confirmPassword: confirmPasswordFormRule,
                    policy: [{ validator: validatePolicy, trigger: 'change' }],
                    email: emailFormRule,
                    verifyCode: verifyCodeFormRule,
                    ...mobileRule
                };

            // reset password form rules    重置密码
            case LoginStateEnum.RESET_PASSWORD:
                return {
                    account: accountFormRule,
                    password: passwordFormRule,
                    confirmPassword: confirmPasswordFormRule,
                    verifyCode: verifyCodeFormRule,
                    ...mobileRule
                };

            // mobile form rules    手机号登录
            case LoginStateEnum.MOBILE:
                return {
                    verifyCode: verifyCodeFormRule,
                    policy: [{ validator: validatePolicy, trigger: 'change' }],
                    ...mobileRule
                };

            // login form rules
            default:
                return {
                    account: accountFormRule,
                    password: passwordFormRule,
                    verifyCode: verifyCodeFormRule
                };
        }
    });

    return { getFormRules };
}

function createRule(message: string) {
    return [
        {
            type: 'string',
            required: true,
            message,
            trigger: 'change'
        }
    ];
}

export async function sendSmsCode(formRef, callback) {
    try {
        const form = unref(formRef);
        if (form) {
            const data = await form.validateFields(['mobile', 'verifyCode']);
            // 发送获取验证码请求
            await getSmsCode({ telephone: data.mobile, verifyCode: data.verifyCode });

            callback({
                errorCode: '',
                errorInfo: ' ' // 需要设置为空格，避免展示没有必要的错误信息
            });

            return true;
        }
    } catch (error: any) {
        const err = error as unknown as AxiosError;
        const data: Record<string, any> = err?.response?.data || {};

        if (!error?.errorFields) {
            callback({
                errorCode: (data?.code || err?.code) + '|' + new Date().valueOf(),
                errorInfo: data?.message || err?.message || err
            });
        }
    }

    return false;
}
