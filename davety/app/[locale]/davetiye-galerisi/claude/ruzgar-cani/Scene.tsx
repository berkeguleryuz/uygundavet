"use client";

import * as THREE from "three";
import { SceneShell } from "@/app/components/three-claude/SceneShell";
import { makeCardMesh, easeOutCubic, type Palette } from "@/app/components/three-claude/sharedScene";

export function Scene({ palette }: { palette: Palette }) {
  return (
    <SceneShell
      palette={palette}
      cameraPos={[0, 0.6, 5.4]}
      idleHint="• rüzgarı estir •"
      runningHint="çanlar çarpışıyor…"
      revealedHint="• davetiye açıldı •"
      build={({ three, palette, api }) => {
        const { scene } = three;

        // Top hub
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.accent).multiplyScalar(0.5),
            roughness: 0.85,
          })
        );
        hub.position.y = 1.6;
        hub.castShadow = true;
        scene.add(hub);

        // Strings + tubes (5 around hub)
        const N_TUBES = 5;
        type Tube = {
          group: THREE.Group;
          ang: number;
          angVel: number;
          baseAng: number;
          radius: number;
        };
        const tubes: Tube[] = [];
        const tubeMat = new THREE.MeshStandardMaterial({
          color: 0xc9c9c9,
          metalness: 0.9,
          roughness: 0.18,
        });
        for (let i = 0; i < N_TUBES; i++) {
          const angAround = (i / N_TUBES) * Math.PI * 2;
          const radius = 0.32;
          const grp = new THREE.Group();
          grp.position.set(
            Math.cos(angAround) * radius,
            1.55,
            Math.sin(angAround) * radius
          );
          scene.add(grp);

          // String (visual line)
          const stringGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.3, 0),
          ]);
          const line = new THREE.Line(
            stringGeo,
            new THREE.LineBasicMaterial({ color: 0x222 })
          );
          grp.add(line);

          const tube = new THREE.Mesh(
            new THREE.CylinderGeometry(0.045, 0.045, 0.9 + i * 0.05, 12),
            tubeMat
          );
          tube.position.y = -0.3 - (0.9 + i * 0.05) / 2;
          tube.castShadow = true;
          grp.add(tube);

          tubes.push({ group: grp, ang: 0, angVel: 0, baseAng: angAround, radius });
        }

        // Center pendant (a small wooden box hanging from hub)
        const pendantGroup = new THREE.Group();
        pendantGroup.position.set(0, 1.55, 0);
        scene.add(pendantGroup);
        const pendantString = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.6, 0),
          ]),
          new THREE.LineBasicMaterial({ color: 0x222 })
        );
        pendantGroup.add(pendantString);

        const pendantBox = new THREE.Group();
        pendantBox.position.y = -0.85;
        pendantGroup.add(pendantBox);
        const boxBody = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.5, 0.5),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.accent).multiplyScalar(0.55),
            roughness: 0.78,
          })
        );
        boxBody.castShadow = true;
        pendantBox.add(boxBody);

        const lidGroup = new THREE.Group();
        lidGroup.position.set(0, 0.25, -0.25);
        pendantBox.add(lidGroup);
        const lid = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, 0.05, 0.5),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.accent).multiplyScalar(0.7),
            roughness: 0.78,
          })
        );
        lid.position.set(0, 0.025, 0.25);
        lid.castShadow = true;
        lidGroup.add(lid);

        const card = makeCardMesh(palette, 0.4, 0.55);
        card.mesh.position.set(0, 0.0, 0);
        card.mesh.visible = false;
        pendantBox.add(card.mesh);

        let trigger = false;
        let impactCount = 0;
        let lidAngle = 0;
        let cardLift = 0;
        let pendulumAng = 0;
        let pendulumVel = 0;
        const IMPACT_THRESHOLD = 7;

        api.triggerRef.current = () => {
          if (trigger) return;
          trigger = true;
          // Apply wind: kick all tubes
          for (const t of tubes) t.angVel = 1.6 + Math.random() * 1.0;
          api.setStage("running");
        };

        api.resetRef.current = () => {
          trigger = false;
          impactCount = 0;
          lidAngle = 0;
          cardLift = 0;
          pendulumAng = 0;
          pendulumVel = 0;
          for (const t of tubes) {
            t.ang = 0;
            t.angVel = 0;
            t.group.rotation.z = 0;
          }
          pendantGroup.rotation.z = 0;
          lidGroup.rotation.x = 0;
          card.mesh.visible = false;
          card.mesh.position.set(0, 0, 0);
          api.setStage("idle");
        };

        return {
          step(_now, dt) {
            if (!trigger) return;

            // Damped pendulum each tube
            for (const t of tubes) {
              const acc = -(9.8 / 0.6) * Math.sin(t.ang) - t.angVel * 0.4;
              t.angVel += acc * dt;
              t.ang += t.angVel * dt;
              t.group.rotation.z = t.ang;
            }

            // Collision check: tubes collide with center pendant
            for (const t of tubes) {
              const tubeWorldX = Math.cos(t.baseAng) * t.radius + Math.sin(t.ang) * 0.6;
              const dist = Math.abs(tubeWorldX);
              if (dist < 0.3 && Math.abs(t.angVel) > 0.3) {
                impactCount++;
                // pendulum gets nudged
                pendulumVel += 0.5 * Math.sign(t.ang || 0.01);
                t.angVel *= -0.6; // bounce
              }
            }

            // Pendant pendulum
            const pacc = -(9.8 / 0.85) * Math.sin(pendulumAng) - pendulumVel * 0.5;
            pendulumVel += pacc * dt;
            pendulumAng += pendulumVel * dt;
            pendantGroup.rotation.z = pendulumAng;

            if (impactCount >= IMPACT_THRESHOLD && lidAngle < Math.PI * 0.55) {
              lidAngle = Math.min(Math.PI * 0.55, lidAngle + dt * 1.4);
              lidGroup.rotation.x = -lidAngle;
            }
            if (lidAngle >= Math.PI * 0.55 - 0.01) {
              card.mesh.visible = true;
              cardLift = Math.min(1, cardLift + dt * 0.7);
              const e = easeOutCubic(cardLift);
              card.mesh.position.y = e * 0.55;
              if (cardLift >= 1) api.setStage("revealed");
            }
          },
          dispose() {
            card.texture.dispose();
            card.material.dispose();
          },
        };
      }}
    />
  );
}
