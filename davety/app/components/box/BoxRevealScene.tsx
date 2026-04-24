"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { InvitationDoc } from "@davety/schema";
import { getBoxRevealState } from "./boxPhysics";

interface BoxRevealSceneProps {
  invitation: InvitationDoc;
}

type SceneStatus = "ready" | "opening" | "settled";

const BOX_WIDTH = 2.55;
const BOX_DEPTH = 2.05;
const BOX_HEIGHT = 1.12;
const WALL = 0.08;

export function BoxRevealScene({ invitation }: BoxRevealSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const [status, setStatus] = useState<SceneStatus>("ready");

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f5f1e7");

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 2.55, 6.05);
    camera.lookAt(0, 1.62, 0);

    const stage = new THREE.Group();
    scene.add(stage);

    addLighting(scene);
    addGround(stage);

    const gift = createGiftBox(invitation);
    stage.add(gift.root);

    const pointer = new THREE.Vector2(0, 0);

    const resize = () => {
      const rect = host.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / Math.max(rect.height, 1);
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const render = () => {
      const now = performance.now() / 1000;
      const elapsed = startRef.current === null ? 0 : now - startRef.current;
      const state = getBoxRevealState(elapsed);

      gift.lidPivot.rotation.x = -state.lid.angle;
      gift.lidPivot.position.y = BOX_HEIGHT + WALL + state.lid.lift;
      gift.card.visible = state.card.visible;
      gift.card.position.y = 0.42 + state.card.lift;
      gift.card.position.z = 0.08 + state.card.forward;
      gift.card.rotation.x = -0.03 - state.card.tilt;
      gift.card.rotation.z = state.card.wobble * 0.5;

      stage.rotation.x += ((-pointer.y * 0.035) - stage.rotation.x) * 0.04;
      stage.rotation.y += ((pointer.x * 0.035) - stage.rotation.y) * 0.04;

      renderer.render(scene, camera);
      rafRef.current = window.requestAnimationFrame(render);
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    host.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      disposeObject(stage);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [invitation]);

  const play = () => {
    startRef.current = null;
    requestAnimationFrame(() => {
      startRef.current = performance.now() / 1000;
      setStatus("opening");
      window.setTimeout(() => setStatus("settled"), 4300);
    });
  };

  const reset = () => {
    startRef.current = null;
    setStatus("ready");
  };

  return (
    <div className="w-full">
      <div
        ref={hostRef}
        onClick={status === "ready" ? play : undefined}
        className="relative h-[min(70dvh,720px)] min-h-[460px] w-full overflow-hidden rounded-md border border-[#ded3c2] bg-[#f5f1e7] shadow-[0_28px_80px_-45px_rgba(37,34,36,0.55)]"
        role="img"
        aria-label="3D gift box opening and invitation reveal scene"
        style={{ cursor: status === "ready" ? "pointer" : "default" }}
      />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={status === "ready" ? play : reset}
          className="rounded-md bg-[#252224] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#f5f1e7] transition hover:bg-[#3a3335]"
        >
          {status === "ready" ? "Kutuyu Aç" : "Tekrar Kur"}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7b6b5a]">
          {status === "ready"
            ? "kutu hazır"
            : status === "opening"
              ? "kapak açılıyor / davetiye yükseliyor"
              : "davetiye çıktı"}
        </p>
      </div>
    </div>
  );
}

function addLighting(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight("#fff7e8", "#b9aa94", 1.75));

  const key = new THREE.DirectionalLight("#fff2da", 3.9);
  key.position.set(3.5, 5.2, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 14;
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);

  const rim = new THREE.DirectionalLight("#d8e4ff", 1.2);
  rim.position.set(-4, 3.5, -3.2);
  scene.add(rim);
}

function addGround(stage: THREE.Group) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(4.4, 96),
    new THREE.MeshStandardMaterial({
      color: "#e7ddcf",
      roughness: 0.86,
      metalness: 0.02,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  stage.add(ground);
}

function createGiftBox(invitation: InvitationDoc) {
  const root = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({
    color: "#91333a",
    roughness: 0.58,
    metalness: 0.08,
  });
  const redDark = new THREE.MeshStandardMaterial({
    color: "#68282d",
    roughness: 0.74,
    metalness: 0.04,
  });
  const gold = new THREE.MeshStandardMaterial({
    color: "#c9a349",
    roughness: 0.34,
    metalness: 0.42,
  });
  addBoxPanel(root, BOX_WIDTH, WALL, BOX_DEPTH, 0, WALL / 2, 0, redDark);
  addBoxPanel(root, BOX_WIDTH, BOX_HEIGHT, WALL, 0, BOX_HEIGHT / 2, -BOX_DEPTH / 2, red);
  addBoxPanel(root, BOX_WIDTH, BOX_HEIGHT, WALL, 0, BOX_HEIGHT / 2, BOX_DEPTH / 2, red);
  addBoxPanel(root, WALL, BOX_HEIGHT, BOX_DEPTH, -BOX_WIDTH / 2, BOX_HEIGHT / 2, 0, red);
  addBoxPanel(root, WALL, BOX_HEIGHT, BOX_DEPTH, BOX_WIDTH / 2, BOX_HEIGHT / 2, 0, red);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, BOX_HEIGHT + WALL, -BOX_DEPTH / 2);
  root.add(lidPivot);

  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_WIDTH + 0.28, WALL * 2.1, BOX_DEPTH + 0.28),
    red,
  );
  lid.position.set(0, 0, BOX_DEPTH / 2);
  lid.castShadow = true;
  lid.receiveShadow = true;
  lidPivot.add(lid);

  const lidRibbonA = new THREE.Mesh(
    new THREE.BoxGeometry(BOX_WIDTH + 0.34, WALL * 2.25, 0.12),
    gold,
  );
  lidRibbonA.position.set(0, 0.012, BOX_DEPTH / 2);
  lidRibbonA.castShadow = true;
  lidPivot.add(lidRibbonA);

  const lidRibbonB = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, WALL * 2.28, BOX_DEPTH + 0.34),
    gold,
  );
  lidRibbonB.position.set(0, 0.018, BOX_DEPTH / 2);
  lidRibbonB.castShadow = true;
  lidPivot.add(lidRibbonB);

  const card = createInvitationCard(invitation);
  card.position.set(0, 0.5, 0.08);
  card.visible = false;
  root.add(card);

  return { root, lidPivot, card };
}

function addBoxPanel(
  parent: THREE.Group,
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

function createInvitationCard(invitation: InvitationDoc) {
  const texture = makeInvitationTexture(invitation);
  const front = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.72,
    metalness: 0,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: "#eee8d9",
    roughness: 0.8,
    metalness: 0,
  });
  const back = new THREE.MeshStandardMaterial({
    color: "#f3ecdc",
    roughness: 0.76,
    metalness: 0,
  });

  const card = new THREE.Mesh(new THREE.BoxGeometry(1.34, 2.08, 0.035), [
    edge,
    edge,
    edge,
    edge,
    front,
    back,
  ]);
  card.castShadow = true;
  card.receiveShadow = true;
  return card;
}

function makeInvitationTexture(invitation: InvitationDoc) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");

  drawInvitationCanvas(ctx, invitation);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  void document.fonts?.ready.then(() => {
    drawInvitationCanvas(ctx, invitation);
    texture.needsUpdate = true;
  });

  return texture;
}

function drawInvitationCanvas(ctx: CanvasRenderingContext2D, invitation: InvitationDoc) {
  const fonts = getCanvasFonts();
  const hero = invitation.blocks.find((block) => block.type === "hero");
  const venue = invitation.blocks.find((block) => block.type === "venue");
  const heroData = hero?.data as
    | { brideName?: string; groomName?: string; subtitle?: string; description?: string }
    | undefined;
  const venueData = venue?.data as { venueName?: string } | undefined;
  const names = `${heroData?.brideName ?? "Hilal"} & ${heroData?.groomName ?? "Ibrahim"}`;
  const date = invitation.meta.weddingDate.split("-").reverse().join(".");

  ctx.fillStyle = invitation.theme.bgColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, ctx.canvas.height);
  gradient.addColorStop(0, "#fffdf6");
  gradient.addColorStop(1, "#eee4ce");
  ctx.fillStyle = gradient;
  roundRect(ctx, 54, 54, 916, 1428, 36);
  ctx.fill();

  ctx.strokeStyle = "#c9a349";
  ctx.lineWidth = 7;
  roundRect(ctx, 92, 92, 840, 1352, 28);
  ctx.stroke();

  ctx.strokeStyle = "rgba(37,34,36,0.18)";
  ctx.lineWidth = 2;
  roundRect(ctx, 120, 120, 784, 1296, 22);
  ctx.stroke();

  ctx.fillStyle = invitation.theme.accentColor;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = fontSpec(400, 44, fonts.display);
  ctx.globalAlpha = 0.58;
  ctx.fillText(heroData?.subtitle ?? "Aşkın Başladığı Gün", 512, 310);

  ctx.globalAlpha = 1;
  ctx.font = fontSpec(500, 104, fonts.display);
  wrapCentered(ctx, names, 512, 565, 760, 96);

  ctx.font = fontSpec(500, 34, fonts.sans);
  ctx.globalAlpha = 0.62;
  wrapCentered(
    ctx,
    heroData?.description ??
      "Bir masal gibi başlayan hikayemizin en özel gününde sizi yanımızda görmekten mutluluk duyarız.",
    512,
    780,
    650,
    42,
  );

  ctx.globalAlpha = 1;
  ctx.fillStyle = "#c9a349";
  ctx.fillRect(392, 955, 240, 4);

  ctx.fillStyle = invitation.theme.accentColor;
  ctx.font = fontSpec(600, 54, fonts.mono);
  ctx.fillText(date, 512, 1070);
  ctx.font = fontSpec(500, 36, fonts.sans);
  ctx.globalAlpha = 0.72;
  ctx.fillText(invitation.meta.weddingTime, 512, 1135);
  ctx.font = fontSpec(500, 34, fonts.sans);
  ctx.fillText(venueData?.venueName ?? "Davet Salonu", 512, 1215);
}

function getCanvasFonts() {
  const styles = getComputedStyle(document.documentElement);
  return {
    display: styles.getPropertyValue("--font-merienda").trim() || "Merienda, Georgia, serif",
    sans:
      styles.getPropertyValue("--font-space-grotesk").trim() ||
      "Space Grotesk, ui-sans-serif, sans-serif",
    mono:
      styles.getPropertyValue("--font-chakra").trim() ||
      "Chakra Petch, ui-monospace, monospace",
  };
}

function fontSpec(weight: number, size: number, family: string) {
  return `${weight} ${size}px ${family}`;
}

function wrapCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => ctx.fillText(line, x, startY + index * lineHeight));
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}
