import React, { useRef, useEffect } from 'react';
import { getAssetUrl } from '../utils/assets.js';

export const MEME_IMAGES = {
  horse: getAssetUrl('memes/meme_berserk_horse.jpg'),
  portrait: getAssetUrl('memes/meme_berserk_portrait.jpg'),
  full: getAssetUrl('memes/meme_berserk_full.jpg'),
  chill: getAssetUrl('memes/meme_face_chill.jpg')
};

export default function PixelMemeAvatar({
  memeKey = 'horse',
  size = 48,
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let tick = 0;

    const render = () => {
      tick++;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const bob = Math.floor(Math.sin(tick * 0.1) * 1.5);
      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2);

      if (memeKey === 'horse') {
        // อัศวินควบม้าหน้าคนยิ้มหลับตาพริ้ม
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 12, cy + 2 + bob, 20, 10);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx + 2, cy - 8 + bob, 11, 11);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx + 5, cy - 4 + bob, 3, 1.5);
        ctx.fillRect(cx + 9, cy - 4 + bob, 3, 1.5);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(cx + 6, cy - 1 + bob, 5, 2);
      } else if (memeKey === 'portrait') {
        // จอมทัพเกราะทมิฬอมยิ้ม
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 10, cy - 12 + bob, 20, 24);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 6, cy - 4 + bob, 12, 10);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 4, cy - 2 + bob, 3, 2);
        ctx.fillRect(cx + 2, cy - 2 + bob, 3, 2);
      } else if (memeKey === 'full') {
        // จอมดาบยักษ์ผ่ามิติ
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx + 5, cy - 16 + bob, 5, 30);
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 9, cy - 6 + bob, 12, 18);
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 7, cy - 13 + bob, 8, 7);
      } else {
        // ผู้รู้แจ้งหน้าชิล (Chill Guy)
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx - 8, cy - 10 + bob, 16, 14);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(cx - 9, cy + 4 + bob, 18, 10);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 4, cy - 5 + bob, 3, 1.5);
        ctx.fillRect(cx + 2, cy - 5 + bob, 3, 1.5);
        ctx.fillRect(cx - 2, cy - 1 + bob, 6, 1.5);
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [memeKey, size]);

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
      <canvas
        ref={canvasRef}
        width={48}
        height={48}
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          display: 'block'
        }}
      />
    </div>
  );
}
