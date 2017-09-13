<template>
  <div id="app">
    <img class="logo" src="./assets/strava-logo.png">
    <router-view></router-view>
    <a href="mailto:sambuddery@gmail.com" class="feedback">Send us some feedback</a>
  </div>
</template>

<script>
  export default {
    name: 'app',
  };
</script>


<style>
  .logo {
    width: 50%;
    margin: auto;
    max-width: 1000px;
  }

  h1, h2 {
    font-weight: normal;
  }

  .feedback {
    position: fixed;
    bottom: 10px;
    right: 10px;
  }

  @media (max-width: 640px) {
    .feedback {
      position: relative;
      bottom: inherit;
      right: inherit;
      margin-top: 10px;
    }
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  a {
    display: inline-block;
    background-color: #F26522;
    color: white;
    font-weight: bold;
    text-decoration: none;
    padding: 10px 20px;
  }
</style>
