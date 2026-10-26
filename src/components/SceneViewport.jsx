import React, { useRef, useEffect, useState } from 'react';
import { SCENE_IMAGE_MAP, SCENE_THEMES } from '../data/sceneThemesData.js';
export { SCENE_IMAGE_MAP, SCENE_THEMES };

// วาดสไปรต์ตัวละครพิกเซลแบบขยับได้ (เดิน, หายใจ, กะพริบตา, แสดงอาวุธ และเปลี่ยนวัยตามอายุจริง)
export function drawLivingCharacterSprite(ctx, {
  x,
  y,
  tick,
  age = 18,
  raceId = 'human',
  bodyType = 'humanoid',
  facing = 1,
  isWalking = true,
  hasWeapon = false,
  weaponId = '',
  scale = 1,
  emote = ''
}) {
  ctx.save();
  ctx.translate(Math.floor(x), Math.floor(y));
  if (facing < 0) {
    ctx.scale(-scale, scale);
  } else {
    ctx.scale(scale, scale);
  }

  const walkCycle = isWalking ? Math.sin(tick * 0.16) : 0;
  const bob = Math.floor(Math.abs(Math.sin(tick * 0.12)) * 2);
  const legSwing = Math.floor(walkCycle * 3.5);
  const isBlinking = (tick % 130) < 6;
  const rId = (raceId || 'human').toLowerCase();
  const bType = (bodyType || 'humanoid').toLowerCase();

  // 1. SLIME (สไลม์เด้งดึ๋ง ยืดหยุ่นตามจังหวะกระโดด)
  if (rId === 'slime' || bType === 'slime') {
    const jumpY = Math.floor(Math.abs(Math.sin(tick * 0.11)) * 7);
    const squishX = Math.floor(Math.cos(tick * 0.11) * 2.5);
    const sizeMod = age <= 4 ? 0.78 : age >= 18 ? 1.08 : 0.92;

    // เงาบนพื้น
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, -1, (14 - jumpY * 0.5) * sizeMod, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // ลำตัวเจลลี่
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.ellipse(0, (-12 - jumpY) * sizeMod, (14 + squishX) * sizeMod, (11 - squishX * 0.6) * sizeMod, 0, 0, Math.PI * 2);
    ctx.fill();

    // ไฮไลต์ความใส
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(-7 * sizeMod, (-18 - jumpY) * sizeMod, 5 * sizeMod, 3 * sizeMod);

    // ตาแป๋ว
    ctx.fillStyle = '#ffffff';
    if (!isBlinking) {
      ctx.fillRect(-6 * sizeMod, (-13 - jumpY) * sizeMod, 4 * sizeMod, 4 * sizeMod);
      ctx.fillRect(2 * sizeMod, (-13 - jumpY) * sizeMod, 4 * sizeMod, 4 * sizeMod);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4 * sizeMod, (-12 - jumpY) * sizeMod, 2 * sizeMod, 2 * sizeMod);
      ctx.fillRect(4 * sizeMod, (-12 - jumpY) * sizeMod, 2 * sizeMod, 2 * sizeMod);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6 * sizeMod, (-11 - jumpY) * sizeMod, 4 * sizeMod, 1.5);
      ctx.fillRect(2 * sizeMod, (-11 - jumpY) * sizeMod, 4 * sizeMod, 1.5);
    }

    // มงกุฎราชาสไลม์เมื่อเป็นผู้ใหญ่
    if (age >= 18) {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-5, (-25 - jumpY) * sizeMod, 10, 4);
      ctx.fillRect(-5, (-28 - jumpY) * sizeMod, 2, 3);
      ctx.fillRect(-1, (-29 - jumpY) * sizeMod, 2, 4);
      ctx.fillRect(3, (-28 - jumpY) * sizeMod, 2, 3);
    }
    ctx.restore();
    return;
  }

  // 2. SKELETON (อัศวินโครงกระดูกเดินได้)
  if (rId === 'skeleton' || bType === 'skeleton' || bType === 'undead') {
    // ขากระดูกก้าวเดิน
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-4 + legSwing * 0.5, -10, 2, 10);
    ctx.fillRect(2 - legSwing * 0.5, -10, 2, 10);
    // ซี่โครงและกระดูกสันหลัง
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-1, -23 - bob, 2, 13);
    ctx.fillRect(-6, -22 - bob, 12, 2);
    ctx.fillRect(-5, -18 - bob, 10, 2);
    ctx.fillRect(-4, -14 - bob, 8, 2);
    // ผ้าคลุมไหล่ขาดวิ่น
    ctx.fillStyle = '#334155';
    ctx.fillRect(-7, -23 - bob, 4, 12);
    // กะโหลก
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -34 - bob, 12, 10);
    ctx.fillRect(-4, -24 - bob + (tick % 30 < 10 ? 1 : 0), 8, 2); // ขากรรไกรขยับ
    // ดวงตาไฟวิญญาณสีฟ้า
    ctx.fillStyle = isBlinking ? '#0284c7' : '#38bdf8';
    ctx.fillRect(-4, -30 - bob, 3, 3);
    ctx.fillRect(2, -30 - bob, 3, 3);
    // ดาบและโล่
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-11, -22 - bob, 5, 11);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(8, -28 - bob + legSwing * 0.4, 2, 14);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(6, -16 - bob + legSwing * 0.4, 6, 2);
    ctx.restore();
    return;
  }

  // 3. CAPYBARA (คาปิบาร่าส้มยูสุบนหัว)
  if (rId === 'capybara' || bType === 'beast') {
    const stepY = Math.abs(Math.floor(walkCycle * 1.5));
    // ขาสี่ขาขยับเดิน
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-10 + legSwing * 0.5, -6, 3, 6);
    ctx.fillRect(-4 - legSwing * 0.5, -6, 3, 6);
    ctx.fillRect(3 + legSwing * 0.5, -6, 3, 6);
    ctx.fillRect(8 - legSwing * 0.5, -6, 3, 6);
    // ลำตัวอวบอ้วน
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-12, -18 - stepY, 22, 13);
    // หัวทรงเหลี่ยมสุดชิล
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, -24 - stepY, 13, 11);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(13, -21 - stepY, 5, 6); // จมูก
    ctx.fillRect(5, -26 - stepY, 3, 3); // หู
    // ตาหลับพริ้ม
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, -20 - stepY, 4, 1.5);
    // ส้มยูสุสีเหลืองสดบนหัว!
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(10, -27 - stepY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(10, -31 - stepY, 2, 2);
    // นกขาวตัวจิ๋วเกาะหลัง
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-6, -23 - stepY - bob, 5, 5);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-1, -21 - stepY - bob, 2, 1.5);
    ctx.restore();
    return;
  }

  // 4. SPY PIGEON (นกพิราบสายลับ)
  if (rId === 'spy_pigeon' || bType === 'bird') {
    const flap = Math.sin(tick * 0.25) * 4;
    const headBob = Math.floor(Math.sin(tick * 0.2) * 2);
    // ขาและกระบอกสารลับสีแดง
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-2 + legSwing * 0.4, -6, 1.5, 6);
    ctx.fillRect(2 - legSwing * 0.4, -6, 1.5, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(3 - legSwing * 0.4, -4, 3, 2); // ม้วนสารลับ
    // ลำตัวนกพิราบ
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-7, -15 - bob, 13, 9);
    // ปีกขยับ
    ctx.fillStyle = '#475569';
    ctx.fillRect(-5, -14 - bob + flap * 0.5, 8, 5);
    // คอสีเขียวมรกตและหัว
    ctx.fillStyle = '#10b981';
    ctx.fillRect(3 + headBob, -18 - bob, 5, 4);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2 + headBob, -23 - bob, 6, 6);
    // ตาและจะงอยปาก
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5 + headBob, -21 - bob, 2, 2);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(8 + headBob, -20 - bob, 3, 2);
    // หมวกสายลับจิ๋ว
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1 + headBob, -25 - bob, 8, 2);
    ctx.fillRect(3 + headBob, -28 - bob, 4, 3);
    ctx.restore();
    return;
  }

  // 5. VENDING MACHINE (ตู้กดน้ำอัตโนมัติหลุดมิติ)
  if (rId === 'vending_machine') {
    const hum = tick % 20 < 10 ? 1 : 0;
    // ล้อเวทมนตร์ด้านล่าง
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-12, -4, 6, 4);
    ctx.fillRect(6, -4, 6, 4);
    // ตัวถังสีแดงสด
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-14, -42 - hum, 28, 38);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(-14, -42 - hum, 28, 3);
    // ตู้กระจกโชว์กระป๋องน้ำ
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(-11, -37 - hum, 22, 18);
    const canCols = ['#4ade80', '#facc15', '#f43f5e', '#38bdf8'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = canCols[(r + c + Math.floor(tick / 25)) % canCols.length];
        ctx.fillRect(-9 + c * 7, -35 + r * 8 - hum, 4, 6);
      }
    }
    // ป้ายไฟ LED วิ่ง
    ctx.fillStyle = tick % 30 < 15 ? '#fde047' : '#22c55e';
    ctx.fillRect(-10, -16 - hum, 12, 4);
    // ช่องหยอดเหรียญและช่องรับของ
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(5, -16 - hum, 5, 5);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-9, -9 - hum, 18, 4);
    ctx.restore();
    return;
  }

  // 6. SENTIENT SWORD (ดาบมารพูดได้ลอยตัว)
  if (rId === 'sentient_sword' || bType === 'sword') {
    const hoverY = Math.sin(tick * 0.1) * 5;
    // เงาวงเวทบนพื้น
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, -2, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // ใบดาบเงินเรืองแสง
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-2, -38 + hoverY, 4, 28);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-1, -34 + hoverY, 2, 20);
    // โกร่งดาบสีทองและดวงตาวิญญาณ
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-8, -40 + hoverY, 16, 3);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-2, -40 + hoverY, 4, 3); // ดวงตาบนโกร่งดาบ
    // ด้ามจับ
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-1.5, -48 + hoverY, 3, 8);
    ctx.restore();
    return;
  }

  // 7. MIMIC CHEST (หีบสมบัติมิมิก)
  if (rId === 'mimic_chest' || bType === 'mimic') {
    const hop = Math.abs(Math.floor(Math.sin(tick * 0.12) * 5));
    const mouthOpen = Math.abs(Math.sin(tick * 0.12)) > 0.5 ? 4 : 1;
    // ฐานกล่อง
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-13, -16 - hop, 26, 16);
    // ฝากล่องขยับอ้าปาก
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-13, -24 - hop - mouthOpen, 26, 8);
    // ขอบทอง
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-13, -17 - hop, 26, 2);
    ctx.fillRect(-13, -24 - hop - mouthOpen, 26, 2);
    // ฟันซี่แหลมและลิ้นสีม่วง
    ctx.fillStyle = '#f8fafc';
    for (let t = -10; t <= 8; t += 5) {
      ctx.fillRect(t, -17 - hop - mouthOpen, 3, 3);
    }
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-3, -15 - hop, 6, 6 + mouthOpen);
    // ดวงตาสีเหลืองวาวโรจน์
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-7, -21 - hop - mouthOpen, 4, 3);
    ctx.fillRect(3, -21 - hop - mouthOpen, 4, 3);
    ctx.restore();
    return;
  }

  // 8. TRUCK-KUN (รถบรรทุกฮีโน่ส่งวิญญาณข้ามมิติ)
  if (rId === 'truck_calamity' || bType === 'truck') {
    const rumble = tick % 6 < 3 ? 1 : 0;
    // ลำแสงไฟหน้ารถส่องสว่าง
    ctx.fillStyle = 'rgba(253, 224, 71, 0.28)';
    ctx.beginPath();
    ctx.moveTo(22, -14 - rumble);
    ctx.lineTo(62, -26);
    ctx.lineTo(62, -2);
    ctx.closePath();
    ctx.fill();
    // ตู้คอนเทนเนอร์ด้านหลัง
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-26, -32 - rumble, 32, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-24, -22 - rumble, 28, 3);
    // หัวรถด้านหน้า
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(6, -26 - rumble, 16, 18);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(12, -24 - rumble, 9, 8); // กระจกหน้า
    // ไฟหน้าสีเหลืองทอง
    ctx.fillStyle = '#fde047';
    ctx.fillRect(20, -13 - rumble, 3, 4);
    // ปีกนางฟ้าสีทองขยับพึ่บพั่บ
    const wingY = Math.sin(tick * 0.2) * 3;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-14, -39 - rumble + wingY, 12, 6);
    // ล้อหมุน
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-14, -6, 5, 0, Math.PI * 2);
    ctx.arc(12, -6, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-15, -7 + (tick % 3), 2, 2);
    ctx.fillRect(11, -7 + (tick % 3), 2, 2);
    ctx.restore();
    return;
  }

  // 9. HUMANOID (มนุษย์, เอลฟ์, ออร์ค, ปีศาจ, นักรบตราประทับ — เติบโตตามช่วงอายุ!)
  // วัยทารก 0-2 ปี
  if (age <= 2) {
    ctx.fillStyle = '#38bdf8'; // ผ้าห่อตัวทารก
    ctx.fillRect(-5, -13 - bob, 10, 11);
    ctx.fillStyle = rId === 'orc' ? '#4ade80' : rId === 'demon' ? '#c4b5fd' : '#fed7aa';
    ctx.fillRect(-4, -20 - bob, 8, 7);
    ctx.fillStyle = '#0f172a';
    if (!isBlinking) {
      ctx.fillRect(-2, -18 - bob, 1.5, 2);
      ctx.fillRect(1.5, -18 - bob, 1.5, 2);
    }
    ctx.restore();
    return;
  }

  // สัดส่วนตามวัย (เด็ก 3-11, วัยรุ่น 12-17, ผู้ใหญ่ 18-49, อาวุโส 50+)
  const hScale = age <= 11 ? 0.72 : age <= 17 ? 0.88 : 1.0;
  ctx.scale(hScale, hScale);

  const skinColor = rId === 'orc' ? '#22c55e' : rId === 'demon' ? '#ddd6fe' : '#fed7aa';
  const tunicColor =
    rId === 'elf' ? '#059669' :
    rId === 'orc' ? '#b91c1c' :
    rId === 'demon' ? '#6d28d9' :
    rId === 'branded_one' ? '#1e293b' : '#2563eb';
  const hairColor =
    age >= 50 ? '#e2e8f0' :
    rId === 'elf' ? '#fde047' :
    rId === 'demon' ? '#1e1b4b' :
    rId === 'orc' ? '#0f172a' :
    rId === 'branded_one' ? '#090d16' : '#78350f';

  // ผ้าคลุมด้านหลัง (สำหรับผู้ใหญ่ / นักรบตราประทับ / ปีศาจ)
  if (age >= 12 || rId === 'branded_one' || rId === 'demon') {
    const capeWave = Math.sin(tick * 0.15) * 2;
    ctx.fillStyle = rId === 'branded_one' ? '#0f172a' : rId === 'demon' ? '#4c1d95' : '#1e3a8a';
    ctx.fillRect(-8 - capeWave * 0.5, -26 - bob, 6, 18);
  }

  // ปีกค้างคาวของเผ่าปีศาจ
  if (rId === 'demon') {
    const wingFlap = Math.sin(tick * 0.18) * 3;
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-13, -28 - bob + wingFlap, 7, 9);
  }

  // ขาสองข้างก้าวเดิน
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-4 + legSwing * 0.5, -11, 3.5, 11);
  ctx.fillRect(1 - legSwing * 0.5, -11, 3.5, 11);

  // ลำตัว / เสื้อเกราะ
  ctx.fillStyle = tunicColor;
  ctx.fillRect(-6, -26 - bob, 12, 15);
  // เข็มขัดทอง
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-6, -15 - bob, 12, 2);

  // ศีรษะและใบหน้า
  ctx.fillStyle = skinColor;
  ctx.fillRect(-5, -36 - bob, 10, 10);

  // หูแหลมเอลฟ์ / เขี้ยวออร์ค / เขาปีศาจ
  if (rId === 'elf') {
    ctx.fillStyle = skinColor;
    ctx.fillRect(-8, -33 - bob, 3, 2);
    ctx.fillRect(5, -33 - bob, 3, 2);
  } else if (rId === 'orc') {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-3, -28 - bob, 2, 2);
    ctx.fillRect(2, -28 - bob, 2, 2);
  } else if (rId === 'demon') {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-5, -41 - bob, 2, 5);
    ctx.fillRect(3, -41 - bob, 2, 5);
  }

  // ทรงผม
  ctx.fillStyle = hairColor;
  ctx.fillRect(-6, -39 - bob, 12, 4);
  ctx.fillRect(-6, -36 - bob, 2, 5);

  // ดวงตากะพริบได้
  ctx.fillStyle = rId === 'demon' || rId === 'branded_one' ? '#ef4444' : '#0f172a';
  if (!isBlinking) {
    ctx.fillRect(-2, -33 - bob, 2, 2.5);
    ctx.fillRect(2, -33 - bob, 2, 2.5);
  } else {
    ctx.fillRect(-2, -32 - bob, 2, 1);
    ctx.fillRect(2, -32 - bob, 2, 1);
  }

  // หนวดเคราและไม้เท้าเมื่อเข้าสู่วัยชรา (50+ ปี)
  if (age >= 50) {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-3, -28 - bob, 6, 5);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(8, -30 - bob, 2, 30);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(7, -33 - bob, 4, 3);
  } else if (hasWeapon || age >= 12) {
    // อาวุธคู่กายในมือขวา (แกว่งตามจังหวะเดิน)
    const armY = -22 - bob + legSwing * 0.4;
    if (weaponId === 'rubber_chicken') {
      ctx.fillStyle = '#facc15';
      ctx.fillRect(7, armY - 6, 4, 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(8, armY - 8, 2, 2);
    } else if (rId === 'branded_one' || weaponId === 'dragonslayer_slab') {
      // ดาบเหล็กยักษ์ผ่ามังกร
      ctx.fillStyle = '#475569';
      ctx.fillRect(7, armY - 18, 5, 24);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(11, armY - 18, 1, 24);
    } else {
      // ดาบอัศวินมาตรฐาน
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(8, armY - 12, 2.5, 15);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(6, armY + 1, 6, 2);
    }
  }

  ctx.restore();
}

// วาดฉากหลังและสภาพแวดล้อมแบบเคลื่อนไหวตาม Biome (ใช้ร่วมกันทั้ง SceneViewport และ PixelSceneIllustrator)
export function renderAnimatedBiomeScene(ctx, {
  width,
  height,
  tick,
  sceneId = 'alley',
  age = 18,
  character = null,
  spouse = null,
  children = [],
  weapon = null,
  emoteText = '',
  showActors = true
}) {
  const theme = SCENE_THEMES[sceneId] || SCENE_THEMES.alley;
  const biome = theme.biome || 'town_alley';
  const groundY = Math.floor(height * 0.78);

  // 1. ท้องฟ้าและบรรยากาศตาม Biome
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  if (biome === 'eclipse') {
    skyGrad.addColorStop(0, '#1a0208');
    skyGrad.addColorStop(0.55, '#450a14');
    skyGrad.addColorStop(1, '#7f1d1d');
  } else if (biome === 'battlefield' || biome === 'explosion') {
    skyGrad.addColorStop(0, '#18071c');
    skyGrad.addColorStop(0.55, '#3b0f2b');
    skyGrad.addColorStop(1, '#7c2d12');
  } else if (biome === 'hotspring' || biome === 'forest') {
    skyGrad.addColorStop(0, '#04131d');
    skyGrad.addColorStop(0.55, '#0c2d3a');
    skyGrad.addColorStop(1, '#134e4a');
  } else if (biome === 'market' || biome === 'tavern' || biome === 'ramen') {
    skyGrad.addColorStop(0, '#090d1c');
    skyGrad.addColorStop(0.55, '#1e1b4b');
    skyGrad.addColorStop(1, '#312e81');
  } else {
    skyGrad.addColorStop(0, '#050811');
    skyGrad.addColorStop(0.6, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, groundY);

  // 2. ดวงดาวกะพริบและเมฆลอยช้าๆ
  for (let s = 0; s < 28; s++) {
    const sx = (s * 43) % width;
    const sy = (s * 17) % Math.floor(groundY * 0.55);
    const alpha = 0.25 + 0.65 * Math.abs(Math.sin(tick * 0.03 + s));
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
    ctx.fillRect(sx, sy, s % 4 === 0 ? 2 : 1.5, s % 4 === 0 ? 2 : 1.5);
  }

  // ดวงจันทร์ / สุริยุปราคาสีเลือด
  const moonX = Math.floor(width * 0.84);
  const moonY = Math.floor(height * 0.2);
  if (biome === 'eclipse') {
    const pulse = Math.sin(tick * 0.08) * 3;
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 22 + pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#050204';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(moonX, moonY, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = skyGrad;
    ctx.beginPath();
    ctx.arc(moonX - 5, moonY - 3, 11, 0, Math.PI * 2);
    ctx.fill();
  }

  // เมฆพิกเซลเคลื่อนที่ช้าๆ
  ctx.fillStyle = 'rgba(148, 163, 184, 0.12)';
  for (let c = 0; c < 3; c++) {
    const cx = ((tick * (0.25 + c * 0.08) + c * 160) % (width + 90)) - 45;
    const cy = 22 + c * 18;
    ctx.fillRect(Math.floor(cx), cy, 46, 8);
    ctx.fillRect(Math.floor(cx) + 8, cy - 5, 28, 5);
  }

  // 3. ทิวเขาชั้นไกล (Parallax Silhouette)
  ctx.fillStyle = biome === 'eclipse' ? '#28050c' : '#09101f';
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(0, groundY - 35);
  ctx.lineTo(width * 0.2, groundY - 68);
  ctx.lineTo(width * 0.42, groundY - 32);
  ctx.lineTo(width * 0.68, groundY - 74);
  ctx.lineTo(width * 0.88, groundY - 38);
  ctx.lineTo(width, groundY - 58);
  ctx.lineTo(width, groundY);
  ctx.closePath();
  ctx.fill();

  // 4. สิ่งปลูกสร้างและฉากกลางตาม Biome
  if (biome === 'winter_village') {
    // ป่าสนเอนไหวตามลม + กระท่อมไม้มีควันลอยจากปล่องไฟ
    const sway = Math.sin(tick * 0.05) * 2;
    for (let t = 0; t < 6; t++) {
      const tx = 24 + t * 72;
      ctx.fillStyle = '#0f2922';
      ctx.beginPath();
      ctx.moveTo(tx + sway, groundY - 46);
      ctx.lineTo(tx - 14, groundY);
      ctx.lineTo(tx + 14, groundY);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(tx - 4 + sway * 0.5, groundY - 42, 8, 4);
    }
    // กระท่อมฟางอบอุ่น
    const hx = Math.floor(width * 0.16);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(hx, groundY - 42, 64, 42);
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.moveTo(hx - 8, groundY - 42);
    ctx.lineTo(hx + 32, groundY - 66);
    ctx.lineTo(hx + 72, groundY - 42);
    ctx.fill();
    // หน้าต่างส่องไฟสีส้มกระพริบอบอุ่น
    ctx.fillStyle = tick % 50 < 25 ? '#fbbf24' : '#f59e0b';
    ctx.fillRect(hx + 12, groundY - 28, 14, 14);
    ctx.fillStyle = '#290f02';
    ctx.fillRect(hx + 38, groundY - 26, 14, 26);
    // ควันปล่องไฟลอยขึ้นจริง
    ctx.fillStyle = '#475569';
    ctx.fillRect(hx + 46, groundY - 60, 8, 16);
    for (let sm = 0; sm < 4; sm++) {
      const smY = groundY - 64 - ((tick * 0.6 + sm * 12) % 36);
      const smX = hx + 48 + Math.sin(tick * 0.06 + sm) * 5;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.fillRect(Math.floor(smX), Math.floor(smY), 6, 5);
    }
  } else if (biome === 'market' || biome === 'tavern' || biome === 'ramen') {
    // ตลาด / โรงเตี๊ยม / ร้านราเม็ง พร้อมโคมไฟแกว่งไกวและหม้อซุปควันฉุย
    const stallX = Math.floor(width * 0.14);
    ctx.fillStyle = '#3f2305';
    ctx.fillRect(stallX, groundY - 48, 86, 48);
    // ผ้าใบกันสาดสลับสีขยับรับลม
    const awningBob = Math.floor(Math.sin(tick * 0.08) * 1.5);
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#fef08a';
      ctx.fillRect(stallX - 4 + i * 15, groundY - 52 + awningBob, 15, 8);
    }
    // โคมไฟแดงแกว่งไกว
    const lanternSwing = Math.sin(tick * 0.07) * 3;
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(stallX + 12 + lanternSwing, groundY - 40, 9, 12);
    ctx.fillRect(stallX + 64 + lanternSwing, groundY - 40, 9, 12);
    // หม้อน้ำซุปเดือดมีไอน้ำลอย
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(stallX + 36, groundY - 22, 16, 10);
    for (let st = 0; st < 3; st++) {
      const sy = groundY - 26 - ((tick * 0.7 + st * 9) % 20);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillRect(stallX + 39 + st * 4 + Math.sin(tick * 0.1 + st) * 2, sy, 2, 4);
    }
  } else if (biome === 'hotspring' || biome === 'forest') {
    // ป่าไผ่พลิ้วไหว + บ่อน้ำแร่ออนเซ็นควันฉุย / แท่นศิลาดาบ
    const bambooSway = Math.sin(tick * 0.05) * 3;
    for (let b = 0; b < 9; b++) {
      const bx = 18 + b * 52;
      ctx.fillStyle = b % 2 === 0 ? '#059669' : '#10b981';
      ctx.fillRect(bx + bambooSway * 0.5, groundY - 75, 5, 75);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(bx - 6 + bambooSway, groundY - 58, 14, 4);
      ctx.fillRect(bx - 4 + bambooSway, groundY - 38, 12, 4);
    }
    // บ่อออนเซ็นหินธรรมชาติ
    const poolX = Math.floor(width * 0.14);
    ctx.fillStyle = '#475569';
    ctx.fillRect(poolX, groundY - 10, 96, 12);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(poolX + 6, groundY - 8, 84, 7);
    // คลื่นน้ำกระเพื่อม
    ctx.fillStyle = '#67e8f9';
    const waveOffset = Math.floor(tick * 0.3) % 16;
    ctx.fillRect(poolX + 12 + waveOffset, groundY - 6, 18, 2);
    ctx.fillRect(poolX + 46 + waveOffset, groundY - 5, 16, 2);
  } else if (biome === 'bonfire' || biome === 'graveyard' || biome === 'dungeon') {
    // ซากเสาวิหารโกธิค + กองไฟ Bonfire ลุกโชน
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(36, groundY - 68, 16, 68);
    ctx.fillRect(width - 64, groundY - 62, 16, 62);
    // ป้ายหลุมศพและคบเพลิง
    ctx.fillStyle = '#334155';
    ctx.fillRect(82, groundY - 24, 14, 24);
    ctx.fillRect(width - 105, groundY - 28, 6, 28);
    ctx.fillRect(width - 111, groundY - 20, 18, 5);

    // กองไฟศักดิ์สิทธิ์ตรงกลางค่อนซ้าย
    const bx = Math.floor(width * 0.25);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(bx - 12, groundY - 6, 24, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx - 1, groundY - 32, 3, 28); // ดาบปักกองไฟ
    const flameH = 12 + Math.sin(tick * 0.25) * 4;
    ctx.fillStyle = 'rgba(249, 115, 22, 0.28)';
    ctx.beginPath();
    ctx.arc(bx, groundY - 10, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(bx, groundY - 8, flameH * 0.65, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(bx, groundY - 7, flameH * 0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (biome === 'battlefield' || biome === 'eclipse' || biome === 'cliff' || biome === 'explosion') {
    // สมรภูมิรบ ธงศึกโบกสะบัดตามลม และดาบปักพื้น
    const flagWave = Math.sin(tick * 0.18) * 4;
    ctx.fillStyle = '#64748b';
    ctx.fillRect(65, groundY - 58, 3, 58);
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(68, groundY - 56);
    ctx.lineTo(98, groundY - 50 + flagWave);
    ctx.lineTo(68, groundY - 38);
    ctx.fill();
    // ดาวตกพาดผ่านท้องฟ้า
    const meteorX = ((tick * 3.5) % (width + 120)) - 60;
    const meteorY = ((tick * 1.8) % Math.floor(groundY * 0.7));
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(meteorX, meteorY);
    ctx.lineTo(meteorX - 18, meteorY - 10);
    ctx.stroke();
  } else {
    // ตรอกเมืองหลวง / ทางหลวงต่างโลก พร้อมตึกเปิดไฟกะพริบและเสาไฟส่องทาง
    ctx.fillStyle = '#0b1324';
    ctx.fillRect(24, groundY - 74, 52, 74);
    ctx.fillRect(92, groundY - 56, 48, 56);
    ctx.fillRect(width - 110, groundY - 68, 56, 68);
    // หน้าต่างตึกส่องแสงไฟ
    ctx.fillStyle = '#fde047';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 2; c++) {
        if ((r + c + Math.floor(tick / 60)) % 3 !== 0) {
          ctx.fillRect(32 + c * 18, groundY - 64 + r * 18, 8, 10);
          ctx.fillRect(width - 100 + c * 20, groundY - 58 + r * 18, 8, 10);
        }
      }
    }
    // เสาไฟริมทางส่องแสงอบอุ่น
    const lampX = Math.floor(width * 0.24);
    ctx.fillStyle = '#475569';
    ctx.fillRect(lampX, groundY - 52, 3, 52);
    ctx.fillRect(lampX - 4, groundY - 54, 11, 3);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.16)';
    ctx.beginPath();
    ctx.moveTo(lampX + 1, groundY - 51);
    ctx.lineTo(lampX - 28, groundY);
    ctx.lineTo(lampX + 30, groundY);
    ctx.closePath();
    ctx.fill();
  }

  // 5. พื้นถนนหิน / พื้นหญ้า
  ctx.fillStyle = biome === 'hotspring' || biome === 'forest' ? '#064e3b' : biome === 'winter_village' ? '#cbd5e1' : '#1e293b';
  ctx.fillRect(0, groundY, width, height - groundY);
  ctx.fillStyle = biome === 'winter_village' ? '#94a3b8' : '#0f172a';
  ctx.fillRect(0, groundY, width, 3);
  for (let gx = 0; gx < width; gx += 22) {
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect((gx + Math.floor(tick * 0.2)) % width, groundY + 8, 12, 3);
  }

  // 6. วาดครอบครัว คู่ครอง ลูก และตัวละครหลักเดินมีชีวิตชีวา (สไตล์ 1in8b.life!)
  if (showActors) {
    const centerX = Math.floor(width * 0.54);
    const raceId = character?.race?.id || 'human';
    const bodyType = character?.race?.bodyType || 'humanoid';
    const isHumanoid = !['slime', 'skeleton', 'capybara', 'spy_pigeon', 'vending_machine', 'sentient_sword', 'mimic_chest', 'truck_calamity'].includes(raceId);

    // พ่อแม่ / ผู้ดูแล ยืนอยู่ฝั่งซ้าย คอยเฝ้ามองและแก่ตัวลงตามอายุของเรา
    const parentAge = 26 + age;
    const parentsAlive = parentAge < 78;
    if (isHumanoid && parentsAlive) {
      // พ่อ
      drawLivingCharacterSprite(ctx, {
        x: centerX - 68 + Math.sin(tick * 0.02) * 4,
        y: groundY + 4,
        tick: tick + 15,
        age: parentAge,
        raceId,
        bodyType,
        facing: 1,
        isWalking: false,
        scale: 0.92
      });
      // แม่
      drawLivingCharacterSprite(ctx, {
        x: centerX - 44 + Math.sin(tick * 0.02 + 1) * 4,
        y: groundY + 5,
        tick: tick + 35,
        age: parentAge - 2,
        raceId,
        bodyType,
        facing: 1,
        isWalking: false,
        scale: 0.88
      });
    } else if (!isHumanoid) {
      // สหายร่วมเผ่าพันธุ์เดินเล่นอยู่ใกล้ๆ
      drawLivingCharacterSprite(ctx, {
        x: centerX - 62 + Math.sin(tick * 0.03) * 8,
        y: groundY + 4,
        tick: tick + 25,
        age: Math.max(5, age),
        raceId,
        bodyType,
        facing: 1,
        isWalking: true,
        scale: 0.78
      });
    }

    // ตัวละครหลักของเรา เดินสำรวจไปมาอย่างมีชีวิตชีวาตรงกลางฉาก!
    const walkOffset = Math.sin(tick * 0.028) * 24;
    const walkDir = Math.cos(tick * 0.028) >= 0 ? 1 : -1;
    const heroX = centerX + walkOffset;
    const heroY = groundY + 6;

    drawLivingCharacterSprite(ctx, {
      x: heroX,
      y: heroY,
      tick,
      age,
      raceId,
      bodyType,
      facing: walkDir,
      isWalking: true,
      hasWeapon: Boolean(weapon),
      weaponId: weapon?.id || '',
      scale: 1.15
    });

    // บับเบิลอารมณ์ / กิจกรรมลอยอยู่เหนือหัวตัวละครหลัก
    const bubbleY = heroY - (age <= 2 ? 28 : 48) + Math.sin(tick * 0.08) * 2;
    const activeIcon = emoteText || (age <= 2 ? '🍼' : age <= 12 ? '✨' : spouse ? '💕' : '⚔️');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(heroX - 12, bubbleY - 14, 24, 14, 4);
    ctx.fill();
    ctx.stroke();
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(activeIcon, heroX, bubbleY - 3);

    // คู่ครอง (Spouse) และลูกๆ (Children) เดินเคียงข้างทางขวา!
    if (spouse) {
      drawLivingCharacterSprite(ctx, {
        x: centerX + 48 + Math.sin(tick * 0.025 + 2) * 6,
        y: groundY + 5,
        tick: tick + 40,
        age: Math.max(18, age),
        raceId,
        bodyType,
        facing: -1,
        isWalking: true,
        scale: 0.95
      });
    }

    if (children && children.length > 0) {
      children.slice(0, 3).forEach((child, idx) => {
        drawLivingCharacterSprite(ctx, {
          x: centerX + 70 + idx * 18 + Math.sin(tick * 0.04 + idx) * 5,
          y: groundY + 6,
          tick: tick + idx * 20,
          age: 6 + idx * 3,
          raceId,
          bodyType,
          facing: -1,
          isWalking: true,
          scale: 0.72
        });
      });
    }
  }

  // 7. เอฟเฟกต์สภาพอากาศเคลื่อนไหว (หิมะ, ฝน, สะเก็ดไฟ, หิ่งห้อยมานา)
  const weather = theme.weather || 'mist';
  for (let p = 0; p < 24; p++) {
    const px = (p * 37 + Math.floor(tick * (weather === 'rain' ? -1.5 : 0.4))) % width;
    const normX = px < 0 ? px + width : px;
    if (weather === 'snow') {
      const py = (p * 23 + Math.floor(tick * 0.9)) % height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(normX + Math.sin(tick * 0.03 + p) * 4, py, 2.5, 2.5);
    } else if (weather === 'rain') {
      const py = (p * 29 + Math.floor(tick * 3.2)) % height;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.fillRect(normX, py, 1.5, 6);
    } else if (weather === 'embers' || weather === 'sparks' || weather === 'meteors') {
      const py = height - ((p * 23 + Math.floor(tick * 1.1)) % height);
      ctx.fillStyle = p % 2 === 0 ? 'rgba(249, 115, 22, 0.8)' : 'rgba(250, 204, 21, 0.8)';
      ctx.fillRect(normX + Math.sin(tick * 0.05 + p) * 3, py, 2, 2);
    } else {
      // หิ่งห้อยมานา / ละอองวิญญาณเรืองแสง
      const py = Math.floor(height * 0.35) + ((p * 19) % Math.floor(height * 0.55)) + Math.sin(tick * 0.04 + p) * 6;
      const glow = 0.3 + 0.6 * Math.abs(Math.sin(tick * 0.05 + p));
      ctx.fillStyle = weather === 'wisps' ? `rgba(56, 189, 248, ${glow.toFixed(2)})` : `rgba(167, 243, 208, ${glow.toFixed(2)})`;
      ctx.fillRect(normX, py, 2, 2);
    }
  }
}

export default function SceneViewport({
  sceneId = 'famine',
  age = 0,
  character = null,
  characterName = 'ผู้ถูกเลือก',
  realm = null,
  housing = 'ยังอาศัยอยู่กับครอบครัว',
  spouse = null,
  children = [],
  weapon = null,
  height = 220
}) {
  const canvasRef = useRef(null);
  const [emoteIndex, setEmoteIndex] = useState(0);
  const emotes = ['⚔️', '❤️', '✨', '🪙', '📖', '🔥'];

  const getSmartFallbackScene = (currentAge) => {
    if (currentAge <= 2) return 'famine';
    if (currentAge <= 6) return 'alley';
    if (currentAge <= 12) return 'market';
    if (currentAge <= 17) return 'tavern';
    if (currentAge <= 35) return 'battlefield';
    return 'bonfire';
  };

  const resolvedSceneKey = SCENE_THEMES[sceneId] ? sceneId : getSmartFallbackScene(age);
  const theme = SCENE_THEMES[resolvedSceneKey] || SCENE_THEMES.famine;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderAnimatedBiomeScene(ctx, {
        width: canvas.width,
        height: canvas.height,
        tick,
        sceneId: resolvedSceneKey,
        age,
        character,
        spouse,
        children,
        weapon,
        emoteText: emotes[emoteIndex % emotes.length],
        showActors: true
      });
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [resolvedSceneKey, age, character, spouse, children, weapon, emoteIndex]);

  const momAge = 26 + age;
  const dadAge = 31 + age;
  const raceId = character?.race?.id || 'human';
  const isHumanoid = !['slime', 'skeleton', 'capybara', 'spy_pigeon', 'vending_machine', 'sentient_sword', 'mimic_chest', 'truck_calamity'].includes(raceId);

  return React.createElement(
    'div',
    {
      style: {
        backgroundColor: '#0c1017',
        borderRadius: '10px',
        border: '1.5px solid #283149',
        overflow: 'hidden',
        marginBottom: '14px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
      }
    },
    React.createElement(
      'div',
      {
        onClick: () => setEmoteIndex(prev => prev + 1),
        title: 'คลิกที่ฉากเพื่อให้ตัวละครส่งอารมณ์ทักทาย!',
        style: {
          position: 'relative',
          width: '100%',
          height: `${height}px`,
          cursor: 'pointer',
          backgroundColor: '#05070c'
        }
      },
      React.createElement('canvas', {
        ref: canvasRef,
        width: 480,
        height: height,
        style: {
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
          objectFit: 'cover'
        }
      }),
      React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            top: '10px',
            left: '12px',
            backgroundColor: 'rgba(9, 13, 22, 0.88)',
            border: '1px solid #c99738',
            borderRadius: '6px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
          }
        },
        React.createElement('span', { style: { fontSize: '12px', color: '#ffd166', fontWeight: 'bold' } }, `📍 ${theme.tag}`),
        React.createElement('span', { style: { fontSize: '10.5px', color: '#94a3b8' } }, `(${theme.mood})`)
      ),
      React.createElement(
        'div',
        {
          style: {
            position: 'absolute',
            bottom: '8px',
            right: '12px',
            backgroundColor: 'rgba(9, 13, 22, 0.85)',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            color: '#38bdf8'
          }
        },
        `🕹️ ฉากชีวิตเคลื่อนไหว • วัย ${age} ปี (คลิกตัวละครได้)`
      )
    ),
    React.createElement(
      'div',
      {
        style: {
          padding: '9px 14px',
          backgroundColor: '#080c14',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '11.5px'
        }
      },
      React.createElement(
        'div',
        { style: { color: '#f8fafc', fontWeight: 'bold' } },
        `🏠 ${realm?.name || 'แดนมรณะ'} • ${housing}`
      ),
      React.createElement(
        'div',
        { style: { color: '#94a3b8' } },
        isHumanoid
          ? `คุณ อายุ ${age} ปี • ${momAge < 78 ? `แม่ อายุ ${momAge} ปี` : 'แม่ (ล่วงลับ)'} • ${dadAge < 78 ? `พ่อ อายุ ${dadAge} ปี` : 'พ่อ (ล่วงลับ)'}${spouse ? ` • 💍 ${spouse.name}` : ''}${children?.length ? ` • 👶 ลูก ${children.length} คน` : ''}`
          : `${characterName} (${character?.race?.name || ''}) • อายุ ${age} ปี${spouse ? ` • 💍 ${spouse.name}` : ''}${children?.length ? ` • 👶 ทายาท ${children.length} ตน` : ''}`
      )
    )
  );
}
