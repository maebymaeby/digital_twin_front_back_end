<template>
  <div id="app">
    <topnav v-if="isTopNavAlive" class="app_topnav" />
    <router-view class="app_routerview" />
  </div>
</template>

<script>
  import topnav from "./components/Global/TopNav.vue";
  export default {
    name: "App",
    components: {
      topnav,
    },
    provide() {
      return {
        reloadTopNav: this.reloadTopNav, // 将“重新加载导航栏”方法暴露
      };
    },

    data() {
      return {
        isTopNavAlive: true, // 导航栏是否已加载flag
      };
    },

    methods: {
      // 重新加载导航栏
      reloadTopNav() {
        this.isTopNavAlive = false;
        this.$nextTick(function () {
          this.isTopNavAlive = true;
        });
      },
    },
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width: 1200px;
    overflow: auto;
  }

  .app_topnav {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 2000;
  }

  .app_routerview {
    position: relative;
    top: 0px;
    left: 0px;
    right: 0px;
    /* z-index: 0; */
  }
</style>