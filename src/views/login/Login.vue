<template>
    <div :class="`${prefixCls} ${isMobile ? 'mobile' : ''}`" class="relative">
        <div class="flex items-center absolute">
            <!-- <AppLocalePicker
                class="text-white enter-x xl:text-gray-600"
                :show-text="false"
                v-if="!sessionTimeout && showLocale"
            /> -->
        </div>

        <div class="container">
            <div class="flex left">
                <AppLogo class="-enter-x" />
                <div class="login-description" v-if="!isMobile">
                    <Carousel autoplay arrows class="login-box">
                        <div class="login-banner">
                            <img :alt="title" src="../../assets/images/banner-1.png" />
                            <div class="text">智能写作助理：轻松写作，下笔如有神</div>
                        </div>
                        <div class="login-banner">
                            <img :alt="title" src="../../assets/images/banner-2.png" />
                            <div class="text">AI小画家：您说我画，创意无极限</div>
                        </div>
                        <div class="login-banner">
                            <img :alt="title" src="../../assets/images/banner-3.png" />
                            <div class="text">秒懂问答：说出疑问，一切都有答案</div>
                        </div>
                        <div class="login-banner">
                            <img :alt="title" src="../../assets/images/banner-4.png" />
                            <div class="text">智能编程：您说我写，编码不再枯燥</div>
                        </div>
                    </Carousel>

                    <div class="title">
                        <span class="inline-block mt-4 text-3xl"> {{ t('sys.login.signInTitle') }}</span>
                    </div>
                    <div class="description">
                        {{ t('sys.login.signInDesc') }}
                    </div>
                </div>
            </div>
            <div class="flex right">
                <div
                    :class="`${prefixCls}-form`"
                    class="relative w-full px-5 py-8 mx-auto my-auto rounded-md shadow-md xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x"
                >
                    <LoginForm />
                    <ForgetPasswordForm />
                    <RegisterForm />
                    <MobileForm />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Carousel } from 'ant-design-vue';
import { AppLogo } from '@components/Application';
import LoginForm from './LoginForm.vue';
import ForgetPasswordForm from './ForgetPasswordForm.vue';
import RegisterForm from './RegisterForm.vue';
import MobileForm from './MobileForm.vue';
import { useDesign } from '@/hooks/web/useDesign';
import { LoginStateEnum, useLoginState } from './useLogin';
import { useI18ns } from '@/hooks/web/useI18ns';
import useMobile from '@/hooks/useMobile';

defineProps({
    sessionTimeout: {
        type: Boolean
    }
});

const isMobile = useMobile();
const { prefixCls } = useDesign('login');
const { setLoginState } = useLoginState();
const { t } = useI18ns();
const title = '拓云智能';

const route = useRoute();

onMounted(() => {
    const { query } = route;

    if (query.type === 'register') {
        setLoginState(LoginStateEnum.REGISTER);
    }
});
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-login';
@form-prefix-cls: ~'@{namespace}-login-form';
@logo-prefix-cls: ~'@{namespace}-app-logo';
@countdown-prefix-cls: ~'@{namespace}-countdown-input';
@dark-bg: #293146;

html[data-theme='dark'] {
    .@{prefix-cls} {
        background-color: @dark-bg;

        &::before {
            background-image: url('@/assets/svg/login-bg-dark.svg');
        }

        .ant-input,
        .ant-input-password {
            background-color: #232a3b;
        }

        .ant-btn:not(.ant-btn-link, .ant-btn-primary) {
            border: 1px solid #4a5569;
        }

        &-form {
            background: transparent !important;
        }

        .app-iconify {
            color: #fff;
        }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
        -webkit-text-fill-color: #c9d1d9 !important;
        box-shadow: inherit !important;
    }
}

.@{prefix-cls} {
    display: flex;
    height: 100%;
    overflow: hidden;
    background-color: #f1f5f8;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-left: -48%;
        background-image: url('@/assets/svg/login-bg.svg');
        background-repeat: no-repeat;
        background-position: 100%;
        background-size: auto 100%;
    }

    &.mobile {
        &::before {
            margin-left: 0;
        }

        .container {
            .left {
                width: auto;
            }

            .right {
                width: 100%;
            }
        }
    }

    .@{form-prefix-cls} {
        background-color: #ffffff;
        padding: 32px;
        border-radius: 4px;
        box-shadow: 0 3px 4px -4px rgba(0, 0, 0, 0.12), 0 6px 8px 0 rgba(0, 0, 0, 0.08),
            0 9px 11px 4px rgba(0, 0, 0, 0.05);
        box-shadow: 0px 0px 20px rgba(200, 200, 200, 0.5);
        border: 1px solid #dadce0;
    }

    .@{logo-prefix-cls} {
        position: absolute;
        top: 12px;
        height: 30px;

        &__title {
            color: #fff;
            font-size: 16px;
        }

        img {
            width: 32px;
        }
    }

    .container {
        padding: 8px 64px;
        position: relative;
        display: flex;
        min-width: 100%;

        .flex {
            display: flex;
        }

        .left {
            width: 50%;

            .login-description {
                margin-top: auto;
                margin-bottom: auto;
                color: #fff;
                width: 100%;

                .login-box {
                    width: 460px;
                    height: 540px;

                    > div {
                        width: 460px;
                        height: 540px;
                    }

                    .login-banner {
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        img {
                            width: 460px;
                            height: 460px;
                        }

                        .text {
                            color: #ffffff;
                            font-size: 16px;
                            text-align: center;
                            height: 40px;
                            line-height: 40px;
                        }
                    }
                }

                .title {
                    font-weight: 500;
                    margin-top: 40px;
                    font-size: 30px;
                }

                .description {
                    font-weight: 400;
                    margin-top: 20px;
                }
            }
        }

        .right {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .@{logo-prefix-cls} {
            display: flex;
            width: 60%;
            height: 80px;
            padding-left: 68px;

            &__title {
                color: #fff;
                font-size: 40px;
            }

            img {
                width: 48px;
            }
        }
    }

    &-sign-in-way {
        .anticon {
            color: #888;
            font-size: 22px;
            cursor: pointer;

            &:hover {
                color: @primary-color;
            }
        }
    }

    input:not([type='checkbox']) {
        min-width: 360px;

        @media (max-width: @screen-xl) {
            min-width: 320px;
        }

        @media (max-width: @screen-lg) {
            min-width: 260px;
        }

        @media (max-width: @screen-md) {
            min-width: 240px;
        }

        @media (max-width: @screen-sm) {
            min-width: 160px;
        }
    }

    .@{countdown-prefix-cls} input {
        min-width: unset;
    }
}
</style>
