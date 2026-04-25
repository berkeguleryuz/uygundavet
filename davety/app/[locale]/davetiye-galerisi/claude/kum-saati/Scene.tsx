"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Palette = { bg: string; ink: string; accent: string };

const SAND_COUNT = 480;
const NECK_R = 0.18;
const CHAMBER_H = 1.6;
const CHAMBER_TOP_R = 1.05;
const SETTLE_FLOOR_Y = -CHAMBER_H + 0.04;

interface SandParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  settled: boolean;
}

export function KumSaatiScene({ palette }: { palette: Palette }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"idle" | "running" | "revealed">("idle");
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const triggerRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(palette.bg);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    wrap.appendChild(renderer.domElement);

    /* ── Lighting ── */
    const hemi = new THREE.HemisphereLight(0xffffff, 0x884422, 0.55);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1c2, 1.05);
    key.position.set(3.2, 5.4, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 3;
    key.shadow.camera.bottom = -3;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb5d4ff, 0.35);
    rim.position.set(-4, 1.4, -2);
    scene.add(rim);

    /* ── Floor / Pedestal ── */
    const pedestalGroup = new THREE.Group();
    scene.add(pedestalGroup);

    const baseDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.7, 0.18, 48),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#3a2a18"),
        roughness: 0.8,
        metalness: 0.05,
      })
    );
    baseDisk.position.y = -2.05;
    baseDisk.receiveShadow = true;
    baseDisk.castShadow = true;
    pedestalGroup.add(baseDisk);

    /* ── Hourglass parent (rotates / lifts on trigger end) ── */
    const hourglass = new THREE.Group();
    scene.add(hourglass);

    /* Wooden caps */
    const woodMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#5a3a1f"),
      roughness: 0.78,
      metalness: 0.05,
    });

    const topCap = new THREE.Mesh(
      new THREE.CylinderGeometry(CHAMBER_TOP_R + 0.12, CHAMBER_TOP_R + 0.12, 0.18, 36),
      woodMat
    );
    topCap.position.y = CHAMBER_H + 0.1;
    topCap.castShadow = true;
    hourglass.add(topCap);

    const bottomCap = new THREE.Mesh(
      new THREE.CylinderGeometry(CHAMBER_TOP_R + 0.12, CHAMBER_TOP_R + 0.12, 0.18, 36),
      woodMat
    );
    bottomCap.position.y = -CHAMBER_H - 0.1;
    bottomCap.castShadow = true;
    hourglass.add(bottomCap);

    /* Wooden corner pillars */
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, CHAMBER_H * 2 + 0.36, 12),
        woodMat
      );
      pillar.position.set(
        Math.cos(angle) * (CHAMBER_TOP_R + 0.06),
        0,
        Math.sin(angle) * (CHAMBER_TOP_R + 0.06)
      );
      pillar.castShadow = true;
      hourglass.add(pillar);
    }

    /* Glass cones — built as LatheGeometry with hourglass profile */
    const profilePoints: THREE.Vector2[] = [];
    const segs = 40;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const y = -CHAMBER_H + t * (CHAMBER_H * 2);
      // hourglass radius profile: large at edges, narrow at neck
      const yNorm = y / CHAMBER_H;
      const r = NECK_R + (CHAMBER_TOP_R - NECK_R) * Math.pow(Math.abs(yNorm), 1.4);
      profilePoints.push(new THREE.Vector2(r, y));
    }
    const glassGeom = new THREE.LatheGeometry(profilePoints, 56);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      thickness: 0.4,
      roughness: 0.06,
      metalness: 0,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const glass = new THREE.Mesh(glassGeom, glassMat);
    hourglass.add(glass);

    /* ── Sand particles ── */
    const sandGeom = new THREE.SphereGeometry(0.045, 6, 6);
    const sandMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.accent).multiplyScalar(1.05),
      roughness: 0.95,
      metalness: 0,
    });
    const sandMesh = new THREE.InstancedMesh(sandGeom, sandMat, SAND_COUNT);
    sandMesh.castShadow = false;
    sandMesh.receiveShadow = false;
    hourglass.add(sandMesh);

    const particles: SandParticle[] = [];
    const dummy = new THREE.Object3D();

    function radiusAtY(y: number): number {
      const yNorm = Math.min(1, Math.max(-1, y / CHAMBER_H));
      return NECK_R + (CHAMBER_TOP_R - NECK_R) * Math.pow(Math.abs(yNorm), 1.4);
    }

    function initSand() {
      particles.length = 0;
      // Stack in upper chamber
      for (let i = 0; i < SAND_COUNT; i++) {
        const rndR = Math.sqrt(Math.random()) * (CHAMBER_TOP_R - 0.1);
        const rndA = Math.random() * Math.PI * 2;
        const baseY = 0.05 + Math.random() * (CHAMBER_H - 0.1);
        const px = Math.cos(rndA) * rndR;
        const pz = Math.sin(rndA) * rndR;
        // clamp to inside hourglass profile
        const r = Math.hypot(px, pz);
        const maxR = radiusAtY(baseY) - 0.06;
        const scale = maxR > 0 && r > maxR ? maxR / r : 1;
        particles.push({
          pos: new THREE.Vector3(px * scale, baseY, pz * scale),
          vel: new THREE.Vector3(0, 0, 0),
          settled: false,
        });
      }
      writeInstances();
    }

    function writeInstances() {
      for (let i = 0; i < SAND_COUNT; i++) {
        const p = particles[i];
        dummy.position.copy(p.pos);
        dummy.updateMatrix();
        sandMesh.setMatrixAt(i, dummy.matrix);
      }
      sandMesh.instanceMatrix.needsUpdate = true;
    }

    initSand();

    /* ── Pedestal pin under hourglass (where invitation will appear) ── */
    const pinPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.45, 0.06, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.accent).multiplyScalar(0.55),
        roughness: 0.7,
      })
    );
    pinPlate.position.y = -CHAMBER_H - 0.16;
    pinPlate.castShadow = true;
    pinPlate.receiveShadow = true;
    pedestalGroup.add(pinPlate);

    /* ── Invitation card (hidden initially) ── */
    const cardW = 1.05;
    const cardH = 1.45;
    const cardCanvas = document.createElement("canvas");
    cardCanvas.width = 420;
    cardCanvas.height = 580;
    const ctx = cardCanvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 580);
      grad.addColorStop(0, "#fbf5e8");
      grad.addColorStop(1, "#efe1c1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 420, 580);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 380, 540);
      ctx.fillStyle = palette.ink;
      ctx.font = "italic 28px Merienda, serif";
      ctx.textAlign = "center";
      ctx.fillText("Sayın Misafir", 210, 110);
      ctx.font = "bold 36px Orbitron, sans-serif";
      ctx.fillText("DÜĞÜN", 210, 220);
      ctx.font = "italic 42px Merienda, serif";
      ctx.fillText("Hilal & İbrahim", 210, 290);
      ctx.font = "20px Space Grotesk, sans-serif";
      ctx.fillText("15 Haziran 2026", 210, 360);
      ctx.fillText("19:00 — Boğaz Terası", 210, 395);
      ctx.font = "italic 18px Merienda, serif";
      ctx.fillText("~ bize katılın ~", 210, 510);
    }
    const cardTex = new THREE.CanvasTexture(cardCanvas);
    cardTex.colorSpace = THREE.SRGBColorSpace;
    const cardMat = new THREE.MeshStandardMaterial({
      map: cardTex,
      roughness: 0.6,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(cardW, cardH), cardMat);
    card.position.set(0, -CHAMBER_H - 0.1, 0);
    card.rotation.x = 0;
    card.visible = false;
    card.castShadow = true;
    pedestalGroup.add(card);

    /* ── Mouse parallax for the camera ── */
    const targetCam = { x: 0, y: 0.6 };
    function onPointerMove(e: PointerEvent) {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      targetCam.x = dx * 0.7;
      targetCam.y = 0.6 - dy * 0.5;
    }
    wrap.addEventListener("pointermove", onPointerMove);

    /* ── Animation loop with manual physics ── */
    const G = -3.6; // gravity
    const NECK_HOLE_R = NECK_R - 0.045;
    let lastT = performance.now();
    let trigger = false;
    let cardLift = 0; // 0..1 progress of card rising
    let glassLift = 0; // 0..1 hourglass rotates + lifts after sand done
    let raf = 0;

    triggerRef.current = () => {
      if (stageRef.current !== "idle") return;
      trigger = true;
      setStage("running");
    };

    resetRef.current = () => {
      trigger = false;
      cardLift = 0;
      glassLift = 0;
      hourglass.rotation.set(0, 0, 0);
      hourglass.position.set(0, 0, 0);
      card.visible = false;
      card.position.y = -CHAMBER_H - 0.1;
      initSand();
      setStage("idle");
    };

    function step(now: number) {
      const dt = Math.min(0.033, (now - lastT) / 1000);
      lastT = now;

      camera.position.x += (targetCam.x - camera.position.x) * 0.06;
      camera.position.y += (targetCam.y - camera.position.y) * 0.06;
      camera.lookAt(0, 0, 0);

      if (trigger) {
        let stillFalling = 0;
        let allSettledAtBottom = 0;

        for (let i = 0; i < SAND_COUNT; i++) {
          const p = particles[i];
          if (p.settled) {
            allSettledAtBottom++;
            continue;
          }
          // gravity
          p.vel.y += G * dt;
          // integrate
          p.pos.x += p.vel.x * dt;
          p.pos.y += p.vel.y * dt;
          p.pos.z += p.vel.z * dt;

          // wall constraint based on hourglass profile
          const r = Math.hypot(p.pos.x, p.pos.z);
          let maxR = radiusAtY(p.pos.y) - 0.05;

          // Special handling at neck: if particle's |y| < ~0.1 it must fit through
          if (Math.abs(p.pos.y) < 0.18) {
            maxR = NECK_HOLE_R - 0.012;
          }

          if (r > maxR && maxR > 0) {
            const nx = p.pos.x / (r || 1);
            const nz = p.pos.z / (r || 1);
            p.pos.x = nx * maxR;
            p.pos.z = nz * maxR;
            // tangential damping + slight inward push
            p.vel.x *= 0.45;
            p.vel.z *= 0.45;
          }

          // floor collision in lower chamber: pile up
          if (p.pos.y < SETTLE_FLOOR_Y) {
            // compute pile height: settled particles form a rough cone
            // simpler: clamp at floor + small random offset based on existing pile
            // settle particle here and stop motion
            p.pos.y = SETTLE_FLOOR_Y;
            p.vel.set(0, 0, 0);
            p.settled = true;
          } else if (
            // settle if landed on top of pile (use density-based heuristic)
            p.pos.y < -CHAMBER_H * 0.45 &&
            p.vel.y > -0.5 &&
            p.vel.y < 0.05 &&
            Math.hypot(p.vel.x, p.vel.z) < 0.05
          ) {
            // not yet — let it slide
            stillFalling++;
          } else {
            stillFalling++;
          }
        }

        // Build pile: settled particles need stacking. Re-sort settled by Y
        // Simplification: as more settle, settle floor rises.
        const settledCount = SAND_COUNT - stillFalling;
        const pileHeight = (settledCount / SAND_COUNT) * (CHAMBER_H * 0.85);

        // Lift settled particles into a cone shape based on order
        // We'll process particles that are settled and place them by index
        const layerCapacity = 28;
        const settledList = particles.filter((p) => p.settled);
        // Stack: particle k at layer floor(k / layerCapacity), within layer ring
        for (let k = 0; k < settledList.length; k++) {
          const p = settledList[k];
          const layer = Math.floor(k / layerCapacity);
          const idxInLayer = k % layerCapacity;
          const layerY =
            SETTLE_FLOOR_Y +
            layer * 0.07 +
            ((idxInLayer % 5) - 2) * 0.005;
          const layerRBase = Math.max(
            0.06,
            (CHAMBER_TOP_R - 0.1) *
              (1 - layer / Math.max(8, settledList.length / layerCapacity))
          );
          const a = (idxInLayer / layerCapacity) * Math.PI * 2;
          p.pos.set(Math.cos(a) * layerRBase, layerY, Math.sin(a) * layerRBase);
        }

        writeInstances();

        if (allSettledAtBottom >= SAND_COUNT) {
          // Trigger glass lift
          if (glassLift < 1) {
            glassLift = Math.min(1, glassLift + dt * 0.45);
            hourglass.rotation.y = glassLift * Math.PI * 1.2;
            hourglass.position.y = glassLift * 2.2;
            (glassMat as THREE.MeshPhysicalMaterial).opacity = 0.9 - glassLift * 0.5;
          } else {
            // Reveal card
            card.visible = true;
            cardLift = Math.min(1, cardLift + dt * 0.7);
            const ease = 1 - Math.pow(1 - cardLift, 3);
            card.position.y = -CHAMBER_H - 0.1 + ease * 1.0;
            card.rotation.y = ease * Math.PI * 0.04 * Math.sin(now * 0.001);
            if (cardLift >= 1 && stageRef.current !== "revealed") {
              setStage("revealed");
            }
          }
          // also: hide sand once glass is mostly gone
          sandMesh.visible = glassLift < 0.85;
        }

        // suppress lint hint about pileHeight (used implicitly via layered placement)
        void pileHeight;
      } else {
        writeInstances();
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    function onResize() {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      glassGeom.dispose();
      sandGeom.dispose();
      glassMat.dispose();
      sandMat.dispose();
      cardTex.dispose();
      cardMat.dispose();
      wrap.removeChild(renderer.domElement);
    };
  }, [palette.bg, palette.accent, palette.ink]);

  return (
    <section className="mx-auto max-w-5xl">
      <div
        ref={wrapRef}
        onClick={() => triggerRef.current()}
        className="relative aspect-[4/5] w-full max-w-xl mx-auto cursor-pointer overflow-hidden rounded-md"
        style={{
          background: palette.bg,
          boxShadow: `0 30px 80px -40px ${palette.ink}55`,
        }}
      />
      <div className="mt-5 flex items-center justify-center gap-3">
        <div
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ fontFamily: "Space Grotesk, sans-serif", opacity: 0.7 }}
        >
          {stage === "idle" && "• kum saatine tıkla •"}
          {stage === "running" && "kum dökülüyor…"}
          {stage === "revealed" && "• davetiye hazır •"}
        </div>
        <button
          type="button"
          onClick={() => resetRef.current()}
          disabled={stage !== "revealed"}
          className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition disabled:opacity-30"
          style={{
            background: palette.ink,
            color: palette.bg,
          }}
        >
          Tekrar
        </button>
      </div>
    </section>
  );
}
