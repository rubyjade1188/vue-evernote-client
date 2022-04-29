import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import NoteBookList from "@/components/NoteBookList";
import NoteDetail from "@/components/NoteDetail";
import TrashDetail from "@/components/TrashDetail";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/notebooks",
      component: NoteBookList
    },
    {
      path: "/note",
      component: NoteDetail
    },
    {
      path: "/trash",
      component: TrashDetail
    }
  ]
});
