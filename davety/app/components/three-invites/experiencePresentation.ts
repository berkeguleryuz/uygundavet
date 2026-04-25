export const EXPERIENCE_PRESENTATION = {
  canvasHasFrame: false,
  hasSharedGround: false,
  hasSharedPedestal: false,
  cardForwardMotion: 0,
} as const;

export const BOOK_PAGE_REVEAL = {
  cardBaseY: -0.36,
  cardRestZ: 0.12,
  startsAsFlatPageRotationX: -Math.PI / 2,
  settlesUprightRotationX: 0,
  tornStubScaleZ: 0.18,
} as const;

export function getCardBaseYForScene(sceneKind: string) {
  return sceneKind === "book" ? BOOK_PAGE_REVEAL.cardBaseY : -0.7;
}
