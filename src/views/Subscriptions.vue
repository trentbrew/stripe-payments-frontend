<template>
  <div class="checkout page-container">

    <h1>Subscriptions</h1>
    <h4 v-if="user">user: {{ user }}</h4>
    <button v-if="!user" @click="signIn()">Sign in with Google</button>

    <div v-if="user" class="main">
      <div class="section firestore-data-container">
        <h3>Firestore Data</h3>
        <p>User's data in Firestore:</p>
        <p>Stripe Customer ID: {{ data.stripeCustomerId }}</p>
        <p>Subscriptions: {{ JSON.stringify(data.activePlans || []) }}</p>
      </div>
      
      <div class="section plan-picker-container">
        <h3>Step 1: Choose a Plan</h3>
        <div class="plan-buttons">
          <button @click="selectPlan()">Monthly $16/m</button>
          <button @click="selectPlan()">Yearly $192</button>
        </div>
        <p>Selected plan: {{ planId }}</p>
      </div>1

      <div class="payment-method-container">
        <form @submit.prevent="handleSubmit" class="section card-element">
            <div v-if="planSelected" class="test-card-examples">
              <h3>Step 2: Submit a Payment Method</h3>
              <p>Collect credit card details, then submit the payment.</p>
              <p>
                Normal Card: <code>4242424242424242</code>
              </p>
              <p>
                3D Secure Card: <code>4000002500003155</code>
              </p>
            </div>
            <div id="card-info-element" class="input-value"></div>
            <button v-if="planSelected" type="submit">Subscribe & Pay</button>
        </form>
      </div>

      <div class="section manage-subscriptions">
        <h3>Manage Current Subscriptions</h3>
        <div v-if="subscriptions > 0" class="subscriptions">
          <p v-for="(item, index) in subscriptions" :key="index">
            {{ item.id }}. Next payment of {{ item.price }} due {{ item.dueDate }}
          </p>
        </div>
        <p v-if="subscriptions == 0">No Subscriptions</p>
        <button>Cancel</button>
      </div>

      <div class="section">
        <button>Signout</button>
      </div>
    </div>

  </div>
</template>

<script>
import { stripe } from '../stripe-config';
import firebase from 'firebase';
import router from '../router';
import { fetchFromAPI } from './helpers';
import store from '../store';

var elements = stripe.elements();

export default {
  name: 'Subscriptions',
  data() {
    return {
      plan: null,
      planSelected: false,
      data: null,
      subscriptions: []
    }
  },
  mounted() {
    //this.fireSubscribe(); //subscribe?
    this.fetchUsers();
  },
  unmounted() {
    //this.fireSubscribe(); //unsubscribe?
  },
  computed: {
    user() {
      return store.state.user;
    }
  },
  methods: {
    async fetchUsers() {
      if(this.user) {
        console.log('logged ');
        const user = this.user;
        await firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
          this.data = doc.data();
        });
      } else {
        console.error('not signed in');
      }
    },
    selectPlan() {
      console.log('selected plan');
      this.planSelected = true;
      this.createAndMountFormElements();
    },
    fireSubscribe() {
      if(this.user) {
        console.log(this.user);
        firebase.firestore().collection('users').doc(this.user.uid).onSnapshot(doc => {
          this.data = doc.data();
        });
      }
    },
    async getSubscriptions() {
      console.log('getting subscriptions...');
      if (this.user) {
        await fetchFromAPI('subscriptions', { method: 'GET' }).then((subs) => {
          this.subscriptions = subs;
        });
      }
    },
    async cancel(id) {
      this.loading = true;
      await fetchFromAPI('subscriptions/' + id, { method: 'PATCH' }).then(() => {
        alert('canceled!');
      });
      await this.getSubscriptions().then(() => {
        this.loading = false;
      });
    },
    async handleSubmit() {
      this.loading = true;
      const cardElement = elements.getElement('card');

      //create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement
      });

      if(error) {
        alert(error.message);
        this.loading = false;
        return;
      }

      //create subscription on the server
      const subscription = await fetchFromAPI(('subscriptions'), {
        body: {
          plan: this.plan,
          payment_method: paymentMethod.id
        }
      });

      const { latest_invoice } = subscription;

      if(latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;

        if (status === 'requires_action') {
          const { error: confirmationError } = await stripe.confirmCardPayment(
            client_secret
          );
          if (confirmationError) {
            console.error(confirmationError);
            alert('unable to confirm card');
            return;
          }
        }

        // success
        alert('You are subscribed!');
        this.getSubscriptions();
      }
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
    async signIn() {
      console.log('signing in...');
      await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async (result) => {
        console.log('RESULT: ', result);
        const { uid, email } = result.user;
        firebase.firestore().collection('users').doc(uid).set({ email }, { merge: true });
        store.commit('setUser', result.user);
        await this.getSubscriptions();
        this.fetchUsers();
      }).catch((err) => {
        console.error('oopsie woopsie ', err);
      });
    },
    signOut() {
      console.log('signing out...');
      firebase.auth().signOut();
      store.commit('setUser', null);
      router.push('/');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

#card-info-element {
  width: 600px;
}

.section {
  border: solid 1px #e0e0e0;
  border-radius: 24px;
  padding: 12px 24px;
  margin-bottom: 24px;
}
  
</style>