import './public-path';
import { createApp } from 'vue';
import ElementUI from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import locale from 'element-plus/dist/locale/zh-cn.mjs';
import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-plus/dist/index.css';

import App from './App';
import store from './store';
import router from './router';
import actions from './actions';
import { ROOT_PATH } from '@utils/constants';
import { registerSVGICON } from '@/icons'; // icon
import '@/permission'; // permission control

import '@/styles/index.less'; // global css
import './index.less';

let instance = null;

function renderApp() {
    instance = createApp(App);

    instance.config.globalProperties.routerAppend = (path, pathToAppend) => {
        return path + (path.endsWith('/') ? '' : '/') + pathToAppend;
    };

    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        instance.component('ElIcon' + key, component);
    }

    instance.use(store);
    instance.use(router);
    instance.use(ElementUI, { locale });
    registerSVGICON(instance);

    instance.mount('#app');
}

function render() {
    if (process.env.NODE_ENV === 'production') {
        if (!window.location.pathname.startsWith(ROOT_PATH)) {
            const newPath = ROOT_PATH + window.location.pathname;
            const url = window.location.href.replace(window.location.pathname, newPath);
            window.location.href = url;
        } else {
            renderApp();
        }
    } else {
        renderApp();
    }
}

function storeTest(props) {
    if (props) {
        actions.setAction(props);
        actions.onGlobalStateChange((state, prev) => {
            window.globalInfo = state;
        }, true);
    }
}

if (!window.__POWERED_BY_QIANKUN__) {
    render({});
}

export async function bootstrap() {
    console.log('vue app bootstraped');
}

export async function mount(props) {
    console.log('props from main framework', props);
    storeTest(props);
    render(props);
}

export async function unmount() {
    if (instance) {
        // instance.$destroy();
        instance?.unmount();
        instance = null;
    }
}
