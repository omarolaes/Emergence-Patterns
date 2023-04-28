<template>
  <div ref="container"></div>
</template>

<script>
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap';


export default {
  name: 'NatureScene',
  mounted() {
    this.initScene();
    this.animate();
    window.addEventListener('resize', this.onWindowResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.$refs.container.appendChild(this.renderer.domElement);

      this.scene.background = new THREE.Color(0x111111);

      const loader = new FontLoader();
      loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('NATURE', {
          font: font,
          size: 4,
          height: 0.05,
        });

        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        this.scene.add(text);
      });

      this.camera.position.z = 8;
      this.camera.position.y = 1;
      this.camera.position.x = 12;

      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
    },
    createFlower() {
      const flower = new THREE.Group();

      const scaleFactor = Math.random() * 0.5 + 0.5;

      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.CircleGeometry((Math.random() * 1) * scaleFactor, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const petal = new THREE.Mesh(geometry, material);

        petal.position.x = Math.cos((i * 2 * Math.PI) / 5);
        petal.position.y = Math.sin((i * 2 * Math.PI) / 5);
        flower.add(petal);
      }

      return flower;
    },
    onMouseMove(event) {
      event.preventDefault();

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const flower = this.createFlower();
        flower.position.set(point.x, point.y, point.z);
        flower.scale.set(0.1, 0.1, 0.1);
        this.scene.add(flower);

        gsap.to(flower.scale, {
          x: 0.25,
          y: 0.25,
          z: 0.25,
          duration: 0.5,
        });
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