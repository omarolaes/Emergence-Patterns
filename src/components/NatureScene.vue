<template>
  <div ref="container" @mousemove="onMouseMove" class="container"></div>
</template>

<script>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { initScene, animate, onWindowResize, onMouseMove } from "./scene.js";

export default {
  name: "NatureScene",
  setup() {
    const container = ref(null);

    onMounted(() => {
      initScene(container);
      animate();
      window.addEventListener("resize", onWindowResize, false);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", onWindowResize, false);
    });

    return {
      container,
      onMouseMove,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
