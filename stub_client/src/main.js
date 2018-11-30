// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueSocketio from 'vue-socket.io'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './icons.css'
const conf = require('../config/config.js');
Vue.use(VueSocketio, conf.host+':'+conf.socket_port)
// Vue.use(VueSocketio, 'http://10.26.232.235:8000')
Vue.use(Vuetify)

import data from './store.js'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    data,
    sockets: {
        disconnect: function () {
          console.log('socket to notification channel disconnected')
        },
        connect: function () {
          console.log('socket to notification channel connected!!!!')
        },
      },
})