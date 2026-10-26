import React, { useRef, useEffect } from 'react';
import { renderAnimatedBiomeScene } from './SceneViewport.jsx';

export default function PixelSceneIllustrator({
  sceneId = 'alley',
  height = 160,
  animated = true,
  character = null,
  age = 18
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameId;
    let tick = Math.floor(Math.random() * 100);

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderAnimatedBiomeScene(ctx, {
        width: canvas.width,
        height: canvas.height,
        tick,
        sceneId,
        age,
        character,
        showActors: height >= 80
      });

      if (animated) {
        frameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [sceneId, animated, height, age, character]);

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
        width={height >= 80 ? 360 : 120}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}
