import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import {isAuthenticated} from "@/services/auth";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, {
        path: '/login.html',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    }, {
        path: '/about.html',
        name: 'About',
        component: () => import('@/views/About.vue')
    }, {
        path: '/users.html',
        name: 'Users',
        component: () => import('@/views/User.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/products.html',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/orders.html',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/payments.html',
        name: 'Payments',
        component: () => import('@/views/Payments.vue'),
        beforeEnter: isAuthenticated,
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;
