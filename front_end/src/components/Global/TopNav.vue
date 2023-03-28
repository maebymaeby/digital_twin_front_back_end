<template>
  <el-row :class="isHomepage ? '' : 'topnav_framework'">
    <el-col v-if="isHomepage" class="homepage_topnav">
      <p>冷端系统数字孪生模型库</p>
    </el-col>
    <el-col v-else>
      <el-col :span="14" class="topnav_title">
        <p>冷端系统数字孪生模型库</p>
      </el-col>
      <el-col :span="10" v-if="isShowingTopNav">
        <el-col :span="15" style="margin-top:2px">
          <p class="topnav_profile">
            <span>{{ companyName }}&nbsp;{{ titleName }}&nbsp;{{ userName }}</span>，欢迎您！
          </p>
        </el-col>
        <el-col :span="3">
          <show-bulletin class="topnav_bulletin"> </show-bulletin>
        </el-col>
        <el-col :span="3">
          <el-button class="topnav_logout" type="text" @click="goBackToHomepage()">返回首页</el-button>
        </el-col>
        <el-col :span="3">
          <el-button class="topnav_logout" type="text" @click="userLogout()">退出登录</el-button>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
  import ShowBulletin from "../Bulletin/BulletinBar.vue";
  export default {
    inject: ["reloadTopNav"], // 注入“重新加载导航栏”方法
    name: "TopNav",
    components: {
      ShowBulletin,
    },
    data() {
      return {
        companyName: "", // 公司名
        titleName: "", // 公司名
        userName: "", // 用户名
      };
    },
    computed: {
      // 根据登录状态和首页状态判断是否需要显示导航栏
      isShowingTopNav: function () {
        return sessionStorage.getItem("token") !== null;
      },
      // 根据路由判断是否是首页导航页面
      isHomepage: function () {
        if (this.$route.matched.length != 0) {
          return this.$route.path === "/" ? true : false;
        } else {
          return true;
        }
      },
    },
    created() {
      if (sessionStorage.getItem("token")) {
        // 更新用户信息
        let profile = JSON.parse(sessionStorage.getItem("profile"));
        this.companyName = profile.company;
        this.titleName = profile.title;
        this.userName = profile.name;
      } else {
        this.$router.replace("/");
      }
    },
    methods: {
      // 返回首页
      goBackToHomepage() {
        this.$router.replace("/");
      },
      // 退出登录
      userLogout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("profile");
        this.reloadTopNav();
      },
    },
  };
</script>

<style>
  * {
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .topnav_framework {
    border-bottom: 1px solid #eee;
  }

  .homepage_topnav p {
    margin: 20px 0 0 0;
    font-size: 64px;
    color: #0550E7;
  }

  .topnav_title {
    text-align: left;
  }

  .topnav_title p {
    font-size: 20px;
    line-height: 50px;
    margin: 0 0 0 20px;
  }

  .topnav_profile,
  .topnav_bulletin {
    text-align: end;
    font-size: 14px;
  }

  .topnav_bulletin {
    padding-right: 8px;
  }

  .el-button.el-button--text.el-popover__reference,
  .el-button.topnav_logout.el-button--text {
    line-height: 50px;
    padding: 0 0 0 0;
  }
</style>