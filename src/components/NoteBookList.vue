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
            to="/note/1"
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
              <span class="date">{{ book.createdAt }}</span>
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

window.Notebooks = Notebooks;

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
      let title = window.prompt("新建笔记本");
      if (title.trim === "") {
        alert("笔记本名字不能为空");
        return;
      }
      Notebooks.addBook({ title }).then(res => {
        console.log(res);
        alert(res.msg);
        this.notebooks.unshift(res.data);
      });
    },
    editNoteBook(notebook) {
      console.log("editing...", notebook);
      let title = window.prompt("修改标题", notebook.title);
      Notebooks.updateBook(notebook.id, { title }).then(res => {
        console.log(res);
        alert(res.msg);
        // 之前是发送请求给后端，后端修改好数据后，显示修改成功，
        // 前端如果不刷新，不能重新渲染得到改变后的title
        // 那么直接在前端修改
        // 即使再刷新，得到的是一致的数据（修改好的），逻辑自洽
        notebook.title = title;

        // 因为我们是按照updatedAt排序，所以edit后的数组也要变为第一个
        this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
        this.notebooks.unshift(notebook);
      });
    },
    deleteNoteBook(notebook) {
      console.log("deleting...", notebook);
      let isConfirm = window.confirm("确定要删除这个笔记本吗？");
      if (isConfirm) {
        Notebooks.deleteBook(notebook.id).then(res => {
          console.log(res);
          this.notebooks.splice(this.notebooks.indexOf(notebook), 1);
          alert(res.msg);
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/notebook-list.less);
</style>
