<template>
  <el-row class="usermanagement_framework">
    <el-col :offset="1" :span="22">
      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="name" label="用户姓名" align="center">
        </el-table-column>
        <el-table-column prop="company" label="用户公司" align="center">
        </el-table-column>
        <el-table-column prop="title" label="用户职称" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="access" label="账号权限" align="center">
          <template slot-scope="scope">
            {{ scope.row.access == 1 ? "普通用户" : "管理员" }}
          </template>
        </el-table-column>
        <el-table-column width="140" align="right">
          <template slot="header">
            <el-button type="primary" @click="toRegisterOrUpdateUser('Register')" size="mini">注册新用户</el-button>
          </template>
          <template slot-scope="scope">
            <el-col :span="12">
              <el-button type="text" @click="toRegisterOrUpdateUser('Update', scope.row)">编辑</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="text" @click="toDeleteUser(scope.row)">删除</el-button>
            </el-col>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="24">
      <el-dialog :visible.sync="isRegisterOrModifyDialogVisible" :title="isRegisterUser ? '注册新用户' : '修改用户信息'" width="720px" @close="closeDialog">
        <el-form ref="userInfoDialog" :model="userInfo" :rules="infoRules" label-width="100px">
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input v-model="userInfo.username" placeholder="请输入" :disabled="!isRegisterUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="name">
              <el-input v-model="userInfo.name" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="userInfo.password" placeholder="请输入" show-password></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户公司" prop="company">
              <el-input v-model="userInfo.company" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userInfo.email" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户职称" prop="title">
              <el-input v-model="userInfo.title" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="userInfo.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号类型" prop="access">
              <el-select v-model="userInfo.access" filterable>
                <el-option v-for="item in accessOptions" :key="item.index" :label="item.label" :value="item.index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="registerOrUpdateUser">{{
            isRegisterUser ? "注册新用户" : "确认修改"
          }}</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
  import STORE from '@/store'

  export default {
    name: "UserManagement",
    components: {},
    data() {
      return {
        // 用户列表
        userList: [],
        // 用户信息
        userInfo: {
          username: "",
          password: "",
          name: "",
          company: "",
          title: "",
          email: "",
          access: "",
          available: 1,
        },
        // 用户信息备份
        userInfoBack: {
          username: "",
          password: "",
          name: "",
          company: "",
          title: "",
          email: "",
          access: "",
          available: 1,
        },
        infoRules: {
          username: [{
            required: true,
            message: "账号为空",
            trigger: "blur",
          }, ],
          password: [{
            required: true,
            message: "密码为空",
            trigger: "blur",
          }, ],
          name: [{
            required: true,
            message: "用户姓名为空",
            trigger: "blur",
          }, ],
          company: [{
            required: true,
            message: "用户公司为空",
            trigger: "blur",
          }, ],
          title: [{
            required: true,
            message: "用户职称为空",
            trigger: "blur",
          }, ],
          email: [{
            required: true,
            message: "邮箱为空",
            trigger: "blur",
          }, {
            pattern: this.GLOBAL.isEmail,
            message: "邮箱格式有误",
            trigger: "blur",
          }, ],
          phone: [{
            required: true,
            message: "手机号为空",
            trigger: "blur",
          }, {
            pattern: this.GLOBAL.isPhone,
            message: "手机号格式有误",
            trigger: "blur",
          }, ],
          access: [{
            required: true,
            message: "用户类型为空",
            trigger: "blur",
          }, ],
        },
        // 账号类型选项
        accessOptions: [{
          index: 0,
          label: '管理员',
        }, {
          index: 1,
          label: '普通用户',
        }, ],
        isRegisterOrModifyDialogVisible: false, // 注册、编辑用户信息对话框flag
        isRegisterUser: false, // 注册新用户flag
      };
    },
    watch: {},
    created() {
      this.getUserList();
    },
    methods: {
      // 获取用户列表
      getUserList() {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("Admin/getUserList", )
            .then((res) => {
              this.userList = res.data.data;
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            });
        });
      },

      // 注册或修改用户
      toRegisterOrUpdateUser(mode, user) {
        this.isRegisterOrModifyDialogVisible = true;
        if (mode === "Register") {
          this.isRegisterUser = true;
          this.userInfo = this.userInfoBack;
        } else {
          this.isRegisterUser = false;
          this.userInfo = user;
        }
      },

      // 提交新注册或修改用户信息
      registerOrUpdateUser() {
        if (this.isRegisterUser) {
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("Admin/registerUser", this.userInfo)
              .then((res) => {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.userInfo = {
                  username: "",
                  password: "",
                  name: "",
                  company: "",
                  title: "",
                  email: "",
                  access: "",
                  available: 1,
                };
                this.userInfoBack = {
                  username: "",
                  password: "",
                  name: "",
                  company: "",
                  title: "",
                  email: "",
                  access: "",
                  available: 1,
                };
                this.getUserList();
                this.isRegisterOrModifyDialogVisible = false;
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        }
        else {
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("Admin/updateUser", this.userInfo)
              .then((res) => {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.getUserList();
                this.isRegisterOrModifyDialogVisible = false;
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        }
      },

      // 删除用户
      toDeleteUser(user) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.userInfo = user;
          return new Promise((resolve, reject) => {
            STORE
              .dispatch("Admin/deleteUser", this.userInfo)
              .then((res) => {
                this.$message({
                  message: res.data.message,
                  type: 'success'
                });
                this.getUserList();
                resolve(res);
              })
              .catch((error) => {
                reject(error);
              });
          });
        })

      },

      // 关闭dialog
      closeDialog() {
        this.userInfoBack = this.userInfo
      },
    },
  };
</script>

<style>
  .usermanagement_framework {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
  }
</style>