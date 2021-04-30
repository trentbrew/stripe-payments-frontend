<template>
    <div class="page-container">
        <!--IdioPayment /-->
        <CardElement actionText="Donate" />
    </div>
</template>

<script>
//import IdioPayment from '@/components/idioPayment.vue';
import CardElement from '@/components/CardElement.vue';

export default {
    name: 'Test',
    components: {
        //IdioPayment,
        CardElement
    },
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.page-container {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>