import { toPng } from "html-to-image";

interface Options {
  pixelRatio?: number;
  backgroundColor?: string;
}

export async function downloadNodeAsPng(
  node: HTMLElement,
  filename: string,
  { pixelRatio = 5, backgroundColor }: Options = {}
): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const dataUrl = await toPng(node, {
    pixelRatio,
    cacheBust: true,
    ...(backgroundColor ? { backgroundColor } : {}),
  });

  const link = document.createElement("a");
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
