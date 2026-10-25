import React, { useRef, useEffect, useState } from 'react';
import { getAssetUrl } from '../utils/assets';

// แมปปิ้งรูปภาพมีมในตำนาน
export const MEME_IMAGES = {
  horse: getAssetUrl('memes/meme_berserk_horse.jpg'),
  portrait: getAssetUrl('memes/meme_berserk_portrait.jpg'),
  full: getAssetUrl('memes/meme_berserk_full.jpg'),
  chill: getAssetUrl('memes/meme_face_chill.jpg')
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
  const [rendered, setRendered] = useState(false);
  const src = MEME_IMAGES[memeKey] || MEME_IMAGES.horse;

  useEffect(() => {
    let isMounted = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      try {
        const lowRes = 48;
        const offCanvas = document.createElement('canvas');
        offCanvas.width = lowRes;
        offCanvas.height = lowRes;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

        offCtx.imageSmoothingEnabled = false;
        offCtx.drawImage(img, 0, 0, lowRes, lowRes);

        const imgData = offCtx.getImageData(0, 0, lowRes, lowRes);
        const data = imgData.data;
        const levels = 24;
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

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
        setRendered(true);
      } catch (e) {
        // Fallback to direct draw
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setRendered(true);
      }
    };

    img.onerror = () => {
      if (isMounted) setRendered(false);
    };

    return () => {
      isMounted = false;
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
        backgroundColor: '#0c0f18',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        ...style
      }}
    >
      {/* 16-Bit Pixel Dither Canvas */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          display: rendered ? 'block' : 'none'
        }}
      />

      {/* Guaranteed Native <img> Fallback (never blank) */}
      {!rendered && (
        <img
          src={src}
          alt={memeKey}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            imageRendering: 'pixelated',
            display: 'block'
          }}
        />
      )}
    </div>
  );
}
