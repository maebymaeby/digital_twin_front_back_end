<template>
  <el-row class="userinfo_framework">
    <!--  用户基本信息  -->
    <el-col class="user_base" :span=12>
      <el-card class="user_base_card">
        <!--  用户照片  -->
        <el-row class="user_image" @click.native="photoEditorVisible = true">
          <img class="image_content" :src="this.currentPhoto">
        </el-row>
        <!--  用户标题  -->
        <el-row class=" user_title">
          <span>{{userName}}</span>
        </el-row>
        <!--  分割线  -->
        <el-divider></el-divider>
        <el-row class="activity_operation">
          <el-col :span=24>
            <el-tooltip class="item" effect="dark" content="修改资料" placement="bottom">
              <el-button type="primary" icon="el-icon-edit-outline" @click="infoEditorVisible = true" circle style="font-size:22px"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <!--  用户详细信息  -->
    <el-col class="user_detail" :span=12>
      <el-card class="user_detail_card">
        <el-row class="info_item_detail" v-for="(item, index) in userInfo" :key="index">
          <div class="info_icon">
            <i :class="item.icon"></i>
          </div>
          <div class="info_text">
            <p class="info_text_title">{{item.title}}</p>
            <p class="info_text_content">{{item.content}}</p>
          </div>
        </el-row>
      </el-card>
    </el-col>
    <!--  修改用户信息  -->
    <el-dialog title="修改用户信息" :visible.sync="infoEditorVisible" :append-to-body="true" width="500px">
      <el-form :model="userInfoForm" label-position="left" label-width="80px" style="margin: 0 20px;">
        <el-form-item label="账号">
          <el-input v-model="userInfoForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userInfoForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="userInfoForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户公司">
          <el-input v-model="userInfoForm.company" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户职称">
          <el-input v-model="userInfoForm.title" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userInfoForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userInfoForm.phone"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoEditorVisible = false">取消</el-button>
        <el-button type="primary" @click="editInfo()">确定</el-button>
      </div>
    </el-dialog>
    <!--  修改头像  -->
    <el-dialog title="修改头像" :visible.sync="photoEditorVisible" :append-to-body="true" width="500px">
      <el-col class="user_photo_content" :span="6" v-for="photo in photoList" :key="photo.index">
        <div :class="photo.selected==false?'user_photo_item':'user_photo_item_selected'">
          <el-avatar :src="photo.src" :size="100" @click.native="selectPhoto(photo.index)"></el-avatar>
        </div>
      </el-col>
      <div slot="footer" class="dialog-footer">
        <el-button @click="photoEditorVisible = false">取消</el-button>
        <el-button type="primary" @click="editPhoto()">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import STORE from '@/store'

  export default {
    name: "UserInfo",
    data() {
      return {
        // 用户资料展示
        userInfo: [
        {
          title: "用户姓名",
          content: "",
          icon: "el-icon-user",
        },
        {
          title: "用户公司",
          content: "",
          icon: "el-icon-office-building",
        },
        {
          title: "用户职称",
          content: "",
          icon: "el-icon-suitcase",
        },
        {
          title: "邮箱",
          content: "",
          icon: "el-icon-link",
        },
        {
          title: "手机号",
          content: "",
          icon: "el-icon-phone-outline",
        }, ],
        userResData: {},
        userName: "",
        // 修改用户资料
        userInfoForm: {
          username: '',
          password: '',
          name: '',
          company: '',
          title: '',
          phone: '',
          email: '',
        },
        infoEditorVisible: false,
        // 头像照片彩蛋
        photoList: [
          { index: 0, src: require('@/assets/Hitori.png'), selected: false, },
          { index: 1, src: require('@/assets/Ikuyo.png'), selected: false, },
          { index: 2, src: require('@/assets/Nijika.png'), selected: false, },
          { index: 3, src: require('@/assets/Ryo.png'), selected: false, },
        ],
        photoSelected: -1,
        currentPhoto: "",
        photoEditorVisible: false,
      };
    },
    computed: {},
    created() {
      this.getUserInfo();
    },
    mounted() {},
    updated() {},
    methods: {
      // 获取用户信息
      getUserInfo() {
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("User/getUserInfo")
            .then((res) => {
              this.userResData = res.data.data;
              this.userInfoForm = res.data.data;
              this.userInfo[0].content = this.userResData.name;
              this.userInfo[1].content = this.userResData.company;
              this.userInfo[2].content = this.userResData.title;
              this.userInfo[3].content = this.userResData.email;
              this.userInfo[4].content = this.userResData.phone;
              this.userName = this.userResData.name;
              this.photoSelected = this.userResData.photo;
              this.currentPhoto = this.photoList[this.photoSelected].src;
              resolve(res);
            })
            .catch((error) => {
              reject(error);
            })
        });
      },
      // 修改用户信息
      editInfo() {
        let userRequestData = {
          password: this.userInfoForm.password,
          email: this.userInfoForm.email,
          phone: this.userInfoForm.phone,
          photo: this.photoSelected,
        }
        return new Promise((resolve, reject) => {
          STORE
            .dispatch("User/editUserInfo", userRequestData)
            .then((res) => {
              this.$message({
                message: res.data.message,
                type: 'success'
              });
              this.infoEditorVisible = false;
              this.getUserInfo();
              resolve(res);
            })
            .catch((error) => {
              this.infoEditorVisible = false;
              reject(error);
            })
        });
      },
      // 选择用户头像
      selectPhoto(photoIndex) {
        if (this.photoList[photoIndex].selected == true) {
          for (let i = 0; i < this.photoList.length; i++) {
            this.photoList[i].selected = false
          }
          this.photoSelected = -1;
        }
        else {
          for (let i = 0; i < this.photoList.length; i++) {
            this.photoList[i].selected = false
          }
          this.photoSelected = photoIndex;
          this.photoList[photoIndex].selected = true;
        }
      },
      // 修改用户头像
      editPhoto() {
        this.editInfo();
        this.photoEditorVisible = false;
      }
    },
  }
</script>

<style>
  .userinfo_framework {
    height: 600px;
    margin: 16px;
    padding: 24px;
    background-color: #fff;
    border-radius: 6px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  .user_base {
    margin-top: 0;
    margin-left: 0;
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .user_base_card {
    margin-top: 10px;
    margin-left: 150px;
    width: 300px;
  }

  .user_base_card .el-card__body {
    padding: 0
  }

  .user_image {
    width: 100%;
    height: 300px;
    overflow: hidden;
  }

  .image_content {
    margin: 0 auto;
    width: 100%;
    height: 300px;
    transition: all 0.5s;
  }

  .image_content:hover {
    transform: scale(1.25);
  }

  .user_title {
    margin-top: 25px;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.25;
    word-wrap: break-word;
    font-family: 'Poppins';
    opacity: 0.8;
  }

  .user_detail {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .info_item_detail {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding-left: 100px;
    line-height: 1;
  }

  .info_item_detail:hover {
    background-color: rgb(241, 243, 244);
  }

  .info_item {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    line-height: 1.7;
  }

  .info_icon {
    margin-right: 60px;
    font-size: 40px;
    opacity: 0.8;
  }

  .info_text {
    flex: 1;
    text-align: left;
    justify-content: center;
    opacity: 0.8;
  }

  .info_text_title {
    color: rgba(0, 0, 0, 0.93);
    font-size: 20px;
  }

  .info_text_content {
    color: rgba(0, 0, 0, .54);
    font-size: 18px;
  }

  .user_detail {
    margin-top: 0;
  }

  .user_detail_card {
    margin-top: 10px;
    margin-bottom: 20px;
    margin-left: 60px;
    margin-right: 120px;
  }

  .el-dialog__body>.el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }

  .el-dialog__body>.el-scrollbar .el-scrollbar__bar.is-horizontal {
    display: none;
  }

  .activity_operation {
    margin-top: 25px;
    margin-bottom: 25px;
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  .user_photo_content {
    display: flex;
    text-align: center;
    justify-content: center;
    margin-bottom: 40px;
    height: 100px;
  }

  .user_photo_item:hover {
    padding: 0 auto;
    background-color: #F7F7F9;
  }

  .user_photo_item_selected {
    background-color: rgb(222, 225, 230);
  }
</style>