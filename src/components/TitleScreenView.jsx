import React, { useState, useEffect, useRef } from 'react';
import PixelMemeAvatar from './PixelMemeAvatar';

// ข้อมูลการเสียชีวิตตลกร้ายในแดนมรณะ (Recent Nether Deaths)
const RECENT_FALLEN_SOULS = [
  { name: 'ไอ้หนุ่มข้ามภพ', race: '???', age: 19, cause: 'โดนรถบรรทุกชนมาเกิดใหม่ แต่ดันสะดุดเปลือกกล้วยตกบันไดวิหารตายต่อ' },
  { name: 'จอมเวทเบียว', race: '???', age: 140, cause: 'ท่องคาถาภาษาโบราณเร็วเกินไปจนกัดลิ้นตัวเอง เลือดไหลหมดตัว' },
  { name: 'สายบวกหน้าใหม่', race: '???', age: 24, cause: 'คิดว่างัดข้อชนะหมูป่าได้ โดนขวิดกระเด็นไปตกหลังคากิลด์' },
  { name: 'ก้อนกลมรักสงบ', race: '???', age: 3, cause: 'แช่น้ำอุ่นเพลินจนละลายรวมเป็นหนึ่งเดียวกับสายน้ำ' },
  { name: 'หัวขโมยกระดูก', race: '???', age: 72, cause: 'ถอดหัวหมุนโชว์สาว แต่หมาคาบหัววิ่งหนีข้ามแม่น้ำตามไม่ทัน' },
  { name: 'ทายาทเศรษฐี', race: '???', age: 35, cause: 'โดนเจ้าหนี้ดอกเบี้ยโหดกระโดดถีบยอดอกเพราะเบี้ยวหนี้ค่าโพชั่น' },
  { name: 'ผู้กล้าติดเกม', race: '???', age: 21, cause: 'ฟาร์มสไลม์ติดต่อกัน 7 วัน 7 คืนไม่ได้นอน หัวใจวายคากองเจลลี่' }
];

export default function TitleScreenView({ onRollBirth, soundEnabled, onToggleSound, crtFilter, onToggleCrt }) {
  const [livingSoulsCount, setLivingSoulsCount] = useState(11489203);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Bonfire Animated Canvas Ref (32-Bit Pixel Bonfire)
  const bonfireCanvasRef = useRef(null);

  // Micro-fluctuation of live souls count
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = Math.floor(Math.random() * 9) - 4;
      setLivingSoulsCount(prev => Math.max(10000000, prev + delta));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Animated 32-Bit Aseprite Pixel Bonfire Background
  useEffect(() => {
    const canvas = bonfireCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h - 30;

      // 1. Dark Nether Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#06050b');
      skyGrad.addColorStop(0.5, '#130d1f');
      skyGrad.addColorStop(1, '#2b1016');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Eclipse Moon (สุริยุปราคาจันทราสีเลือด)
      const moonX = w * 0.85;
      const moonY = 42;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0612';
      ctx.beginPath();
      ctx.arc(moonX - 4, moonY - 3, 18, 0, Math.PI * 2);
      ctx.fill();

      // 3. Castle Silhouette in distance
      ctx.fillStyle = '#110b1a';
      ctx.fillRect(w * 0.08, h - 65, 42, 50);
      ctx.fillRect(w * 0.12, h - 85, 20, 70);
      ctx.fillRect(w * 0.15, h - 105, 10, 90); // Spire

      // 4. Ground Layer (Rocky Surface)
      ctx.fillStyle = '#0a0712';
      ctx.fillRect(0, h - 22, w, 22);
      ctx.fillStyle = '#1c1527';
      for (let i = 0; i < w; i += 10) {
        ctx.fillRect(i, h - 22, 6, 3);
      }

      // 5. Bonfire Logs
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cx - 20, cy + 6, 40, 8);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - 16, cy + 2, 32, 6);

      // Sword in the Bonfire (ดาบปักกองไฟสไตล์ Dark Souls)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 2, cy - 44, 4, 48);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx - 8, cy - 36, 16, 4); // Guard
      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx - 1.5, cy - 52, 3, 8); // Hilt

      // 6. Flickering Bonfire Flames (32-Bit Smooth Pixel Flames)
      const flameHeight = 28 + Math.sin(tick * 0.25) * 8;
      const flameWidth = 20 + Math.cos(tick * 0.2) * 5;

      // Outer Red Glow
      const glowGrad = ctx.createRadialGradient(cx, cy - 10, 4, cx, cy - 10, 60);
      glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 60, 0, Math.PI * 2);
      ctx.fill();

      // Red Flame Core
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 4, flameWidth, flameHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Orange Mid Flame
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 2, flameWidth * 0.75, flameHeight * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Yellow/White Hot Core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(cx, cy, flameWidth * 0.45, flameHeight * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // 7. Rising Embers & Sparkles
      for (let i = 0; i < 22; i++) {
        const seed = i * 41;
        const emberX = cx + Math.sin(tick * 0.05 + seed) * (18 + (i * 2));
        const emberY = (cy - ((tick * 1.5 + seed) % 110));
        const alpha = Math.max(0, 1 - (cy - emberY) / 110);
        ctx.fillStyle = i % 2 === 0 ? `rgba(253, 224, 71, ${alpha})` : `rgba(249, 115, 22, ${alpha})`;
        ctx.fillRect(emberX, emberY, (i % 3 === 0 ? 3 : 2), (i % 3 === 0 ? 3 : 2));
      }

      // 8. Pixel Vignette
      ctx.fillStyle = 'rgba(7, 6, 10, 0.25)';
      ctx.fillRect(0, 0, 20, h);
      ctx.fillRect(w - 20, 0, 20, h);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={containerStyle}>
      {/* 1. Header Toolbar: Sound & CRT Settings */}
      <div style={toolbarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🩸</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#c99738', letterSpacing: '0.5px' }}>
            แดนมรณะข้ามภพ • สุ่มเกิดใหม่ต่างโลก (ISEKAI REBIRTH RPG)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onToggleCrt}
            style={toggleBtnStyle(crtFilter)}
            title="สลับโหมดจำลองจอแก้วพิกเซลเรโทร (CRT Scanlines)"
          >
            📺 CRT {crtFilter ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={onToggleSound}
            style={toggleBtnStyle(soundEnabled)}
            title="เปิด/ปิดเสียงเอฟเฟกต์"
          >
            {soundEnabled ? '🔊 เสียงเปิด' : '🔇 ปิดเสียง'}
          </button>
        </div>
      </div>

      {/* 2. Hero Section: 32-Bit Animated Bonfire & World Ticker */}
      <div style={heroBoxStyle}>
        <canvas
          ref={bonfireCanvasRef}
          width={760}
          height={180}
          style={{ width: '100%', height: '180px', display: 'block', imageRendering: 'pixelated' }}
        />

        <div style={heroOverlayStyle}>
          <div style={liveBadgeStyle}>
            <span style={pulseDotStyle}></span>
            <span>วิญญาณกำลังเวียนว่ายตายเกิดในแดนมรณะ:</span>
            <strong style={{ color: '#38bdf8' }}>{livingSoulsCount.toLocaleString()}</strong> ดวง
          </div>

          <h1 className="cinzel-decor" style={titleStyle}>
            🔥 สุ่มเกิดใหม่ในแดนมรณะ (ISEKAI REBIRTH)
          </h1>
          <p style={subtitleStyle}>
            ชีวิตจริงเลือกเกิดไม่ได้ ต่างโลกก็เหมือนกัน! ก้าวเข้าสู่กองไฟ... แล้วไปลุ้นเอาว่าจะเกิดเป็นตัวอะไร!
          </p>
        </div>
      </div>

      {/* 3. Action Call To Action: Roll Bonfire */}
      <div style={ctaSectionStyle}>
        <button
          onClick={onRollBirth}
          style={primaryRollButtonStyle}
        >
          <span style={{ fontSize: '22px' }}>🔥</span>
          <span>จุดกองไฟสุ่มชะตาชีวิต (Start Life)</span>
          <span style={{ fontSize: '18px' }}>➔</span>
        </button>

        <button
          onClick={() => setShowRulesModal(true)}
          style={secondaryBtnStyle}
        >
          📖 กฎแห่งวัฏจักร & เคล็ดลับเอาชีวิตรอด
        </button>
      </div>

      {/* 4. Mystery Feature Cards (32-Bit Pixel Highlights, NO SPOILER of races!) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginTop: '6px'
      }}>
        <div style={featureBoxStyle}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>🎲</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '2px' }}>สุ่มชาติกำเนิด 100%</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
            ตั้งแต่ผู้กล้าคาบช้อนทอง จนถึงสิ่งมีชีวิตสุดอนาถในสลัม ลุ้นเอาว่าจะได้ร่างไหน!
          </div>
        </div>

        <div style={featureBoxStyle}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>⚔️</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '2px' }}>เรื่องราวไม่ซ้ำซาก</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
            เหตุการณ์ด่วน วิกฤตชีวิต และการตัดสินใจในแต่ละวัยถูกสุ่มใหม่ตลอดเวลา ไม่มีวันเบื่อ
          </div>
        </div>

        <div style={featureBoxStyle}>
          <div style={{ fontSize: '22px', marginBottom: '4px' }}>🕹️</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '2px' }}>ภาพพิกเซล 32 บิตแท้</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
            ฉากศิลปะเรโทรและสภาพอากาศพิกเซลเคลื่อนไหว สมจริงสไตล์เกม RPG คลาสสิก
          </div>
        </div>
      </div>

      {/* 4.1 Cameos in 16-Bit Pixel (ผู้กล้าต่างมิติมีม ไม่รกตา เข้ากับธีม) */}
      <div style={{
        backgroundColor: '#0c1017',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🌟</span>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffd166' }}>
              ตำนานผู้กล้าต่างมิติ (Multiverse Cameos)
            </div>
            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
              แปลงภาพเป็นสไตล์ 16-bit พิกเซล สุ่มปรากฏตัวในเหตุการณ์ชีวิตและวิกฤตด่วน
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div title="อัศวินม้าหน้าคน (The Centaur Knight)" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="horse" size={36} />
          </div>
          <div title="จอมทัพเกราะทมิฬ (Berserker Face)" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="portrait" size={36} />
          </div>
          <div title="จอมดาบยักษ์ผ่ามิติ (Dragon Slayer)" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="full" size={36} />
          </div>
          <div title="ผู้รู้แจ้งหน้าชิล (Chill Guy)" style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid #334155' }}>
            <PixelMemeAvatar memeKey="chill" size={36} />
          </div>
        </div>
      </div>

      {/* 5. Memorial Wall of the Fallen Souls (ป้ายไว้อาลัยดวงวิญญาณล่าสุด) */}
      <div style={memorialSectionStyle}>
        <div style={memorialHeaderStyle}>
          <span style={{ color: '#ef4444' }}>⚰️ หอเกียรติยศผู้ดับสูญล่าสุด (Recent Deaths):</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>อัปเดตเรียลไทม์</span>
        </div>
        <div style={memorialMarqueeWrapStyle}>
          <div style={memorialTrackStyle}>
            {RECENT_FALLEN_SOULS.map((soul, idx) => (
              <div key={idx} style={soulCardStyle}>
                <strong style={{ color: '#ffd166' }}>"{soul.name}"</strong> (สิ้นใจ ณ วัย {soul.age} ปี):{' '}
                <span style={{ color: '#cbd5e1' }}>{soul.cause}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Philosophy & Rules Modal */}
      {showRulesModal && (
        <div style={modalBackdropStyle} onClick={() => setShowRulesModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 className="gothic-title" style={{ color: '#c99738', margin: 0, fontSize: '18px' }}>
                ⚖️ กฎแห่งวัฏจักรและวิธีเล่น
              </h3>
              <button onClick={() => setShowRulesModal(false)} style={closeBtnStyle}>✕</button>
            </div>
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                <strong>1. สุ่มเกิดใหม่ 100% คนเราเลือกเกิดไม่ได้:</strong> คุณไม่มีทางรู้เลยว่าจะได้ลืมตาตื่นขึ้นมาในร่างของอะไร จนกว่าจะได้ก้าวเข้าสู่กองไฟแห่งโชคชะตา!
              </p>
              <p>
                <strong>2. ความเลื่อมล้ำและชะตาชีวิต:</strong> ชนชั้นครอบครัวตั้งแต่สลัมจนถึงขุนนางใหญ่จะกำหนดเงินก้นถุงและโอกาสในวัยเด็ก แต่ทุกทางเลือกในแต่ละช่วงวัยจะเปลี่ยนชะตาชีวิตของคุณได้เสมอ
              </p>
              <p>
                <strong>3. ตัดสินใจตามสัญชาตญาณ:</strong> คุณจะไม่เห็นตัวเลขสเตตัสล่วงหน้า ให้เลือกตามเซนส์และความฮา ทุกการกระทำส่งผลต่อชีวิตจริง!
              </p>
              <p>
                <strong>4. เส้นเรื่องใหม่ๆ ทุกรอบ:</strong> ระบบถูกออกแบบมาให้เหตุการณ์ในแต่ละวัยไม่ซ้ำซาก เล่นกี่รอบก็เจอเรื่องราวใหม่ๆ เสมอ!
              </p>
            </div>
            <button
              onClick={() => {
                setShowRulesModal(false);
                onRollBirth();
              }}
              style={{ ...primaryRollButtonStyle, width: '100%', marginTop: '18px' }}
            >
              🔥 ข้าเข้าใจแล้ว • สุ่มเกิดใหม่เลย! ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 32-Bit Retro & Dark Fantasy UI Styles
// ==========================================
const containerStyle = {
  width: '100%',
  maxWidth: '780px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px'
};

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#0c0f18',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  padding: '8px 14px'
};

const toggleBtnStyle = (active) => ({
  backgroundColor: active ? '#8a0303' : '#111827',
  border: active ? '1px solid #c99738' : '1px solid #374151',
  color: active ? '#ffd166' : '#94a3b8',
  borderRadius: '6px',
  padding: '4px 10px',
  fontSize: '11px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
});

const heroBoxStyle = {
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid #8a0303',
  boxShadow: '0 8px 30px rgba(138, 3, 3, 0.35), 0 0 20px rgba(0,0,0,0.8)'
};

const heroOverlayStyle = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '16px',
  background: 'linear-gradient(180deg, rgba(6,5,11,0.2) 0%, rgba(6,5,11,0.85) 100%)',
  pointerEvents: 'none'
};

const liveBadgeStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  backgroundColor: 'rgba(7, 10, 18, 0.75)',
  border: '1px solid rgba(56, 189, 248, 0.3)',
  borderRadius: '20px',
  padding: '3px 12px',
  fontSize: '11px',
  color: '#cbd5e1',
  marginBottom: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
};

const pulseDotStyle = {
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#ef4444',
  boxShadow: '0 0 8px #ef4444',
  display: 'inline-block'
};

const titleStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#ffd166',
  margin: '0 0 6px 0',
  letterSpacing: '1px',
  textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 0 15px rgba(201, 151, 56, 0.4)'
};

const subtitleStyle = {
  fontSize: '13px',
  color: '#e2e8f0',
  margin: 0,
  maxWidth: '560px',
  lineHeight: '1.5'
};

const ctaSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px'
};

const primaryRollButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  maxWidth: '440px',
  padding: '14px 28px',
  backgroundColor: '#8a0303',
  border: '2px solid #ffd166',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(138, 3, 3, 0.6), 0 0 15px rgba(255, 209, 102, 0.3)',
  transition: 'all 0.18s ease'
};

const secondaryBtnStyle = {
  background: 'none',
  border: '1px solid #374151',
  color: '#94a3b8',
  borderRadius: '6px',
  padding: '6px 14px',
  fontSize: '12px',
  cursor: 'pointer'
};

const featureBoxStyle = {
  backgroundColor: '#0c1017',
  border: '1px solid #1e293b',
  borderRadius: '10px',
  padding: '14px',
  textAlign: 'center'
};

const memorialSectionStyle = {
  backgroundColor: '#080c14',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  padding: '8px 14px',
  overflow: 'hidden'
};

const memorialHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '11px',
  fontWeight: 'bold',
  marginBottom: '6px'
};

const memorialMarqueeWrapStyle = {
  overflow: 'hidden',
  position: 'relative',
  width: '100%'
};

const memorialTrackStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const soulCardStyle = {
  fontSize: '11.5px',
  color: '#94a3b8',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(3, 7, 18, 0.85)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '16px'
};

const modalContentStyle = {
  backgroundColor: '#0c1017',
  border: '1.5px solid #c99738',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '540px',
  width: '100%',
  boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(201, 151, 56, 0.3)'
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  fontSize: '16px',
  cursor: 'pointer'
};
