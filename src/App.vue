<template>
  <div id="app">
    <div v-if="dev" id="nav">
      <ul>
        <router-link to="/"><li>Home</li></router-link>
        <router-link to="/checkout"><li>Checkout</li></router-link>
        <router-link to="/payments"><li>Payments</li></router-link>
        <router-link to="/payment-slider"><li>Payment Slider</li></router-link>
        <router-link to="/customers"><li>Customers</li></router-link>
        <router-link to="/subscriptions"><li>Subscriptions</li></router-link>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    
  },
  data() {
    return {
      dev: false
    }
  }
}
</script>

<style lang="scss">
body {
  margin: 0px;
  padding: 0px;
}

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  background: black;
  height: 80px;
  width: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ul {
    justify-content: center;
    align-items: center;
    display: flex;
    list-style: none;

    li {
      margin-left: 12px;
      margin-right: 12px;
    }
  }

  a {
    font-weight: normal;
    text-decoration: none;
    color: white !important;
    opacity: 0.4;

    &.router-link-exact-active {
      color: white;
      opacity: 1 !important;
      //font-weight: bold;
    }
  }
}
</style>
