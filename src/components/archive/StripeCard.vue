<template>
  <div id='app'>
    <h1>Please give us your payment details:</h1>
    <Card class='stripe-card'
      :class='{ complete }'
      stripe='pk_test_51HvILvHUKxrEYb5x1DKN1D7yf80AS7OYixPzMBW4q5VH69vtJ4IfqbMZyV5OZHyfe5Z2pcjbGkkxLpiPClpZGDk900kDGDYx4Y'
      :options='stripeOptions'
      @change='complete = $event.complete'
    />
    <button class='pay-with-stripe' @click='pay' :disabled='!complete'>Pay with credit card</button>
  </div>
</template>
 
<script>
//import { stripeKey, stripeOptions } from './stripeConfig.json'
import { Card, createToken } from 'vue-stripe-elements-plus';
 
export default {
  name: 'StripeCard',
  components: { Card },
  data () {
    return {
      complete: false,
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
      }
    }
  },
  mounted() {
    console.log('mounted stripe card');
    console.log('card component', Card);
    console.log('createToken function', createToken);
  },
  methods: {
    pay () {
      // createToken returns a Promise which resolves in a result object with
      // either a token or an error key.
      // See https://stripe.com/docs/api#tokens for the token object.
      // See https://stripe.com/docs/api#errors for the error object.
      // More general https://stripe.com/docs/stripe.js#stripe-create-token.
      
      //createToken().then(data => console.log(data.token))

      console.log('handle payment');
    }
  }
}
</script> 
 
<style>
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style>