<template>
    <Input v-bind="$attrs" :class="prefixCls" :size="size" :maxlength="20" :value="state">
        <template #addonAfter>
            <div class="code-img">
                <p id="picContainer"></p>
                <a @click="updateCode">换一张</a>
            </div>
        </template>

        <template #[item]="data" v-for="item in Object.keys($slots).filter((k) => k !== 'addonAfter')">
            <slot :name="item" v-bind="data || {}"></slot>
        </template>
    </Input>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { Input } from 'ant-design-vue';
import { useDesign } from '@/hooks/web/useDesign';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { getVerifyCodeImage } from '@/api/login';
import store from '@/store';

const props = {
    value: { type: String },
    size: { type: String, validator: (v: string) => ['default', 'large', 'small'].includes(v) },
    errorCode: { type: String }
};

export default defineComponent({
    name: 'VerifyCode',
    components: { Input },
    inheritAttrs: false,
    props,
    setup(props) {
        const { prefixCls } = useDesign('code-input');
        const [state] = useRuleFormItem(props);

        onMounted(() => {
            updateCode();
        });

        watch(
            () => props.errorCode,
            (errorCode) => {
                // 表示验证码出错了
                if (
                    errorCode?.startsWith('1002|') ||
                    errorCode?.startsWith('1003|') ||
                    errorCode?.startsWith('1005|')
                ) {
                    updateCode();
                }
            }
        );

        function updateCode() {
            getVerifyCodeImage().then((resp) => {
                const arrayBufferView = new Uint8Array(resp.data);
                const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
                const urlCreator = window.URL || window.webkitURL;
                const url = urlCreator.createObjectURL(blob);
                let image = new Image();

                image.onload = () => {
                    const pic = document.getElementById('picContainer');

                    if (pic?.childNodes?.length) {
                        pic?.removeChild(pic.childNodes[0]);
                    }

                    pic?.append(image);
                    urlCreator.revokeObjectURL(url);

                    store.dispatch('setSessionId', { sessionId: resp.headers?.temp_session_id || '' });
                };

                image.src = url;
                image.width = 100;
                image.height = 40;
            });
        }

        return { prefixCls, state, updateCode };
    }
});
</script>

<style lang="less">
@prefix-cls: ~'@{namespace}-code-input';

.@{prefix-cls} {
    input:not([type='checkbox']) {
        min-width: unset !important;
    }

    .ant-input-group-addon {
        padding-right: 0;
        border: none;
        background-color: transparent;

        button {
            font-size: 14px;
        }
    }

    .code-img {
        display: flex;
        justify-content: center;
        align-items: center;

        #picContainer {
            margin-bottom: 0px;
            margin-right: 8px;
        }
    }
}
</style>
