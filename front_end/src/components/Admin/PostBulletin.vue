<template>
  <el-row class="postbulletin_framework">
    <el-form :model="bulletin" label-width="auto" inline-message status-icon>
      <el-form-item label="标题" required>
        <el-input v-model="bulletin.message_title" type="text" placeholder="请输入内容" maxlength="20" clearable show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="内容" required>
        <text-editor ref="editor"></text-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="postMessage">提交</el-button>
      </el-form-item>
    </el-form>
  </el-row>
</template>

<script>
  import STORE from '@/store'
  import TextEditor from "../Bulletin/TextEditor.vue";

  export default {
    name: "PostBulletin",
    inject: ["reloadTopNav"], // 注入“重新加载导航栏”方法
    components: {
      TextEditor
    },
    data() {
      return {
        bulletin: {
          create_time: "",
          message_title: "",
          message_content: "",
        },
      };
    },
    mounted() {},
    methods: {
      //确定提交公告
      postMessage() {
        this.bulletin.create_time = this.GLOBAL.getDatetimeFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.bulletin.message_content = this.$refs.editor.editorData;
        if (this.bulletin.message_title == "") {
          this.$message({
            type: "error",
            message: "请填写公告标题!",
          });
        } else if (this.bulletin.message_content == "") {
          this.$message({
            type: "error",
            message: "请填写公告内容!",
          });
        }
        else {
          this.$confirm("此操作将提交此公告, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
            .then(() => {
              this.submitBulletin();
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消提交",
              });
            });
        }
      },
      submitBulletin() {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Admin/sendMessage", this.bulletin)
            .then((res) => {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              //清空当前页面
              this.bulletin.create_time = '';
              this.bulletin.message_title = '';
              this.$refs.editor.editor.txt.clear();
              //重新加载导航栏，获取公告未读标记
              this.reloadTopNav();
              resolve(res)
            })
            .catch((error) => {
              reject(error)
            });
        });
      },
    },
  };
</script>

<style scoped>
  .postbulletin_framework {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }

  .el-form {
    margin-left: 10px;
  }

  .el-form-item {
    text-align: left !important;
  }

  .el-input {
    width: 32%;
  }
</style>