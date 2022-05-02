import request from "@/helpers/request";
import { friendlyDate } from "@/helpers/util";

const URL = {
  GET: "/notebooks",
  ADD: "/notebooks",
  UPDATE: "/notebooks/:id",
  DELETE: "/notebooks/:id"
};

export default {
  getAllBooks() {
    return new Promise((resolve, reject) => {
      request(URL.GET)
        .then(res => {
          // 排序
          res.data = res.data.sort((notebook1, notebook2) =>
            notebook1.updatedAt < notebook2.updatedAt ? 1 : -1
          );
          res.data.forEach(ele => {
            ele.createdAtFriendly = friendlyDate(ele.createdAt);
            ele.updatedAtFriendly = friendlyDate(ele.updatedAt);
          });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // es6设置默认参数的写法
  updateBook(notebookId, { title = "" } = { title: "" }) {
    return request(URL.UPDATE.replace(":id", notebookId), "PATCH", { title });
  },
  deleteBook(notebookId) {
    return request(URL.DELETE.replace(":id", notebookId), "DELETE");
  },
  addBook({ title = "" } = { title: "" }) {
    return new Promise((resolve, reject) => {
      request(URL.ADD, "POST", { title })
        .then(res => {
          res.data.createdAtFriendly = friendlyDate(res.data.createdAt);
          res.data.updatedAtFriendly = friendlyDate(res.data.updatedAt);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
