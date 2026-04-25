"use client";

import * as THREE from "three";
import { SceneShell } from "@/app/components/three-claude/SceneShell";
import { makeCardMesh, type Palette } from "@/app/components/three-claude/sharedScene";

export function Scene({ palette }: { palette: Palette }) {
  return (
    <SceneShell
      palette={palette}
      cameraPos={[0, 0.4, 5.4]}
      idleHint="• saati başlat •"
      runningHint="guguk geliyor…"
      revealedHint="• davetiye geldi •"
      build={({ three, palette, api }) => {
        const { scene } = three;

        const woodMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(palette.accent).multiplyScalar(0.5),
          roughness: 0.85,
        });

        // House body
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 2.4, 0.6),
          woodMat
        );
        body.position.y = 0.2;
        body.castShadow = true;
        scene.add(body);

        // Roof (triangular prism)
        const roofGeo = new THREE.BufferGeometry();
        const roofV = new Float32Array([
          -1.05, 0, 0.35, 1.05, 0, 0.35, 0, 0.6, 0,
          -1.05, 0, -0.35, 1.05, 0, -0.35, 0, 0.6, 0,
          -1.05, 0, 0.35, -1.05, 0, -0.35, 0, 0.6, 0,
          1.05, 0, 0.35, 0, 0.6, 0, 1.05, 0, -0.35,
        ]);
        roofGeo.setAttribute("position", new THREE.BufferAttribute(roofV, 3));
        roofGeo.setIndex([
          0, 2, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11,
        ]);
        roofGeo.computeVertexNormals();
        const roof = new THREE.Mesh(
          roofGeo,
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.accent).multiplyScalar(0.7),
            roughness: 0.7,
          })
        );
        roof.position.set(0, 1.4, 0);
        roof.castShadow = true;
        scene.add(roof);

        // Clock face
        const face = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.4, 0.04, 32),
          new THREE.MeshStandardMaterial({ color: 0xfaf3e2, roughness: 0.5 })
        );
        face.rotation.x = Math.PI / 2;
        face.position.set(0, 0.5, 0.31);
        scene.add(face);

        // Pendulum
        const pendulumPivot = new THREE.Group();
        pendulumPivot.position.set(0, 0.0, 0.31);
        scene.add(pendulumPivot);
        const rod = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.012, 0.7, 8),
          new THREE.MeshStandardMaterial({ color: 0xc9a349, metalness: 0.7, roughness: 0.3 })
        );
        rod.position.y = -0.35;
        pendulumPivot.add(rod);
        const bob = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 0.04, 32),
          new THREE.MeshStandardMaterial({ color: 0xd4a93c, metalness: 0.85 })
        );
        bob.rotation.x = Math.PI / 2;
        bob.position.y = -0.7;
        pendulumPivot.add(bob);

        // Doors above face
        const doorL = new THREE.Group();
        const doorR = new THREE.Group();
        doorL.position.set(-0.3, 1.05, 0.31);
        doorR.position.set(0.3, 1.05, 0.31);
        scene.add(doorL);
        scene.add(doorR);
        const doorGeo = new THREE.BoxGeometry(0.3, 0.4, 0.04);
        const doorMatL = new THREE.MeshStandardMaterial({
          color: new THREE.Color(palette.accent).multiplyScalar(0.6),
          roughness: 0.7,
        });
        const doorL_mesh = new THREE.Mesh(doorGeo, doorMatL);
        const doorR_mesh = new THREE.Mesh(doorGeo, doorMatL);
        doorL_mesh.position.set(0.15, 0, 0.02);
        doorR_mesh.position.set(-0.15, 0, 0.02);
        doorL.add(doorL_mesh);
        doorR.add(doorR_mesh);

        // Cuckoo bird (extends from inside)
        const birdGroup = new THREE.Group();
        birdGroup.position.set(0, 1.05, 0.0);
        scene.add(birdGroup);
        const birdBody = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0x9c4d2d, roughness: 0.7 })
        );
        birdBody.scale.set(1, 0.9, 1.4);
        birdGroup.add(birdBody);
        const beak = new THREE.Mesh(
          new THREE.ConeGeometry(0.04, 0.1, 8),
          new THREE.MeshStandardMaterial({ color: 0xd2a64f, roughness: 0.5 })
        );
        beak.rotation.x = Math.PI / 2;
        beak.position.z = 0.18;
        birdGroup.add(beak);

        // Card initially in beak
        const card = makeCardMesh(palette, 0.4, 0.55);
        card.mesh.position.set(0, -0.05, 0.25);
        card.mesh.rotation.x = -Math.PI / 2;
        card.mesh.scale.setScalar(0.6);
        card.mesh.visible = false;
        birdGroup.add(card.mesh);

        // Pedestal below for card to land
        const pedestal = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.4, 0.06, 32),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(palette.accent).multiplyScalar(0.4),
            roughness: 0.7,
          })
        );
        pedestal.position.set(0, -1.55, 0.6);
        pedestal.receiveShadow = true;
        scene.add(pedestal);

        let trigger = false;
        let pendAng = 0.4;
        let pendVel = 0;
        let elapsed = 0;
        let doorsOpen = 0;
        let birdExtend = 0;
        let cardReleased = false;
        const cardPos = new THREE.Vector3();
        const cardVel = new THREE.Vector3();
        const cardRot = new THREE.Euler();
        let cardOnPed = false;
        let cardScaleUp = 0;
        const REVEAL_T = 4.0;

        api.triggerRef.current = () => {
          if (trigger) return;
          trigger = true;
          pendAng = 0.4;
          api.setStage("running");
        };

        api.resetRef.current = () => {
          trigger = false;
          elapsed = 0;
          doorsOpen = 0;
          birdExtend = 0;
          cardReleased = false;
          cardOnPed = false;
          cardScaleUp = 0;
          pendAng = 0;
          pendVel = 0;
          pendulumPivot.rotation.z = 0;
          doorL.rotation.y = 0;
          doorR.rotation.y = 0;
          birdGroup.position.z = 0.0;
          birdGroup.scale.set(1, 1, 1);
          card.mesh.visible = false;
          card.mesh.position.set(0, -0.05, 0.25);
          card.mesh.rotation.set(-Math.PI / 2, 0, 0);
          card.mesh.scale.setScalar(0.6);
          api.setStage("idle");
        };

        return {
          step(_now, dt) {
            if (!trigger) return;
            elapsed += dt;
            const acc = -(9.8 / 0.7) * Math.sin(pendAng) - pendVel * 0.04;
            pendVel += acc * dt;
            pendAng += pendVel * dt;
            pendulumPivot.rotation.z = pendAng;

            if (elapsed > REVEAL_T) {
              if (doorsOpen < 1) {
                doorsOpen = Math.min(1, doorsOpen + dt * 1.5);
                doorL.rotation.y = -doorsOpen * Math.PI * 0.4;
                doorR.rotation.y = doorsOpen * Math.PI * 0.4;
              }
              if (doorsOpen >= 1 && birdExtend < 1) {
                birdExtend = Math.min(1, birdExtend + dt * 1.0);
                birdGroup.position.z = birdExtend * 0.7;
                birdGroup.visible = true;
              }
              if (birdExtend >= 1 && !cardReleased) {
                cardReleased = true;
                card.mesh.visible = true;
                // Detach from bird (place in world coords)
                const wp = new THREE.Vector3();
                card.mesh.getWorldPosition(wp);
                scene.add(card.mesh);
                cardPos.copy(wp);
                cardVel.set(0, -0.2, 0.2);
                cardRot.copy(card.mesh.rotation);
              }
            }

            if (cardReleased && !cardOnPed) {
              cardVel.y -= 4.0 * dt; // reduced gravity for paper flutter
              cardVel.x += Math.sin(elapsed * 6) * 0.4 * dt;
              cardPos.add(cardVel.clone().multiplyScalar(dt));
              card.mesh.position.copy(cardPos);
              card.mesh.rotation.x = cardRot.x + Math.sin(elapsed * 4) * 0.4;
              card.mesh.rotation.z = Math.sin(elapsed * 3) * 0.6;
              if (cardPos.y < -1.5) {
                cardPos.set(0, -1.5, 0.6);
                card.mesh.position.copy(cardPos);
                card.mesh.rotation.set(-Math.PI / 2, 0, 0);
                cardOnPed = true;
              }
            }

            if (cardOnPed) {
              cardScaleUp = Math.min(1, cardScaleUp + dt * 0.6);
              const s = 0.6 + cardScaleUp * 0.6;
              card.mesh.scale.setScalar(s);
              card.mesh.rotation.x = -Math.PI / 2 + cardScaleUp * Math.PI / 2;
              card.mesh.position.y = -1.5 + cardScaleUp * 0.3;
              if (cardScaleUp >= 1) api.setStage("revealed");
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
