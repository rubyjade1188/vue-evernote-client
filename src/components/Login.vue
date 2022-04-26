<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="main"></div>
        <div class="form">
          <h3 @click="toRegister">创建账户</h3>
          <div v-show="showRegister" class="register">
            <input
              type="text"
              v-model="register.username"
              placeholder="用户名"
            />
            <input
              type="password"
              v-model="register.password"
              placeholder="密码"
            />
            <p v-bind:class="{ error: register.isError }">
              {{ register.hint }}
            </p>
            <div class="button" @click="clickRegister">创建账号</div>
          </div>
          <h3 @click="toLogin">登录</h3>
          <div v-show="showLogin" class="login">
            <input
              type="text"
              v-model="login.username"
              placeholder="输入用户名"
            />
            <input
              type="password"
              v-model="login.password"
              placeholder="密码"
            />
            <p v-bind:class="{ error: login.isError }">
              {{ login.hint }}
            </p>
            <div class="button" @click="clickLogin">登录</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 一开始判断是否登陆，接口可以返回isLogin状态
// import request from "@/helpers/request";
// request("/auth").then(data => {
//   console.log(data);
// });

// 封装后可以改成以下样子
import Auth from "@/apis/auth";
import eventBus from "@/helpers/eventBus";

Auth.getInfo().then(data => {
  console.log(data);
});

export default {
  name: "Login",
  data() {
    return {
      showRegister: false,
      showLogin: true,
      login: {
        username: "",
        password: "",
        hint: "请输入用户名和密码",
        isError: false
      },
      register: {
        username: "",
        password: "",
        hint: "创建账号后请记住用户名和密码",
        isError: false
      }
    };
  },
  methods: {
    toRegister() {
      this.showRegister = true;
      this.showLogin = false;
    },
    toLogin() {
      this.showRegister = false;
      this.showLogin = true;
    },
    clickRegister() {
      console.log("register...");
      let res1 = this.validateUsername(this.register.username);
      if (!res1.isValid) {
        this.register.isError = true;
        this.register.hint = res1.hint;
        return;
      }
      let res2 = this.validatePassword(this.register.password);
      if (!res2.isValid) {
        this.register.isError = true;
        this.register.hint = res2.hint;
        return;
      }
      console.log(
        "开始注册, 用户名是：",
        this.register.username,
        " 密码是：",
        this.register.password
      );
      // 利用封装axios的request发送请求
      // request("/auth/register", "POST", {
      //   username: this.register.username,
      //   password: this.register.password
      // }).then(data => {
      //   console.log(data);
      // });

      // 封装接口请求之后
      Auth.register({
        username: this.register.username,
        password: this.register.password
      })
        .then(data => {
          this.register.isError = false;
          this.register.hint = "";
          eventBus.$emit("userInfo", { username: this.register.username });
          // 实现页面跳转
          this.$router.push({ path: "/notebooks" });
          // 希望后续弹窗可以用组件库更新
          alert("恭喜，注册成功🎉");
          console.log(data);
        })
        .catch(data => {
          this.register.isError = true;
          this.register.hint = data.msg;
        });
    },
    clickLogin() {
      console.log("login...");
      // 输入判断
      let res1 = this.validateUsername(this.login.username);
      if (!res1.isValid) {
        this.login.isError = true;
        this.login.hint = res1.hint;
        return;
      }
      let res2 = this.validatePassword(this.login.password);
      if (!res2.isValid) {
        this.login.isError = true;
        this.login.hint = res2.hint;
        return;
      }
      console.log(
        `start login..., username: ${this.login.username}, password: ${this.login.password}`
      );
      // 利用封装axios的request发送请求
      // request("auth/login", "POST", {
      //   username: this.login.username,
      //   password: this.login.password
      // }).then(data => {
      //   console.log(data);
      // });

      // 封装接口请求之后
      Auth.login({
        username: this.login.username,
        password: this.login.password
      })
        .then(data => {
          this.login.isError = false;
          this.login.hint = "";
          eventBus.$emit("userInfo", { username: this.login.username });
          // 实现页面跳转
          this.$router.push({ path: "/notebooks" });
          console.log("start redirect...");
        })
        .catch(data => {
          console.log(data);
          this.login.isError = true;
          this.login.hint = data.msg;
        });
    },
    validateUsername(username) {
      // 用户名可能包含中文，大小写字母，和数字
      return {
        isValid: /^[\u4e00-\u9fa5a-zA-Z0-9]{3,12}$/.test(username),
        hint: "用户名必须是3～12个字符，限于字母数字中文"
      };
    },
    validatePassword(password) {
      // return {
      //   isValid: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/.test(password),
      //   hint:
      //     "密码必须是6～16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符"
      // };
      return {
        isValid: /^.{6,16}$/.test(password),
        hint: "密码长度为6～16个字符"
      };
    }
  }
};
</script>

<style lang="less" scoped>
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  height: 500px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
  display: flex;

  .main {
    flex: 1;
    background: #36bc64
      url(//cloud.hunger-valley.com/17-12-13/38476998.jpg-middle) center center
      no-repeat;
    background-size: contain;
  }

  .form {
    width: 270px;
    border-left: 1px solid #ccc;
  }

  h3 {
    padding: 10px 20px;
    font-weight: normal;
    font-size: 16px;
    border-top: 1px solid #eee;
    cursor: pointer;

    &:nth-of-type(2) {
      border-bottom: 1px solid #eee;
    }
  }

  .button {
    background-color: #2bb964;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    border-radius: 4px;
    margin-top: 18px;
    cursor: pointer;
  }

  .login,
  .register {
    padding: 10px 20px;
    border-top: 1px solid #eee;

    input {
      display: block;
      width: 100%;
      height: 35px;
      line-height: 35px;
      padding: 0 6px;
      border-radius: 4px;
      border: 1px solid #ccc;
      outline: none;
      font-size: 14px;
      margin-top: 10px;
    }
    input:focus {
      border: 3px solid #9dcaf8;
    }

    p {
      font-size: 12px;
      margin-top: 10px;
      color: #444;
    }

    .error {
      color: red;
    }

    .login {
      border-top: 0;
    }
  }
}
</style>
