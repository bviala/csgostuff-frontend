import Vue from 'vue'
import Router from 'vue-router'
import StuffList from '@/components/StuffList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StuffList',
      component: StuffList
    }
  ]
})
