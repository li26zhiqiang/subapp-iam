import * as Vue from 'vue';
import * as Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';

const store = Vuex.createStore({
    modules: {
        app,
        user,
        permission
    },
    getters
});

export default store;
