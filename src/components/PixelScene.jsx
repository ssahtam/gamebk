import React, { useRef, useEffect } from 'react';

// Canvas-based Animated Retro Pixel Art Scene Viewport
// Renders dynamic, responsive, 16-bit retro dark fantasy animated scenes
export default function PixelScene({ sceneId, age, weather }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let frameId;
    let tick = 0;

    // Particles (Embers, Snow, Rain, Stars)
    const particles = [];
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 320,
        y: Math.random() * 160,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: 0.4 + Math.random() * 0.8,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7
      });
    }

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, 320, 160);

      // 1. Sky & Backdrop according to sceneId
      drawBackground(ctx, sceneId, tick);

      // 2. Animated Particles (Embers / Fog / Rain / Snow)
      drawParticles(ctx, sceneId, particles, tick);

      // 3. Middleground Scenery (Ruins, Mountains, Temples, Trees)
      drawScenery(ctx, sceneId, tick);

      // 4. Foreground Animated Pixel Actors & Memes
      drawForegroundActors(ctx, sceneId, tick);

      // 5. Cinematic Vignette & Scanlines
      drawScanlinesAndVignette(ctx);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [sceneId]);

  return (
    <div style={viewportContainerStyle}>
      <canvas
        ref={canvasRef}
        width={320}
        height={160}
        style={canvasStyle}
      />
      {/* Decorative Golden Runic Corner Accents */}
      <div style={cornerTopLeft} />
      <div style={cornerTopRight} />
      <div style={cornerBottomLeft} />
      <div style={cornerBottomRight} />
    </div>
  );
}

// ----------------------------------------------------
// 1. Background Rendering
// ----------------------------------------------------
function drawBackground(ctx, sceneId, tick) {
  // Blood Eclipse Sky
  if (sceneId.includes('eclipse')) {
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#1a0003');
    grad.addColorStop(0.6, '#3d050c');
    grad.addColorStop(1, '#660b11');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 160);

    // Eclipsed Blood Sun
    const sunPulse = Math.sin(tick * 0.05) * 2;
    ctx.fillStyle = '#0a0002';
    ctx.beginPath();
    ctx.arc(160, 50, 24, 0, Math.PI * 2);
    ctx.fill();

    // Red Corona Ring
    ctx.strokeStyle = '#ff3344';
    ctx.lineWidth = 2 + (sunPulse > 0 ? 1 : 0);
    ctx.stroke();

    // Bleeding Tendrils
    ctx.fillStyle = 'rgba(255, 30, 50, 0.2)';
    ctx.fillRect(156, 74, 8, 40 + Math.sin(tick * 0.1) * 8);
    return;
  }

  // Blizzard / Winter Sky
  if (sceneId.includes('winter') || sceneId.includes('snow') || sceneId.includes('famine')) {
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#0d131f');
    grad.addColorStop(0.7, '#1f2b3e');
    grad.addColorStop(1, '#3b4b60');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 160);
    return;
  }

  // Mana Disaster / White Whale Sky
  if (sceneId.includes('mana') || sceneId.includes('whale') || sceneId.includes('truck')) {
    const grad = ctx.createLinearGradient(0, 0, 0, 160);
    grad.addColorStop(0, '#100c24');
    grad.addColorStop(0.5, '#291b4d');
    grad.addColorStop(1, '#4f3b78');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 160);

    // Cosmic Mana Rift / Swirl
    ctx.fillStyle = 'rgba(255, 230, 180, 0.4)';
    const riftGlow = Math.sin(tick * 0.08) * 10;
    ctx.beginPath();
    ctx.ellipse(160, 35, 40 + riftGlow, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Classic Gothic Dark Night with Crescent Moon & Stars
  const grad = ctx.createLinearGradient(0, 0, 0, 160);
  grad.addColorStop(0, '#05070c');
  grad.addColorStop(0.6, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 320, 160);

  // Pale Moon
  ctx.fillStyle = '#ffeedd';
  ctx.beginPath();
  ctx.arc(260, 35, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(266, 33, 13, 0, Math.PI * 2);
  ctx.fill();

  // Distant Mountain Silhouettes
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.lineTo(50, 75);
  ctx.lineTo(110, 105);
  ctx.lineTo(180, 65);
  ctx.lineTo(240, 95);
  ctx.lineTo(320, 70);
  ctx.lineTo(320, 160);
  ctx.lineTo(0, 160);
  ctx.fill();
}

// ----------------------------------------------------
// 2. Animated Particles
// ----------------------------------------------------
function drawParticles(ctx, sceneId, particles, tick) {
  const isSnow = sceneId.includes('winter') || sceneId.includes('famine');
  const isEmbers = sceneId.includes('eclipse') || sceneId.includes('flame') || sceneId.includes('birth');

  particles.forEach(p => {
    if (isSnow) {
      p.y += p.speedY * 1.5;
      p.x += Math.sin(tick * 0.04 + p.y * 0.1) * 0.7;
      if (p.y > 160) { p.y = 0; p.x = Math.random() * 320; }
      ctx.fillStyle = `rgba(220, 240, 255, ${p.alpha})`;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    } else if (isEmbers) {
      p.y -= p.speedY * 0.8;
      p.x += (Math.random() - 0.5) * 0.9;
      if (p.y < 0) { p.y = 160; p.x = Math.random() * 320; }
      ctx.fillStyle = `rgba(255, ${Math.floor(80 + Math.random() * 120)}, 40, ${p.alpha})`;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
    } else {
      // Atmospheric dust/mist
      p.y += Math.sin(tick * 0.02 + p.x) * 0.2;
      p.x += 0.3;
      if (p.x > 320) p.x = 0;
      ctx.fillStyle = `rgba(180, 200, 220, 0.25)`;
      ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 1);
    }
  });
}

// ----------------------------------------------------
// 3. Scenery & Structures
// ----------------------------------------------------
function drawScenery(ctx, sceneId, tick) {
  // Ground
  ctx.fillStyle = '#0a0d14';
  ctx.fillRect(0, 120, 320, 40);

  // Cobblestone ground texture
  ctx.fillStyle = '#161c28';
  for (let x = 0; x < 320; x += 16) {
    ctx.fillRect(x + ((x % 32 === 0) ? 0 : 8), 125, 12, 4);
    ctx.fillRect(x + ((x % 32 === 0) ? 6 : 0), 136, 10, 4);
  }

  // Graveyard Crosses & Tombs
  if (sceneId.includes('graveyard') || sceneId.includes('skeleton') || sceneId.includes('dead') || sceneId.includes('funeral')) {
    ctx.fillStyle = '#1c2434';
    // Cross 1
    ctx.fillRect(40, 92, 4, 30);
    ctx.fillRect(34, 100, 16, 4);
    // Tombstone 2
    ctx.fillRect(80, 98, 14, 24);
    // Cross 3
    ctx.fillRect(260, 90, 5, 32);
    ctx.fillRect(253, 99, 19, 4);
    return;
  }

  // Cliff View (Patches Scene)
  if (sceneId.includes('patches') || sceneId.includes('cliff')) {
    // The Cliff Drop
    ctx.fillStyle = '#131824';
    ctx.fillRect(0, 115, 200, 45);
    ctx.fillStyle = '#07090f';
    ctx.fillRect(200, 115, 120, 45); // Abyss deep drop
    // Rainbow glint at abyss bottom
    const glint = Math.sin(tick * 0.15) > 0.3;
    if (glint) {
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(250, 140, 4, 4);
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(258, 145, 3, 3);
    }
    return;
  }

  // Bonfire / Shrine (Firekeeper, Birth, Rest)
  if (sceneId.includes('birth') || sceneId.includes('flame') || sceneId.includes('bonfire')) {
    // Sword in Bonfire
    ctx.fillStyle = '#555';
    ctx.fillRect(160, 95, 2, 28);
    ctx.fillRect(156, 100, 10, 2);
    // Flickering Fire
    const flameH = 12 + Math.floor(Math.sin(tick * 0.3) * 4);
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(161, 118, flameH * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(161, 119, flameH * 0.35, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // Royal Magic Academy / Cathedral Columns
  if (sceneId.includes('school') || sceneId.includes('academy') || sceneId.includes('magic')) {
    ctx.fillStyle = '#192030';
    ctx.fillRect(20, 50, 14, 75);
    ctx.fillRect(14, 46, 26, 6);
    ctx.fillRect(285, 50, 14, 75);
    ctx.fillRect(279, 46, 26, 6);
    // Stained glass window glow
    ctx.fillStyle = 'rgba(100, 180, 255, 0.15)';
    ctx.fillRect(70, 40, 45, 70);
    ctx.fillRect(205, 40, 45, 70);
  }
}

// ----------------------------------------------------
// 4. Foreground Characters & Memes
// ----------------------------------------------------
function drawForegroundActors(ctx, sceneId, tick) {
  const bob = Math.floor(Math.sin(tick * 0.1) * 2);

  // A. Detective Conan & Sleeping Kogoro Meme
  if (sceneId.includes('conan') || sceneId.includes('detective')) {
    // Sleeping Kogoro slumped on stool
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(100, 105 + bob, 14, 18); // Blue suit
    ctx.fillStyle = '#ecc94b';
    ctx.fillRect(103, 98 + bob, 8, 8); // Head slumped
    ctx.fillStyle = '#2d3748';
    ctx.fillRect(105, 104 + bob, 4, 2); // Mustache
    // Zzz bubbles
    ctx.fillStyle = '#fff';
    ctx.font = '8px monospace';
    ctx.fillText('Zzz...', 115, 95 + bob);

    // Conan with red bowtie & glowing glasses
    const conanX = 180;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(conanX, 108, 12, 14); // Suit
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(conanX + 4, 111, 4, 3); // Red Bowtie
    ctx.fillStyle = '#fde047';
    ctx.fillRect(conanX + 2, 98, 8, 10); // Face
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(conanX, 94, 12, 6); // Spiky Hair
    // Glowing White Glasses!
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(conanX + 1, 100, 4, 3);
    ctx.fillRect(conanX + 7, 100, 4, 3);
    ctx.fillRect(conanX + 5, 101, 2, 1);
    return;
  }

  // B. Aqua from KonoSuba crying in trash bin
  if (sceneId.includes('aqua')) {
    const binX = 150;
    // Wooden / Metal Trash Bin
    ctx.fillStyle = '#475569';
    ctx.fillRect(binX, 100, 28, 25);
    ctx.fillStyle = '#334155';
    ctx.fillRect(binX - 2, 98, 32, 4);

    // Aqua peeking out
    ctx.fillStyle = '#38bdf8'; // Blue hair
    ctx.fillRect(binX + 6, 82 + bob, 16, 16);
    ctx.fillStyle = '#fed7aa'; // Face
    ctx.fillRect(binX + 8, 86 + bob, 12, 10);
    // Crying pixel tears flowing
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(binX + 9, 93 + (tick % 6), 2, 4);
    ctx.fillRect(binX + 17, 93 + (tick % 6), 2, 4);
    return;
  }

  // C. Griffith with red Behelit egg
  if (sceneId.includes('behelit') || sceneId.includes('griffith') || sceneId.includes('white_haired')) {
    const gx = 145;
    // Elegant armor
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(gx + 3, 98 + bob, 14, 22);
    // Flowing White Hair
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(gx, 82 + bob, 20, 16);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(gx + 5, 87 + bob, 10, 10); // Face
    // Crimson Behelit Glowing in hand
    const bGlow = (tick % 20 > 10) ? 1 : 0;
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(gx + 18, 103 + bob, 6 + bGlow, 7 + bGlow);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(gx + 19, 105 + bob, 2, 2); // Eye of Behelit
    return;
  }

  // D. Patches the Hyena Kicking on Cliff
  if (sceneId.includes('patches') || sceneId.includes('cliff')) {
    const px = 175;
    // Bald head
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(px + 6, 92, 6, 0, Math.PI * 2);
    ctx.fill();
    // Smirking crouch body
    ctx.fillStyle = '#78350f';
    ctx.fillRect(px, 98, 14, 16);
    // Kicking Foot extending!
    const kickOut = (tick % 40 > 25);
    ctx.fillStyle = '#451a03';
    if (kickOut) {
      ctx.fillRect(px + 14, 105, 14, 5); // Boot kick!
      // Sweat drop
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(px + 30, 95, 2, 4);
    } else {
      ctx.fillRect(px + 4, 112, 6, 6);
    }
    return;
  }

  // E. Skeleton Rave Party (Dancing Skeleton)
  if (sceneId.includes('skeleton') || sceneId.includes('rave')) {
    const sx = 150;
    // Disco Strobe Glow
    const colors = ['#f43f5e', '#a855f7', '#06b6d4', '#10b981', '#fbbf24'];
    const discoColor = colors[Math.floor(tick / 8) % colors.length];
    ctx.fillStyle = discoColor;
    ctx.fillRect(sx - 15, 60, 50, 4);

    // Dancing Skeleton
    const danceStep = (tick % 16 < 8) ? 3 : -3;
    ctx.fillStyle = '#f8fafc';
    // Skull
    ctx.fillRect(sx, 85 + bob, 12, 10);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(sx + 2, 88 + bob, 3, 3); // Eye
    ctx.fillRect(sx + 7, 88 + bob, 3, 3); // Eye
    // Ribcage & Pelvis
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + 3, 96 + bob, 6, 12);
    // Arms up dancing!
    ctx.fillRect(sx - 4, 93 + bob + danceStep, 4, 8);
    ctx.fillRect(sx + 12, 93 + bob - danceStep, 4, 8);
    // Dancing Legs
    ctx.fillRect(sx + 1, 108, 4, 12 + danceStep);
    ctx.fillRect(sx + 7, 108, 4, 12 - danceStep);
    return;
  }

  // F. Tree Sentinel on Heavy Warhorse
  if (sceneId.includes('sentinel') || sceneId.includes('tree_sentinel')) {
    const hx = 130;
    // Massive Golden Horse
    ctx.fillStyle = '#78350f';
    ctx.fillRect(hx, 95, 38, 20); // Body
    ctx.fillRect(hx + 30, 80, 10, 22); // Neck
    ctx.fillRect(hx + 34, 76, 12, 9); // Head
    ctx.fillRect(hx + 4, 115, 6, 12); // Leg
    ctx.fillRect(hx + 28, 115, 6, 12); // Leg

    // Golden Armored Rider & Giant Halberd
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(hx + 14, 68 + bob, 14, 20); // Armor
    ctx.fillRect(hx + 17, 58 + bob, 9, 10); // Golden Helmet with Plume
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(hx + 20, 53 + bob, 5, 5); // Red Feather Plume
    // Golden Halberd
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(hx + 24, 40 + bob, 3, 50); // Shaft
    ctx.fillRect(hx + 20, 36 + bob, 11, 10); // Axe Blade
    return;
  }

  // G. Truck-kun with Glowing Headlights & Wings!
  if (sceneId.includes('truck') || sceneId.includes('transcendence')) {
    const tx = 110;
    // Angelic Golden Wings on Truck!
    const wingFlap = Math.sin(tick * 0.15) * 6;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
    ctx.beginPath();
    ctx.moveTo(tx + 20, 85);
    ctx.lineTo(tx - 15, 55 + wingFlap);
    ctx.lineTo(tx + 25, 75);
    ctx.fill();

    // Truck Body
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(tx, 80, 65, 32); // Cargo
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(tx + 65, 90, 28, 22); // Cabin
    // Windshield
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(tx + 72, 92, 14, 10);

    // Glowing Yellow Headlights beams
    ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
    ctx.beginPath();
    ctx.moveTo(tx + 93, 102);
    ctx.lineTo(320, 85);
    ctx.lineTo(320, 135);
    ctx.fill();

    // Wheels rotating
    const wheelTick = (tick * 0.4) % 4;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(tx + 20, 115, 7, 0, Math.PI * 2);
    ctx.arc(tx + 75, 115, 7, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // H. Beggar / Hobo with Wooden Bowl (สายขอทาน)
  if (sceneId.includes('beggar') || sceneId.includes('bowl')) {
    const bx = 145;
    // Ragged Clothes
    ctx.fillStyle = '#57534e';
    ctx.fillRect(bx, 96 + bob, 18, 24);
    // Face & Bandage
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bx + 4, 86 + bob, 10, 10);
    // Wooden Begging Bowl
    ctx.fillStyle = '#b45309';
    ctx.fillRect(bx + 18, 106 + bob, 12, 6);
    // Shiny gold coin dropping into bowl
    const coinY = (tick * 1.5) % 25;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(bx + 23, 85 + coinY, 3, 3);
    return;
  }

  // I. Default Adventurer / Wanderer by Campfire
  const ax = 135;
  ctx.fillStyle = '#334155';
  ctx.fillRect(ax, 95 + bob, 16, 22); // Cloak
  ctx.fillStyle = '#fed7aa';
  ctx.fillRect(ax + 3, 85 + bob, 10, 10); // Face
  // Sword on Back
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(ax - 2, 78 + bob, 3, 26);
  ctx.fillRect(ax - 5, 84 + bob, 9, 2);
}

// ----------------------------------------------------
// 5. Retro CRT Scanlines & Vignette Filter
// ----------------------------------------------------
function drawScanlinesAndVignette(ctx) {
  // Scanlines
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  for (let y = 0; y < 160; y += 2) {
    ctx.fillRect(0, y, 320, 1);
  }

  // Dark Vignette Edges
  const grad = ctx.createRadialGradient(160, 80, 70, 160, 80, 170);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.65)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 320, 160);
}

// ----------------------------------------------------
// Component Styles
// ----------------------------------------------------
const viewportContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '180px',
  maxHeight: '200px',
  backgroundColor: '#05070c',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '2px solid #3d4a6b',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 6px 18px rgba(0,0,0,0.6)',
  marginBottom: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const canvasStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  imageRendering: 'pixelated'
};

const cornerTopLeft = {
  position: 'absolute',
  top: '4px',
  left: '4px',
  width: '8px',
  height: '8px',
  borderTop: '2px solid #c99738',
  borderLeft: '2px solid #c99738',
  pointerEvents: 'none'
};

const cornerTopRight = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '8px',
  height: '8px',
  borderTop: '2px solid #c99738',
  borderRight: '2px solid #c99738',
  pointerEvents: 'none'
};

const cornerBottomLeft = {
  position: 'absolute',
  bottom: '4px',
  left: '4px',
  width: '8px',
  height: '8px',
  borderBottom: '2px solid #c99738',
  borderLeft: '2px solid #c99738',
  pointerEvents: 'none'
};

const cornerBottomRight = {
  position: 'absolute',
  bottom: '4px',
  right: '4px',
  width: '8px',
  height: '8px',
  borderBottom: '2px solid #c99738',
  borderRight: '2px solid #c99738',
  pointerEvents: 'none'
};
