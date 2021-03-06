import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import {isAuthenticated} from "@/services/auth";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Начальная',
        component: Home
    }, {
        path: '/login',
        name: 'Вход',
        component: () => import('@/views/Login.vue')
    }, {
        path: '/logout',
        name: 'Выход',
        component: () => import('@/views/Logout.vue')
    }, {
        path: '/about',
        name: 'О нас',
        component: () => import('@/views/About.vue')
    }, {
        path: '/users',
        name: 'Клиенты',
        component: () => import('@/views/User.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/products',
        name: 'Продукты',
        component: () => import('@/views/Products.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/payments',
        name: 'Платежи',
        component: () => import('@/views/Payments.vue'),
        beforeEnter: isAuthenticated,
    }, {
        path: '/offers',
        name: 'Акции',
        component: () => import('@/views/Offers.vue'),
        beforeEnter: isAuthenticated,
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router;
