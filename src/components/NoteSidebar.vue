<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="addNote">添加笔记</span>
    <el-dropdown
      class="notebook-title"
      @command="handleCommand"
      placement="bottom"
    >
      <span class="el-dropdown-link">
        {{ curBook.title }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(book, index) in notebooks"
          :key="index"
          :command="book.id"
          >{{ book.title }}</el-dropdown-item
        >
        <el-dropdown-item command="trash">回收站</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <div class="subheader">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="notes">
      <li v-for="(note, index) in notes" :key="index">
        <!-- es6 字符串模版写法 -->
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="date">{{ note.updatedAtFriendly }}</span>
          <span class="title">{{ note.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import Notebooks from "@/apis/notebooks";
import Notes from "@/apis/notes";
import eventBus from "@/helpers/eventBus";

export default {
  data() {
    return {
      notebooks: [],
      notes: [],
      curBook: {}
    };
  },
  created() {
    Notebooks.getAllBooks()
      .then(res => {
        this.notebooks = res.data;
        let val = this.$route.query.notebookId;
        //   console.log(typeof val);
        //   this.curBook = this.notebooks.find(item => item.id == val);
        this.curBook =
          this.notebooks.find(item => item.id === parseInt(val)) ||
          this.notebooks[0] ||
          {};
        return Notes.getNotes({ notebookId: this.curBook.id });
      })
      .then(res => {
        this.notes = res.data;
        this.$emit("update:notes", this.notes);
        eventBus.$emit("update:notes", this.notes);
      });
  },
  methods: {
    handleCommand(notebookId) {
      if (notebookId !== "trash") {
        this.curBook = this.notebooks.find(
          notebook => notebook.id == notebookId
        );
        Notes.getNotes({ notebookId }).then(res => {
          this.notes = res.data;
          this.$emit("update:notes", this.notes);
        });
      } else {
        return this.$router.push({ path: "/trash" });
      }
    },
    addNote() {
      console.log("addNote", this.curBook.id);
      Notes.addNote({ notebookId: this.curBook.id }).then(res => {
        this.$message.success("笔记创建成功");
        this.notes.unshift(res.data);
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
</style>
