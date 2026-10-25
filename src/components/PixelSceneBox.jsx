import React, { useRef, useEffect } from 'react';
import { getTaxonomyCategory } from '../data/lifeCrisesEngine';

export default function PixelSceneBox({
  age = 0,
  realmName = 'นครหลวงทองคำ',
  character,
  parentMotherAge = 26,
  parentFatherAge = 31
}) {
  const canvasRef = useRef(null);
  const taxonomy = getTaxonomyCategory(character?.race);
  const raceId = character?.race?.id || '';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let tick = 0;

    // Twinkling Pixel Stars
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.floor(Math.random() * 400),
      y: Math.floor(Math.random() * 110),
      size: Math.random() > 0.8 ? 2 : 1,
      speed: 0.03 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2
    }));

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Dark Night Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
      skyGrad.addColorStop(0, '#090d16');
      skyGrad.addColorStop(0.7, '#141d2e');
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Pixel Stars Twinkle
      stars.forEach(s => {
        const alpha = 0.3 + 0.7 * Math.sin(tick * s.speed + s.phase);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });

      // 3. Pixel Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(340, 35, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(334, 32, 12, 0, Math.PI * 2);
      ctx.fill();

      // 4. Distant Silhouettes (Castles & Town Towers)
      ctx.fillStyle = '#0b111e';
      ctx.fillRect(40, 50, 45, 90);
      ctx.fillRect(110, 70, 55, 70);
      ctx.fillRect(260, 45, 50, 95);
      ctx.fillRect(320, 65, 60, 75);

      // Glowing Windows in Buildings
      ctx.fillStyle = '#fde047';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          if ((r + c + (tick >> 6)) % 3 !== 0) {
            ctx.fillRect(48 + c * 18, 60 + r * 18, 8, 10);
            ctx.fillRect(268 + c * 20, 55 + r * 18, 8, 10);
          }
        }
      }

      // 5. Ground Street / Cobblestone Path
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 140, canvas.width, 40);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 140, canvas.width, 3);

      // Street markings / fence posts
      ctx.fillStyle = '#334155';
      for (let i = 0; i < canvas.width; i += 16) {
        ctx.fillRect(i, 130, 4, 12);
      }
      ctx.fillRect(0, 132, canvas.width, 2);

      // Center position
      const cx = 190;
      const cy = 138;

      // ==========================================
      // 6. SPECIES-ACCURATE PIXEL CHARACTER ART
      // ==========================================

      if (taxonomy === 'object') {
        // A. VENDING MACHINE (ตู้กดน้ำอัตโนมัติหยอดเหรียญ)
        if (raceId === 'vending_machine' || raceId.includes('vending') || character?.race?.name?.includes('ตู้กดน้ำ')) {
          // Streetlamp on the left casting light
          ctx.fillStyle = '#475569';
          ctx.fillRect(cx - 50, cy - 65, 4, 65);
          ctx.fillRect(cx - 54, cy - 68, 12, 4);
          ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
          ctx.beginPath();
          ctx.moveTo(cx - 48, cy - 64);
          ctx.lineTo(cx - 75, cy);
          ctx.lineTo(cx + 40, cy);
          ctx.closePath();
          ctx.fill();

          // Vending Machine Main Chassis
          ctx.fillStyle = '#dc2626'; // Vibrant Red Body
          ctx.fillRect(cx - 16, cy - 48, 32, 48);
          ctx.fillStyle = '#991b1b'; // Shadow border
          ctx.strokeRect(cx - 16, cy - 48, 32, 48);

          // Glass Display Window
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(cx - 12, cy - 44, 24, 22);

          // Cans inside display
          const canColors = ['#60a5fa', '#4ade80', '#fbbf24', '#f43f5e'];
          for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
              ctx.fillStyle = canColors[(col + row) % canColors.length];
              ctx.fillRect(cx - 10 + col * 7, cy - 42 + row * 10, 5, 8);
            }
          }

          // LED Price Sign (flashing digital)
          ctx.fillStyle = tick % 40 > 20 ? '#fef08a' : '#22c55e';
          ctx.fillRect(cx - 12, cy - 18, 14, 5);

          // Coin slot & button panel
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(cx + 4, cy - 18, 8, 8);
          ctx.fillStyle = '#ffd166';
          ctx.fillRect(cx + 6, cy - 16, 4, 1); // coin slot

          // Dispenser Door at bottom
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cx - 10, cy - 8, 20, 6);

          // Glowing Aura around the legendary machine
          ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
          ctx.fillRect(cx - 18, cy - 50, 36, 52);
        }
        // B. SENTIENT SWORD (ดาบมีชีวิตปักบนแท่นศิลา)
        else if (raceId === 'sentient_sword' || character?.race?.name?.includes('ดาบ')) {
          // Stone Pedestal
          ctx.fillStyle = '#475569';
          ctx.fillRect(cx - 20, cy - 12, 40, 12);
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - 16, cy - 16, 32, 4);

          // Sword Blade embedded in stone
          ctx.fillStyle = '#e2e8f0'; // Silver blade
          ctx.fillRect(cx - 2, cy - 50, 4, 34);
          ctx.fillStyle = '#38bdf8'; // Blue glowing runes on blade
          ctx.fillRect(cx - 1, cy - 42, 2, 18);

          // Crossguard & Hilt
          ctx.fillStyle = '#d97706'; // Gold guard
          ctx.fillRect(cx - 9, cy - 52, 18, 3);
          ctx.fillStyle = '#78350f'; // Grip
          ctx.fillRect(cx - 2, cy - 60, 4, 8);
          ctx.fillStyle = '#ef4444'; // Red gem pommel
          ctx.fillRect(cx - 3, cy - 63, 6, 3);

          // Floating magic particles
          for (let p = 0; p < 4; p++) {
            const py = cy - 20 - ((tick * 1.2 + p * 15) % 45);
            const px = cx + Math.sin(tick * 0.08 + p) * 12;
            ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.fillRect(px, py, 2, 2);
          }
        }
        // C. MIMIC CHEST (หีบมิมิก)
        else if (raceId === 'mimic_chest' || character?.race?.name?.includes('มิมิก')) {
          // Wooden chest body
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx - 16, cy - 22, 32, 22);
          // Gold borders
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 16, cy - 22, 32, 22);

          // Peeking Glowing Eyes
          ctx.fillStyle = '#fde047';
          ctx.fillRect(cx - 8, cy - 16, 4, 4);
          ctx.fillRect(cx + 4, cy - 16, 4, 4);
          ctx.fillStyle = '#000';
          ctx.fillRect(cx - 6, cy - 15, 2, 2);
          ctx.fillRect(cx + 6, cy - 15, 2, 2);

          // Purple Tongue peeking out
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(cx - 3, cy - 8, 6, 8 + Math.sin(tick * 0.1) * 3);
        }
        // D. OTHER OBJECT / RELIC
        else {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(cx - 16, cy - 10, 32, 10);
          ctx.fillStyle = '#a855f7';
          ctx.beginPath();
          ctx.arc(cx, cy - 24 + Math.sin(tick * 0.08) * 3, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      else if (taxonomy === 'monster') {
        // SLIME or GOBLIN (สไลม์เด้งดึ๋ง)
        const bounce = Math.abs(Math.sin(tick * 0.08)) * 5;
        const squish = Math.cos(tick * 0.08) * 2;

        ctx.fillStyle = '#10b981'; // Green Jelly Slime
        ctx.beginPath();
        ctx.ellipse(cx, cy - 14 - bounce, 16 + squish, 14 - squish, 0, 0, Math.PI * 2);
        ctx.fill();

        // Big Shiny Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 7, cy - 18 - bounce, 5, 5);
        ctx.fillRect(cx + 2, cy - 18 - bounce, 5, 5);
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(cx - 5, cy - 17 - bounce, 3, 3);
        ctx.fillRect(cx + 4, cy - 17 - bounce, 3, 3);

        // Cute blush
        ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.fillRect(cx - 9, cy - 12 - bounce, 3, 2);
        ctx.fillRect(cx + 6, cy - 12 - bounce, 3, 2);
      }
      else if (taxonomy === 'undead') {
        // SKELETON (โครงกระดูกใต้จันทร์เพ็ญ)
        ctx.fillStyle = '#e2e8f0'; // Bone white
        // Skull
        ctx.fillRect(cx - 6, cy - 36, 12, 12);
        // Eye sockets
        ctx.fillStyle = '#38bdf8'; // Cyan glowing magic soul
        ctx.fillRect(cx - 4, cy - 32, 3, 3);
        ctx.fillRect(cx + 1, cy - 32, 3, 3);
        // Spine & Ribs
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx - 1, cy - 24, 2, 14);
        ctx.fillRect(cx - 6, cy - 22, 12, 2);
        ctx.fillRect(cx - 5, cy - 18, 10, 2);
        // Legs
        ctx.fillRect(cx - 5, cy - 10, 2, 10);
        ctx.fillRect(cx + 3, cy - 10, 2, 10);
        // Shield
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 15, cy - 25, 6, 14);
      }
      else if (taxonomy === 'beast') {
        // CAPYBARA in Hot Spring (คาปิบาร่าแช่น้ำร้อน)
        // Hot spring stone pool
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 30, cy - 10, 60, 10);
        // Warm Steaming Water
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx - 26, cy - 12, 52, 6);

        // Capybara Body
        ctx.fillStyle = '#92400e'; // Brown Fur
        ctx.fillRect(cx - 12, cy - 22, 24, 14);
        // Head
        ctx.fillRect(cx - 6, cy - 28, 14, 10);
        // Snout
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx + 4, cy - 24, 4, 5);
        // Chill closed eyes
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 1, cy - 25, 4, 1);

        // Yellow Yuzu Fruit on head!
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(cx + 1, cy - 31, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Rising Steam Particles
        for (let s = 0; s < 3; s++) {
          const sy = cy - 16 - ((tick * 0.8 + s * 20) % 35);
          const sx = cx - 15 + s * 15 + Math.sin(tick * 0.05 + s) * 4;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillRect(sx, sy, 2, 4);
        }
      }
      else {
        // HUMANOID: Father, Mother, and Child holding hands
        // Father (Left Adult)
        ctx.fillStyle = '#3b82f6'; // Blue Shirt
        ctx.fillRect(cx - 30, cy - 28, 12, 16);
        ctx.fillStyle = '#1e293b'; // Pants
        ctx.fillRect(cx - 30, cy - 12, 12, 12);
        ctx.fillStyle = '#fed7aa'; // Skin
        ctx.fillRect(cx - 28, cy - 38, 8, 10);
        ctx.fillStyle = '#78350f'; // Hair
        ctx.fillRect(cx - 29, cy - 40, 10, 5);

        // Mother (Right Adult)
        ctx.fillStyle = '#ec4899'; // Pink/Purple Dress
        ctx.fillRect(cx + 8, cy - 26, 12, 18);
        ctx.fillStyle = '#fed7aa'; // Skin
        ctx.fillRect(cx + 10, cy - 36, 8, 10);
        ctx.fillStyle = '#451a03'; // Long Hair
        ctx.fillRect(cx + 8, cy - 38, 12, 6);
        ctx.fillRect(cx + 7, cy - 32, 3, 14);
        ctx.fillRect(cx + 18, cy - 32, 3, 14);

        // Child / Creature in the Middle
        if (age <= 3) {
          ctx.fillStyle = '#38bdf8'; // Baby Onesie
          ctx.fillRect(cx - 8, cy - 16, 8, 10);
          ctx.fillStyle = '#fef08a'; // Baby Face / Glow
          ctx.fillRect(cx - 7, cy - 22, 6, 6);
          // Small floating pink balloon
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(cx + 25, cy - 28 + Math.sin(tick * 0.05) * 3, 5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#10b981'; // Green clothes
          ctx.fillRect(cx - 8, cy - 20, 9, 12);
          ctx.fillStyle = '#fed7aa'; // Skin
          ctx.fillRect(cx - 7, cy - 27, 7, 7);
          ctx.fillStyle = '#b45309'; // Hair
          ctx.fillRect(cx - 8, cy - 29, 9, 4);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [age, taxonomy, raceId]);

  const currentMomAge = parentMotherAge + age;
  const currentDadAge = parentFatherAge + age;

  return (
    <div style={{
      backgroundColor: '#0c1017',
      borderRadius: '10px',
      border: '1px solid #1e293b',
      overflow: 'hidden',
      marginBottom: '14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
    }}>
      {/* 16:9 Canvas Viewport */}
      <div style={{ width: '100%', height: '170px', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
        />
      </div>

      {/* Location and Demographic Footer Bar (Tailored to taxonomy) */}
      <div style={{
        padding: '10px 14px',
        backgroundColor: '#080c14',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px',
        fontSize: '12px'
      }}>
        {taxonomy === 'object' ? (
          <>
            <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>
              📍 {realmName} • แท่นติดตั้งจักรกล/ศัสตราวุธ
            </div>
            <div style={{ color: '#94a3b8' }}>
              อายุการทำงาน {age} ปี • คอร์เวทมนตร์: ทำงานปกติ 100%
            </div>
          </>
        ) : taxonomy === 'undead' ? (
          <>
            <div style={{ color: '#a855f7', fontWeight: 'bold' }}>
              📍 {realmName} • สุสานโบราณใต้ดิน
            </div>
            <div style={{ color: '#94a3b8' }}>
              อายุวิญญาณคืนชีพ {age} ปี • ไอวิญญาณมืดลุกโชน
            </div>
          </>
        ) : taxonomy === 'monster' ? (
          <>
            <div style={{ color: '#4ade80', fontWeight: 'bold' }}>
              📍 {realmName} • รังมอนสเตอร์ใต้ดันเจี้ยน
            </div>
            <div style={{ color: '#94a3b8' }}>
              อายุ {age} ปี • สัญชาตญาณสัตว์ร้ายเฉียบแหลม
            </div>
          </>
        ) : taxonomy === 'beast' ? (
          <>
            <div style={{ color: '#fb923c', fontWeight: 'bold' }}>
              📍 {realmName} • ถิ่นอาศัยธรรมชาติ / บ่อน้ำแร่
            </div>
            <div style={{ color: '#94a3b8' }}>
              อายุ {age} ปี • ผ่อนคลายร่วมกับฝูง
            </div>
          </>
        ) : (
          <>
            <div style={{ color: '#f8fafc', fontWeight: 'bold' }}>
              📍 {realmName} • ที่พักอาศัย • ครอบครัว
            </div>
            <div style={{ color: '#94a3b8' }}>
              คุณ อายุ {age} ปี • แม่ อายุ {currentMomAge} ปี • พ่อ อายุ {currentDadAge} ปี
            </div>
          </>
        )}
      </div>
    </div>
  );
}
