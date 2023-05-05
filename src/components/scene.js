import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { gsap } from "gsap";

const textTexture =
    "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8D8E5_9D9DAF_B4B4C4_B4B4CC-256px.png";

const textureUrls = [
    "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8D8E5_9D9DAF_B4B4C4_B4B4CC-256px.png",
    "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8D8E5_9D9DAF_B4B4C4_B4B4CC-256px.png",
    "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8D8E5_9D9DAF_B4B4C4_B4B4CC-256px.png",
    "https://raw.githubusercontent.com/nidorx/matcaps/master/256/D8D8E5_9D9DAF_B4B4C4_B4B4CC-256px.png",
];

let currentTextureIndex = 0;

let scene, camera, renderer, raycaster, mouse;

export function initScene(container) {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.autoRotate = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.value.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x888888);
    loadText();
    camera.position.z = 8;
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
}

function loadText() {
    const loader = new FontLoader();
    loader.load("/picnic.json", (font) => {
        const textGeometry = new TextGeometry("Z", {
            font: font,
            size: 8,
            height:2,
        });
        const matcapTextureLoader = new THREE.TextureLoader();
        matcapTextureLoader.load(textTexture, (texture) => {
            const textMaterial = new THREE.MeshMatcapMaterial({
                matcap: texture,
            });
            const text = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(text);
            text.position.set(-4, -4, 0);
            text.rotation.y = Math.PI * 0.1;
            text.rotation.x = Math.PI * 0.1;
        });
    });
}

function createPetalGeometry(radius = 0.1) {
    const points = [];
    for (let i = 0; i < 5; i++) {
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
}

function createFlower() {
    const flower = new THREE.Group();
    flower.name = "flower";
    const matcapTextureLoader = new THREE.TextureLoader();
    matcapTextureLoader.load(textureUrls[currentTextureIndex], (texture) => {
        const material = new THREE.MeshMatcapMaterial({ matcap: texture });
        for (let i = 0; i <= 1; i++) {
            const radius = (i + 1) * 0.1;
            const petalGeometry = createPetalGeometry(radius);
            const petal = new THREE.Mesh(petalGeometry, material);
            petal.rotation.y = i % 2 === 0 ? 1 : -1;
            petal.rotation.x = Math.PI * 0.1;
            petal.position.set(
                Math.sin(Math.random() * i * -20),
                Math.random() * 0.1 + 0.25,
                -0.1
            );
            flower.add(petal);
        }
    });
    currentTextureIndex = (currentTextureIndex + 1) % textureUrls.length;
    return flower;
}

export function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0.05) {
        const point = intersects[0].point;
        const flower = createFlower();
        flower.position.copy(point);
        flower.scale.set(0.1, 0.1, 0.1);
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name !== "flower") {
            scene.add(flower);
            gsap.to(flower.scale, {
                x: 0.15,
                y: Math.random() * 0.5 + 0.05,
                z: 0.15,
                duration: Math.floor(Math.random() * (15 - 2 + 1)) + 2,
            });
        }
    }
}

export function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}