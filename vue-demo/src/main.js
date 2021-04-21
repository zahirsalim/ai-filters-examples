import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

// import vectorlyUpscaler from '@vectorly-io/ai-upscaler/dist/vectorly-upscaler'

Vue.config.productionTip = false
// console.log(vectorlyUpscaler)

new Vue({
  render: h => h(App),
}).$mount('#app')
