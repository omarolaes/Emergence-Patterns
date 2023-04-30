<template>
  <div ref="container" @mousemove="onMouseMove" class="container"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { gsap } from "gsap";

const textTexture =
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/C7C7D7_4C4E5A_818393_6C6C74-256px.png";
const textureUrls = [
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/4F4C45_A7AEAA_7A8575_9D97A2-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/46804D_CBE9AC_90B57C_95D38F-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/47392E_997E69_7C6553_8B745F-256px.png",
  "https://raw.githubusercontent.com/nidorx/matcaps/master/256/0C430C_257D25_439A43_3C683C-256px.png",
];

let currentTextureIndex = 0;

export default {
  name: "NatureSceneMatCap",
  mounted() {
    this.initScene();
    this.animate();
    window.addEventListener("resize", this.onWindowResize, false);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onWindowResize, false);
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

      const orbitControls = new OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      orbitControls.update();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);
      this.scene.background = new THREE.Color(0x888888);
      this.loadText();
      this.camera.position.z = 10;
      this.camera.position.x = 0;
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
    },
    loadText() {
      const loader = new FontLoader();
      loader.load(
        "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          const textGeometry = new TextGeometry("GROW", {
            font: font,
            size: 4,
            height: 2,
          });
          const matcapTextureLoader = new THREE.TextureLoader();
          matcapTextureLoader.load(textTexture, (texture) => {
            const textMaterial = new THREE.MeshMatcapMaterial({
              matcap: texture,
            });
            const text = new THREE.Mesh(textGeometry, textMaterial);
            this.scene.add(text);
            text.position.set(-6, -2, 0);
            text.rotation.x = Math.PI * 0.1;
          });
        }
      );
    },
    createPetalGeometry(radius = 0.1) {
      const points = [];
      for (let i = 0; i < 4; i++) {
        points.push(
          new THREE.Vector3(
            Math.sin(i * 0.1) * 0.5,
            i,
            Math.random() * i * 0.85
          )
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 16, radius, 8, false);
      return geometry;
    },
    createFlower() {
      const flower = new THREE.Group();
      flower.name = "flower";
      const matcapTextureLoader = new THREE.TextureLoader();
      matcapTextureLoader.load(textureUrls[currentTextureIndex], (texture) => {
        const material = new THREE.MeshMatcapMaterial({ matcap: texture });
        for (let i = 0; i < 3; i++) {
          const radius = (i + 1) * 0.1;
          const petalGeometry = this.createPetalGeometry(radius);
          const petal = new THREE.Mesh(petalGeometry, material);
          petal.rotation.y = i % 2 === 0 ? 1 : -1;
          petal.position.set(Math.sin(Math.random() * i * -20), 0, 0);
          flower.add(petal);
        }
      });
      currentTextureIndex = (currentTextureIndex + 1) % textureUrls.length;
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
        flower.position.copy(point);
        flower.scale.set(0.1, 0.1, 0.1);
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name !== "flower") {
          this.scene.add(flower);
          gsap.to(flower.scale, { x: 0.15, y: (Math.random() * 0.25 + 0.10), z: 0.15, duration: 5 });
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