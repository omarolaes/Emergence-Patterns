<template>
  <div ref="container"></div>
</template>

<script>
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { gsap } from "gsap";

const textTexture =
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/CBCBCB_595959_8C8C8C_747474-256px.png";
const textureUrls = [
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/CB4E88_F99AD6_F384C3_ED75B9-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/CB919B_F9DDE1_ECC0C8_F4CCD4-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D64480_E27497_EA9BB1_CD156F-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8388B_230A14_FCC8FC_FC71E1-256px.png",
];

let currentTextureIndex = 0;

export default {
  name: "NatureSceneMatCap",
  mounted() {
    this.initScene();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize, false);
    window.removeEventListener("mousemove", this.onMouseMove, false);
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);
      this.scene.background = new THREE.Color(0x888888);
      const loader = new FontLoader();
      //
      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          const textGeometry = new TextGeometry("*Grow", {
            font: font,
            size: 4,
            height: 1,
          });
          const matcapTextureLoader = new THREE.TextureLoader();
          matcapTextureLoader.load(textTexture, (texture) => {
            const textMaterial = new THREE.MeshMatcapMaterial({
              matcap: texture,
            });
            const text = new THREE.Mesh(textGeometry, textMaterial);
            this.scene.add(text);
          });
        }
      );
      this.camera.rotation.y = 0.25;
      this.camera.position.z = 6;
      this.camera.position.y = 1.5;
      this.camera.position.x = 12;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
    },
    createFlower() {
      const flower = new THREE.Group();
      flower.name = "flower";
      const scaleFactor = Math.random() * 1 + 0.5;
      const matcapTextureLoader = new THREE.TextureLoader();
      matcapTextureLoader.load(textureUrls[currentTextureIndex], (texture) => {
        for (let i = 0; i < 5; i++) {
          const geometry = new THREE.CylinderGeometry(
            0.5,
            0.5,
            Math.random() * 0.5 * scaleFactor,
            20,
            32
          );
          const material = new THREE.MeshMatcapMaterial({ matcap: texture });
          const petal = new THREE.Mesh(geometry, material);
          petal.position.x = Math.cos((i * 4 * Math.PI) / 5);
          petal.position.y = Math.sin((i * 0.5 * Math.PI) / 5);
          petal.position.z = -0.4;
          flower.add(petal);
        }
      });
      currentTextureIndex++;
      if (currentTextureIndex >= textureUrls.length) {
        currentTextureIndex = 0;
      }
      return flower;
    },
    onMouseMove(event) {
      event.preventDefault();
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children);
      if (intersects.length > 0.05) {
        const point = intersects[0].point;
        const flower = this.createFlower();
        flower.position.set(point.x, point.y, point.z);
        flower.scale.set(0.015, 0.015, 0.015);
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name !== "flower") {
          this.scene.add(flower);
          gsap.to(flower.scale, {
            x: 0.25,
            y: 0.25,
            z: 0.25,
            duration: 2,
          });
        }
      }
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
