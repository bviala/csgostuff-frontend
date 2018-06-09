import Vue from 'vue'
import Router from 'vue-router'
import StuffList from '@/components/StuffList'
import AddStuff from '@/components/AddStuff'
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
      path: '/addstuff',
      name: 'AddStuff',
      component: AddStuff,
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
