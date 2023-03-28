import axios from 'axios'
import { Message } from 'element-ui';
import GLOBAL from '@/utils/global.js'

axios.defaults.headers.post['Content-Type'] = 'application/json'

let config = {
  baseURL: GLOBAL.baseURL,
  timeout: 150000,
  headers: {}
}

// axios内部公用变量和方法
let common = {
  // 提示错误信息
  showMessage: function (msg) {
    Message({
      message: msg,
      type: "error",
    });
  },
}

export const _axios = axios.create(config)

_axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token') && !config.headers.Authorization) {
      let Authorization = 'Bearer ' + sessionStorage.getItem('token')
      config.headers.Authorization = Authorization
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 701) {
      common.showMessage('模型训练/预测/增量学习失败');
    }
    else if (error.response.status === 702) {
      Message({
        message: '当前数据不需要增量学习',
        type: "success",
      });
    }
    else if (error.response.status === 801) {
      common.showMessage('用户名或密码错误');
    }
    else if (error.response.status === 802) {
      common.showMessage('当前用户未激活');
    }
    else if (error.response.status === 803) {
      common.showMessage('当前用户无权限');
    }
    else if (error.response.status === 804) {
      common.showMessage('用户认证请求头缺失');
    }
    else if (error.response.status === 805) {
      common.showMessage('当前用户登录已过期');
      setTimeout(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("profile");
        location.replace("/");
      }, 2000);
    }
    else {
      common.showMessage('操作失败，请重试');
    }
    return Promise.reject(error)

  }
)