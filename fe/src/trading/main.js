import Vue from 'vue'
import App from './App.vue'
import 'font-awesome/scss/font-awesome.scss'
import store from '@/client/store'
new Vue({
    store,
    render: h => h(App)
}).$mount('#app')

