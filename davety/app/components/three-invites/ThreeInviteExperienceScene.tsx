"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { InvitationDoc } from "@davety/schema";
import { getInviteExperienceState, type InviteExperienceState } from "./experiencePhysics";
import {
  BOOK_PAGE_REVEAL,
  EXPERIENCE_PRESENTATION,
  getCardBaseYForScene,
} from "./experiencePresentation";
import type { InviteExperienceConfig, InviteSceneKind } from "./experienceRegistry";

interface ThreeInviteExperienceSceneProps {
  invitation: InvitationDoc;
  experience: InviteExperienceConfig;
}

type SceneStatus = "ready" | "opening" | "settled";

interface BuiltExperience {
  root: THREE.Group;
  card: THREE.Mesh;
  update: (opener: number, elapsed: number) => void;
  placeCard: (invitation: InviteExperienceState["invitation"]) => void;
}

const DEFAULT_CARD_LIFT = 1.72;

export function ThreeInviteExperienceScene({
  invitation,
  experience,
}: ThreeInviteExperienceSceneProps) {
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
    renderer.toneMappingExposure = experience.sceneKind === "moonlight" ? 1.25 : 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.45, 6.35);
    camera.lookAt(0, 0.42, 0);

    const stage = new THREE.Group();
    scene.add(stage);
    addLighting(scene, experience);

    const built = buildExperience(experience, invitation);
    stage.add(built.root);

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
      const state = getInviteExperienceState(elapsed);

      built.update(state.opener, elapsed);
      built.placeCard(state.invitation);

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
  }, [experience, invitation]);

  const play = () => {
    startRef.current = null;
    requestAnimationFrame(() => {
      startRef.current = performance.now() / 1000;
      setStatus("opening");
      window.setTimeout(() => setStatus("settled"), 5400);
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
        className="relative h-[min(70dvh,720px)] min-h-[460px] w-full overflow-visible"
        role="img"
        aria-label={`${experience.title} 3D sahnesi`}
        style={{
          cursor: status === "ready" ? "pointer" : "default",
          background: "transparent",
        }}
      />

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={status === "ready" ? play : reset}
          className="rounded-md px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] transition"
          style={{
            backgroundColor: experience.palette.dark,
            color: experience.sceneKind === "moonlight" || experience.sceneKind === "curtain"
              ? "#fff7df"
              : experience.palette.paper,
          }}
        >
          {status === "ready" ? experience.cta : "Tekrar Kur"}
        </button>
        <p
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: experience.palette.accent }}
        >
          {status === "ready"
            ? "sahne kapalı"
            : status === "opening"
              ? "sahne açılıyor"
              : "davetiye çıktı"}
        </p>
      </div>
    </div>
  );
}

function addLighting(scene: THREE.Scene, experience: InviteExperienceConfig) {
  scene.add(new THREE.HemisphereLight("#fff8e8", experience.palette.secondary, 1.4));

  const key = new THREE.DirectionalLight("#fff1d7", experience.sceneKind === "moonlight" ? 2.5 : 3.6);
  key.position.set(3.4, 5.2, 4.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);

  const rim = new THREE.DirectionalLight(
    experience.sceneKind === "moonlight" ? "#dbe9ff" : "#e5edff",
    1.1,
  );
  rim.position.set(-4, 3, -4);
  scene.add(rim);
}

function buildExperience(
  experience: InviteExperienceConfig,
  invitation: InvitationDoc,
): BuiltExperience {
  const root = new THREE.Group();
  const materials = makeMaterials(experience);
  const card = createInvitationCard(invitation, experience);
  card.position.set(0, -0.7, 0.06);
  card.visible = false;

  const opener = new THREE.Group();
  root.add(opener);
  const update = buildProps(experience.sceneKind, root, opener, materials);
  const placeCard = createCardPlacer(experience.sceneKind, card);
  root.add(card);

  return { root, card, update, placeCard };
}

function createCardPlacer(kind: InviteSceneKind, card: THREE.Mesh) {
  return (invitation: InviteExperienceState["invitation"]) => {
    const revealProgress = clamp01(invitation.lift / DEFAULT_CARD_LIFT);
    card.visible = invitation.visible;
    card.position.y = getCardBaseYForScene(kind) + invitation.lift;
    card.position.z = kind === "book" ? BOOK_PAGE_REVEAL.cardRestZ : 0.06;
    card.rotation.x = kind === "book"
      ? lerp(
          BOOK_PAGE_REVEAL.startsAsFlatPageRotationX,
          BOOK_PAGE_REVEAL.settlesUprightRotationX,
          easeInOutCubic(revealProgress),
        )
      : 0;
    card.rotation.y = invitation.rotationY;
    card.rotation.z = invitation.wobble * 0.18;
  };
}

function makeMaterials(experience: InviteExperienceConfig) {
  return {
    paper: new THREE.MeshStandardMaterial({
      color: experience.palette.paper,
      roughness: 0.75,
      metalness: 0.01,
      side: THREE.DoubleSide,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: experience.palette.accent,
      roughness: 0.68,
      metalness: 0.06,
      side: THREE.DoubleSide,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: experience.palette.dark,
      roughness: 0.72,
      metalness: 0.04,
      side: THREE.DoubleSide,
    }),
    secondary: new THREE.MeshStandardMaterial({
      color: experience.palette.secondary,
      roughness: 0.62,
      metalness: 0.18,
      side: THREE.DoubleSide,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: "#dff2ff",
      roughness: 0.05,
      transmission: 0.45,
      thickness: 0.2,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
    }),
  };
}

function buildProps(
  kind: InviteSceneKind,
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  void EXPERIENCE_PRESENTATION;

  switch (kind) {
    case "scroll":
      return buildScroll(root, opener, materials);
    case "ring-box":
      return buildRingBox(root, opener, materials);
    case "glass-dome":
      return buildGlassDome(root, opener, materials);
    case "book":
      return buildBook(root, opener, materials);
    case "flower":
      return buildFlower(root, opener, materials);
    case "tray":
      return buildTray(root, opener, materials);
    case "music-box":
      return buildMusicBox(root, opener, materials);
    case "butterfly-box":
      return buildButterflyBox(root, opener, materials);
    case "crystal":
      return buildCrystal(root, opener, materials);
    case "film":
      return buildFilm(root, opener, materials);
    case "drawer":
      return buildDrawer(root, opener, materials);
    case "ribbon-envelope":
      return buildRibbonEnvelope(root, opener, materials);
    case "moonlight":
      return buildMoonlight(root, opener, materials);
    case "gallery":
      return buildGallery(root, opener, materials);
    case "cube":
      return buildCube(root, opener, materials);
    case "mailbox":
      return buildMailbox(root, opener, materials);
    case "curtain":
      return buildCurtain(root, opener, materials);
    case "bottle":
      return buildBottle(root, opener, materials);
    case "mirror":
      return buildMirror(root, opener, materials);
    case "origami":
      return buildOrigami(root, opener, materials);
  }
}

function buildScroll(
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  const parchment = addBox(opener, [2.15, 0.06, 1.05], [0, -0.24, 0], materials.paper);
  parchment.rotation.x = -0.18;
  const leftRoll = addCylinder(root, 0.13, 1.18, [-1.2, -0.24, 0], materials.secondary);
  const rightRoll = addCylinder(root, 0.13, 1.18, [1.2, -0.24, 0], materials.secondary);
  leftRoll.rotation.z = Math.PI / 2;
  rightRoll.rotation.z = Math.PI / 2;
  const seal = addCylinder(opener, 0.18, 0.05, [0, -0.18, 0.56], materials.accent);
  seal.rotation.x = Math.PI / 2;
  return (o: number, elapsed: number) => {
    opener.scale.x = 0.42 + o * 0.58;
    opener.rotation.x = -0.18 + o * 0.18;
    seal.scale.setScalar(Math.max(0.05, 1 - o * 0.95));
    leftRoll.rotation.y = elapsed * 0.7;
    rightRoll.rotation.y = -elapsed * 0.7;
  };
}

function buildRingBox(
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  addBox(root, [2.4, 0.5, 1.35], [0, -0.54, 0], materials.accent);
  const cushion = addBox(root, [1.95, 0.18, 1.02], [0, -0.18, 0], materials.dark);
  cushion.rotation.x = -0.08;
  const lid = addBox(opener, [2.45, 0.18, 1.35], [0, 0, -0.58], materials.accent);
  lid.position.y = 0.05;
  opener.position.set(0, -0.26, -0.58);
  return (o: number) => {
    opener.rotation.x = -o * 1.85;
    lid.position.y = 0.08 + o * 0.2;
  };
}

function buildGlassDome(
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.05, 48, 24), materials.glass);
  dome.scale.set(1, 1.06, 0.72);
  dome.position.set(0, 0, 0);
  dome.castShadow = true;
  opener.add(dome);
  addCylinder(root, 1.18, 0.12, [0, -0.62, 0], materials.secondary);
  return (o: number) => {
    opener.position.y = o * 1.25;
    opener.rotation.y = o * 0.35;
  };
}

function buildBook(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const book = new THREE.Group();
  book.position.set(0, -0.58, 0);
  book.rotation.x = -0.08;
  root.add(book);

  const spine = addBox(book, [0.16, 0.24, 1.62], [0, 0.02, -0.02], materials.dark);
  spine.rotation.z = Math.PI / 2;

  const leftCover = makeHingedPanel(
    book,
    [-0.08, 0.02, 0],
    [-1, 0, 0],
    [1.28, 0.09, 1.58],
    materials.dark,
  );
  const rightCover = makeHingedPanel(
    book,
    [0.08, 0.02, 0],
    [1, 0, 0],
    [1.28, 0.09, 1.58],
    materials.dark,
  );
  const leftPages = makeHingedPanel(
    book,
    [-0.06, 0.1, 0],
    [-1, 0, 0],
    [1.16, 0.08, 1.46],
    materials.paper,
  );
  const rightPages = makeHingedPanel(
    book,
    [0.06, 0.1, 0],
    [1, 0, 0],
    [1.16, 0.08, 1.46],
    materials.paper,
  );
  const pageLines = new THREE.Group();
  for (let i = 0; i < 8; i += 1) {
    const line = addBox(pageLines, [0.95, 0.012, 0.012], [0, 0.16 + i * 0.026, -0.5 + i * 0.14], materials.secondary);
    line.rotation.y = 0.02;
  }
  rightPages.add(pageLines);

  opener.position.set(0, -0.36, 0.06);
  const loosePage = makeHingedPanel(
    opener,
    [0, 0, -0.72],
    [0, 0, 1],
    [1.28, 0.035, 1.42],
    materials.paper,
  );
  const loosePageMesh = loosePage.children[0] as THREE.Mesh;
  const tearLine = new THREE.Group();
  for (let i = 0; i < 13; i += 1) {
    addBox(
      tearLine,
      [0.045, 0.012, 0.018],
      [-0.58 + i * 0.095, 0.035, -0.71],
      materials.secondary,
    );
  }
  opener.add(tearLine);

  return (o: number, elapsed: number) => {
    const coverAngle = 0.08 + o * 1.18;
    const tearProgress = easeInOutCubic(clamp01((elapsed - 2.1) / 1.45));
    leftCover.rotation.y = coverAngle;
    rightCover.rotation.y = -coverAngle;
    leftPages.rotation.y = 0.12 + o * 0.38;
    rightPages.rotation.y = -0.12 - o * 0.32;
    loosePage.rotation.x = 0;
    loosePageMesh.scale.z = 1 - tearProgress * (1 - BOOK_PAGE_REVEAL.tornStubScaleZ);
    loosePageMesh.position.z = 0.71 * loosePageMesh.scale.z;
    tearLine.visible = tearProgress < 0.98;
    tearLine.position.y = tearProgress * 0.02;
    opener.rotation.x = -0.06 + o * 0.06;
  };
}

function buildFlower(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const petals: THREE.Mesh[] = [];
  for (let i = 0; i < 10; i += 1) {
    const petal = new THREE.Mesh(new THREE.CircleGeometry(0.34, 32), materials.accent);
    const angle = (Math.PI * 2 * i) / 10;
    petal.scale.set(0.68, 1.45, 1);
    petal.position.set(Math.cos(angle) * 0.45, -0.28, Math.sin(angle) * 0.32);
    petal.rotation.set(Math.PI / 2, 0, angle);
    petal.castShadow = true;
    opener.add(petal);
    petals.push(petal);
  }
  addCylinder(root, 0.25, 0.2, [0, -0.46, 0], materials.secondary);
  return (o: number) => {
    petals.forEach((petal, i) => {
      petal.rotation.x = Math.PI / 2 + o * (0.72 + (i % 2) * 0.18);
      petal.position.y = -0.28 - o * 0.18;
    });
  };
}

function buildTray(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addCylinder(root, 1.28, 0.14, [0, -0.62, 0], materials.secondary);
  const cloth = addBox(opener, [2.5, 0.045, 1.25], [0, -0.32, 0], materials.accent);
  cloth.rotation.x = -0.03;
  return (o: number) => {
    cloth.position.x = -o * 1.65;
    cloth.rotation.z = -o * 0.35;
    cloth.position.y = -0.32 + Math.sin(o * Math.PI) * 0.16;
  };
}

function buildMusicBox(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addBox(root, [2.5, 0.48, 1.35], [0, -0.55, 0], materials.secondary);
  const lid = addBox(opener, [2.5, 0.12, 1.35], [0, 0, -0.64], materials.secondary);
  opener.position.set(0, -0.34, -0.64);
  const gear = addCylinder(root, 0.28, 0.08, [0, -0.2, 0.25], materials.accent);
  gear.rotation.x = Math.PI / 2;
  return (o: number, elapsed: number) => {
    opener.rotation.x = -o * 1.35;
    lid.position.y = o * 0.15;
    gear.rotation.z = elapsed * 2.3;
  };
}

function buildButterflyBox(
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  addBox(root, [2.35, 0.45, 1.28], [0, -0.58, 0], materials.dark);
  const lid = addBox(opener, [2.35, 0.12, 1.28], [0, -0.2, -0.56], materials.dark);
  const butterflies: THREE.Mesh[] = [];
  for (let i = 0; i < 5; i += 1) {
    const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.2), materials.accent);
    wing.position.set((i - 2) * 0.38, 0.12 + i * 0.05, -0.12 + (i % 2) * 0.18);
    wing.rotation.z = i % 2 === 0 ? 0.45 : -0.45;
    opener.add(wing);
    butterflies.push(wing);
  }
  return (o: number, elapsed: number) => {
    opener.position.y = o * 0.25;
    lid.rotation.x = -o * 1.45;
    butterflies.forEach((wing, i) => {
      wing.position.y = 0.12 + o * (0.8 + i * 0.08);
      wing.rotation.y = Math.sin(elapsed * 8 + i) * 0.55;
    });
  };
}

function buildCrystal(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const shards: THREE.Mesh[] = [];
  for (let i = 0; i < 6; i += 1) {
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), materials.glass);
    const angle = (Math.PI * 2 * i) / 6;
    shard.position.set(Math.cos(angle) * 0.28, -0.18, Math.sin(angle) * 0.18);
    shard.scale.set(0.72, 1.2, 0.34);
    opener.add(shard);
    shards.push(shard);
  }
  addCylinder(root, 0.9, 0.1, [0, -0.7, 0], materials.secondary);
  return (o: number) => {
    shards.forEach((shard, i) => {
      const angle = (Math.PI * 2 * i) / 6;
      shard.position.x = Math.cos(angle) * (0.28 + o * 0.95);
      shard.position.z = Math.sin(angle) * (0.18 + o * 0.55);
      shard.rotation.y = o * 1.2;
      shard.rotation.x = o * 0.6;
    });
  };
}

function buildFilm(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const left = addCylinder(root, 0.42, 0.12, [-1.25, -0.28, 0], materials.dark);
  const right = addCylinder(root, 0.42, 0.12, [1.25, -0.28, 0], materials.dark);
  left.rotation.x = Math.PI / 2;
  right.rotation.x = Math.PI / 2;
  const strip = addBox(opener, [2.25, 0.16, 0.035], [0, -0.28, 0.2], materials.dark);
  return (o: number, elapsed: number) => {
    strip.scale.x = 0.35 + o * 0.65;
    strip.position.y = -0.28 + o * 0.22;
    left.rotation.z = elapsed * 1.2;
    right.rotation.z = -elapsed * 1.2;
  };
}

function buildDrawer(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addBox(root, [2.6, 0.95, 1.3], [0, -0.48, -0.14], materials.dark);
  const drawer = addBox(opener, [2.25, 0.42, 1.18], [0, -0.42, 0.08], materials.secondary);
  const handle = addCylinder(opener, 0.08, 0.36, [0, -0.35, 0.72], materials.accent);
  handle.rotation.z = Math.PI / 2;
  return (o: number) => {
    drawer.position.z = 0.08 + o * 0.75;
    handle.position.z = 0.72 + o * 0.75;
  };
}

function buildRibbonEnvelope(
  root: THREE.Group,
  opener: THREE.Group,
  materials: ReturnType<typeof makeMaterials>,
) {
  addBox(root, [2.7, 0.08, 1.55], [0, -0.48, 0], materials.paper);
  const flap = addBox(opener, [2.7, 0.06, 0.72], [0, -0.02, -0.5], materials.paper);
  const ribbonV = addBox(opener, [0.16, 0.08, 1.65], [0, -0.43, 0.03], materials.accent);
  const ribbonH = addBox(opener, [2.8, 0.09, 0.16], [0, -0.43, 0.03], materials.accent);
  opener.position.set(0, -0.05, -0.55);
  return (o: number) => {
    flap.rotation.x = -o * 1.7;
    ribbonV.position.x = -o * 1.25;
    ribbonH.position.z = o * 0.55;
    ribbonH.rotation.y = o * 0.35;
  };
}

function buildMoonlight(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.42, 64), materials.secondary);
  moon.position.set(-1.35, 1.12, -0.65);
  moon.rotation.y = 0.08;
  root.add(moon);
  const beam = addBox(opener, [1.5, 0.035, 2.2], [0.1, -0.08, 0.1], materials.paper);
  beam.material = new THREE.MeshStandardMaterial({
    color: "#fff5c8",
    transparent: true,
    opacity: 0.24,
    roughness: 0.55,
    side: THREE.DoubleSide,
  });
  beam.rotation.x = -0.95;
  return (o: number, elapsed: number) => {
    opener.scale.setScalar(0.35 + o * 0.65);
    opener.rotation.z = Math.sin(elapsed * 0.7) * 0.015;
    moon.scale.setScalar(1 + Math.sin(elapsed * 1.3) * 0.035);
  };
}

function buildGallery(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addCylinder(root, 0.72, 0.55, [0, -0.58, 0], materials.paper);
  const glass = addBox(opener, [1.45, 1.35, 0.82], [0, 0.02, 0], materials.glass);
  const spot = addCylinder(root, 0.18, 0.35, [-1.4, 0.35, -0.5], materials.dark);
  spot.rotation.z = 0.8;
  return (o: number, elapsed: number) => {
    glass.position.y = 0.02 + o * 1.15;
    spot.rotation.y = Math.sin(elapsed * 0.8) * 0.35;
  };
}

function buildCube(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const panels: THREE.Mesh[] = [];
  const positions: Array<[number, number, number]> = [
    [0, -0.25, 0.55],
    [0, -0.25, -0.55],
    [-0.55, -0.25, 0],
    [0.55, -0.25, 0],
  ];
  positions.forEach((position) => {
    const panel = addBox(opener, [1.08, 0.045, 1.08], position, materials.accent);
    panels.push(panel);
  });
  return (o: number) => {
    panels[0].rotation.x = -o * 1.25;
    panels[1].rotation.x = o * 1.25;
    panels[2].rotation.z = o * 1.25;
    panels[3].rotation.z = -o * 1.25;
    opener.rotation.y = o * 0.18;
  };
}

function buildMailbox(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addBox(root, [2.4, 0.78, 1.15], [0, -0.45, 0], materials.accent);
  const roof = addCylinder(root, 0.58, 2.4, [0, -0.08, 0], materials.accent);
  roof.rotation.z = Math.PI / 2;
  const door = addBox(opener, [2.42, 0.72, 0.07], [0, -0.42, 0.61], materials.dark);
  return (o: number) => {
    door.rotation.x = -o * 1.35;
    door.position.y = -0.42 - o * 0.16;
  };
}

function buildCurtain(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  addBox(root, [2.95, 0.08, 0.12], [0, 0.9, -0.52], materials.secondary);
  const left = addBox(opener, [1.35, 1.8, 0.08], [-0.68, -0.05, -0.48], materials.accent);
  const right = addBox(opener, [1.35, 1.8, 0.08], [0.68, -0.05, -0.48], materials.accent);
  return (o: number) => {
    left.position.x = -0.68 - o * 0.82;
    right.position.x = 0.68 + o * 0.82;
    left.rotation.y = o * 0.18;
    right.rotation.y = -o * 0.18;
  };
}

function buildBottle(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const bottle = addCylinder(root, 0.34, 1.78, [0, -0.25, 0], materials.glass);
  bottle.rotation.z = Math.PI / 2;
  const neck = addCylinder(root, 0.16, 0.6, [0.86, -0.25, 0], materials.glass);
  neck.rotation.z = Math.PI / 2;
  const cork = addCylinder(opener, 0.14, 0.24, [1.22, -0.25, 0], materials.secondary);
  cork.rotation.z = Math.PI / 2;
  return (o: number) => {
    cork.position.x = 1.22 + o * 0.7;
    cork.rotation.y = o * 2.2;
    root.rotation.z = -0.18 + o * 0.18;
  };
}

function buildMirror(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const frame = addBox(root, [1.55, 2.1, 0.14], [0, 0.03, -0.42], materials.secondary);
  const mirror = addBox(opener, [1.28, 1.78, 0.035], [0, 0.03, -0.32], materials.glass);
  frame.rotation.x = -0.04;
  return (o: number, elapsed: number) => {
    mirror.rotation.y = Math.sin(elapsed * 2) * 0.035 + o * 0.22;
    mirror.position.z = -0.32 - o * 0.22;
  };
}

function buildOrigami(root: THREE.Group, opener: THREE.Group, materials: ReturnType<typeof makeMaterials>) {
  const folds: THREE.Mesh[] = [];
  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < 3; x += 1) {
      const fold = addBox(opener, [0.62, 0.035, 0.82], [(x - 1) * 0.55, -0.38 + y * 0.28, 0], materials.paper);
      fold.rotation.z = (x - 1) * 0.24;
      fold.rotation.x = y === 0 ? 0.5 : -0.5;
      folds.push(fold);
    }
  }
  return (o: number) => {
    folds.forEach((fold, i) => {
      const col = (i % 3) - 1;
      fold.rotation.z = col * 0.24 * (1 - o);
      fold.rotation.x = (i < 3 ? 0.5 : -0.5) * (1 - o);
      fold.position.y = -0.38 + Math.floor(i / 3) * 0.28 + o * 0.1;
    });
  };
}

function makeHingedPanel(
  parent: THREE.Object3D,
  hingePosition: [number, number, number],
  openDirection: [number, number, number],
  size: [number, number, number],
  material: THREE.Material,
) {
  const hinge = new THREE.Group();
  hinge.position.set(...hingePosition);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(
    openDirection[0] * size[0] * 0.5,
    openDirection[1] * size[1] * 0.5,
    openDirection[2] * size[2] * 0.5,
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  hinge.add(mesh);
  parent.add(hinge);
  return hinge;
}

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addCylinder(
  parent: THREE.Object3D,
  radius: number,
  height: number,
  position: [number, number, number],
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createInvitationCard(invitation: InvitationDoc, experience: InviteExperienceConfig) {
  const texture = makeInvitationTexture(invitation, experience);
  const front = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.72 });
  const edge = new THREE.MeshStandardMaterial({ color: "#eee8d9", roughness: 0.8 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(1.32, 1.92, 0.04), [
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

function makeInvitationTexture(invitation: InvitationDoc, experience: InviteExperienceConfig) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");
  drawInvitationCanvas(ctx, invitation, experience);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  void document.fonts?.ready.then(() => {
    drawInvitationCanvas(ctx, invitation, experience);
    texture.needsUpdate = true;
  });
  return texture;
}

function drawInvitationCanvas(
  ctx: CanvasRenderingContext2D,
  invitation: InvitationDoc,
  experience: InviteExperienceConfig,
) {
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
  gradient.addColorStop(1, experience.palette.paper);
  ctx.fillStyle = gradient;
  roundRect(ctx, 54, 54, 916, 1428, 34);
  ctx.fill();
  ctx.strokeStyle = experience.palette.secondary;
  ctx.lineWidth = 7;
  roundRect(ctx, 92, 92, 840, 1352, 26);
  ctx.stroke();
  ctx.strokeStyle = "rgba(37,34,36,0.18)";
  ctx.lineWidth = 2;
  roundRect(ctx, 120, 120, 784, 1296, 22);
  ctx.stroke();

  ctx.fillStyle = experience.palette.accent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = fontSpec(400, 42, fonts.display);
  ctx.globalAlpha = 0.58;
  ctx.fillText(heroData?.subtitle ?? "Aşkın Başladığı Gün", 512, 310);
  ctx.globalAlpha = 1;
  ctx.font = fontSpec(500, 98, fonts.display);
  wrapCentered(ctx, names, 512, 555, 760, 92);
  ctx.font = fontSpec(500, 32, fonts.sans);
  ctx.globalAlpha = 0.62;
  wrapCentered(
    ctx,
    heroData?.description ??
      "Bir masal gibi başlayan hikayemizin en özel gününde sizi yanımızda görmekten mutluluk duyarız.",
    512,
    772,
    650,
    40,
  );
  ctx.globalAlpha = 1;
  ctx.fillStyle = experience.palette.secondary;
  ctx.fillRect(392, 948, 240, 4);
  ctx.fillStyle = experience.palette.accent;
  ctx.font = fontSpec(600, 52, fonts.mono);
  ctx.fillText(date, 512, 1066);
  ctx.font = fontSpec(500, 34, fonts.sans);
  ctx.globalAlpha = 0.72;
  ctx.fillText(invitation.meta.weddingTime, 512, 1130);
  ctx.font = fontSpec(500, 32, fonts.sans);
  ctx.fillText(venueData?.venueName ?? "Davet Salonu", 512, 1208);
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

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function easeInOutCubic(value: number) {
  const p = clamp01(value);
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
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
