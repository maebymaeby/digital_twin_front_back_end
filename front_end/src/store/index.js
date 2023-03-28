import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Model from './modules/Model.js'
import User from './modules/User.js'
import Admin from './modules/Admin.js'

export default new Vuex.Store({
  modules: {
    Model,
    User,
    Admin
  }
})