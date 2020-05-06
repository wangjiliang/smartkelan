import Vue from 'vue'
import App from './App'
import baseUrl from './Api/baseUrl'

Vue.prototype.baseUrl =baseUrl;
Vue.prototype.firstLoaded = true;

import './static/css/style.scss'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
