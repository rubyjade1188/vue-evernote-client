import request from "@/helpers/request";
import { friendlyDate } from "@/helpers/util";

const URL = {
  GET: "/notes/from/:notebookId",
  ADD: "/notes/to/:notebookId",
  DELETE: "/notes/:noteId",
  UPDATE: "/notes/:noteId"
};

export default {
  getNotes({ notebookId }) {
    return new Promise((resolve, reject) => {
      request(URL.GET.replace(":notebookId", notebookId))
        .then(res => {
          res.data = res.data.sort((note1, note2) =>
            note1.updatedAt < note2.updatedAt ? 1 : -1
          );
          res.data.forEach(element => {
            element.updatedAtFriendly = friendlyDate(element.updatedAt);
            element.createdAtFriendly = friendlyDate(element.createdAt);
          });
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  updateNote({ noteId }, { title, content }) {
    return request(URL.UPDATE.replace(":noteId", noteId), "PATCH", {
      title,
      content
    });
  },
  deleteNote({ noteId }) {
    return request(URL.DELETE.replace(":noteId", noteId), "DELETE");
  },
  addNote(
    { notebookId },
    { title = "", content = "" } = { title: "", content: "" }
  ) {
    return new Promise((resolve, reject) => {
      request(URL.ADD.replace(":notebookId", notebookId), "POST", {
        title,
        content
      })
        .then(res => {
          res.data.createdAtFriendly = friendlyDate(res.data.createdAt);
          res.data.updatedAtFriendly = friendlyDate(res.data.updatedAt);
          resolve(res);
        })
        .catch(res => {
          reject(res);
        });
    });
    // return request(URL.ADD.replace(":notebookId", notebookId), "POST", {
    //   title,
    //   content
    // });
  }
};
