<template>
    <div class="payment-method-container">
      <form @submit.prevent="handleSubmit" class="section card-element">
          <div id="card-info-element" class="input-value"></div>
          <button type="submit">{{ actionText }}</button>
      </form>
    </div>
</template>

<script>
import { fetchFromAPI } from '../views/helpers';
import { stripe } from '../stripe-config';

var elements = stripe.elements();

export default {
    name: 'CardElement',
    data() {
        return {
            amount: 0,
            mountElements: false,
            paymentIntent: null
        }
    },
    props: {
        actionText: {
            type: String,
            default: 'Submit'
        }
    },
    mounted() {
        this.createAndMountFormElements();
    },
    methods: {
        async createPaymentIntent() {
            const validAmount = Math.min(Math.max(this.amount, 50), 9999999);
            this.amount = validAmount;
            await fetchFromAPI('payments', { body: { amount: validAmount } }, true).then((pi) => {
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
    }
}
</script>

<style lang="scss" scoped>
#card-info-element {
    width: 500px;
}
</style>