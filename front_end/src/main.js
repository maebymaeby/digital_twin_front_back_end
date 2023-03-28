import Vue from 'vue'
import App from './App'
import router from './router'
import VueMeta from 'vue-meta'
import VueResource from 'vue-resource'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueMeta)
Vue.use(VueResource)
Vue.use(VueClipboard)

import './plugins/axios'
import store from './store'

import globalEntity from '@/utils/global.js'
Vue.prototype.GLOBAL = globalEntity

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(ElementUI)

import Highcharts from "highcharts";
import exporting from 'highcharts/modules/exporting'

exporting(Highcharts)

import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

Vue.config.productionTip = false


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})