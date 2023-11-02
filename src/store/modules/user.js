import { getInfo } from '@/api/login';

const user = {
    state: {
        name: '',
        avatar: '',
        roles: [],
        sessionId: ''
    },

    mutations: {
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_SESSIONID: (state, sessionId) => {
            state.sessionId = sessionId;
        }
    },

    actions: {
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo()
                    .then((response) => {
                        const data = response.data;

                        if (data.roles && data.roles.length > 0) {
                            // 验证返回的roles是否是一个非空数组
                            commit('SET_ROLES', data.roles);
                        } else {
                            reject('getInfo: roles must be a non-null array !');
                        }

                        commit('SET_NAME', data.username);
                        commit('SET_AVATAR', data.icon);
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        setSessionId({ commit }, data) {
            commit('SET_SESSIONID', data.sessionId);
        }
    }
};

export default user;
