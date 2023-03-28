import { _axios as request } from '@/plugins/axios'

const actions = {
  // 用户登录
  userLogin(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/user/login',
          method: 'post',
          data: data,
        })
        .then((response) => {
          sessionStorage.setItem("token", response.data.data.token);
          sessionStorage.setItem("profile", JSON.stringify(response.data.data));
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 用户验证
  userValid(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/user/valid',
          method: 'post',
          data: data,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 用户获取个人信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      request({
          url: '/user/info',
          method: 'get',
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 用户修改个人信息
  editUserInfo(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/user/info',
          method: 'post',
          data: data,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 用户获取公告
  getUserMessage() {
    return new Promise((resolve, reject) => {
      request({
          url: '/user/message',
          method: 'get',
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
}

export default {
  namespaced: true,
  actions,
};