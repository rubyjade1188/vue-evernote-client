// 需要什么数据，数据最好是最原始的数据
const state = {};

// 原始数据有一部分要呈现给对外的模板，需要给模版去用的，放到getters里面
// 可以认为是 store 的计算属性
const getters = {};

// 修改state，改完之后，getters里的东西也会变
const mutations = {};

// actions用来放异步的请求，用于去做复杂的逻辑，成功之后再去commit，相当于调用mutation里的方法去修改state
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
