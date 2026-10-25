import React, { useState } from 'react';
import PixelCharacterAvatar from './PixelCharacterAvatar';
import { PORTRAIT_IMAGE_MAP } from './CharacterVisualCard';

export default function BirthCertificateView({
  character,
  characterName,
  bestowedGiver,
  gender,
  realm,
  socialClass,
  familyFund,
  gold,
  debt,
  onStartLife,
  onReroll,
  onNameChange,
  onRerollName
}) {
  if (!character || !character.race) return null;

  const race = character.race;
  const familyWealthDots = socialClass.name.includes('ขุนนาง') || socialClass.name.includes('เศรษฐี') ? 5
    : socialClass.name.includes('พาณิชย์') || socialClass.name.includes('อัศวิน') ? 4
    : socialClass.name.includes('ชาวบ้าน') || socialClass.name.includes('เสรี') ? 3
    : socialClass.name.includes('ยากจน') || socialClass.name.includes('สลัม') ? 2 : 1;

  const portraitUrl = race.portrait || PORTRAIT_IMAGE_MAP[race.id];
  const [imgErr, setImgErr] = useState(false);

  return (
    <div style={{
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      backgroundColor: '#0c1017',
      borderRadius: '14px',
      overflow: 'hidden',
      border: '1.5px solid #2d3748',
      boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 30px rgba(245, 158, 11, 0.15)',
      fontFamily: "'Sarabun', sans-serif",
      color: '#cbd5e1'
    }}>
      {/* Top Fantasy Header Banner */}
      <div style={{
        backgroundColor: '#18122B',
        background: 'linear-gradient(90deg, #8a0303 0%, #1e112a 50%, #0f172a 100%)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        borderBottom: '2px solid #f59e0b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📜</span>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ffd166', letterSpacing: '0.5px' }}>
            ทะเบียนเกิดใหม่ต่างโลก (Isekai Rebirth Pass)
          </h2>
        </div>
        <span style={{
          fontSize: '11px',
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid #f59e0b',
          color: '#fbbf24',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {race.rarity || 'Common'}
        </span>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Character Card Hero: Portrait + Editable Name */}
        <div style={{
          display: 'flex',
          gap: '18px',
          alignItems: 'center',
          backgroundColor: '#070a12',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '10px',
            backgroundColor: '#030712',
            border: `2px solid ${race.badgeColor || '#f59e0b'}`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
          }}>
            {portraitUrl && !imgErr ? (
              <img
                src={portraitUrl}
                alt={race.name}
                onError={() => setImgErr(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <PixelCharacterAvatar raceId={race.id} size={84} animated={true} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>
                ✏️ ชื่อนามในชาตินี้ (พิมพ์แก้ได้เอง):
              </div>
              {onRerollName && (
                <button
                  type="button"
                  onClick={onRerollName}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    color: '#ffd166',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="สุ่มชื่อใหม่"
                >
                  🎲 สุ่มชื่อ
                </button>
              )}
            </div>

            {/* Editable Name Input Box */}
            <input
              type="text"
              value={characterName}
              onChange={(e) => onNameChange && onNameChange(e.target.value)}
              placeholder="พิมพ์ชื่อตัวละครของคุณ..."
              maxLength={40}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#0c1017',
                border: '1.5px solid #f59e0b',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#f8fafc',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
              }}
            />

            <div style={{ fontSize: '12px', color: race.badgeColor || '#38bdf8', fontWeight: 'bold', marginTop: '6px' }}>
              ✦ {race.name} • {gender}
            </div>
          </div>
        </div>

        {/* 4 Clean RPG Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* Card 1: เผ่าพันธุ์ */}
          <div style={statCardStyle}>
            <div style={cardLabelStyle}>🏷️ เผ่าพันธุ์</div>
            <div style={cardValueStyle}>{race.name.split(' (')[0]}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{race.badge}</div>
          </div>

          {/* Card 2: ดินแดนเกิด */}
          <div style={statCardStyle}>
            <div style={cardLabelStyle}>🏰 ดินแดนเกิด</div>
            <div style={cardValueStyle}>{realm.name}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{realm.desc ? realm.desc.slice(0, 24) + '...' : 'ดินแดนแห่งโชคชะตา'}</div>
          </div>

          {/* Card 3: ฐานะครอบครัว */}
          <div style={statCardStyle}>
            <div style={cardLabelStyle}>👑 ฐานะครอบครัว</div>
            <div style={{ ...cardValueStyle, color: '#ffd166' }}>
              {'●'.repeat(familyWealthDots)}{'○'.repeat(5 - familyWealthDots)}
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>{socialClass.name}</div>
          </div>

          {/* Card 4: ทรัพย์สินเริ่มต้น */}
          <div style={statCardStyle}>
            <div style={cardLabelStyle}>🪙 เงินก้นถุงเริ่มต้น</div>
            <div style={{ ...cardValueStyle, color: '#4ade80' }}>{gold} Gold</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>อายุขัยเฉลี่ย: {race.maxAge} ปี</div>
          </div>
        </div>

        {/* Short Fun Meme Backstory */}
        <div style={{
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#fef3c7'
        }}>
          💡 <strong>เรื่องย่อก่อนเริ่ม:</strong> คุณตื่นขึ้นมาในร่างนี้พร้อมความทรงจำชาติก่อนที่ยังหลงเหลือ โลกดาร์กแฟนตาซีแห่งนี้เต็มไปด้วยมอนสเตอร์ โรคภัย และความเลื่อมล้ำ แต่ก็มีโอกาสรวยและกลายเป็นตำนานได้เหมือนกัน!
        </div>

        {/* Bottom Actions: No Manual Reroll Allowed */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', paddingTop: '12px', borderTop: '1px solid #1f293d' }}>
          <button
            onClick={onStartLife}
            style={{
              backgroundColor: '#e11d48',
              border: 'none',
              color: '#ffffff',
              padding: '13px 40px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 18px rgba(225, 29, 72, 0.45)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f43f5e';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#e11d48';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span>⚔️ เริ่มต้นชะตากรรมชีวิตนี้เลย!</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const statCardStyle = {
  backgroundColor: '#070a12',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  padding: '12px 14px'
};

const cardLabelStyle = {
  fontSize: '11.5px',
  color: '#64748b',
  fontWeight: 'bold',
  marginBottom: '2px'
};

const cardValueStyle = {
  fontSize: '15px',
  color: '#f8fafc',
  fontWeight: 'bold'
};
