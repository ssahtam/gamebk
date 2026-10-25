import React, { useRef, useEffect } from 'react';

// แมปปิ้งรูปภาพมีมในตำนาน
export const MEME_IMAGES = {
  horse: '/memes/meme_berserk_horse.jpg',
  portrait: '/memes/meme_berserk_portrait.jpg',
  full: '/memes/meme_berserk_full.jpg',
  chill: '/memes/meme_face_chill.jpg'
};

// 4x4 Bayer Dithering Matrix สำหรับสไตล์ Aseprite 16-Bit แท้
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function PixelMemeAvatar({
  memeKey = 'horse',
  size = 64,
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const src = MEME_IMAGES[memeKey] || MEME_IMAGES.horse;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;

    img.onload = () => {
      // 16-bit low-res offscreen buffer
      const lowRes = 48;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = lowRes;
      offCanvas.height = lowRes;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      offCtx.imageSmoothingEnabled = false;
      offCtx.drawImage(img, 0, 0, lowRes, lowRes);

      try {
        const imgData = offCtx.getImageData(0, 0, lowRes, lowRes);
        const data = imgData.data;
        const levels = 24; // 16-bit SNES/GBA steps
        const step = 255 / (levels - 1);

        for (let y = 0; y < lowRes; y++) {
          for (let x = 0; x < lowRes; x++) {
            const idx = (y * lowRes + x) * 4;
            const dither = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * (step * 0.7);
            data[idx] = Math.min(255, Math.max(0, Math.round((data[idx] + dither) / step) * step));
            data[idx + 1] = Math.min(255, Math.max(0, Math.round((data[idx + 1] + dither) / step) * step));
            data[idx + 2] = Math.min(255, Math.max(0, Math.round((data[idx + 2] + dither) / step) * step));
          }
        }
        offCtx.putImageData(imgData, 0, 0);
      } catch (e) {
        // Fallback gracefully on cross-origin
      }

      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
    };
  }, [src, size]);

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1.5px solid #475569',
        backgroundColor: '#070a12',
        boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
}
