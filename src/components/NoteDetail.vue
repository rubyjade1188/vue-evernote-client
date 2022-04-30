<template>
  <div id="note" class="detail">
    <NoteSidebar @update:notes="val => (notes = val)"></NoteSidebar>
    <div class="note-detail">
      <div class="note-empty" v-show="!curNote.id">请选择笔记</div>
      <div class="note-detail-ct" v-show="curNote.id">
        <div class="note-bar">
          <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
          <span>创建日期：{{ curNote.createdAtFriendly }}</span>
          <span>{{ statusText }}</span>
          <span class="iconfont icon-delete" @click="deleteNote"></span>
          <span class="iconfont icon-fullscreen"></span>
        </div>
        <div class="note-title">
          <input
            type="text"
            v-model="curNote.title"
            @input="updateNote"
            @keydown="statusText = '正在输入...'"
            placeholder="输入标题"
          />
        </div>
        <div class="editor">
          <textarea
            v-show="true"
            v-model="curNote.content"
            @input="updateNote"
            @keydown="statusText = '正在输入...'"
            placeholder="输入内容，支持markdown语法"
          ></textarea>
          <div class="preview markdown-body" v-show="false"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "@/apis/auth";
import NoteSidebar from "@/components/NoteSidebar";
import eventBus from "@/helpers/eventBus";
import _ from "lodash";
import Notes from "@/apis/notes";

export default {
  name: "NoteDetail",
  components: {
    NoteSidebar
  },
  data() {
    return {
      curNote: {},
      notes: [],
      statusText: "笔记未改动"
    };
  },
  created() {
    Auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push({ path: "/login" });
      }
    });
    eventBus.$on("update:notes", val => {
      this.curNote =
        val.find(note => note.id == this.$route.query.noteId) || {};
    });
  },
  methods: {
    updateNote: _.debounce(function() {
      Notes.updateNote(
        { noteId: this.curNote.id },
        { title: this.curNote.title, content: this.curNote.content }
      )
        .then(data => {
          this.statusText = "已保存";
        })
        .catch(data => {
          this.statusText = "保存出错";
        });
    }, 300),
    deleteNote() {
      Notes.deleteNote({ noteId: this.curNote.id }).then(data => {
        this.$message.success(data.msg);
        this.notes.splice(this.notes.indexOf(this.curNote), 1);
        this.$router.replace({ path: "/note" });
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log("beforeRouteUpdate");
    this.curNote = this.notes.find(note => note.id == to.query.noteId) || {};
    next();
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-detail.less);

#note {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;
}
</style>
