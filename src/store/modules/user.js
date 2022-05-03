import Auth from "@/apis/auth";
import { Message } from "element-ui";
import router from "@/router";

const state = { user: null };

const getters = {
  username: state => (state.user === null ? "未登录" : state.user.username),
  initial: state => (state.user === null ? "未" : state.user.username.charAt(0))
};

const mutations = {
  setUser(state, payload) {
    state.user = payload.user;
  }
};

const actions = {
  login({ commit }, { username, password }) {
    return Auth.login({ username, password }).then(res => {
      commit("setUser", { user: res.data });
      // console.log(res);
      Message.success("登录成功🏖");
    });
  },
  register({ commit }, { username, password }) {
    return Auth.register({ username, password }).then(res => {
      commit("setUser", { user: res.data });
      // console.log(res);
      Message.success("恭喜，注册成功🎉");
    });
  },
  checkLogin({ commit }, payload) {
    return Auth.getInfo().then(res => {
      if (res.isLogin) {
        commit("setUser", { user: res.data });
      } else {
        router.push(payload);
      }
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
