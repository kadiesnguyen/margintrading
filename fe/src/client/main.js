import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/client/tailwind.css'
import Vue from 'vue'
// import 'tw-elements';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
