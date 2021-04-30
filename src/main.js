import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from 'firebase'
import { firebaseConfig } from '../firebase-config.js'

firebase.initializeApp(firebaseConfig)

createApp(App).use(store).use(router).mount('#app')
