import * as THREE from 'three';

const container = document.getElementById('three-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e14);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Світло
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(1, 2, 1);
scene.add(dirLight);

// ВІДЕО
const video = document.createElement('video');
video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;
video.autoplay = true;
video.play().catch(() => {});

const videoTexture = new THREE.VideoTexture(video);
videoTexture.needsUpdate = true;

// Площина з відео
const geometry = new THREE.PlaneGeometry(2.2, 1.6);
const material = new THREE.MeshStandardMaterial({
    map: videoTexture,
    side: THREE.DoubleSide,
    emissive: new THREE.Color(0x222233),
    emissiveIntensity: 0.2,
});
const videoPlane = new THREE.Mesh(geometry, material);
scene.add(videoPlane);

// Додаткові 3D-об'єкти
const cubeGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1e3a8a, emissiveIntensity: 0.3 });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(1.8, 1.2, -0.5);
scene.add(cube);

const cube2 = new THREE.Mesh(cubeGeo, new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0x831843, emissiveIntensity: 0.3 }));
cube2.position.set(-1.8, -1.2, -0.5);
scene.add(cube2);

const sphereGeo = new THREE.SphereGeometry(0.25, 24, 24);
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x4c1d95, emissiveIntensity: 0.3 });
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(1.8, -1.2, 0.3);
scene.add(sphere);

const torusGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32);
const torusMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x78350f, emissiveIntensity: 0.3 });
const torus = new THREE.Mesh(torusGeo, torusMat);
torus.position.set(-1.8, 1.2, 0.3);
scene.add(torus);

// Анімація
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.02;
    cube.rotation.y += 0.03;
    cube2.rotation.x += 0.02;
    cube2.rotation.y -= 0.03;
    sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.02;
    torus.rotation.x += 0.03;
    torus.rotation.y += 0.02;

    renderer.render(scene, camera);
}
animate();

// Адаптивність
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

// Запуск відео по кліку
document.addEventListener('click', () => {
    video.play().catch(() => {});
});