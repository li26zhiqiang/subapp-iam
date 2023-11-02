<template>
    <div class="check-card-container">
        <div
            v-for="(item, index) in options"
            :key="index"
            @click="toggleSelection(item)"
            :class="{
                'check-card-item': true,
                active: item.key === state.selectedKey,
                disabled: item.disabled,
                [item.class || '']: !!item.class
            }"
        >
            <div class="card">
                <img :src="item.image" />
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, reactive } from 'vue';
import './index.less';

const props = defineProps({
    options: {
        type: Array, // { key, title, description, image, disabled, class }
        default: () => []
    },
    selectedKey: String
});

const emit = defineEmits(['change']);

const state = reactive({
    selectedKey: props.selectedKey
});

function toggleSelection(option) {
    const { key, disabled } = option;

    if (!disabled && key !== state.selectedKey) {
        state.selectedKey = option.key;
        emit('change', option);
    }
}
</script>
