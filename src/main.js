import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './assets/style.css'

console.log("Starting IBN SINO EDUCATION App...");

try {
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
    console.log("App successfully mounted to #app");
} catch (error) {
    console.error("Critical error during app mount:", error);
}
