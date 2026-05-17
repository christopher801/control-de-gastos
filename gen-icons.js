// gen-icons.js
// Usage: node gen-icons.js
// Requis: npm install canvas

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const OUT_DIR = path.join(__dirname, 'public', 'icons');
const SIZES   = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx    = canvas.getContext('2d');
  const s      = size / 64; // base SVG = 64px

  // Fond noir arrondi (rx="16" sur base 64px)
  const r = 16 * s;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = '#0A0A0A';
  ctx.fill();

  // Signe $ (reproduit exactement le SVG original)
  // font-size="36" sur base 64px, centré x=32 y=44
  const fontSize = Math.round(36 * s);
  ctx.fillStyle  = '#F5F4F0';
  ctx.font       = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign  = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('$', size / 2, 44 * s);

  return canvas;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`\n📁 Output → ${OUT_DIR}\n`);

  for (const size of SIZES) {
    const buffer  = drawIcon(size).toBuffer('image/png');
    const outPath = path.join(OUT_DIR, `icon-${size}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅  icon-${size}.png`.padEnd(24) + `${(buffer.length / 1024).toFixed(1)} KB`);
  }

  // favicon.png (32px) nan rasin /public
  const buf = drawIcon(32).toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, 'public', 'favicon.png'), buf);
  console.log(`✅  favicon.png (32×32)\n`);

  console.log(`🎉  ${SIZES.length + 1} fichye nan public/icons/`);
}

main();