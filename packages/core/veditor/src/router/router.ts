import { createMemoryHistory, createRouter } from 'vue-router'
import Home from "../views/Home.vue";
import Editor from "../views/Editor.vue";
import Preview from "../views/Preview.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/editor/:appId', component: Editor },
    { path: '/preview/:appId', component: Preview },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router