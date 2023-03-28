<template>
  <div id="editor"></div>
</template>

<script>
  import Editor from "wangeditor";
  import { Message } from "element-ui";
  export default {
    name: "TextEditor",
    components: {},
    data() {
      return {
        editor: null,
        editorData: "", //编辑器内容
      };
    },
    mounted() {
      this.initEditor();
    },
    methods: {
      //初始化编辑器
      initEditor() {
        const editor = new Editor("#editor");
        editor.config.height = 400; // 设置编辑区域高度为 400px
        editor.config.zIndex = 400;
        editor.config.onchange = (newHtml) => {
          // 配置 onchange 回调函数，将数据同步到 vue 中
          this.editorData = newHtml;
        };
        editor.config.focus = false; // 取消自动 focus
        editor.config.excludeMenus = ["head", "video", "code", "emoticon"]; // 设置不需要的菜单
        editor.config.fontSizes = {
          //配置字体字号，不超过 40px
          "x-small": { name: "10px", value: "1" },
          small: { name: "13px", value: "2" },
          normal: { name: "16px", value: "3" },
          large: { name: "18px", value: "4" },
        };
        //自定义消息框（用el-ui）
        editor.config.customAlert = function (s, t) {
          switch (t) {
          case "success":
            Message({
              message: s,
              type: "success",
            });
            break;
          case "info":
            Message({
              message: s,
              type: "info",
            });
            Message.info(s);
            break;
          case "warning":
            Message({
              message: s,
              type: "warning",
            });
            break;
          case "error":
            Message({
              message: s,
              type: "error",
            });
            break;
          default:
            break;
          }
        };
        editor.config.uploadImgMaxLength = 10; // 一次最多上传 10 个图片
        editor.config.showLinkImg = false; //不显示“上传网络图片按钮”
        editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
        editor.create(); // 创建编辑器
        this.editor = editor;
      },
    },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy();
      this.editor = null;
    },
  };
</script>

<style scoped>
  #editor {
    margin-right: 10px;
  }
</style>