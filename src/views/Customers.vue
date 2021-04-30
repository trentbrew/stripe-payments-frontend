<template>
  <div class="checkout page-container">
    <h1>Customers</h1>
    <button v-if="!user" @click="signIn">Sign in with Google</button>
    <div v-if="user" class="main">
      <h4>user: {{ user.email }}</h4>
      <div class="section attach-new-card-container">
        <h4>Create a stetup intent</h4>
        <button @click="createSetupIntent">Attach New Credit Card</button>
        <div class="payment-method-container">
          <form @submit.prevent="handleSubmit" class="col s12 card-element">
              <div v-if="displayPaymentMethod" class="test-card-examples">
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
              <button v-if="displayPaymentMethod" type="submit">Submit</button>
          </form>
        </div>
      </div>
      <div class="section payment-sources-container">
        <h4>Retrieve all Payment Sources</h4>
        <select class="payment-sources-list">
          <option v-for="(item, index) in paymentSources" :key="index">
            {{ item.card.brand + ' **** **** **** ' + item.card.last4 + ' expires ' + item.card.exp_month + '/' + item.card.exp_year }}
          </option>
        </select>
      </div>
      <button @click="signOut">Signout</button>
    </div>
  </div>
</template>

<script>
import router from '../router';
import firebase from 'firebase';
import { fetchFromAPI } from './helpers';
import { stripe } from '../stripe-config';
import store from '../store';

var elements = stripe.elements();

export default {
  name: 'Customers',
  data() {
    return {
      wallet: null,
      paymentSources: [],
      si: null,
      mountElements: false,
      displayPaymentMethod: false
    }
  },
  mounted() {
    this.fetchTestData();
  },
  computed: {
    user() {
      return store.state.user;
    }
  },
  methods: {
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
    async handleSubmit() {
      const cardElement = elements.getElement("card");

      // Confirm Card Payment
      const {
        setupIntent: updatedSetupIntent,
        error,
      } = await stripe.confirmCardSetup(this.setupIntent.client_secret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        alert(error.message);
        console.error(error);
      } else {
        this.setupIntent = updatedSetupIntent;
        await this.getWallet().then(() => {
          alert('Success! Card has been added to your wallet');
        });
      }
    },
    async createSetupIntent() {
      this.displayPaymentMethod = true;
      this.createAndMountFormElements();
      await fetchFromAPI('wallet').then((si) => {
        this.setupIntent = si;
      });
    },
    async getWallet() {
      console.log('fetching wallet...');
      if(this.user) {
        await fetchFromAPI('wallet', { method: 'GET' }).then((paymentMethods) => {
          this.wallet = paymentMethods;
          this.mapPaymentSources();
        });
      }
    },
    mapPaymentSources() {
      this.paymentSources = [];
      console.log('wallet', this.wallet);
      this.wallet.forEach((paymentSource) => {
        this.paymentSources.push({
          key: paymentSource.id,
          card: paymentSource.card
        });
      });
      console.log('paymentSources:::', this.paymentSources);
    },
    fetchTestData() {
      console.log('fetching test data...');
      firebase.firestore().collection('test-data').get().then((docs) => {
        docs.forEach((doc) => {
          console.log(doc.data());
        });
      });
    },
    async signIn() {
      console.log('signing in...');
        await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(async (result) => {
          console.log('RESULT: ', result);
          const { uid, email } = result.user;
          firebase.firestore().collection('users').doc(uid).set({ email }, { merge: true });
          store.commit('setUser', result.user);
          await this.getWallet();
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

.section {
  padding: 12px 24px;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  margin-bottom: 24px;
}

</style>