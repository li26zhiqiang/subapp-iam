import './public-path';
import { createApp } from 'vue';

import App from './views/login/App';
import store from './store';
import router from './router/login';
import actions from './actions';
import { setupI18n } from '@/locales/setupI18n';
import '@utils/setFontSize';

import './styles/animate.less';
import './index.less';

let instance = null;

async function renderApp() {
    instance = createApp(App);

    instance.config.globalProperties.routerAppend = (path, pathToAppend) => {
        return path + (path.endsWith('/') ? '' : '/') + pathToAppend;
    };

    instance.use(store);
    instance.use(router);

    await setupI18n(instance);

    instance.mount('#login-app');
}

function render() {
    renderApp();
}

function storeTest(props) {
    if (props) {
        actions.setAction(props);
        actions.onGlobalStateChange((value, prev) => {
            console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev);
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
        instance?.unmount();
        instance = null;
    }
}
