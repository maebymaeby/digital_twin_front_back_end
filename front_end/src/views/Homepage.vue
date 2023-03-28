<template>
  <el-row class="homepage_framework">
    <!-- 打开页面显示 -->
    <el-col v-show="!isLogin" :span="24" class="navigationLayout">
      <el-col :offset="2" :span="22" class="navigationFormLayout">
        <el-button type="text" @click="changeLoginLayout('user')">
          <el-col :span="24">
            <el-image :src="userImage" style="width: 100%; height: 100%" fit="fill"></el-image>
            <p>用户登录</p>
            <i class="el-icon-right"></i>
          </el-col>
        </el-button>
      </el-col>
      <el-col :offset="8" :span="16" class="navigationAdminLayout">
        <el-button type="text" @click="changeLoginLayout('admin')">
          <el-col :span="24">
            <el-image :src="adminImage" style="width: 100%; height: 100%" fit="fill"></el-image>
            <p>管理员登录</p>
            <i class="el-icon-right"></i>
          </el-col>
        </el-button>
      </el-col>
    </el-col>
    <!-- 点击相应平台后显示 -->
    <el-col v-show="isLogin" :offset="6" :span="12" class="loginLayout">
      <el-col :span="24" class="loginDetailLayout">
        <el-col :offset="21" :span="2" style="margin-top: 20px">
          <el-button icon="el-icon-close" circle size="mini" @click="isLogin = !isLogin"></el-button>
        </el-col>
        <el-col :span="24">
          <el-col :offset="3" :span="16" style="margin-top: 20px; margin-bottom: 20px">
            <el-form ref="loginForm" :model="loginForm" label-width="80px" :hide-required-asterisk="true">
              <el-form-item label="账号" prop="username">
                <el-input v-model="loginForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="userLogin">登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
    <el-col :offset="2" :span="22" class="messageLayout">
      <el-col :span="2" class="messageHeader">
        <p>系统使用说明</p>
      </el-col>
      <el-col :span="24">
        <ul>
          <li v-for="message in messageList" :key="message.index">
            <router-link :to="message.url"><i class="bluesquare"></i> {{ message.title }}</router-link>
          </li>
        </ul>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import STORE from '@/store'

  export default {
    inject: ["reloadTopNav"], // 注入“重新加载导航栏”方法
    name: "Homepage",
    data() {
      return {
        userImage: require("../assets/homepage-user.png"), // 填报段入口图片
        adminImage: require("../assets/homepage-admin.png"), // 管理端入口图片
        messageList: [
          { index: 0, title: "冷端系统数字孪生模型库操作手册", url: "" },
          { index: 1, title: "冷端系统数字孪生模型库培训视频", url: "" },
        ],
        isLogin: false, // 是否已进入登录框flag
        gotoView: "", // 登录后前往的页面
        loginForm: {}, // 登录表单
      };
    },
    methods: {
      // 测试登录
      userLogin() {
        if (this.gotoView == '/User') {
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("User/userLogin", this.loginForm)
              .then((res) => {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.isLoginning = false;
                this.reloadTopNav();
                this.$router.replace(this.gotoView);
                resolve(res)
              })
              .catch((error) => {
                reject(error);
              });
          });
        }
        else {
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("Admin/adminLogin", this.loginForm)
              .then((res) => {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.isLoginning = false;
                this.reloadTopNav();
                this.$router.replace(this.gotoView);
                resolve(res)
              })
              .catch((error) => {
                reject(error);
              });
          });
        }
      },
      // 切换用户登录界面
      changeLoginLayout(type) {
        // 确定登录后去往页面
        if (type == 'user') {
          this.gotoView = '/User';
        }
        else if (type == 'admin') {
          this.gotoView = '/Admin';
        }
        // 判断是否已有token
        if (sessionStorage.getItem("token")) {
          this.$router.push(this.gotoView);
        }
        else {
          // 确定是登录“用户端”还是“管理端”
          this.loginForm.type = type;
          // 切换登录平台与登录框状态
          this.isLogin = !this.isLogin;
        }
      },
    },
  };
</script>

<style>
  @import "../style/Homepage.css";
</style>