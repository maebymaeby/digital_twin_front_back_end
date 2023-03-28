<template>
  <div class="bulletinbar_framework">
    <el-popover placement="bottom-start" width="400" trigger="click" @show="showBulletins">
      <!--  表格  -->
      <el-table :data="bulletinItems" v-loading="isLoadingMenu" max-height="400px" element-loading-spinner="el-icon-loading">
        <el-table-column label="消息列表" width="250" prop="createTime" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-news"></i>
            <span style="margin-left: 50px">
              {{scope.row.createTime}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="
              handleTableEdit(
                scope.row.id,
                scope.row.title,
                scope.row.content,
                scope.row.createTime,)">
              <span>From&nbsp;&nbsp;{{scope.row.usernameFrom}}</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="text" slot="reference">消息公告</el-button>
    </el-popover>
    <!--  弹出对话框  -->
    <el-dialog custom-class="bulletinbar_dialog" :visible.sync="dialog.isShowBulletin" append-to-body>
      <span slot="title" class="dialog-header">
        <i class="el-icon-news"></i>
        <span style="margin-left: 10px;font-size:24px">{{ dialog.title }}</span>
        </span>
        <div class="dialog_body" v-html="dialog.content"></div>
        <span slot="footer" class="dialog-footer">
          <pre>{{ "发布日期:  " + dialog.date }}</pre>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import STORE from '@/store'

  export default {
    name: "ShowBulletin",
    components: {},
    data() {
      return {
        bulletinItems: [],
        dialog: {
          isShowBulletin: false, //点击详情，出现dialog对话框
          title: "", //对话框标题（==消息标题）
          content: "", //对话框内容 （==消息内容）
          date: "", //对话框日期（==消息日期）
          currentId: 1, //当前点击消息ID
          currentIsRead: false, //当前点击项状态
        },
        isLoadingMenu: false, //点击下拉菜单，出现loading状态
      };
    },
    async created() {
      this.isLoadingMenu = true;
      //获取下拉菜单所有消息项
      await this.getBulletin();
      this.isLoadingMenu = false;
    },
    methods: {
      async showBulletins() {
        this.isLoadingMenu = true;
        // 获取下拉菜单所有消息项
        await this.getBulletin();
        this.isLoadingMenu = false;
      },
      // 获取消息列表
      getBulletin() {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("User/getUserMessage")
            .then((res) => {
              let resData = res.data.data;
              resData.reverse()
              this.bulletinItems = [];
              for (let i = 0; i < resData.length; i++) {
                let dataItem = resData[i];
                this.bulletinItems.push({
                  id: dataItem.message_id,
                  usernameFrom: dataItem.username_from,
                  createTime: dataItem.create_time,
                  title: dataItem.message_title,
                  content: dataItem.message_content,
                });
              }
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      //点击菜单项时触发
      handleTableEdit(id, title, content, date) {
        this.dialog.isShowBulletin = true;
        this.dialog.currentId = id;
        this.dialog.title = title;
        this.dialog.content = content;
        this.dialog.date = this.GLOBAL.getDatetimeFormat(date, "yyyy-MM-dd hh:mm");
      },
    },
  };
</script>

<style>
  .bulletinbar_tableitem .el-badge__content.is-fixed {
    top: 5px !important;
    right: 8px !important;
  }

  .el-badge__content.is-fixed {
    top: 14px !important;
  }

  .bulletinbar_dialog .el-dialog__header {
    font-size: 20px;
    padding-bottom: 0px;
  }

  .bulletinbar_dialog .el-dialog__body {
    padding: 20px;
  }

  .bulletinbar_dialog .el-dialog__footer {
    padding-top: 0px;
    padding-bottom: 20px;
  }

  .dialog_body {
    padding: 10px;
    border: 1px solid #ccc;
    height: 400px;
    overflow: auto;
  }

  /* table 样式 */
  .dialog_body table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
  }

  .dialog_body table td,
  .dialog_body table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
  }

  .dialog_body table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
  }

  /* blockquote 样式 */
  .dialog_body blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
  }

  /* ul ol 样式 */
  .dialog_body ul,
  .dialog_body ol {
    margin: 10px 0 10px 20px;
  }

  /* 分页栏居中 */
  .bulletinbar_pagination.el-pagination.el-pagination--small {
    margin-top: 10px;
    text-align: center;
  }
</style>

<style scoped>
  pre {
    font-size: 16px;
    color: #909399;
    margin: 0px;
  }
</style>