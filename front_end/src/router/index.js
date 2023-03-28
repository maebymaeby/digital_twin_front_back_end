import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'
// import { Message } from 'element-ui';
// import backgroundimg from "@/assets/homepage-background.jpg";
import backgroundimg from "@/assets/homepage-background.png";
// import GLOBAL from '@/utils/global.js'

Vue.use(Router)

/* let common = {
  quitCurrentUser: function () {
    Message({
      message: "当前账户无权访问该页面，请重新登录",
      type: "error",
    });
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("profile");
  },
  alertAuthorization: function () {
    Message({
      message: "当前账户无权访问该页面",
      type: "error",
    });
  }
} */

const router = new Router({
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // 导航页
    {
      path: '/',
      name: 'Homepage',
      component: () => import('@/views/Homepage.vue'),
      meta: { bgimg: backgroundimg }
    },

    // 用户页面
    {
      path: '/User',
      redirect: '/UserGuide',
      component: () => import('@/views/UserView.vue'),
      children: [
      {
        path: '/UserGuide',
        component: () => import('@/components/User/UserGuide.vue'),
      },
      {
        path: '/ModelTrain',
        component: () => import('@/components/Model/ModelTrain.vue'),
      },
      {
        path: '/DatadrivenModelResult',
        component: () => import('@/components/Model/DatadrivenModelResult.vue'),
      },
      {
        path: '/MechanismResult',
        component: () => import('@/components/Model/MechanismResult.vue'),
      },
      {
        path: '/ModelPredict',
        component: () => import('@/components/Model/ModelPredict.vue'),
      },
      {
        path: '/ModelFinetune',
        component: () => import('@/components/Model/ModelFinetune.vue'),
      },
      {
        path: '/UserModel',
        component: () => import('@/components/User/UserModel.vue'),
      },
      {
        path: '/UserInfo',
        component: () => import('@/components/User/UserInfo.vue'),
      }, ]
    },

    // 管理员页面
    {
      path: '/Admin',
      redirect: '/UserManagement',
      component: () => import('@/views/AdminView.vue'),
      children: [
      {
        path: '/UserManagement',
        component: () => import('@/components/Admin/UserManagement.vue'),
      },
      {
        path: '/ModelManagement',
        component: () => import('@/components/Admin/ModelManagement.vue'),
      },
      {
        path: '/PostBulletin',
        component: () => import('@/components/Admin/PostBulletin.vue'),
      }, ],
    }
  ]
})

router.afterEach(to => {
  if (to.path === "/") {
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundSize = "100% 100%";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundImage = `url(${to.meta.bgimg})`;
  } else {
    document.body.style.backgroundRepeat = "";
    document.body.style.backgroundPosition = "";
    document.body.style.backgroundSize = "";
    document.body.style.backgroundAttachment = "";
    document.body.style.backgroundImage = "";
  }
});

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router