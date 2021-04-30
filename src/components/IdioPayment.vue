<template>
    <div class="payment-intent-status">
      <h3>{{ ( !paymentIntent ? 'No Payment Intent Created Yet' : 'Payment Intent ' + paymentIntent.status ) }}</h3>
      <h4 v-if="paymentIntent">{{ 'id: ' + paymentIntent.id }}</h4>
      <h4 v-if="paymentIntent">{{ 'amount: ' + paymentIntent.amount }}</h4>
      <h4 v-if="paymentIntent">{{ 'status: ' + paymentIntent.status }}</h4>
    </div>

    <div class="inline-form">
      <input type="number" v-model="amount" :disabled="paymentIntent" />
      <button :disabled="amount <= 0" @click="createPaymentIntent" :hidden="paymentIntent">
        {{ 'Ready to pay $' + (amount / 100).toFixed(2) }}
      </button>
    </div>

    <section :class="( mountElements ? 'card-active' : 'card-inactive' )" class="row payment-form">
      <h5 class="#e0e0e0 grey lighten-4">
          Payment Method
          <span class="right">{{ formatUSD(amount) }}</span>
      </h5>

      <div class="error red center-align white-text">{{stripeValidationError}}</div>

      <form @submit.prevent="handleSubmit" class="col s12 card-element">
          <h3>Step 2: Submit a Payment Method</h3>
          <p>Collect credit card details, then submit the payment.</p>
          <p>
            Normal Card: <code>4242424242424242</code>
          </p>
          <p>
            3D Secure Card: <code>4000002500003155</code>
          </p>
          <div id="card-info-element" class="input-value"></div>
          <button type="submit">Donate</button>
      </form>

    </section>
</template>

<script>
import { fetchFromAPI } from '../views/helpers';
import { stripe } from '../stripe-config';

var elements = stripe.elements();

export default {
    name: '',
    data() {
        return {
            mountElements: false,
            amount: 0,
            paymentIntent: null,
        }
    },
    mounted() {

    },
    methods: {
        formatUSD(price) {
            return '$' + (price / 100).toFixed(2);
        },
        createAndMountFormElements() {
            var card = elements.create("card", {
                style: {
                    base: {
                    color: "#32325D",
                    fontWeight: 500,
                    fontFamily: "Inter UI, Open Sans, Segoe UI, sans-serif",
                    fontSize: "16px",
                    fontSmoothing: "antialiased",

                    "::placeholder": {
                        color: "#CFD7DF"
                    }
                    },
                    invalid: {
                    color: "#E25950"
                    }
                }
            });

            card.mount("#card-info-element");
        },
        async createPaymentIntent() {
            this.mountElements = true;
            const validAmount = Math.min(Math.max(this.amount, 50), 9999999);
            this.amount = validAmount;
            await fetchFromAPI('payments', { body: { amount: validAmount } }, true).then((pi) => {
                console.log(pi);
                this.paymentIntent = pi;
                this.createAndMountFormElements();
            });
        },
        async handleSubmit() {
            const cardElement = elements.getElement("card");

            // Confirm Card Payment
            const {
                paymentIntent: updatedPaymentIntent,
                error,
            } = await stripe.confirmCardPayment(this.paymentIntent.client_secret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                console.error(error);
                (error.payment_intent ? this.paymentIntent = error.payment_intent : this.paymentIntent);
            } else {
                this.paymentIntent = updatedPaymentIntent;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.idiopayment-container {
    width: 600px;
}

.card-inactive {
    opacity: 0;
    transform: scale(0.9);
}

.card-active {
    opacity: 1;
    transform: scale(1);
}
</style>