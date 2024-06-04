import { createMemoryHistory, createRouter } from 'vue-router'

const layout = () => import('@/views/layout.vue');
const home = () => import('@/views/home.vue');
const apis = () => import('@/views/apis.vue');
const bv = () => import('@/views/bv.vue');
const ipc = () => import('@/views/ipc.vue');
const desktopCapturer = () => import('@/views/desktopCapturer.vue');
const session = () => import('@/views/session.vue');
const protocal = () => import('@/views/protocal.vue')

const routes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/',
        name: 'home',
        component: home,
      },
      {
        path: '/apis',
        name: 'apis',
        component: apis,
      },
      {
        path: '/bv',
        name: 'bv',
        component: bv,
      },
      {
        path: '/ipc',
        name: 'ipc',
        component: ipc,
      },
      {
        path: '/desktopCapturer',
        name: 'desktopCapturer',
        component: desktopCapturer,
      },
      {
        path: '/session',
        name: 'session',
        component: session,
      },{
        path: '/protocal',
        name: 'protocal',
        component: protocal,
      },
    ],
  }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router