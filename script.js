import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================
// 1. КОНТЕЙНЕР
// ============================================
const container = document.getElementById('three-container');

// ============================================
// 2. СЦЕНА
// ============================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e14);

// ============================================
// 3. КАМЕРА (активна, можна керувати)
// ============================================
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

// ============================================
// 4. РЕНДЕР
// ============================================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// ============================================
// 5. ORBIT CONTROLS (КЕРУВАННЯ КАМЕРОЮ)
// ============================================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // плавне гальмування
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.autoRotate = false; // камера не обертається автоматично
controls.target.set(0, 0, 0);

// ============================================
// 6. СВІТЛО
// ============================================
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(3, 5, 2);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
fillLight.position.set(-2, 1, -3);
scene.add(fillLight);

const backLight = new THREE.DirectionalLight(0xff8844, 0.3);
backLight.position.set(-1, -1, -4);
scene.add(backLight);

// ============================================
// 7. ОСНОВНИЙ ОБ'ЄКТ — СФЕРА З ВІДЕО (БУДЕ ОБЕРТАТИСЬ)
// ============================================
const mainGroup = new THREE.Group();

// --- 7.1 Відеотекстура ---
const video = document.createElement('video');
video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
video.loop = true;
video.muted = true;
video.playsInline = true;
video.autoplay = true;
video.play().catch(() => {});

const videoTexture = new THREE.VideoTexture(video);
videoTexture.needsUpdate = true;

// --- 7.2 Сфера з відеотекстурою (головний об'єкт) ---
const sphereGeo = new THREE.SphereGeometry(1.2, 64, 64);
const sphereMat = new THREE.MeshStandardMaterial({
    map: videoTexture,
    roughness: 0.2,
    metalness: 0.1,
    emissive: new THREE.Color(0x112233),
    emissiveIntensity: 0.3,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.castShadow = true;
sphere.receiveShadow = true;
mainGroup.add(sphere);

// --- 7.3 Каркас навколо сфери (для краси) ---
const wireframeGeo = new THREE.SphereGeometry(1.25, 24, 16);
const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.15,
});
const wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
mainGroup.add(wireframe);

// --- 7.4 Світна оболонка ---
const glowGeo = new THREE.SphereGeometry(1.35, 32, 32);
const glowMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.05,
    wireframe: true,
});
const glow = new THREE.Mesh(glowGeo, glowMat);
mainGroup.add(glow);

scene.add(mainGroup);

// ============================================
// 8. ДОДАТКОВІ 3D-ОБ'ЄКТИ НАВКОЛО
// ============================================

// --- 8.1 Орбітальні кубики ---
const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.6,
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), cubeMat);
cube.position.set(2.2, 1.5, 0);
cube.castShadow = true;
scene.add(cube);

const cubeMat2 = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    emissive: 0x831843,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.6,
});
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), cubeMat2);
cube2.position.set(-2.2, -1.2, 0.8);
cube2.castShadow = true;
scene.add(cube2);

const cubeMat3 = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x064e3b,
    emissiveIntensity: 0.3,
    roughness: 0.3,
    metalness: 0.6,
});
const cube3 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), cubeMat3);
cube3.position.set(0.5, 2.0, 1.5);
cube3.castShadow = true;
scene.add(cube3);

// --- 8.2 Тор ---
const torusMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0x78350f,
    emissiveIntensity: 0.2,
    roughness: 0.4,
    metalness: 0.3,
});
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.08, 16, 32), torusMat);
torus.position.set(1.8, -1.8, -0.5);
torus.castShadow = true;
scene.add(torus);

// --- 8.3 Маленькі сфери, що літають (орбітальний пояс) ---
const dotMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.4,
});
const dots = [];
const numDots = 16;
for (let i = 0; i < numDots; i++) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), dotMat);
    const angle = (i / numDots) * Math.PI * 2;
    const radius = 2.0;
    dot.position.set(Math.cos(angle) * radius, Math.sin(angle * 2) * 0.6, Math.sin(angle) * radius);
    dot.castShadow = true;
    scene.add(dot);
    dots.push({
        mesh: dot,
        angle: angle,
        radius: radius,
        speed: 0.5 + Math.random() * 0.3,
        yOffset: Math.random() * 0.4,
    });
}

// --- 8.4 Кільце (додатковий декоративний елемент) ---
const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
const ringMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.2,
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI / 3;
ring.rotation.z = Math.PI / 4;
scene.add(ring);

const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.015, 16, 64),
    new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15 })
);
ring2.rotation.x = -Math.PI / 4;
ring2.rotation.y = Math.PI / 3;
scene.add(ring2);

// ============================================
// 9. АНІМАЦІЯ
// ============================================
function animate() {
    requestAnimationFrame(animate);

    // ===== ОСНОВНИЙ ОБ'ЄКТ ОБЕРТАЄТЬСЯ =====
    mainGroup.rotation.y += 0.008; // повільне обертання навколо осі Y
    mainGroup.rotation.x += 0.002; // ледь помітне хитання
    mainGroup.rotation.z += 0.001;

    // ===== ОБЕРТАННЯ ДОДАТКОВИХ ОБ'ЄКТІВ =====
    cube.rotation.x += 0.03;
    cube.rotation.y += 0.04;
    cube2.rotation.x += 0.02;
    cube2.rotation.y -= 0.03;
    cube3.rotation.x += 0.04;
    cube3.rotation.z += 0.03;
    torus.rotation.x += 0.04;
    torus.rotation.y += 0.03;

    // ===== РУХ МАЛЕНЬКИХ СФЕР ПО ОРБІТІ =====
    dots.forEach((dot, index) => {
        dot.angle += 0.01 * dot.speed;
        const x = Math.cos(dot.angle) * dot.radius;
        const z = Math.sin(dot.angle) * dot.radius;
        const y = Math.sin(dot.angle * 2 + index) * 0.6;
        dot.mesh.position.set(x, y, z);
    });

    // ===== ОБЕРТАННЯ КІЛЕЦЬ =====
    ring.rotation.y += 0.005;
    ring2.rotation.y -= 0.004;

    // ===== ОНОВЛЕННЯ КОНТРОЛІВ (для плавності) =====
    controls.update();

    // ===== РЕНДЕР =====
    renderer.render(scene, camera);
}
animate();

// ============================================
// 10. АДАПТИВНІСТЬ
// ============================================
window.addEventListener('resize', () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

// ============================================
// 11. ЗАПУСК ВІДЕО ПО КЛІКУ
// ============================================
document.addEventListener('click', () => {
    video.play().catch(() => {});
});

console.log('✅ Сцена Three.js активна!');
console.log('🔄 Об\'єкт обертається!');
console.log('🎥 Камера керована (OrbitControls)');
