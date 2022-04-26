import axios from "axios";
import baseURLConfig from "./config-baseURL";

console.log(baseURLConfig);

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// 表示是否使用跨域请求
axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseURLConfig.baseURL;

export default function request(url, type = "GET", data = {}) {
  return new Promise((resolve, reject) => {
    let option = {
      url,
      method: type,
      validateStatus(status) {
        return (status >= 200 && status < 300) || status === 400;
      }
    };
    if (type.toLowerCase === "get") {
      option.params = data;
    } else {
      option.data = data;
    }
    axios(option)
      .then(res => {
        if (res.status === 200) {
          resolve(res.data);
        } else {
          console.error(res.data);
          reject(res.data);
        }
      })
      .catch(err => {
        console.error({ msg: "网络异常" });
        reject({ msg: "网络异常" });
      });
  });
}
