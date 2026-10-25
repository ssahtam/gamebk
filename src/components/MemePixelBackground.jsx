import React, { useEffect, useRef, useState } from 'react';
import PixelMemeAvatar from './PixelMemeAvatar';

export default function MemePixelBackground({ gameState = 'TITLE', age = 0 }) {
  const canvasRef = useRef(null);
  const [easterEggFlyer, setEasterEggFlyer] = useState({ active: false, x: -100, y: 50, type: 'horse' });

  // 1. Particle & Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle pool (Embers & Star dust)
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 1.2,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.2,
      hue: gameState === 'DEAD' ? 270 : gameState === 'BIRTH' ? 45 : 15 // red/ember vs gold vs purple
    }));

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Draw subtle 16-bit floating embers
      for (let p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${p.alpha * (0.6 + Math.sin(tick * 0.05 + p.x) * 0.4)})`;
        // Chunky pixel rect instead of smooth circle for 16-bit retro feel
        const s = Math.round(p.size);
        ctx.fillRect(Math.round(p.x), Math.round(p.y), s, s);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState]);

  // 2. Periodic Meme Easter Egg flying across top horizon (ม้าหน้าคน หรือ รถบรรทุก บินผ่านขอบฟ้า)
  useEffect(() => {
    const triggerFlyer = () => {
      const types = ['horse', 'truck', 'chill'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      setEasterEggFlyer({
        active: true,
        x: -120,
        y: Math.random() * 120 + 20,
        type: chosen
      });

      const startTime = Date.now();
      const duration = 7000;

      const flyInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        if (progress >= 1) {
          setEasterEggFlyer(prev => ({ ...prev, active: false }));
          clearInterval(flyInterval);
        } else {
          setEasterEggFlyer(prev => ({
            ...prev,
            x: -120 + progress * (window.innerWidth + 240)
          }));
        }
      }, 30);
    };

    // First launch after 4 seconds, then periodically
    const timer = setTimeout(triggerFlyer, 4000);
    const interval = setInterval(triggerFlyer, 28000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {/* 1. Deep Atmospheric Gradient & 16-Bit Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: gameState === 'DEAD'
          ? 'radial-gradient(circle at 50% 20%, #200a2b 0%, #0c0514 60%, #050208 100%)'
          : gameState === 'BIRTH'
          ? 'radial-gradient(circle at 50% 15%, #2a1b06 0%, #130d07 55%, #080604 100%)'
          : 'radial-gradient(circle at 50% 15%, #2b0b11 0%, #130a17 55%, #07060a 100%)',
        opacity: 0.95
      }} />

      {/* 2. Dither Pixel Matrix Pattern Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(rgba(201, 151, 56, 0.06) 1px, transparent 1px), radial-gradient(rgba(239, 68, 68, 0.04) 1px, transparent 1px)`,
        backgroundSize: '24px 24px, 48px 48px',
        backgroundPosition: '0 0, 12px 12px',
        opacity: 0.7
      }} />

      {/* 3. Canvas Particles (Rising Embers & Stars) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* 4. Left Meme Guardian Pillar (Visible on larger screens) */}
      <div style={{
        position: 'absolute',
        left: '20px',
        top: '70px',
        width: '150px',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity: 0.75,
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
        '@media (min-width: 1100px)': { display: 'flex' }
      }} className="desktop-flank-left">
        <div style={{
          backgroundColor: '#0f1422',
          border: '1.5px solid #8a0303',
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(138, 3, 3, 0.4)'
        }}>
          <div style={{ fontSize: '10px', color: '#ffd166', fontWeight: 'bold', marginBottom: '6px' }}>
            ⚔️ จอมทัพเบอร์เซิร์ก
          </div>
          <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="portrait" size={100} />
          </div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.3' }}>
            "เกราะหนัก 200 กก.<br/>แต่หน้าตายังชิล"
          </div>
        </div>

        <div style={{
          backgroundColor: '#0c0f18',
          border: '1px solid #1e293b',
          borderRadius: '6px',
          padding: '6px 8px',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{ fontSize: '9px', color: '#64748b' }}>มัลติเวิร์สชาแนล #1</div>
          <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold' }}>🚚 ทรัคคุงพร้อมชน</div>
        </div>
      </div>

      {/* 5. Right Meme Guardian Pillar (Visible on larger screens) */}
      <div style={{
        position: 'absolute',
        right: '20px',
        top: '70px',
        width: '150px',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        opacity: 0.75,
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.8))',
        '@media (min-width: 1100px)': { display: 'flex' }
      }} className="desktop-flank-right">
        <div style={{
          backgroundColor: '#0f1422',
          border: '1.5px solid #c99738',
          borderRadius: '8px',
          padding: '8px',
          textAlign: 'center',
          boxShadow: '0 0 15px rgba(201, 151, 56, 0.35)'
        }}>
          <div style={{ fontSize: '10px', color: '#ffd166', fontWeight: 'bold', marginBottom: '6px' }}>
            🐴 อัศวินม้าหน้าคน
          </div>
          <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="horse" size={100} />
          </div>
          <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.3' }}>
            "120 กม./ชม.<br/>หน้าพริ้มท้าพายุ"
          </div>
        </div>

        <div style={{
          backgroundColor: '#0c0f18',
          border: '1px solid #1e293b',
          borderRadius: '6px',
          padding: '6px 8px',
          textAlign: 'center',
          width: '100%'
        }}>
          <div style={{ fontSize: '9px', color: '#64748b' }}>ศาลเจ้าแห่งความชิล</div>
          <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold' }}>🍊 คาปิบาร่าออนเซ็น</div>
        </div>
      </div>

      {/* 6. Easter Egg Flying Sprite (แว้นผ่านขอบฟ้าแบบสุ่ม) */}
      {easterEggFlyer.active && (
        <div style={{
          position: 'absolute',
          left: `${easterEggFlyer.x}px`,
          top: `${easterEggFlyer.y}px`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: 0.65,
          transform: 'scale(0.85)',
          transition: 'none',
          filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.4))'
        }}>
          <div style={{
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid #ffd166',
            boxShadow: '0 0 10px #ffd166'
          }}>
            <PixelMemeAvatar memeKey={easterEggFlyer.type === 'horse' ? 'horse' : 'chill'} size={40} />
          </div>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '9px',
            color: '#f8fafc',
            whiteSpace: 'nowrap'
          }}>
            {easterEggFlyer.type === 'horse' ? '💨 กุบกับๆ 120km/h!' : '✨ สู้ชีวิตนะเพื่อน!'}
          </div>
        </div>
      )}

      {/* Responsive CSS for desktop flank pillars */}
      <style>{`
        @media (min-width: 1140px) {
          .desktop-flank-left, .desktop-flank-right {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
