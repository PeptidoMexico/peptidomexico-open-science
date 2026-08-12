import * as THREE from "three";

const host = document.querySelector("#scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e5eaf2");
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(3.9, 1.65, 6.7);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
host.append(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xfafcff, 0x9faabd, 2.3));
const key = new THREE.DirectionalLight(0xffffff, 3.2);
key.position.set(3, 5, 4);
key.castShadow = true;
scene.add(key);
const fill = new THREE.DirectionalLight(0x8da8ff, 1.2);
fill.position.set(-4, 1, 2);
scene.add(fill);

const rig = new THREE.Group();
rig.rotation.z = -0.055;
scene.add(rig);
const barrelLength = 4.65;
const barrelRadius = 0.52;
const glassMaterial = new THREE.MeshPhysicalMaterial({ color: 0xeaf4ff, transparent: true, opacity: 0.22, roughness: 0.08, metalness: 0.05, transmission: 0.25, side: THREE.DoubleSide });
const glass = new THREE.Mesh(new THREE.CylinderGeometry(barrelRadius, barrelRadius, barrelLength, 64, 1, true), glassMaterial);
glass.rotation.z = Math.PI / 2;
glass.castShadow = true;
rig.add(glass);
const capMaterial = new THREE.MeshStandardMaterial({ color: 0xff6a18, roughness: 0.28, metalness: 0.05 });
const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.67, 0.67, 0.18, 64), capMaterial);
hub.rotation.z = Math.PI / 2;
hub.position.x = -barrelLength / 2 - 0.12;
hub.castShadow = true;
rig.add(hub);
const needle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.018, 1.5, 24), new THREE.MeshStandardMaterial({ color: 0xb6c0cf, metalness: 0.8, roughness: 0.2 }));
needle.rotation.z = Math.PI / 2;
needle.position.x = -barrelLength / 2 - 0.9;
rig.add(needle);
const plunger = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.16, 64), new THREE.MeshStandardMaterial({ color: 0x313c50, roughness: 0.38, metalness: 0.15 }));
plunger.rotation.z = Math.PI / 2;
rig.add(plunger);
const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.25, 32), new THREE.MeshStandardMaterial({ color: 0x4e5b70, roughness: 0.4, metalness: 0.22 }));
rod.rotation.z = Math.PI / 2;
rig.add(rod);
const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.13, 64), capMaterial);
thumb.rotation.z = Math.PI / 2;
thumb.castShadow = true;
rig.add(thumb);
const tickGroup = new THREE.Group();
const tickMaterial = new THREE.MeshBasicMaterial({ color: 0x273248 });
for (let index = 0; index <= 30; index += 1) {
  const tick = new THREE.Mesh(new THREE.BoxGeometry(0.025, index % 5 === 0 ? 0.27 : 0.16, 0.012), tickMaterial);
  tick.position.set(-barrelLength / 2 + (barrelLength * index) / 30, -0.02, barrelRadius + 0.014);
  tickGroup.add(tick);
}
rig.add(tickGroup);
const fluid = new THREE.Mesh(new THREE.CylinderGeometry(barrelRadius * 0.8, barrelRadius * 0.8, 1, 64), new THREE.MeshPhysicalMaterial({ color: 0xff7b22, transparent: true, opacity: 0.78, roughness: 0.14, metalness: 0.02, transmission: 0.08 }));
fluid.rotation.z = Math.PI / 2;
fluid.position.x = -barrelLength / 2 + 0.5;
fluid.castShadow = true;
rig.add(fluid);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.ShadowMaterial({ color: 0x273248, opacity: 0.14 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.1;
floor.receiveShadow = true;
scene.add(floor);

function resize() {
  const box = host.getBoundingClientRect();
  const height = box.height || 520;
  renderer.setSize(box.width, height, false);
  camera.aspect = box.width / height;
  camera.updateProjectionMatrix();
}

function update() {
  const mass = Number(document.querySelector("#mass").value);
  const target = Number(document.querySelector("#target").value);
  const capacity = Number(document.querySelector("#capacity").value);
  const volume = target > 0 ? mass / target : 0;
  document.querySelector("#answer").textContent = `${Number.isFinite(volume) ? volume.toFixed(3) : "—"} mL`;
  document.querySelector("#formula").textContent = target > 0 ? `${mass} mg ÷ ${target} mg/mL = ${volume.toFixed(3)} mL` : "Enter a positive concentration";
  const visible = Math.max(0.03, Math.min(volume / capacity, 1));
  fluid.scale.x = visible;
  fluid.position.x = -barrelLength / 2 + (barrelLength * visible) / 2;
  plunger.position.x = -barrelLength / 2 + barrelLength * Math.min(volume / capacity, 1) + 0.22;
  rod.position.x = plunger.position.x + 0.62;
  thumb.position.x = plunger.position.x + 1.25;
}

new ResizeObserver(resize).observe(host);
resize();
document.querySelectorAll("input, select").forEach((node) => node.addEventListener("input", update));
update();

function animate() {
  requestAnimationFrame(animate);
  rig.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();
