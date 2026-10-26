import React, { useState, useEffect } from 'react';
import PixelCharacterAvatar from './PixelCharacterAvatar.jsx';
import { getAssetUrl } from '../utils/assets.js';

// แมปปิ้งรูปภาพพอร์ตเทรตตัวละคร (Character Portrait Art)
export const PORTRAIT_IMAGE_MAP = {
  ashen_lord: getAssetUrl('portraits/ashen_lord.jpg'),
  slime: getAssetUrl('portraits/slime.jpg'),
  skeleton: getAssetUrl('portraits/skeleton.jpg'),
  sentient_sword: getAssetUrl('portraits/sentient_sword.jpg'),
  mimic_chest: getAssetUrl('portraits/mimic_chest.jpg'),
  vending_machine: getAssetUrl('portraits/vending_machine.svg'),
  truck_calamity: getAssetUrl('portraits/truck_calamity.jpg'),
  capybara: getAssetUrl('portraits/capybara.jpg'),
  bean_knight: getAssetUrl('portraits/bean_knight.svg'),
  orange_cat: getAssetUrl('scenes/alley.jpg'),
  debt_priestess: getAssetUrl('scenes/aqua.jpg'),
  branded_one: getAssetUrl('scenes/berserk.jpg'),
  roomba: getAssetUrl('portraits/vending_machine.svg'),
  radahn: getAssetUrl('scenes/radahn.jpg'),
  frieren_mimic: getAssetUrl('scenes/mimic.jpg'),
  saitama: getAssetUrl('scenes/saitama.jpg')
};

// หมวดหมู่และอนุกรมวิธานสิ่งมีชีวิต (Taxonomy Categories)
export const SPECIES_TAXONOMY = {
  humanoid: {
    label: '👑 มนุษย์ & ผู้สืบทอดสายเลือดโบราณ',
    themeColor: '#f59e0b',
    icon: '👑',
    desc: 'สิ่งมีชีวิตสองขา มีสมองพัฒนาการสูง ใช้อุปกรณ์และอาวุธได้ทุกชนิด แต่ร่างกายเปราะบาง'
  },
  undead: {
    label: '💀 อันเดด & สิ่งมีชีวิตคืนชีพจากความตาย',
    themeColor: '#94a3b8',
    icon: '💀',
    desc: 'ไร้เนื้อหนังหรือไร้ลมหายใจ ไม่หิวข้าว ไม่เหนื่อยล้า แต่แพ้ไฟและเวทมนตร์ศักดิ์สิทธิ์'
  },
  monster: {
    label: '🧌 อมนุษย์ & มอนสเตอร์ดึกดำบรรพ์',
    themeColor: '#10b981',
    icon: '🧌',
    desc: 'มอนสเตอร์สัญชาตญาณสัตว์ป่า ปรับตัวเอาชีวิตรอดเก่ง มนุษย์หวาดกลัวแต่มีความสามารถเฉพาะตัวสูง'
  },
  beast: {
    label: '🐾 สัตว์สี่ขา & สัตว์อสูรธรรมชาติ',
    themeColor: '#fb923c',
    icon: '🐾',
    desc: 'ร่างกายสี่ขา ว่องไว มีเขี้ยวเล็บหรือขนหนา ไม่สามารถจับอาวุธมนุษย์ได้ แต่เอาตัวรอดตามสัญชาตญาณ'
  },
  object: {
    label: '📦 วัตถุมีวิญญาณ & สิ่งของหลุดมิติ',
    themeColor: '#8b5cf6',
    icon: '📦',
    desc: 'วัตถุไร้ชีวิตที่ได้รับวิญญาณหรือคำสาป ขยับตัวแบบสิ่งมีชีวิตไม่ได้ แต่มีความทนทานและสกิลเฉพาะตัวประหลาด'
  },
  anomaly: {
    label: '🌌 หายนะข้ามมิติ & ตัวตนลี้ลับเหนือธรรมชาติ',
    themeColor: '#ec4899',
    icon: '🌌',
    desc: 'ตัวตนที่ฉีกกฎฟิสิกส์และมิติของโลก พลังทำลายล้างหรือโชคลาภสูงเกินกว่าที่คนธรรมดาจะเข้าใจ'
  }
};

export default function CharacterVisualCard({ race, characterName, gender, bestowedGiver, generation = 1 }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [race?.id]);

  if (!race) return null;

  // หาหมวดหมู่สิ่งมีชีวิต (Biological Clade)
  let taxonKey = 'humanoid';
  const bodyType = race.bodyType || 'humanoid';
  if (bodyType === 'skeleton' || bodyType === 'ghost') {
    taxonKey = 'undead';
  } else if (bodyType === 'slime' || bodyType === 'goblin' || bodyType === 'spider' || bodyType === 'lobster' || bodyType === 'mushroom') {
    taxonKey = 'monster';
  } else if (bodyType === 'beast' || bodyType === 'dragon' || bodyType === 'bird') {
    taxonKey = 'beast';
  } else if (bodyType === 'sword' || bodyType === 'object' || bodyType === 'mimic') {
    taxonKey = 'object';
  } else if (bodyType === 'truck' || race.id === 'rubber_duck' || race.id === 'golden_poop' || race.id === 'guild_soap') {
    taxonKey = 'anomaly';
  } else if (bodyType === 'onion' || bodyType === 'humanoid') {
    taxonKey = 'humanoid';
  }

  const taxon = SPECIES_TAXONOMY[taxonKey] || SPECIES_TAXONOMY.humanoid;
  const portraitUrl = race.portrait || PORTRAIT_IMAGE_MAP[race.id];

  // สีขอบตามความหายาก (Rarity Glow)
  const isSecret = race.rarity?.includes('SECRET');
  const isSSR = race.rarity?.includes('SSR');
  const isRare = race.rarity?.includes('Rare');
  const isUncommon = race.rarity?.includes('Uncommon');

  const rarityGlow = isSecret
    ? '0 0 25px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(168, 85, 247, 0.4)'
    : isSSR
    ? '0 0 25px rgba(245, 158, 11, 0.6), inset 0 0 20px rgba(251, 191, 36, 0.3)'
    : isRare
    ? '0 0 18px rgba(56, 189, 248, 0.5)'
    : isUncommon
    ? '0 0 12px rgba(52, 211, 153, 0.4)'
    : '0 0 10px rgba(148, 163, 184, 0.2)';

  const rarityBorder = isSecret
    ? '2px solid #ec4899'
    : isSSR
    ? '2px solid #f59e0b'
    : isRare
    ? '2px solid #38bdf8'
    : isUncommon
    ? '2px solid #10b981'
    : '1.5px solid #475569';

  return (
    <div style={{
      maxWidth: '740px',
      margin: '0 auto 20px auto',
      backgroundColor: '#0c0f17',
      border: '1.5px solid #283149',
      borderRadius: '14px',
      padding: '20px',
      boxShadow: '0 12px 36px rgba(0,0,0,0.8), inset 0 0 25px rgba(0,0,0,0.5)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative top ribbon */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, transparent, ${taxon.themeColor}, transparent)`
      }} />

      {/* Header Taxon Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{
          backgroundColor: `${taxon.themeColor}22`,
          border: `1px solid ${taxon.themeColor}66`,
          color: taxon.themeColor,
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {taxon.label}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: race.badgeColor || '#64748b',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '3px 10px',
            borderRadius: '12px'
          }}>
            {race.badge}
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: isSecret ? '#ec4899' : isSSR ? '#ffd166' : isRare ? '#38bdf8' : '#94a3b8'
          }}>
            {race.rarity}
          </span>
        </div>
      </div>

      {/* Main Visual Display: Portrait Art + Lore */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        alignItems: 'center',
        marginBottom: '18px'
      }}>
        {/* Left: Framed Character Portrait */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: '210px',
            height: '210px',
            borderRadius: '16px',
            border: rarityBorder,
            boxShadow: rarityGlow,
            overflow: 'hidden',
            backgroundColor: '#07090e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {portraitUrl && !imgError ? (
              <img
                src={portraitUrl}
                alt={race.name}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <PixelCharacterAvatar raceId={race.id} size={210} animated={true} />
            )}

            {/* Bottom rarity tag */}
            <div style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(0,0,0,0.75)',
              border: `1px solid ${taxon.themeColor}`,
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 'bold',
              color: '#fff',
              backdropFilter: 'blur(4px)'
            }}>
              {race.avatar} {gender}
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            ✦ ภาพประจำสายพันธุ์ (Species Portrait)
          </div>
        </div>

        {/* Right: Bestowed Name & Species Lore */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Bestowed Name Box */}
          <div style={{
            backgroundColor: '#07090e',
            border: '1.5px solid #c99738',
            borderRadius: '10px',
            padding: '14px 16px',
            boxShadow: '0 4px 14px rgba(201,151,56,0.15)'
          }}>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', fontStyle: 'italic', marginBottom: '4px' }}>
              📜 {bestowedGiver}:
            </div>
            <div className="gothic-title" style={{
              fontSize: '24px',
              color: '#ffd166',
              fontWeight: 'bold',
              textShadow: '0 0 10px rgba(255,209,102,0.4)',
              letterSpacing: '0.5px'
            }}>
              "{characterName}"
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
              (คนเราเลือกเกิดไม่ได้ ชื่อนามและสังขารจึงได้รับมอบตามชะตาฟ้าลิขิต)
            </div>
          </div>

          {/* Species Title and Innate Gender */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px' }}>
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>🧬 เผ่าพันธุ์ที่ถือกำเนิด:</div>
              <div style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>
                {race.name}
              </div>
            </div>

            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px' }}>
              <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>⚧️ เพศสรีระ:</div>
              <div style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px', marginTop: '2px' }}>
                {gender === 'ไร้เพศ' ? '⚪ ไร้เพศ' : gender === 'เพศเมีย' ? '♀️ เพศเมีย' : gender === 'เพศผู้' ? '♂️ เพศผู้' : gender === 'หญิง' ? '♀️ เพศหญิง' : '♂️ เพศชาย'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biological Specifications: 3-Column Breakdown (อธิบายลักษณะชัดเจน) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '10px',
        fontSize: '12px',
        backgroundColor: '#07090e',
        borderRadius: '10px',
        padding: '14px',
        border: '1px solid #1e293b'
      }}>
        {/* Box 1: Visual Appearance */}
        <div style={{ borderRight: '1px dashed #1e293b', paddingRight: '10px' }}>
          <div style={{ color: '#38bdf8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span>👁️</span> รูปลักษณ์และผิวสัมผัส
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
            {race.appearance || race.desc}
          </div>
        </div>

        {/* Box 2: Biological Strengths */}
        <div style={{ borderRight: '1px dashed #1e293b', paddingRight: '10px' }}>
          <div style={{ color: '#4ade80', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span>⚡</span> จุดเด่นทางชีววิทยา
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
            {race.strengths || (
              race.bodyType === 'slime' ? 'ย่อยสลายสสารเพื่อขยายขนาด, ไหลลอดรูแคบได้, ทนการโจมตีกายภาพ' :
              race.bodyType === 'skeleton' ? 'ไม่หิวข้าว, ไม่เหนื่อยล้า, ไม่มีเลือดเนื้อให้เสีย, ซ่อมแซมกระดูกได้' :
              race.bodyType === 'sword' ? 'คมกริบตัดผ่านเกราะ, ดูดซับไอมานา, ร่างกายเหล็กกล้าทนทาน' :
              race.bodyType === 'beast' ? 'สี่ขาว่องไว, สัญชาตญาณสัตว์ป่าระวังภัยสูง, ฟื้นตัวเร็ว' :
              race.bodyType === 'object' ? 'ไม่รู้สึกเจ็บปวด, ไร้กิเลสความกลัว, กลมกลืนกับสภาพแวดล้อม' :
              race.bodyType === 'truck' ? 'พุ่งชนด้วยแรงมหาศาล, ร่างกายเหล็กกล้าไร้เทียมทาน, มีแตรข่มขู่' :
              'ใช้เครื่องมือและอาวุธได้ครบทุกประเภท, เรียนรู้วิชาการและเวทมนตร์ได้กว้างขวาง'
            )}
          </div>
        </div>

        {/* Box 3: Physiological Limitations */}
        <div>
          <div style={{ color: '#f87171', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <span>⚠️</span> ข้อจำกัดทางสรีระ
          </div>
          <div style={{ color: '#cbd5e1', lineHeight: '1.5' }}>
            {race.weaknesses || (
              race.bodyType === 'slime' ? 'ไม่มีมือจับอาวุธทั่วไป, ไม่มีขาเดิน (เคลื่อนที่ช้า), แพ้ความร้อนแห้ง' :
              race.bodyType === 'skeleton' ? 'ไม่มีกระเพาะอาหารกินข้าวไม่ได้, กระดูกเปราะต่อการทุบตีด้วยค้อน' :
              race.bodyType === 'sword' ? 'ไม่มีแขนขาเดินเอง ต้องรอคนมาถือหรือสะสมพลังจิตลอยตัว' :
              race.bodyType === 'spider' ? 'ไม่มีมือจับดาบแบบคน (มีแต่ขาแมลง), ร่างกายเล็กเมื่อแรกเกิด' :
              race.bodyType === 'beast' ? 'จับด้ามอาวุธหรือเครื่องมือมนุษย์ไม่ได้, กินยาเม็ดลำบาก' :
              race.bodyType === 'object' ? 'เคลื่อนไหวเองไม่ได้หรือช้ามาก, ต้องอาศัยกลไกเฉพาะตัว' :
              race.bodyType === 'truck' ? 'เข้าประตูบ้านคนไม่ได้, สิ้นเปลืองพลังงานดีเซลและวิญญาณ' :
              'ร่างกายเปราะบาง บาดเจ็บเลือดไหลได้ง่าย, ต้องกินอาหารและนอนหลับทุกวัน'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
