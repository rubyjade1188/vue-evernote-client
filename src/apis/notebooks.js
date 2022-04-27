import request from "@/helpers/request";

const URL = {
  GET: "/notebooks",
  ADD: "/notebooks",
  UPDATE: "/notebooks/:id",
  DELETE: "/notebooks/:id"
};

export default {
  getAllBooks() {
    return request(URL.GET);
  },
  // es6设置默认参数的写法
  updateBook(notebookId, { title = "" } = { title: "" }) {
    return request(URL.UPDATE.replace(":id", notebookId), "PATCH", { title });
  },
  deleteBook(notebookId) {
    return request(URL.DELETE.replace(":id", notebookId), "DELETE");
  },
  addBook({ title = "" } = { title: "" }) {
    return request(URL.ADD, "POST", { title });
  }
};
