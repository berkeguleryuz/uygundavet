import * as THREE from "three";

export type Palette = { bg: string; ink: string; accent: string };

export function makeInvitationTexture(palette: Palette): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 420;
  canvas.height = 580;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createLinearGradient(0, 0, 0, 580);
  grad.addColorStop(0, "#fbf5e8");
  grad.addColorStop(1, "#efe1c1");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 420, 580);
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 380, 540);
  ctx.fillStyle = palette.ink;
  ctx.textAlign = "center";
  ctx.font = "italic 28px Merienda, serif";
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
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface SceneCtx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  wrap: HTMLDivElement;
  dispose: () => void;
}

export function bootstrapScene(
  wrap: HTMLDivElement,
  palette: Palette,
  cameraPos: [number, number, number] = [0, 0.6, 6.4],
  lookAt: [number, number, number] = [0, 0, 0]
): SceneCtx {
  const w = wrap.clientWidth;
  const h = wrap.clientHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.bg);

  const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(...cameraPos);
  camera.lookAt(...lookAt);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  wrap.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x884422, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff1c2, 1.05);
  key.position.set(3.2, 5.4, 3.6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 16;
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb5d4ff, 0.35);
  rim.position.set(-4, 1.4, -2);
  scene.add(rim);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(8, 64),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(palette.bg).multiplyScalar(0.92),
      roughness: 0.95,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.05;
  ground.receiveShadow = true;
  scene.add(ground);

  function dispose() {
    renderer.dispose();
    if (renderer.domElement.parentElement === wrap) {
      wrap.removeChild(renderer.domElement);
    }
  }

  return { scene, camera, renderer, wrap, dispose };
}

export function makeCardMesh(
  palette: Palette,
  width = 1.05,
  height = 1.45
): { mesh: THREE.Mesh; texture: THREE.CanvasTexture; material: THREE.MeshStandardMaterial } {
  const tex = makeInvitationTexture(palette);
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.6,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  mesh.castShadow = true;
  return { mesh, texture: tex, material: mat };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
