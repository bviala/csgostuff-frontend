import Vue from 'vue'
import Router from 'vue-router'
import StuffList from '@/components/StuffList'
import StuffCreation from '@/components/StuffCreation'
import store from '../store/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StuffList',
      component: StuffList
    },
    {
      path: '/createstuff',
      name: 'StuffCreation',
      component: StuffCreation,
      beforeEnter: (to, from, next) => {
        if (!store.state.isUserSignedIn) {
          next('/') // redirect the user back to home if not signed in
        } else {
          next() // process
        }
      }
    }
  ]
})
