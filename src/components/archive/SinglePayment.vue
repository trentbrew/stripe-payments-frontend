<template>
  <div class="checkout page-container">

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
  </div>
</template>

<script>
import { fetchFromAPI } from './helpers';
import { stripe } from '../stripe-config';
//import firebase from 'firebase';

var elements = stripe.elements();

export default {
  name: 'Payments',
  data() {
    return {
      amount: 0,
      mountElements: false,
      paymentIntent: null
    }
  },
  mounted() {

  },
  computed: {

  },
  methods: {
    formatUSD(price) {
      return '$' + (price / 100).toFixed(2);
    },
    async createPaymentIntent() {
      const validAmount = Math.min(Math.max(this.amount, 50), 9999999);
      this.amount = validAmount;
      await fetchFromAPI('payments', { body: { amount: validAmount } }).then((pi) => {
        console.log(pi);
        this.paymentIntent = pi;
        this.createAndMountFormElements();
      });
    },
    createAndMountFormElements() {
        this.mountElements = true;

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
    setValidationError(event) {
        this.stripeValidationError = event.error ? event.error.message : "";
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
    /*saveDataToFireStore(stripeObject) {
      const db = firebase.firestore()
      const chargesRef = db.collection("charges")
      const pushId = chargesRef.doc().id

      db.collection("charges").doc(pushId).set(stripeObject)

      chargesRef.doc(pushId).onSnapshot(snapShot => {
        const charge = snapShot.data();
        if (charge.error) {
            alert(charge.error);
            chargesRef
            .doc(pushId)
            .delete();
            return;
        }
        if (charge.status && charge.status == "succeeded") {
            alert(charge.status);
        }
      })
    }*/
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

.inline-form {
  display: flex;
}

.payment-intent-status {
  border: gray 1px solid;
  border-radius: 24px;
  margin-bottom: 24px;
  padding: 24px;
}

.card-inactive {
  opacity: 0;
  transform: scale(0.9);
}

.card-active {
  opacity: 1;
  transform: scale(1);
}

.payment-form {
    max-width: 400px;
    margin: 20px auto;
    border: 1px solid #ececec;
    transition: 300ms;
    transition-delay: 600ms;
}

.payment-form h5 {
    margin: 0;
    padding: 10px;
    font-size: 1.2rem;
}

.card-element {
    margin-top: 5px;
}

#card-number-element,
#card-expiry-element,
#card-cvc-element {
    background: white;
    padding: 5px;
    border: 1px solid #ececec;
    height: 30px;
}



.place-order-button-block {
    margin: 10px 0;
}
  
</style>