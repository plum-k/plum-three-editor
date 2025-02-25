import {createApp} from 'vue'
import './styles/style.css'
import App from './App.vue'
import router from "./router/router.ts";
import {createPinia} from "pinia";
import {Bus} from "./hooks";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
const pinia = createPinia()
const app = createApp(App)


app.config.globalProperties.bus = new Bus();
app.use(pinia)
app.use(router)
app.use(ContextMenu)
app.mount('#app')

