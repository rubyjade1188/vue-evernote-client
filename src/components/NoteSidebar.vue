<template>
  <div class="note-sidebar">
    <span class="btn add-note" @click="onAddNote">添加笔记</span>
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
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {};
  },
  created() {
    this.getNotebooks()
      .then(() => {
        this.setCurBookId({ curBookId: this.$route.query.notebookId });
        if (this.curBook.id)
          return this.getNotes({ notebookId: this.curBook.id });
      })
      .then(() => {
        this.$store.commit("setCurNoteId", {
          curNoteId: this.$route.query.noteId
        });
        this.$router.replace({
          path: "/note",
          query: {
            noteId: this.curNote.id,
            notebookId: this.curBook.id
          }
        });
      });
    // Notebooks.getAllBooks()
    //   .then(res => {
    //     this.notebooks = res.data;
    //     let val = this.$route.query.notebookId;
    //     //   console.log(typeof val);
    //     //   this.curBook = this.notebooks.find(item => item.id == val);
    //     this.curBook =
    //       this.notebooks.find(item => item.id === parseInt(val)) ||
    //       this.notebooks[0] ||
    //       {};
    //     return Notes.getNotes({ notebookId: this.curBook.id });
    //   })
    //   .then(res => {
    //     this.notes = res.data;
    //     this.$emit("update:notes", this.notes);
    //     eventBus.$emit("update:notes", this.notes);
    //   });
  },
  computed: {
    ...mapGetters(["notebooks", "notes", "curBook", "curNote"])
  },
  methods: {
    ...mapMutations(["setCurBookId", "setCurNoteId"]),
    ...mapActions(["getNotebooks", "getNotes", "addNote"]),
    handleCommand(notebookId) {
      if (notebookId !== "trash") {
        // 绝对绝对不能直接给computted里的properties赋值！！！！
        // this.curBook = this.notebooks.find(
        //   notebook => notebook.id == notebookId
        // );
        this.$store.commit("setCurBookId", { curBookId: notebookId });
        // 获取新的curbook里的notes
        // Notes.getNotes({ notebookId }).then(res => {
        //   this.notes = res.data;
        //   this.$emit("update:notes", this.notes);
        // });
        // 因为上面set过一遍了
        this.getNotes({ notebookId: this.curBook.id }).then(() => {
          this.$store.commit("setCurNoteId", {});
          this.$router.replace({
            path: "/note",
            query: {
              noteId: this.curNote.id,
              notebookId: this.curBook.id
            }
          });
        });
      } else {
        return this.$router.push({ path: "/trash" });
      }
    },
    onAddNote() {
      this.addNote({ notebookId: this.curBook.id });
      // console.log("addNote", this.curBook.id);
      // Notes.addNote({ notebookId: this.curBook.id }).then(res => {
      //   this.$message.success("笔记创建成功");
      //   this.notes.unshift(res.data);
      // });
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
</style>
