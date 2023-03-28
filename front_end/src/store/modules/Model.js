import { _axios as request } from '@/plugins/axios'
import axios from 'axios'

const actions = {
  // 模型训练
  modelTrain(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/train',
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
  // 模型预测
  modelPredict(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/predict',
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
  // 模型增量学习
  modelFinetune(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/finetune',
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
  // 保存模型
  saveModel(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/saveModel',
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
  // 获取模型列表
  getModelList() {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/getModelList',
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
  // 筛选模型列表
  getModelListByFilter(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/getModelList',
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
  // 修改模型信息
  editModelInfo(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/updateModel',
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
  // 删除模型
  deleteModel(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/deleteModel',
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

  //机理建模相关
  mechanismModelTrain(_, data) {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:3000/GA/Train`, data, {})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  mechanismModelPredict(_, data) {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:3000/GA/Predict`, data, {})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  mechanismModelFinetune(_, data) {
    return new Promise((resolve, reject) => {
      axios.post(`http://localhost:3000/GA/Finetune`, data, {})
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  saveMechanismModel(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/saveMechanismModel',
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
  getMechanismModelParam(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/getMechanismModelParam',
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
  deleteMechanismModel(_, data) {
    return new Promise((resolve, reject) => {
      request({
          url: '/model/deleteMechanismModel',
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