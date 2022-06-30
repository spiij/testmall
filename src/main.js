import Vue from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './store/index'


Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


// const num = 10
// console.log(!num)