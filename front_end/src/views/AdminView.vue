<template>
  <el-row class="adminview_framework">
    <!-- 侧边导航栏 -->
    <el-col :span="3">
      <el-menu router :default-active="$route.path" class="el-menu-vertical-demo">
        <template v-for="item in menuItems">
          <el-menu-item v-if="item.subMenu.length === 0" :key="item.index" :index="item.index">
            <i :class="item2icon[item.title]"></i>{{ item.title }}
            </el-menu-item>
            <el-submenu v-else :key="item.index" :index="item.index">
              <template slot="title"><i :class="item2icon[item.title]"></i>{{ item.title }}</template>
                <el-menu-item v-for="subItem in item.subMenu" :key="subItem.index" :index="subItem.index">
                  {{ subItem.title }}
              </el-menu-item>
            </el-submenu>
        </template>
      </el-menu>
    </el-col>
    <!-- 右侧窗口栏 -->
    <el-col :span="21" :style="{ height: innerHeight }">
      <!-- 路由页面 -->
      <el-scrollbar class="routerview_scrollbar">
        <router-view></router-view>
      </el-scrollbar>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "AdminView",
    data() {
      return {
        clientHeight: "", // 浏览器可视高度
        innerHeight: "", // router-view可视高度
        // 导航栏内容对应图标
        item2icon: {
          用户管理: "el-icon-user-solid",
          模型管理: "el-icon-s-operation",
          数据管理: "el-icon-s-platform",
          发送公告: "el-icon-takeaway-box"
        },
        // 导航栏内容
        menuItems: [
        {
          index: "/UserManagement",
          title: "用户管理",
          subMenu: [],
        },
        {
          index: "/ModelManagement",
          title: "模型管理",
          subMenu: [],
        },
        {
          index: "/PostBulletin",
          title: "发送公告",
          subMenu: [],
        }, ],
      };
    },
    computed: {},
    watch: {
      clientHeight() {
        this.updateInnerHeight(this.clientHeight);
      },
    },
    created() {},
    mounted() {
      // 根据浏览器高度自动条件routerview高度，控制scrollbar效果
      this.clientHeight = document.documentElement.clientHeight; //获取浏览器可视区域高度
      let that = this;
      window.onresize = function () {
        this.clientHeight = document.documentElement.clientHeight;
        that.updateInnerHeight(this.clientHeight);
      };
    },
    updated() {},
    methods: {
      // 更新可视区域高度
      updateInnerHeight(clientHeight) {
        this.innerHeight = clientHeight - this.GLOBAL.topnavHeight + "px";
      },
    },
  }
</script>

<style>
  @import "../style/Data.css";
  @import "../style/Global.css";

  .routerview_scrollbar {
    height: 100%;
    background-color: #F7F7F9;
  }

  .routerview_scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-select {
    width: 100%;
  }

  .search_autocomplete {
    width: 100%;
  }

  .el-autocomplete {
    width: 100%;
  }

  .el-menu-vertical-demo {
    text-align: left;
  }

  .el-submenu .el-menu.el-menu--inline {
    padding-left: 10px;
  }

  .el-submenu .el-menu-item {
    min-width: 100px;
  }
</style>