import {createApp} from 'vue'
import './styles/style.css'
import App from './App.vue'
import router from "./router/router.ts";
import {createPinia} from "pinia";
import {Bus} from "./hooks/Bus.ts";

const pinia = createPinia()
const app = createApp(App)


app.config.globalProperties.bus = new Bus();
app.config.globalProperties.msg = 'hello'
app.use(pinia)
app.use(router)
app.mount('#app')

