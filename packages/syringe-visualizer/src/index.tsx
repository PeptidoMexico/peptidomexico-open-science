"use client";

import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BARREL_BOTTOM = -1.32;
const CHAMBER_HEIGHT = 2.72;
const BARREL_TOP = BARREL_BOTTOM + CHAMBER_HEIGHT;

export interface SyringeVisualizerProps {
  capacityMl: number;
  volumeMl: number;
  reducedMotion?: boolean;
  className?: string;
  ariaLabel?: string;
}

export interface SyringeSceneProps {
  capacityMl: number;
  volumeMl: number;
  reducedMotion?: boolean;
}

function positiveOr(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clampVolume(volumeMl: number, capacityMl: number): number {
  return Math.max(0, Math.min(capacityMl, Number.isFinite(volumeMl) ? volumeMl : 0));
}

function formatVolume(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

function usePrefersReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function makeGraduationTexture(capacityMl: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(18, 24, 30, 0.96)";
  context.strokeStyle = "rgba(18, 24, 30, 0.96)";
  context.lineCap = "round";
  context.textAlign = "right";
  context.textBaseline = "middle";
  context.font = "700 34px Arial, sans-serif";

  for (let index = 0; index <= 10; index += 1) {
    const y = 76 + (index * 872) / 10;
    const major = index % 5 === 0 || index === 10;
    context.lineWidth = major ? 8 : 5;
    context.beginPath();
    context.moveTo(major ? 270 : 320, y);
    context.lineTo(472, y);
    context.stroke();
    context.fillText((capacityMl * index / 10).toFixed(1), 250, y);
  }

  context.font = "800 28px Arial, sans-serif";
  context.textAlign = "left";
  context.fillText("mL", 270, 984);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function StudioEnvironment() {
  const { gl, get } = useThree();

  useEffect(() => {
    const scene = get().scene;
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04).texture;
    scene.environment = environment;

    return () => {
      if (scene.environment === environment) scene.environment = null;
      environment.dispose();
      pmrem.dispose();
      room.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material?.dispose();
        }
      });
    };
  }, [get, gl]);

  return (
    <>
      <ambientLight intensity={0.32} color="#dbe6f4" />
      <hemisphereLight args={["#fffaf3", "#8492a6", 0.58]} />
      <directionalLight
        castShadow
        position={[3.5, 5.2, 4.8]}
        intensity={4.2}
        color="#fff7e9"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-4, 2.5, 2]} intensity={1.8} color="#d7e5ff" />
      <pointLight position={[0, 1.8, -2.8]} intensity={1.3} distance={8} color="#ffb35c" />
    </>
  );
}

function GraduationStrip({ capacityMl }: { capacityMl: number }) {
  const texture = useMemo(() => makeGraduationTexture(capacityMl), [capacityMl]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={[0.015, 0.03, 0.438]} renderOrder={4}>
      <planeGeometry args={[0.34, 2.74]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function SyringeModel({
  capacityMl,
  volumeMl,
  reducedMotion,
}: {
  capacityMl: number;
  volumeMl: number;
  reducedMotion: boolean;
}) {
  const plungerRef = useRef<THREE.Group>(null);
  const fluidRef = useRef<THREE.Mesh>(null);
  const pistonRef = useRef<THREE.Mesh>(null);
  const fraction = capacityMl > 0 ? volumeMl / capacityMl : 0;
  const displayedFraction = useRef(fraction);

  useFrame((_, delta) => {
    displayedFraction.current = reducedMotion
      ? fraction
      : THREE.MathUtils.damp(displayedFraction.current, fraction, 7, delta);
    const liveFraction = displayedFraction.current;
    const fluidHeight = Math.max(0.001, CHAMBER_HEIGHT * liveFraction);
    const fluidLevel = BARREL_BOTTOM + fluidHeight;

    if (fluidRef.current) {
      fluidRef.current.scale.y = fluidHeight;
      fluidRef.current.position.y = BARREL_BOTTOM + fluidHeight / 2;
    }
    if (plungerRef.current) plungerRef.current.position.y = fluidLevel;
    if (pistonRef.current) pistonRef.current.position.y = fluidLevel;
  });

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#f8fbff",
    roughness: 0.04,
    transmission: 0.92,
    thickness: 0.18,
    ior: 1.46,
    clearcoat: 0.7,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.46,
    depthWrite: false,
  }), []);
  const orangeMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#ff6a13",
    metalness: 0.06,
    roughness: 0.28,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
  }), []);
  const rubberMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2b3036",
    roughness: 0.62,
  }), []);
  const fluidMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#5b8eea",
    roughness: 0.08,
    transmission: 0.23,
    thickness: 0.28,
    ior: 1.34,
    transparent: true,
    opacity: 0.82,
  }), []);
  const metalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#b9c2cb",
    metalness: 0.78,
    roughness: 0.22,
  }), []);

  return (
    <group rotation={[0, -0.16, 0]} position={[0, 0.03, 0]}>
      <mesh castShadow receiveShadow material={glassMaterial}>
        <cylinderGeometry args={[0.43, 0.43, CHAMBER_HEIGHT, 96, 1, true]} />
      </mesh>
      <mesh position={[0, BARREL_TOP, 0]} material={glassMaterial}>
        <torusGeometry args={[0.43, 0.027, 16, 96]} />
      </mesh>
      <mesh position={[0, BARREL_BOTTOM, 0]} material={glassMaterial}>
        <torusGeometry args={[0.43, 0.027, 16, 96]} />
      </mesh>

      <mesh ref={fluidRef} castShadow material={fluidMaterial} position={[0, BARREL_BOTTOM + 0.05, 0]} scale={[0.8, 0.001, 0.8]}>
        <cylinderGeometry args={[0.39, 0.39, 1, 96]} />
      </mesh>
      <mesh ref={pistonRef} castShadow material={rubberMaterial} position={[0, BARREL_BOTTOM, 0]}>
        <cylinderGeometry args={[0.375, 0.375, 0.09, 64]} />
      </mesh>
      <mesh position={[0, BARREL_BOTTOM + 0.002, 0]} material={rubberMaterial}>
        <torusGeometry args={[0.36, 0.018, 12, 64]} />
      </mesh>

      <GraduationStrip capacityMl={capacityMl} />

      <group ref={plungerRef} position={[0, BARREL_BOTTOM, 0]}>
        <mesh position={[0, 0.035, 0]} castShadow material={orangeMaterial}>
          <cylinderGeometry args={[0.10, 0.10, 0.92, 32]} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow material={orangeMaterial}>
          <cylinderGeometry args={[0.27, 0.24, 0.17, 64]} />
        </mesh>
        <mesh position={[0, 0.63, 0]} castShadow material={orangeMaterial}>
          <torusGeometry args={[0.235, 0.027, 16, 64]} />
        </mesh>
        <mesh position={[0, 0.76, 0]} castShadow material={orangeMaterial}>
          <cylinderGeometry args={[0.235, 0.22, 0.14, 64]} />
        </mesh>
      </group>

      <mesh position={[0, BARREL_BOTTOM - 0.13, 0]} castShadow material={orangeMaterial}>
        <cylinderGeometry args={[0.5, 0.47, 0.18, 64]} />
      </mesh>
      <mesh position={[0, BARREL_BOTTOM - 0.25, 0]} castShadow material={orangeMaterial}>
        <cylinderGeometry args={[0.24, 0.31, 0.13, 64]} />
      </mesh>
      <RoundedBox args={[0.98, 0.09, 0.58]} radius={0.055} smoothness={5} position={[0, BARREL_BOTTOM - 0.06, 0]} castShadow material={glassMaterial} />
      <mesh position={[0, BARREL_BOTTOM - 0.4, 0]} castShadow material={metalMaterial}>
        <cylinderGeometry args={[0.095, 0.095, 0.3, 32]} />
      </mesh>
      <mesh position={[0, BARREL_BOTTOM - 0.57, 0]} castShadow material={metalMaterial}>
        <coneGeometry args={[0.08, 0.22, 32]} />
      </mesh>
    </group>
  );
}

function AccessibleSyringeVisual({ capacityMl, volumeMl }: { capacityMl: number; volumeMl: number }) {
  const fraction = capacityMl > 0 ? volumeMl / capacityMl : 0;
  const liquidTop = 380 - fraction * 318;

  return (
    <div className="syringe-visualizer__fallback" aria-hidden="true">
      <svg viewBox="0 0 220 520" focusable="false">
        <defs>
          <linearGradient id="syringe-glass" x1="0" x2="1">
            <stop offset="0" stopColor="#dbe3eb" stopOpacity=".38" />
            <stop offset=".48" stopColor="#fff" stopOpacity=".78" />
            <stop offset="1" stopColor="#b7c2cd" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="syringe-liquid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#91b9ff" stopOpacity=".86" />
            <stop offset="1" stopColor="#315ec1" stopOpacity=".72" />
          </linearGradient>
          <linearGradient id="syringe-orange" x1="0" x2="1">
            <stop offset="0" stopColor="#e94b08" />
            <stop offset=".5" stopColor="#ff7a1a" />
            <stop offset="1" stopColor="#df4307" />
          </linearGradient>
        </defs>
        <ellipse cx="110" cy="495" rx="72" ry="10" fill="#364557" opacity=".15" />
        <rect x="84" y="48" width="52" height="338" rx="17" fill="url(#syringe-glass)" stroke="#a9b6c2" strokeWidth="3" />
        <rect x="91" y={liquidTop} width="38" height={Math.max(2, 380 - liquidTop)} rx="7" fill="url(#syringe-liquid)" />
        <rect x="73" y="17" width="74" height="23" rx="8" fill="url(#syringe-orange)" />
        <rect x="104" y="36" width="12" height="39" rx="5" fill="#f26413" />
        <rect x="59" y="383" width="102" height="17" rx="8" fill="url(#syringe-orange)" />
        <rect x="91" y="399" width="38" height="20" rx="7" fill="#e85a0d" />
        <rect x="103" y="418" width="14" height="55" rx="5" fill="#bbc4ce" />
        <path d="M103 473h14l-7 21z" fill="#8996a5" />
        {Array.from({ length: 11 }, (_, index) => {
          const y = 66 + index * 30;
          const major = index % 5 === 0 || index === 10;
          const mark = (capacityMl * index / 10).toFixed(1);
          return (
            <g key={index}>
              <line x1={major ? 127 : 132} x2="148" y1={y} y2={y} stroke="#1d2734" strokeWidth={major ? 2.5 : 1.5} />
              {major ? <text x="123" y={y + 4} textAnchor="end" fill="#1d2734" fontSize="12" fontWeight="700">{mark}</text> : null}
            </g>
          );
        })}
        <text x="129" y="371" fill="#1d2734" fontSize="11" fontWeight="700">mL</text>
        <path d="M96 62v298" stroke="#fff" strokeWidth="4" opacity=".48" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SceneContents({ capacityMl, volumeMl, reducedMotion }: { capacityMl: number; volumeMl: number; reducedMotion: boolean }) {
  return (
    <>
      <StudioEnvironment />
      <SyringeModel capacityMl={capacityMl} volumeMl={volumeMl} reducedMotion={reducedMotion} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.17, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#e6ebf1" roughness={0.9} />
      </mesh>
      <ContactShadows position={[0, -2.16, 0]} opacity={0.34} scale={4.5} blur={2.6} far={4} resolution={512} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.075}
        enablePan={false}
        minDistance={5.5}
        maxDistance={10.5}
        minPolarAngle={0.58}
        maxPolarAngle={2.6}
        target={[0, -0.2, 0]}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.45}
      />
    </>
  );
}

export function SyringeScene({ capacityMl: requestedCapacity, volumeMl: requestedVolume, reducedMotion = false }: SyringeSceneProps) {
  const capacityMl = positiveOr(requestedCapacity, 1);
  const volumeMl = clampVolume(requestedVolume, capacityMl);
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 2]}
      camera={{ position: [3.2, 0.55, 7.5], fov: 36, near: 0.1, far: 30 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.12,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      fallback={<AccessibleSyringeVisual capacityMl={capacityMl} volumeMl={volumeMl} />}
    >
      <SceneContents capacityMl={capacityMl} volumeMl={volumeMl} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export function SyringeVisualizer({
  capacityMl: requestedCapacity,
  volumeMl: requestedVolume,
  reducedMotion,
  className,
  ariaLabel,
}: SyringeVisualizerProps) {
  const capacityMl = positiveOr(requestedCapacity, 1);
  const volumeMl = clampVolume(requestedVolume, capacityMl);
  const systemReducedMotion = usePrefersReducedMotion();
  const motionReduced = reducedMotion ?? systemReducedMotion;
  const label = ariaLabel ?? "Syringe visualization with " + formatVolume(volumeMl) + " mL of " + formatVolume(capacityMl) + " mL represented.";

  return (
    <div
      className={className}
      role="img"
      aria-label={label}
      style={{ width: "100%", minHeight: 340, position: "relative" }}
    >
      <SyringeScene capacityMl={capacityMl} volumeMl={volumeMl} reducedMotion={motionReduced} />
    </div>
  );
}

export default SyringeVisualizer;
