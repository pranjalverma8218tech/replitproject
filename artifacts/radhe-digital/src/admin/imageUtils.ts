const MAX_SIDE = 1200;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const TARGET_BYTES = 500 * 1024;
const QUALITY_START = 0.88;
const MIN_QUALITY = 0.32;
const QUALITY_STEP = 0.08;

export function validateImageFile(file: File): void {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(
      `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed is 20 MB.`
    );
  }
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];
  if (!allowed.includes(file.type)) {
    throw new Error("Unsupported format. Please upload JPG, PNG, WebP, or GIF.");
  }
}

function detectWebP(): boolean {
  try {
    const c = document.createElement("canvas");
    c.width = 1; c.height = 1;
    return c.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

const WEBP_SUPPORTED = detectWebP();

async function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, mime, quality));
}

export async function compressImage(
  file: File,
  onProgress?: (stage: "reading" | "compressing" | "done") => void
): Promise<{ file: File; originalKB: number; compressedKB: number }> {
  validateImageFile(file);
  const originalKB = Math.round(file.size / 1024);

  onProgress?.("reading");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Could not read image. File may be corrupted.");
  }

  onProgress?.("compressing");

  const { width: origW, height: origH } = bitmap;
  let w = origW;
  let h = origH;

  if (w > MAX_SIDE || h > MAX_SIDE) {
    if (w >= h) {
      h = Math.round((h / w) * MAX_SIDE);
      w = MAX_SIDE;
    } else {
      w = Math.round((w / h) * MAX_SIDE);
      h = MAX_SIDE;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available.");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const mime = WEBP_SUPPORTED ? "image/webp" : "image/jpeg";
  const ext  = WEBP_SUPPORTED ? ".webp"      : ".jpg";

  let quality = QUALITY_START;
  let blob: Blob | null = null;

  while (quality >= MIN_QUALITY) {
    blob = await canvasToBlob(canvas, mime, quality);
    if (blob && blob.size <= TARGET_BYTES) break;
    quality -= QUALITY_STEP;
  }

  if (!blob || blob.size === 0) {
    blob = await canvasToBlob(canvas, mime, MIN_QUALITY);
  }
  if (!blob) throw new Error("Compression failed. Please try a different image.");

  const baseName = file.name.replace(/\.[^.]+$/, "");
  const compressed = new File([blob], `${baseName}${ext}`, { type: mime });
  const compressedKB = Math.round(compressed.size / 1024);

  onProgress?.("done");
  return { file: compressed, originalKB, compressedKB };
}
