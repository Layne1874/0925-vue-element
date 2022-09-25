import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control


//注册全局组件
import CategorySelect from '@/components/CategorySelect';
import hintButton from '@/components/HintButton';

//注册全局组件
Vue.component(CategorySelect.name, CategorySelect);
Vue.component(hintButton.name, hintButton);


//引入API相关的四个发送请求的函数
import $api from '@/api';
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false


Vue.prototype.$api = $api;
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
