<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="createNoteBook"
        ><i class="iconfont icon-plus"></i> 新建笔记本</a
      >
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="book-list">
          <router-link
            v-for="(book, index) in notebooks"
            :key="index"
            :to="`/note?notebookId=${book.id}`"
            class="notebook"
          >
            <div>
              <span class="iconfont icon-notebook"></span>{{ book.title }}
              <span>{{ book.noteCounts }}</span>
              <span class="action" @click.stop.prevent="editNoteBook(book)"
                >编辑</span
              >
              <span class="action" @click.stop.prevent="deleteNoteBook(book)"
                >删除</span
              >
              <span class="date">{{ book.friendlyUpdatedAt }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from "@/apis/auth";
import Notebooks from "@/apis/notebooks";
import { friendlyDate } from "@/helpers/util";

// window.Notebooks = Notebooks;

export default {
  name: "NoteBookList",
  data() {
    return {
      notebooks: [],
      msg: "笔记本列表"
    };
  },
  created() {
    Auth.getInfo().then(res => {
      if (!res.isLogin) {
        this.$router.push({ path: "/login" });
      }
    });
    Notebooks.getAllBooks().then(res => {
      this.notebooks = res.data;
    });
  },
  methods: {
    createNoteBook() {
      this.$prompt("请输入笔记本标题", "新建笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: "标题不能为空，且不超过30个字符"
      })
        .then(({ value }) => {
          return Notebooks.addBook({ title: value });
        })
        .then(res => {
          console.log(res);
          res.data.friendlyUpdatedAt = friendlyDate(res.data.updatedAt);
          this.notebooks.unshift(res.data);
          this.$message({
            type: "success",
            message: res.msg
          });
        })
        .catch(err => {
          // 这里可能是点了取消按钮，此时err为cancel
          // console.log(err)
          if (err === "cancel") {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          } else {
            // 当接收到后端返回的err时
            this.$message({
              type: "error",
              message: err.msg
            });
          }
        });
    },
    editNoteBook(notebook) {
      let title = "";
      this.$prompt("请输入新标题", "修改笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: notebook.title,
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: "标题不能为空，且不超过30个字符"
      })
        .then(({ value }) => {
          title = value;
          return Notebooks.updateBook(notebook.id, { title });
        })
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: res.msg
          });
          // 之前是发送请求给后端，后端修改好数据后，显示修改成功，
          // 前端如果不刷新，不能重新渲染得到改变后的title
          // 那么直接在前端修改
          // 即使再刷新，得到的是一致的数据（修改好的），逻辑自洽
          notebook.title = title;
          // console.log("test", notebook.friendlyUpdatedAt);
          notebook.friendlyUpdatedAt = friendlyDate(Date.now());

          // 因为我们是按照updatedAt排序，所以edit后的数组也要变为第一个
          this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
          this.notebooks.unshift(notebook);
        })
        .catch(err => {
          // 这里可能是点了取消按钮，此时err为cancel
          // console.log(err)
          if (err === "cancel") {
            this.$message({
              type: "info",
              message: "取消输入"
            });
          } else {
            // 当接收到后端返回的err时
            this.$message({
              type: "error",
              message: err.msg
            });
          }
        });
    },
    deleteNoteBook(notebook) {
      this.$confirm("确定要删除这个笔记本吗？", "删除笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return Notebooks.deleteBook(notebook.id);
        })
        .then(res => {
          console.log(res);
          this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(res => {
          // console.log(res);
          if (res === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/notebook-list.less);
</style>
