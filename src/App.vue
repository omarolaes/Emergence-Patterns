<template>
  <NatureScene />
</template>

<script>
import NatureScene from './components/NatureScene.vue'

export default {
  name: 'App',
  components: {
    NatureScene
  }
}
</script>

<style>
body{
  margin: 0;
  background: #2c3e50;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
canvas{
  width: 100%;
  height: 100%;
}
</style>
