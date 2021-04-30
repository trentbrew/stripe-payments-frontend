import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Checkout from '../views/Checkout.vue'
import Payments from '../views/Payments.vue'
import Customers from '../views/Customers.vue'
import Subscriptions from '../views/Subscriptions.vue'
import Cancel from '../views/Cancel.vue'
import Success from '../views/Success.vue'
import Test from '../views/Test.vue'
import PaymentSlider from '../views/PaymentSlider.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/payments',
    name: 'Payments',
    component: Payments
  },
  {
    path: '/payment-slider',
    name: 'PaymentSlider',
    component: PaymentSlider
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: Subscriptions
  },
  {
    path: '/failed',
    name: 'Cancel',
    component: Cancel
  },
  {
    path: '/success',
    name: 'Success',
    component: Success
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
