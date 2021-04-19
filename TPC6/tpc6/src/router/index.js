import Vue from 'vue'
import VueRouter from 'vue-router'
import Pubs from '../views/Pubs.vue'
import Pub from '../views/Pub.vue'
import PubsAuthor from '../views/PubsAuthor.vue'
import Authors from '../views/Authors.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/pubs',
    name: 'Pubs',
    component: () => import(/* webpackChunkName: "about" */ '../views/Pubs.vue')
  },
  {
    path: '/pubs/author/:id',
    name: 'PubsAuthor',
    component: PubsAuthor
  },
  {
    path: '/pubs/:id',
    name: 'Pub',
    component: Pub
  },
  {
    path: '/authors',
    name: 'Authors',
    component: Authors
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
