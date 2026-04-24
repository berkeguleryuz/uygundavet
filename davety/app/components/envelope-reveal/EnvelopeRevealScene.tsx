"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { InvitationDoc } from "@davety/schema";
import { getEnvelopeRevealState } from "./envelopePhysics";

interface EnvelopeRevealSceneProps {
  invitation: InvitationDoc;
}

type SceneStatus = "ready" | "opening" | "settled";

const ENVELOPE_W = 3.25;
const ENVELOPE_H = 2.02;
const ENVELOPE_DEPTH = 0.08;
const FLAP_H = 1.12;
const CARD_BASE_Y = -0.24;

export function EnvelopeRevealScene({ invitation }: EnvelopeRevealSceneProps) {
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
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.85, 6.2);
    camera.lookAt(0, 0.56, 0);

    const stage = new THREE.Group();
    scene.add(stage);
    addLighting(scene);
    addGround(stage);

    const envelope = createEnvelope(invitation);
    stage.add(envelope.root);

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
      const state = getEnvelopeRevealState(elapsed);

      envelope.root.rotation.y = state.envelope.rotationY;
      envelope.flapPivot.rotation.x = -state.flap.angle;
      envelope.card.visible = state.card.visible;
      envelope.card.position.y = CARD_BASE_Y + state.card.lift;
      envelope.card.position.z = -0.025 - state.card.forward;
      envelope.card.rotation.x = -0.02 - state.card.tilt;
      envelope.card.rotation.z = state.card.wobble * 0.4;

      stage.rotation.x += ((-pointer.y * 0.025) - stage.rotation.x) * 0.04;
      stage.rotation.y += ((pointer.x * 0.025) - stage.rotation.y) * 0.04;

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
      window.setTimeout(() => setStatus("settled"), 5000);
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
        aria-label="3D envelope flipping open and revealing invitation"
        style={{ cursor: status === "ready" ? "pointer" : "default" }}
      />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={status === "ready" ? play : reset}
          className="rounded-md bg-[#252224] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#f5f1e7] transition hover:bg-[#3a3335]"
        >
          {status === "ready" ? "Zarfı Aç" : "Tekrar Kur"}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7b6b5a]">
          {status === "ready"
            ? "zarf kapalı"
            : status === "opening"
              ? "zarf dönüyor / kapak açılıyor"
              : "davetiye çıktı"}
        </p>
      </div>
    </div>
  );
}

function addLighting(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight("#fff7e8", "#b9aa94", 1.7));
  const key = new THREE.DirectionalLight("#fff1d7", 3.8);
  key.position.set(3.8, 5.2, 4.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);

  const rim = new THREE.DirectionalLight("#e5edff", 1.1);
  rim.position.set(-4, 3, -4);
  scene.add(rim);
}

function addGround(stage: THREE.Group) {
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(4.7, 96),
    new THREE.MeshStandardMaterial({ color: "#e7ddcf", roughness: 0.86 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.08;
  ground.receiveShadow = true;
  stage.add(ground);
}

function createEnvelope(invitation: InvitationDoc) {
  const root = new THREE.Group();
  const paper = new THREE.MeshStandardMaterial({
    color: "#f3ead8",
    roughness: 0.78,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const paperShade = new THREE.MeshStandardMaterial({
    color: "#e3d4bb",
    roughness: 0.82,
    metalness: 0.01,
    side: THREE.DoubleSide,
  });
  const lining = new THREE.MeshStandardMaterial({
    color: "#2a211d",
    roughness: 0.74,
    metalness: 0.03,
    side: THREE.DoubleSide,
  });

  const front = new THREE.Mesh(
    new THREE.BoxGeometry(ENVELOPE_W, ENVELOPE_H, ENVELOPE_DEPTH),
    makeFrontEnvelopeMaterials(),
  );
  front.position.z = ENVELOPE_DEPTH / 2;
  front.castShadow = true;
  front.receiveShadow = true;
  root.add(front);

  const backBase = new THREE.Mesh(
    new THREE.BoxGeometry(ENVELOPE_W, ENVELOPE_H, ENVELOPE_DEPTH * 0.65),
    paper,
  );
  backBase.position.z = -ENVELOPE_DEPTH / 2;
  backBase.castShadow = true;
  backBase.receiveShadow = true;
  root.add(backBase);

  const liner = new THREE.Mesh(
    makeTriangleGeometry([
      [-ENVELOPE_W / 2 + 0.12, ENVELOPE_H / 2 - 0.1],
      [ENVELOPE_W / 2 - 0.12, ENVELOPE_H / 2 - 0.1],
      [0, 0.18],
    ]),
    lining,
  );
  liner.position.z = -0.005;
  root.add(liner);

  addPocketTriangle(root, paperShade, [
    [-ENVELOPE_W / 2, -ENVELOPE_H / 2],
    [-ENVELOPE_W / 2, ENVELOPE_H / 2],
    [0, 0.18],
  ]);
  addPocketTriangle(root, paperShade, [
    [ENVELOPE_W / 2, -ENVELOPE_H / 2],
    [ENVELOPE_W / 2, ENVELOPE_H / 2],
    [0, 0.18],
  ]);
  addPocketTriangle(root, paper, [
    [-ENVELOPE_W / 2, -ENVELOPE_H / 2],
    [ENVELOPE_W / 2, -ENVELOPE_H / 2],
    [0, 0.18],
  ]);

  const flapPivot = new THREE.Group();
  flapPivot.position.set(0, ENVELOPE_H / 2, 0.035);
  root.add(flapPivot);

  const flap = new THREE.Mesh(
    makeTriangleGeometry([
      [-ENVELOPE_W / 2, 0],
      [ENVELOPE_W / 2, 0],
      [0, -FLAP_H],
    ]),
    paper,
  );
  flap.castShadow = true;
  flap.receiveShadow = true;
  flapPivot.add(flap);

  const card = createInvitationCard(invitation);
  card.position.set(0, CARD_BASE_Y, -0.025);
  card.visible = false;
  root.add(card);

  return { root, flapPivot, card };
}

function addPocketTriangle(
  root: THREE.Group,
  material: THREE.Material,
  points: Array<[number, number]>,
) {
  const mesh = new THREE.Mesh(makeTriangleGeometry(points), material);
  mesh.position.z = 0.02;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
}

function makeTriangleGeometry(points: Array<[number, number]>) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function makeFrontEnvelopeMaterials() {
  const frontTexture = makeFrontEnvelopeTexture();
  const front = new THREE.MeshStandardMaterial({
    map: frontTexture,
    roughness: 0.76,
    metalness: 0.02,
  });
  const paper = new THREE.MeshStandardMaterial({ color: "#f3ead8", roughness: 0.8 });
  return [paper, paper, paper, paper, front, paper];
}

function createInvitationCard(invitation: InvitationDoc) {
  const texture = makeInvitationTexture(invitation);
  const front = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.72 });
  const edge = new THREE.MeshStandardMaterial({ color: "#eee8d9", roughness: 0.8 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(1.34, 2.12, 0.035), [
    edge,
    edge,
    edge,
    edge,
    front,
    front,
  ]);
  card.castShadow = true;
  card.receiveShadow = true;
  return card;
}

function makeFrontEnvelopeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 760;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");
  drawFrontEnvelope(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  void document.fonts?.ready.then(() => {
    drawFrontEnvelope(ctx);
    texture.needsUpdate = true;
  });
  return texture;
}

function drawFrontEnvelope(ctx: CanvasRenderingContext2D) {
  const fonts = getCanvasFonts();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#f3ead8";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.strokeStyle = "rgba(37,34,36,0.16)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(600, 390);
  ctx.lineTo(1200, 0);
  ctx.moveTo(0, 760);
  ctx.lineTo(600, 390);
  ctx.lineTo(1200, 760);
  ctx.stroke();
  ctx.fillStyle = "#252224";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = fontSpec(500, 78, fonts.display);
  ctx.fillText("Etkinliğe", 600, 328);
  ctx.font = fontSpec(500, 78, fonts.display);
  ctx.fillText("Davet Edildiniz", 600, 420);
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

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
  ctx.globalAlpha = 1;
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
