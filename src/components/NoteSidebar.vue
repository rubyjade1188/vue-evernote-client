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
export default {
  data() {
    return {
      notebooks: [
        {
          id: 1,
          title: "hello1"
        },
        {
          id: 2,
          title: "hello2",
          updatedAtFriendly: "3分钟前"
        }
      ],
      notes: [
        {
          id: 11,
          title: "第1个笔记",
          updatedAtFriendly: "刚刚"
        },
        {
          id: 12,
          title: "第2个笔记",
          updatedAtFriendly: "3分钟前"
        }
      ]
    };
  },
  methods: {
    handleCommand(cmd) {
      console.log(cmd);
    }
  }
};
</script>

<style lang="less" scoped>
@import url(../assets/css/note-sidebar.less);
</style>
