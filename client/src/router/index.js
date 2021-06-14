import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
      path: '/:pathMatch(.*)*',
      redirect: to => {
        return {
          path: '/',
          name: 'Create',
          component: () => import(/* webpackChunkName: "Create" */ '../views/CreatePage.vue')
        }
      }
    },
    {
      path: '/create',
      name: 'Create',
      component: () => import(/* webpackChunkName: "Create" */ '../views/CreatePage.vue')
    },
    {
      path: '/detail/:code',
      name: 'Detail',
      component: () => import(/* webpackChunkName: "Detail" */ '../views/DetailPage.vue')
    },
    {
      path: '/links',
      name: 'Links',
      component: () => import(/* webpackChunkName: "Links" */ '../views/LinksPage.vue')
    }
  ]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
