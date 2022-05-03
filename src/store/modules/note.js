import Note from "@/apis/notes";
import { Message } from "element-ui";

const state = {
  notes: null,
  curNoteId: null
};

const getters = {
  notes: state => state.notes || [],
  curNote: state => {
    if (!Array.isArray(state.notes)) return {};
    if (!state.curNoteId) return state.notes[0];
    return state.notes.find(note => note.id == state.curNoteId) || {};
  }
};

const mutations = {
  setNote(state, payload) {
    state.notes = payload.notes;
  },
  addNote(state, payload) {
    state.notes.unshift(payload.note);
  },
  updateNote(state, payload) {
    let note = state.notes.find(note => note.id === payload.noteId) || {};
    note.title = payload.title;
    note.content = payload.content;
  },
  deleteNote(state, payload) {
    state.notes = state.notes.filter(note => note.id !== payload.noteId);
  },
  setCurNoteId(state, payload) {
    state.curNoteId = payload.curNoteId;
  }
};

const actions = {
  getNotes({ commit }, payload) {
    return Note.getNotes({ notebookId: payload.notebookId }).then(res => {
      commit("setNote", { notes: res.data });
    });
  },
  addNote({ commit }, payload) {
    return Note.addNote(
      { notebookId: payload.notebookId },
      { title: payload.title, content: payload.content }
    ).then(res => {
      commit("addNote", { note: res.data });
      Message.success(res.msg);
    });
  },
  updateNote({ commit }, payload) {
    return Note.updateNote(
      { noteId: payload.noteId },
      { title: payload.title, content: payload.content }
    ).then(res => {
      commit("updateNote", {
        noteId: payload.noteId,
        title: payload.title,
        content: payload.content
      });
      // 取消弹窗，不然一直输入一直弹
      //Message.success(res.msg);
    });
  },
  deleteNote({ commit }, payload) {
    return Note.deleteNote({ noteId: payload.noteId }).then(res => {
      commit("deleteNote", { noteId: payload.noteId });
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
