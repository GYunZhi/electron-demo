/*
 * @Author: gongyunzhi
 * @Date: 2020-07-02 15:15:23
 * @LastEditors: gongyunzhi
 * @LastEditTime: 2023-07-26 15:55:02
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'

const layout = () => import('@/views/layout')
const home = () => import('@/views/home')
const apis = () => import('@/views/apis')
const window = () => import('@/views/window')
const ipc = () => import('@/views/ipc')
const desktopCapturer = () => import('@/views/desktopCapturer')
const session = () => import('@/views/session')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'layout',
      component: layout,
      children: [
        {
          path: '/',
          name: 'home',
          component: home
        },
        {
          path: '/apis',
          name: 'apis',
          component: apis
        },
        {
          path: '/window',
          name: 'window',
          component: window
        },
        {
          path: '/ipc',
          name: 'ipc',
          component: ipc
        },
        {
          path: '/desktopCapturer',
          name: 'desktopCapturer',
          component: desktopCapturer
        },
        {
          path: '/session',
          name: 'session',
          component: session
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
