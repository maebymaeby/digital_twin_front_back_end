import { _axios as request } from '@/plugins/axios'

const actions = {
  // 管理员登录
  adminLogin(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/login',
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
  // 管理员获取模型列表
  getModelList() {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/getModelList',
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
  // 管理员筛选模型列表
  getModelListByFilter(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/getModelList',
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
  // 管理员获取用户列表
  getUserList() {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/getUserList',
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
  // 管理员新增用户
  registerUser(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/registerUser',
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
  // 管理员修改用户信息
  updateUser(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/updateUser',
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
  // 管理员删除用户
  deleteUser(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/deleteUser',
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
  // 管理员发送公告
  sendMessage(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/admin/sendMessage',
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
  }
}

export default {
  namespaced: true,
  actions,
};