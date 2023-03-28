<template>
  <div id="loader_wrapper">
    <div id="loader"></div>
    <div class="load_title">正在{{this.loadingEvent}}，请稍等......</div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingEvent: {
        type: String,
        required: true,
      },
    },
    name: "LoadingComponent",
    components: {},
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style scoped>
  #loader_wrapper {
    width: 400px;
    height: 400px;
    margin-left: 450px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  #loader:after {
    content: "";
    position: absolute;
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #409EFF;
    opacity: 0.85;
    -webkit-animation: spin 3s linear 2s infinite;
    -ms-animation: spin 3s linear 2s infinite;
    -moz-animation: spin 3s linear 2s infinite;
    -o-animation: spin 3s linear 2s infinite;
    animation: spin 3s linear 2s infinite;
  }

  #loader:before {
    content: "";
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #02bcfe;
    opacity: 0.85;
    -webkit-animation: spin 5s linear infinite;
    -ms-animation: spin 5s linear infinite;
    -moz-animation: spin 5s linear infinite;
    -o-animation: spin 5s linear infinite;
    animation: spin 5s linear infinite;
  }

  #loader {
    display: block;
    position: relative;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 400px;
    margin: -200px 0 0 -200px;
    border-radius: 50%;
    border: 8px solid transparent;
    border-top-color: #3be6cb;
    opacity: 0.85;
    -webkit-animation: spin 3s linear infinite;
    -ms-animation: spin 3s linear infinite;
    -moz-animation: spin 3s linear infinite;
    -o-animation: spin 3s linear infinite;
    animation: spin 3s linear infinite;
    z-index: 1001;
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
    }

    100% {
      -webkit-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  #loader_wrapper .load_title {
    color: #909399;
    opacity: 0.85;
    font-size: 24px;
    width: 100%;
    text-align: center;
    z-index: 9999;
    line-height: 20px;
    margin-left: 20px;
  }
</style>