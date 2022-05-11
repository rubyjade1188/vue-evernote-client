import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/components/Login.vue")
    },
    {
      path: "/notebooks",
      alias: "/",
      component: () => import("@/components/NoteBookList.vue")
    },
    {
      path: "/note",
      component: () => import("@/components/NoteDetail.vue")
    },
    {
      path: "/trash",
      component: () => import("@/components/TrashDetail.vue")
    }
  ]
});
