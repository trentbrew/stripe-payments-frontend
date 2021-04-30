<template>
  <div class="checkout page-container">
    <h2>Stripe Checkout</h2>
    <p>        
        Shopping-cart scenario. Change the quantity
        of the products below, then click checkout to open the Stripe Checkout
        window.
    </p>
    <div class="product">
        <h3>{{ product.name }}</h3>
        <h4>Stripe Amount: {{ product.amount }}</h4>
        <h4>USD: {{ formatUSD(product.amount) }}</h4>

        <img :src="product.images[0]" width="250" alt="product"/><br>

        <button @click="changeQuantity(-1)">-</button>
        
        <span style="margin:20px;font-size:2em">{{ product.quantity }}</span>

        <button @click="changeQuantity(1)">+</button>
    </div>
    <button class="btn-primary" @click="handleClick" :disabled="product.quantity < 1">Start Checkout</button>
  </div>
</template>

<script>
import { stripe } from '../stripe-config';
import { fetchFromAPI } from './helpers';

export default {
  name: 'Checkout',
  data() {
    return {
        product: {
            name: 'Hat',
            description: 'nunu Hat',
            images: [
                'https://images.unsplash.com/photo-1521369909029-2afed882baee?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
            ],
            amount: 799,
            currency: 'usd',
            quantity: 0
        }
    }
  },
  mounted() {
      console.log('stripe object', stripe);
  },
  computed: {

  },
  methods: {
    formatUSD(price) {
        return '$' + (price / 100);
    },
    changeQuantity(v) {
        this.product.quantity += v;
        console.log('new product quantity: ', this.product.quantity);
    },
    async handleClick(event) {
        console.log('handling click: ', event);
        const body = { line_items: [this.product] }
        const { id: sessionId } = await fetchFromAPI('checkouts', { body }, true);
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if(error) {
            console.log(error);
        }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';


  
</style>