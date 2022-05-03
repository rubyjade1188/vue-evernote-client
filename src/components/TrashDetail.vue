<template>
  <div id="trash" class="detail">
    <div class="note-sidebar">
      <h3 class="notebook-title">回收站</h3>
      <div class="subheader">
        <div>更新时间</div>
        <div>标题</div>
      </div>
      <ul class="notes">
        <li v-for="(note, index) in trashNotes" :key="index">
          <!-- es6 字符串模版写法 -->
          <router-link :to="`/trash?noteId=${note.id}`">
            <span class="date">{{ note.updatedAtFriendly }}</span>
            <span class="title">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="note-detail">
      <div class="note-bar" v-if="true">
        <span> 创建日期: {{ curTrashNote.createdAtFriendly }}</span>
        <span> | </span>
        <span> 更新日期: {{ curTrashNote.updatedAtFriendly }}</span>
        <span> | </span>
        <span> 所属笔记本: {{ belongTo }}</span>

        <a class="btn action" @click="onRevert">恢复</a>
        <a class="btn action" @click="onDelete">彻底删除</a>
      </div>
      <div class="note-title">
        <span>{{ curTrashNote.title }}</span>
      </div>
      <div class="editor">
        <div class="preview markdown-body" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "@/apis/auth";
import MarkdownIt from "markdown-it";
import Trash from "@/apis/trash";
import { mapGetters, mapActions, mapMutations } from "vuex";

window.Trash = Trash;

let md = new MarkdownIt();

export default {
  name: "TrashDetail",
  data() {
    return {
      msg: "回收站笔记详情页",
      belongTo: "我的笔记本"
    };
  },
  created() {
    this.checkLogin({ path: "/login" });
    this.getTrashNotes().then(() => {
      this.setCurTrashNoteId({ curTrashNoteId: this.$route.query.noteId });
    });
  },
  computed: {
    ...mapGetters(["trashNotes", "curTrashNote"]),
    compiledMarkdown() {
      return md.render(this.curTrashNote.content || "");
    }
  },
  methods: {
    ...mapMutations(["setCurTrashNoteId"]),
    ...mapActions([
      "checkLogin",
      "getTrashNotes",
      "deleteTrashNote",
      "revertTrashNote"
    ]),
    onRevert() {
      his.revertTrashNote({ noteId: this.curTrashNote.id });
      console.log("revert!!!");
    },
    onDelete() {
      this.deleteTrashNote({ noteId: this.curTrashNote.id });
      console.log("delete!!!");
    }
  },
  beforeRouteUpdate(to, from, next) {
    console.log("trash beforeRouteUpdate");
    // this.curNote = this.notes.find(note => note.id == to.query.noteId) || {};
    this.setCurTrashNoteId({ curTrashNoteId: to.query.noteId });
    next();
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
@import url(../assets/css/note-detail.less);

#trash {
  display: flex;
  align-items: stretch;
  background-color: #fff;
  flex: 1;

  .note-bar {
    .action {
      float: right;
      margin-left: 10px;
      padding: 2px 4px;
      font-size: 12px;
    }
  }
}
</style>
