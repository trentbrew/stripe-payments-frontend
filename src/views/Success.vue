<template>
    <div class="page-container">
        <h1>Payment Was a Success!!!</h1>
        <h3>{{ sessionId }}</h3>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: null,
            sessionId: null
        }
    },
    mounted() {
        this.url = window.location.href;
        this.sessionId = new URL(this.url).searchParams.get('session_id');
    }
}
</script>

<style lang="scss" scoped>
h1 {
    color: forestgreen;
}
</style>