<template>
  <div class="note-sidebar">
    <span class="btn add-note">添加笔记</span>
    <el-dropdown
      class="notebook-title"
      @command="handleCommand"
      placement="bottom"
    >
      <span class="el-dropdown-link">
        我的笔记本1<i class="el-icon-arrow-down el-icon--right"></i>
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
        <router-link :to="`/note?noteId=${note.id}`">
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

window.Notes = Notes;

export default {
  data() {
    return {
      notebooks: [],
      notes: []
    };
  },
  created() {
    Notebooks.getAllBooks().then(res => {
      this.notebooks = res.data;
    });
  },
  methods: {
    handleCommand(notebookId) {
      if (notebookId !== "trash") {
        Notes.getNotes({ notebookId }).then(res => {
          this.notes = res.data;
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
</style>
