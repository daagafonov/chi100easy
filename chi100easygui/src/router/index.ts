import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about.html',
        name: 'About',
        component: () => import('@/views/About.vue')
    }, {
        path: '/users.html',
        name: 'Users',
        component: () => import('@/views/User.vue'),
    }, {
        path: '/products.html',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
    }, {
        path: '/orders.html',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
    }, {
        path: '/payments.html',
        name: 'Payments',
        component: () => import('@/views/Payments.vue'),
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;
