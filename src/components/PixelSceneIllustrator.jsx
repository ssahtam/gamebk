import React, { useRef, useEffect, useState } from 'react';
import { SCENE_IMAGE_MAP, SCENE_THEMES } from './SceneViewport';

// Bayer 4x4 Dithering Matrix สำหรับสไตล์ Aseprite เรโทรแท้
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function PixelSceneIllustrator({
  sceneId = 'alley',
  height = 160,
  animated = true,
  pixelMode = '16bit'
}) {
  const canvasRef = useRef(null);
  const [loadedImage, setLoadedImage] = useState(null);
  const [imgError, setImgError] = useState(false);

  const imageSrc = SCENE_IMAGE_MAP[sceneId] || SCENE_IMAGE_MAP.alley;
  const theme = SCENE_THEMES[sceneId] || SCENE_THEMES.alley;

  useEffect(() => {
    let isMounted = true;
    setImgError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      if (isMounted) {
        setLoadedImage(img);
        setImgError(false);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        setLoadedImage(null);
        setImgError(true);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameId;
    let tick = 0;

    // ระบบ Particles แบบ 16-Bit Chunky Pixels
    const particleCount = 25;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: 0.6 + Math.random() * 1.6,
      size: 2, // 2px chunky pixel blocks
      alpha: Math.random() * 0.7 + 0.3
    }));

    // Offscreen Canvas สำหรับประมวลผล Pixelation
    const pixelWidth = pixelMode === '16bit' ? 180 : 320;
    const pixelHeight = pixelMode === '16bit' ? 100 : 180;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = pixelWidth;
    offCanvas.height = pixelHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (loadedImage && !imgError) {
        // ==========================================
        // 1. ถ่ายทอดภาพจริงผ่าน Aseprite 16-Bit Pixel Shader
        // ==========================================
        offCtx.imageSmoothingEnabled = false;
        offCtx.drawImage(loadedImage, 0, 0, pixelWidth, pixelHeight);

        try {
          const imgData = offCtx.getImageData(0, 0, pixelWidth, pixelHeight);
          const data = imgData.data;
          const levels = 24;
          const step = 255 / (levels - 1);

          for (let y = 0; y < pixelHeight; y++) {
            for (let x = 0; x < pixelWidth; x++) {
              const idx = (y * pixelWidth + x) * 4;
              const dither = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * (step * 0.75);

              data[idx] = Math.min(255, Math.max(0, Math.round((data[idx] + dither) / step) * step));
              data[idx + 1] = Math.min(255, Math.max(0, Math.round((data[idx + 1] + dither) / step) * step));
              data[idx + 2] = Math.min(255, Math.max(0, Math.round((data[idx + 2] + dither) / step) * step));
            }
          }
          offCtx.putImageData(imgData, 0, 0);
        } catch (e) {
          // ignore cross-origin error
        }

        // Scale up ด้วย Nearest-Neighbor
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
      } else {
        // ==========================================
        // 2. Procedural Fallback: ทิวเขาและกระท่อมฟางพิกเซลละเอียด
        // ==========================================
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#060913');
        skyGrad.addColorStop(0.6, '#131d33');
        skyGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ดวงดาวพิกเซล
        for (let s = 0; s < 25; s++) {
          const starX = (s * 31 + Math.sin(tick * 0.02 + s) * 2) % canvas.width;
          const starY = (s * 17) % (canvas.height * 0.6);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(Math.floor(starX), Math.floor(starY), 2, 2);
        }

        // พระจันทร์
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(canvas.width - 50, 30, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#060913';
        ctx.beginPath();
        ctx.arc(canvas.width - 55, 28, 12, 0, Math.PI * 2);
        ctx.fill();

        // ทิวเขาพิกเซล
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.6);
        ctx.lineTo(80, canvas.height * 0.45);
        ctx.lineTo(160, canvas.height * 0.65);
        ctx.lineTo(240, canvas.height * 0.4);
        ctx.lineTo(340, canvas.height * 0.65);
        ctx.lineTo(canvas.width, canvas.height * 0.55);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();

        // พื้นหิน
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, canvas.height * 0.72, canvas.width, canvas.height * 0.28);
      }

      // ==========================================
      // 3. Dynamic Weather Particles (ถ้าเปิด animated)
      // ==========================================
      if (animated) {
        const weather = theme?.weather || 'mist';
        if (weather === 'snow') {
          ctx.fillStyle = '#ffffff';
          particles.forEach(p => {
            ctx.globalAlpha = p.alpha;
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            p.y += p.speedY * 0.7;
            p.x += Math.sin(tick * 0.02 + p.y) * 0.4;
            if (p.y > canvas.height) {
              p.y = -3;
              p.x = Math.random() * canvas.width;
            }
          });
        } else if (weather === 'embers' || weather === 'sparks') {
          particles.forEach((p, idx) => {
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = idx % 2 === 0 ? '#f97316' : '#ef4444';
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            p.y -= p.speedY * 0.8;
            if (p.y < 0) {
              p.y = canvas.height + 2;
              p.x = Math.random() * canvas.width;
            }
          });
        } else if (weather === 'rain') {
          ctx.fillStyle = '#38bdf8';
          ctx.globalAlpha = 0.6;
          particles.forEach(p => {
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1.5, 5);
            p.y += p.speedY * 2.5;
            p.x -= 0.8;
            if (p.y > canvas.height) {
              p.y = -5;
              p.x = Math.random() * canvas.width;
            }
          });
        }
      }

      ctx.globalAlpha = 1.0;

      if (animated) {
        frameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [loadedImage, imgError, sceneId, animated, pixelMode]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#05070c',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid #1e293b',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
          objectFit: 'cover'
        }}
      />

      {/* Retro CRT Scanlines Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%)',
          backgroundSize: '100% 3px',
          pointerEvents: 'none'
        }}
      />

      {/* Dark Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 50%, rgba(5,7,12,0.6) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
