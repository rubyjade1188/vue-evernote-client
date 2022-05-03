import Trash from "@/apis/trash";
import { Message } from "element-ui";

// 需要什么数据，数据最好是最原始的数据
const state = {
  trashNotes: null,
  curTrashNoteId: null
};

// 原始数据有一部分要呈现给对外的模板，需要给模版去用的，放到getters里面
// 可以认为是 store 的计算属性
const getters = {
  trashNotes: state => state.trashNotes || [],
  curTrashNote: (state, getters) => {
    if (!state.curTrashNoteId) return getters.trashNotes[0] || {};
    return state.trashNotes.find(note => note.id == state.curTrashNoteId) || {};
  },
  belongTo: (state, getters, rootState, rootGetters) => {
    let notebook =
      rootGetters.notebooks.find(
        notebook => notebook.id == getters.curTrashNote.notebookId
      ) || {};
    return notebook.title || "";
  }
};

// 修改state，改完之后，getters里的东西也会变
const mutations = {
  setTrashNotes(state, payload) {
    state.trashNotes = payload.trashNotes;
  },
  addTrashNote(state, payload) {
    state.trashNotes.unshift(payload.note);
  },
  // 彻底删除 & revert操作
  deleteTrashNote(state, payload) {
    state.trashNotes = state.trashNotes.filter(
      note => note.id != payload.noteId
    );
  },
  setCurTrashNoteId(state, payload) {
    state.curTrashNoteId = payload.curTrashNoteId;
  }
};

// actions用来放异步的请求，用于去做复杂的逻辑，成功之后再去commit，相当于调用mutation里的方法去修改state
const actions = {
  getTrashNotes({ commit }) {
    return Trash.getAllTrashNotes().then(res => {
      commit("setTrashNotes", { trashNotes: res.data });
    });
  },
  deleteTrashNote({ commit }, { noteId }) {
    return Trash.deleteNote({ noteId }).then(res => {
      commit("deleteTrashNote", { noteId });
      Message.success(res.msg);
    });
  },
  revertTrashNote({ commit }, { noteId }) {
    return Trash.revertNote({ noteId }).then(res => {
      commit("deleteTrashNote", { noteId });
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
