"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { bootstrapScene, type Palette } from "./sharedScene";

export interface SceneApi {
  triggerRef: { current: () => void };
  resetRef: { current: () => void };
  setStage: (s: "idle" | "running" | "revealed") => void;
}

export interface SceneBuilderArgs {
  three: ReturnType<typeof bootstrapScene>;
  palette: Palette;
  api: SceneApi;
}

export type SceneBuilder = (args: SceneBuilderArgs) => {
  step: (now: number, dt: number) => void;
  dispose: () => void;
};

export interface SceneShellProps {
  palette: Palette;
  build: SceneBuilder;
  idleHint: string;
  runningHint: string;
  revealedHint: string;
  cameraPos?: [number, number, number];
  lookAt?: [number, number, number];
}

export function SceneShell({
  palette,
  build,
  idleHint,
  runningHint,
  revealedHint,
  cameraPos,
  lookAt,
}: SceneShellProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<"idle" | "running" | "revealed">("idle");
  const triggerRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});
  const buildRef = useRef(build);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const three = bootstrapScene(wrap, palette, cameraPos, lookAt);

    const api: SceneApi = {
      triggerRef,
      resetRef,
      setStage,
    };

    const builder = buildRef.current({ three, palette, api });

    const targetCam = { x: three.camera.position.x, y: three.camera.position.y };
    function onPointerMove(e: PointerEvent) {
      const r = wrap!.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      targetCam.x = (cameraPos?.[0] ?? 0) + dx * 0.6;
      targetCam.y = (cameraPos?.[1] ?? 0.6) - dy * 0.4;
    }
    wrap.addEventListener("pointermove", onPointerMove);

    let lastT = performance.now();
    let raf = 0;
    function loop(now: number) {
      const dt = Math.min(0.033, (now - lastT) / 1000);
      lastT = now;
      three.camera.position.x += (targetCam.x - three.camera.position.x) * 0.06;
      three.camera.position.y += (targetCam.y - three.camera.position.y) * 0.06;
      three.camera.lookAt(...(lookAt ?? [0, 0, 0]));
      builder.step(now, dt);
      three.renderer.render(three.scene, three.camera);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function onResize() {
      const w = wrap!.clientWidth;
      const h = wrap!.clientHeight;
      three.camera.aspect = w / h;
      three.camera.updateProjectionMatrix();
      three.renderer.setSize(w, h);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      builder.dispose();
      three.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose?.();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
        else m?.dispose?.();
      });
      three.dispose();
    };
  }, [palette, cameraPos, lookAt]);

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
          {stage === "idle" && idleHint}
          {stage === "running" && runningHint}
          {stage === "revealed" && revealedHint}
        </div>
        <button
          type="button"
          onClick={() => resetRef.current()}
          disabled={stage !== "revealed"}
          className="rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] transition disabled:opacity-30"
          style={{ background: palette.ink, color: palette.bg }}
        >
          Tekrar
        </button>
      </div>
    </section>
  );
}
