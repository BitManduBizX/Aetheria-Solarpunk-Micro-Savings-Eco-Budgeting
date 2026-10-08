import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Sun,
  ArrowUpCircle,
  Eye,
  Compass,
  Sparkles,
  CloudRain,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAetheria, INFRASTRUCTURE_TIERS } from '../context/AetheriaContext';
import islandBackdropUrl from '../assets/images/solarpunk_island_backdrop_1791438826203.jpg';

export const TerrariumViewport: React.FC = () => {
  const {
    state,
    budgetRemaining,
    budgetHealthStatus,
    harvestDailySunlight,
    upgradeInfrastructure,
  } = useAetheria();

  const mountRef = useRef<HTMLDivElement | null>(null);
  const [viewMode, setViewMode] = useState<'3D_ISLAND' | '2D_CONSERVATORY'>('3D_ISLAND');
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<'GOLDEN_HOUR' | 'ZENITH_SUN'>('GOLDEN_HOUR');
  const [imageError, setImageError] = useState<boolean>(false);

  const currentTier =
    INFRASTRUCTURE_TIERS.find((t) => t.level === state.ecosystemLevel) || INFRASTRUCTURE_TIERS[0];
  const nextTier = INFRASTRUCTURE_TIERS.find((t) => t.level === state.ecosystemLevel + 1);

  useEffect(() => {
    if (viewMode !== '3D_ISLAND') return;
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId = 0;

    try {
      const width = container.clientWidth || 800;
      const height = container.clientHeight || 420;

      const scene = new THREE.Scene();
      const bgHex =
        lightingPreset === 'GOLDEN_HOUR'
          ? budgetHealthStatus === 'OVER_BUDGET'
            ? 0x261c1a
            : 0x13261b
          : 0x1a2e26;
      scene.background = new THREE.Color(bgHex);
      scene.fog = new THREE.FogExp2(bgHex, 0.032);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 5.2, 11.5);
      camera.lookAt(0, 0.6, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const canvasEl = renderer.domElement;
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setWebglSupported(false);
        setViewMode('2D_CONSERVATORY');
      };
      canvasEl.addEventListener('webglcontextlost', handleContextLost, false);

      // Three-Point Studio Lighting
      const keyLight = new THREE.DirectionalLight(
        lightingPreset === 'GOLDEN_HOUR' ? 0xffdfa8 : 0xffffff,
        2.2
      );
      keyLight.position.set(7, 11, 6);
      keyLight.castShadow = true;
      scene.add(keyLight);

      const fillLight = new THREE.AmbientLight(0xa3d9c9, 0.85);
      scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.15);
      rimLight.position.set(-8, 5, -7);
      scene.add(rimLight);

      // Floating Island Group
      const islandGroup = new THREE.Group();
      scene.add(islandGroup);

      // Base Terraced Stone & Mineral Core
      const rockGeo = new THREE.CylinderGeometry(4.2, 2.1, 2.2, 7);
      const rockMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.y = -1.1;
      islandGroup.add(rockMesh);

      // Soil & Moss Terrace Layer (Color responds to budgetHealthStatus)
      const turfColor =
        budgetHealthStatus === 'HEALTHY'
          ? 0x2d5a27
          : budgetHealthStatus === 'WARNING'
          ? 0x856826
          : 0x7f392d;

      const turfGeo = new THREE.CylinderGeometry(4.4, 4.15, 0.55, 7);
      const turfMat = new THREE.MeshStandardMaterial({
        color: turfColor,
        roughness: 0.7,
        metalness: 0.05,
        flatShading: true,
      });
      const turfMesh = new THREE.Mesh(turfGeo, turfMat);
      turfMesh.position.y = 0.25;
      islandGroup.add(turfMesh);

      // Upper Botanical Terrace
      const upperGeo = new THREE.CylinderGeometry(2.6, 2.9, 0.5, 7);
      const upperMat = new THREE.MeshStandardMaterial({
        color: budgetHealthStatus === 'HEALTHY' ? 0x10b981 : 0xd97706,
        roughness: 0.65,
        flatShading: true,
      });
      const upperMesh = new THREE.Mesh(upperGeo, upperMat);
      upperMesh.position.set(-0.4, 0.72, -0.3);
      islandGroup.add(upperMesh);

      // Cascading Hydro Stream
      const streamGeo = new THREE.BoxGeometry(0.95, 0.65, 2.8);
      const streamMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.82,
      });
      const streamMesh = new THREE.Mesh(streamGeo, streamMat);
      streamMesh.position.set(1.1, 0.45, 1.2);
      islandGroup.add(streamMesh);

      // Dynamic Infrastructure based on state.ecosystemLevel (1..4)
      const infraGroup = new THREE.Group();
      islandGroup.add(infraGroup);

      // Level 1+: Cedar Well / Hydro Base
      const wellGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.7, 8);
      const wellMat = new THREE.MeshStandardMaterial({
        color: 0x92400e,
        roughness: 0.75,
      });
      const wellMesh = new THREE.Mesh(wellGeo, wellMat);
      wellMesh.position.set(1.1, 0.85, 0.2);
      infraGroup.add(wellMesh);

      // Rotating Turbine / Solar Rotor
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(1.1, 1.55, 0.2);
      infraGroup.add(rotorGroup);

      if (state.ecosystemLevel >= 2) {
        // Heliotropic Copper-Glass Solar Ring
        const ringGeo = new THREE.TorusGeometry(0.85, 0.08, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          metalness: 0.7,
          roughness: 0.25,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        rotorGroup.add(ringMesh);
      }

      if (state.ecosystemLevel >= 3) {
        // Kinetic Hydro-Turbine Blades
        for (let i = 0; i < 6; i++) {
          const bladeGeo = new THREE.BoxGeometry(0.16, 1.5, 0.06);
          const bladeMat = new THREE.MeshStandardMaterial({
            color: 0xfef3c7,
            metalness: 0.5,
            roughness: 0.3,
          });
          const blade = new THREE.Mesh(bladeGeo, bladeMat);
          blade.rotation.z = (i * Math.PI) / 3;
          rotorGroup.add(blade);
        }
      }

      if (state.ecosystemLevel >= 4) {
        // Atmospheric Geodesic Bio-Dome
        const domeGeo = new THREE.IcosahedronGeometry(1.45, 1);
        const domeMat = new THREE.MeshPhysicalMaterial({
          color: 0xa7f3d0,
          wireframe: true,
          transparent: true,
          opacity: 0.65,
        });
        const domeMesh = new THREE.Mesh(domeGeo, domeMat);
        domeMesh.position.set(-0.6, 1.65, -0.4);
        infraGroup.add(domeMesh);
      }

      // Pine & Solarpunk Flora Cluster (Count scales with Sunlight Energy)
      const treePositions = [
        [-1.6, 0.95, -0.9, 1.15],
        [-0.5, 0.98, -1.3, 1.35],
        [-1.9, 0.95, 0.6, 0.95],
        [0.4, 0.98, -1.1, 1.05],
        [-0.9, 0.98, 1.4, 0.85],
        [2.3, 0.55, -0.8, 0.9],
        [-2.8, 0.55, -0.2, 0.8],
      ];

      const activeTreeCount = Math.max(
        3,
        Math.min(treePositions.length, Math.round((state.sunlightEnergy / 100) * treePositions.length))
      );

      for (let i = 0; i < activeTreeCount; i++) {
        const [tx, ty, tz, scale] = treePositions[i];
        const tree = new THREE.Group();
        tree.position.set(tx, ty, tz);
        tree.scale.setScalar(scale);

        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.15, 0.6, 6),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
        );
        trunk.position.y = 0.3;
        tree.add(trunk);

        const foliageColor =
          budgetHealthStatus === 'HEALTHY'
            ? i % 2 === 0
              ? 0x10b981
              : 0x2d5a27
            : budgetHealthStatus === 'WARNING'
            ? 0xd97706
            : 0xef4444;

        const cone1 = new THREE.Mesh(
          new THREE.ConeGeometry(0.65, 1.2, 6),
          new THREE.MeshStandardMaterial({
            color: foliageColor,
            roughness: 0.6,
            flatShading: true,
          })
        );
        cone1.position.y = 0.95;
        tree.add(cone1);

        const cone2 = new THREE.Mesh(
          new THREE.ConeGeometry(0.48, 0.95, 6),
          new THREE.MeshStandardMaterial({
            color: foliageColor,
            roughness: 0.55,
            flatShading: true,
          })
        );
        cone2.position.y = 1.55;
        tree.add(cone2);

        islandGroup.add(tree);
      }

      // Orbiting Firefly / Sunlight Particles
      const particleCount = 42;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 2.2 + (i % 5) * 0.6;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0.8 + (i % 7) * 0.38;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: budgetHealthStatus === 'OVER_BUDGET' ? 0xef4444 : 0xfbbf24,
        size: 0.14,
        transparent: true,
        opacity: 0.85,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      islandGroup.add(particles);

      // Pointer drag rotation interaction
      let isDragging = false;
      let prevX = 0;
      let targetRotationY = 0.35;

      const onPointerDown = (e: PointerEvent) => {
        isDragging = true;
        prevX = e.clientX;
      };
      const onPointerMove = (e: PointerEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - prevX;
        prevX = e.clientX;
        targetRotationY += deltaX * 0.008;
      };
      const onPointerUp = () => {
        isDragging = false;
      };

      canvasEl.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);

      let clock = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        clock += 0.014;

        if (!isDragging) {
          targetRotationY += 0.0025;
        }
        islandGroup.rotation.y += (targetRotationY - islandGroup.rotation.y) * 0.08;
        islandGroup.position.y = Math.sin(clock * 1.4) * 0.14;

        rotorGroup.rotation.z += 0.025 * state.ecosystemLevel;
        rotorGroup.rotation.y = Math.sin(clock * 0.7) * 0.35;
        particles.rotation.y = -clock * 0.3;

        renderer?.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 800;
        const h = container.clientHeight || 420;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        canvasEl.removeEventListener('pointerdown', onPointerDown);
        canvasEl.removeEventListener('webglcontextlost', handleContextLost);
        renderer?.dispose();
      };
    } catch (err) {
      console.warn('WebGL fallback to 2D Botanical Conservatory view:', err);
      setWebglSupported(false);
      setViewMode('2D_CONSERVATORY');
    }
  }, [viewMode, state.ecosystemLevel, state.sunlightEnergy, budgetHealthStatus, lightingPreset]);

  return (
    <section
      aria-label="Solarpunk Floating Ecosystem Viewport"
      className="relative w-full rounded-2xl overflow-hidden border border-[#1E293B]/15 bg-[#13261B] text-white"
    >
      {/* 3D WebGL or 2D Botanical Fallback Viewport */}
      <div className="relative w-full h-[440px] sm:h-[480px]">
        {viewMode === '3D_ISLAND' && webglSupported ? (
          <div
            ref={mountRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            title="Drag horizontally to rotate your floating Solarpunk island"
          />
        ) : (
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#13261B] via-[#1E3F2B] to-[#2D5A27]">
            {!imageError && (
              <img
                src={islandBackdropUrl}
                alt="Solarpunk Floating Botanical Conservatory Island"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center opacity-85"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />
          </div>
        )}

        {/* Top-Left Semantic DOM Overlay: Ecosystem Status & Biomarkers */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto z-10 pointer-events-auto flex flex-col gap-2 max-w-md">
          <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-emerald-200/90">
              <span>Sanctuary Tier {state.ecosystemLevel} of 4</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{state.streakDays}-Day Sunlight Streak</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Level {state.level} Steward</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-0.5 tracking-tight">
              {currentTier.name}
            </h2>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              {currentTier.description}
            </p>

            {/* Spend-Driven Biomarker Indicator (Text + Icon + Color for Accessibility) */}
            <div className="mt-2.5 pt-2.5 border-t border-white/15 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                {budgetHealthStatus === 'HEALTHY' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span className="text-[#10B981] font-medium">
                      Biomarker: Thriving Canopy (Under Budget)
                    </span>
                  </>
                ) : budgetHealthStatus === 'WARNING' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span className="text-[#F59E0B] font-medium">
                      Biomarker: Amber Dew Alert (Near Threshold)
                    </span>
                  </>
                ) : (
                  <>
                    <CloudRain className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <span className="text-[#EF4444] font-medium">
                      Biomarker: Dry Soil Storm (Over Budget)
                    </span>
                  </>
                )}
              </div>
              <span className="font-mono tabular-nums text-white/90 font-semibold">
                ${budgetRemaining.toFixed(0)} left
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right Viewport Controls (3D / 2D Switcher & Lighting) */}
        <div className="hidden sm:flex absolute top-4 right-4 z-10 pointer-events-auto items-center gap-2">
          {webglSupported && (
            <div className="flex items-center gap-1 p-1 bg-black/50 backdrop-blur-md border border-white/15 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('3D_ISLAND')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === '3D_ISLAND'
                    ? 'bg-[#2D5A27] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                3D Interactive Island
              </button>
              <button
                type="button"
                onClick={() => setViewMode('2D_CONSERVATORY')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === '2D_CONSERVATORY'
                    ? 'bg-[#2D5A27] text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Conservatory Panorama
              </button>
            </div>
          )}

          {viewMode === '3D_ISLAND' && (
            <button
              type="button"
              onClick={() =>
                setLightingPreset((prev) =>
                  prev === 'GOLDEN_HOUR' ? 'ZENITH_SUN' : 'GOLDEN_HOUR'
                )
              }
              className="px-3 py-2 text-xs font-medium bg-black/50 backdrop-blur-md border border-white/15 rounded-lg text-white/90 hover:bg-black/70 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
              {lightingPreset === 'GOLDEN_HOUR' ? 'Golden Hour' : 'Zenith Sun'}
            </button>
          )}
        </div>

        {/* Bottom HUD Bar: Sunlight Check-In, Specimens & Infrastructure Level-Up */}
        <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-black/55 backdrop-blur-md border border-white/15 rounded-xl p-3.5">
          {/* Left Metrics & Specimens */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <div>
              <span className="text-white/65 block">Canopy Sunlight</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono tabular-nums text-sm font-semibold text-[#F59E0B]">
                  {state.sunlightEnergy}%
                </span>
                <div className="w-20 h-2 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] transition-transform duration-200 origin-left"
                    style={{ transform: `scaleX(${state.sunlightEnergy / 100})` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-white/65 block">Micro-Savings Yield</span>
              <span className="font-mono tabular-nums text-sm font-semibold text-[#10B981]">
                ${state.microSavingsBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ·{' '}
                {(state.baseApy + state.bonusApy).toFixed(2)}% APY
              </span>
            </div>

            <div className="hidden md:block">
              <span className="text-white/65 block">Active Wildlife & Flora</span>
              <span className="text-white/90 font-medium">
                {state.unlockedSpecimens.slice(-2).join(' · ')}
              </span>
            </div>
          </div>

          {/* Right Primary Meta-Game Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={harvestDailySunlight}
              className="px-4 py-2 text-xs font-semibold bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Harvest Daily Sunlight (+95 XP)
            </button>

            {nextTier ? (
              <button
                type="button"
                onClick={upgradeInfrastructure}
                className="px-4 py-2 text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-[#10B981]" />
                Upgrade to {nextTier.name} (${nextTier.requiredSavings.toLocaleString()})
              </button>
            ) : (
              <span className="text-xs text-[#10B981] font-medium px-2">
                Max Infrastructure Tier Reached
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
