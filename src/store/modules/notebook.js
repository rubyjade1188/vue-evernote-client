import Notebook from "@/apis/notebooks";
import { Message } from "element-ui";
import { satisfies } from "semver";

const state = {
  notebooks: null,
  curBookId: null
};

const getters = {
  notebooks: state => state.notebooks || [],
  curBook: state => {
    if (!Array.isArray(state.notebooks)) return {};
    if (!state.curBookId) return state.notebooks[0];
    return (
      state.notebooks.find(notebook => notebook.id == state.curBookId) || {}
    );
  }
};

const mutations = {
  setNotebooks(state, payload) {
    state.notebooks = payload.notebooks;
  },
  addNotebook(state, payload) {
    state.notebooks.unshift(payload.notebook);
  },
  updateNotebook(state, payload) {
    let notebook =
      state.notebooks.find(notebook => notebook.id == payload.notebookId) || {};
    notebook.title = payload.title;
  },
  deleteNotebook(state, payload) {
    state.notebooks = state.notebooks.filter(
      book => book.id != payload.notebookId
    );
  },
  setCurBookId(state, payload) {
    state.curBookId = payload.curBookId;
  }
};

const actions = {
  getNotebooks({ commit }) {
    return Notebook.getAllBooks().then(res => {
      commit("setNotebooks", { notebooks: res.data });
    });
  },
  addNotebook({ commit }, payload) {
    return Notebook.addBook({ title: payload.title }).then(res => {
      commit("addNotebook", { notebook: res.data });
      Message.success(res.msg);
    });
  },
  updateNotebook({ commit }, payload) {
    return Notebook.updateBook(payload.notebookId, {
      title: payload.title
    }).then(res => {
      commit("updateNotebook", {
        notebookId: payload.notebookId,
        title: payload.title
      });
      Message.success(res.msg);
    });
  },
  deleteNotebook({ commit }, payload) {
    return Notebook.deleteBook(payload.notebookId).then(res => {
      commit("deleteNotebook", { notebookId: payload.notebookId });
      Message.success(res.msg);
    });
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
