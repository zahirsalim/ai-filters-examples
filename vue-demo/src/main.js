import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

import VueFlashMessage from 'vue-flash-message';
Vue.use(VueFlashMessage);

require('vue-flash-message/dist/vue-flash-message.min.css');

// import vectorlyUpscaler from '@vectorly-io/ai-upscaler/dist/vectorly-upscaler'

Vue.config.productionTip = false
// console.log(vectorlyUpscaler)

new Vue({
  render: h => h(App),
}).$mount('#app')
