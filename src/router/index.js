import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ApiModuleView from '../views/ApiModuleView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/api/:moduleId', name: 'api-module', component: ApiModuleView, props: true }
  ]
})

export default router
