import React, { useState } from 'react';
import PixelSceneIllustrator from './PixelSceneIllustrator';

export default function MajorDecisionModal({
  decision,
  characterName = 'ผู้ถูกเลือก',
  onSelectChoice,
  onAutoDecide,
  onDismiss
}) {
  const [selectedChoice, setSelectedChoice] = useState(null);

  if (!decision) return null;

  const isCrisis = Boolean(decision.isCrisis);

  // Map appropriate Pixel Meme Scene ID
  const getSceneId = () => {
    if (decision.sceneId) return decision.sceneId;
    const id = decision.id || '';
    if (id.includes('truck')) return 'truck';
    if (id.includes('vending') || id.includes('obj')) return 'vending';
    if (id.includes('sword') || id.includes('berserk')) return 'berserk';
    if (id.includes('plague') || id.includes('black_mist') || id.includes('conan')) return 'conan';
    if (id.includes('famine') || id.includes('famine_inflation')) return 'famine';
    if (id.includes('war') || id.includes('tax') || id.includes('radahn') || id.includes('boss')) return 'radahn';
    if (id.includes('layoff') || id.includes('economic') || id.includes('bandit') || id.includes('fire')) return 'alley';
    if (id.includes('mimic') || id.includes('dungeon')) return 'mimic';
    if (id.includes('aqua') || id.includes('debt') || id.includes('mushroom')) return 'aqua';
    if (id.includes('saitama') || id.includes('market')) return 'saitama';
    return isCrisis ? 'berserk' : 'alley';
  };

  const sceneId = getSceneId();

  // Helper เพื่อลบสปอยล์ผลลัพธ์ออกจากปุ่มตัวเลือก 100%
  const getCleanChoiceText = (rawText) => {
    if (!rawText) return '';
    let t = rawText;
    // ถ้ามีโคลอนหรือแดชที่อธิบายผลลัพธ์ เช่น "1. กลืนผลึก: ร่างกายเปลี่ยนเป็น..." ให้ตัดออกเอาแค่การกระทำ
    if (t.includes(':')) {
      t = t.split(':')[0];
    } else if (t.includes(' - ')) {
      t = t.split(' - ')[0];
    }
    // ตัดวงเล็บ [สายป้องกัน], [INT +5] ทั้งหมด
    t = t.replace(/\[.*?\]/g, '').trim();
    return t;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(3, 7, 18, 0.92)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#0c1017',
        border: isCrisis ? '2px solid #ef4444' : '1.5px solid #f59e0b',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        boxShadow: isCrisis
          ? '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(239, 68, 68, 0.35)'
          : '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.25)',
        overflowY: 'auto',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: isCrisis ? 'rgba(153, 27, 27, 0.35)' : '#080c14'
        }}>
          <span style={{
            backgroundColor: isCrisis ? '#ef4444' : 'rgba(245, 158, 11, 0.2)',
            border: isCrisis ? '1px solid #f87171' : '1px solid #f59e0b',
            color: isCrisis ? '#ffffff' : '#fbbf24',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            {isCrisis ? `🚨 เกิดเรื่องด่วน! (วัย ${decision.age} ปี)` : `⭐ จุดเปลี่ยนชีวิต (วัย ${decision.age} ปี)`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              ปี {2026 + decision.age}
            </span>
            <button
              onClick={onDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '11.5px',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              title="พับเก็บไว้ก่อน"
            >
              พับไว้ก่อน ▾
            </button>
          </div>
        </div>

        {/* 32-Bit Pixel Scene Banner */}
        <div style={{ padding: '14px 18px 0 18px' }}>
          <PixelSceneIllustrator sceneId={sceneId} height={145} animated={true} />
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px 20px 20px' }}>
          
          {/* STEP 1: ผู้เล่นยังไม่ได้เลือก (แสดงเนื้อหาและตัวเลือกแบบไม่มีสปอยล์) */}
          {!selectedChoice ? (
            <>
              {/* Title */}
              <h2 style={{
                fontSize: '18px',
                color: isCrisis ? '#fca5a5' : '#f8fafc',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
                lineHeight: '1.4'
              }}>
                {decision.title}
              </h2>

              {/* Narrative context & Dialogue */}
              <p style={{
                fontSize: '13.5px',
                color: '#cbd5e1',
                lineHeight: '1.65',
                marginBottom: '18px'
              }}>
                {decision.desc ? decision.desc.replace(/เจ้า/g, characterName) : ''}
              </p>

              {/* Choices: Clean and Punchy without stat spoilers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {decision.choices && decision.choices.map((choice, index) => {
                  const cleanText = getCleanChoiceText(choice.text);

                  return (
                    <button
                      key={choice.id || index}
                      onClick={() => setSelectedChoice(choice)}
                      style={{
                        backgroundColor: '#111827',
                        border: isCrisis ? '1.5px solid #450a0a' : '1.5px solid #2d3748',
                        borderLeft: isCrisis ? '4px solid #ef4444' : '4px solid #f59e0b',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        textAlign: 'left',
                        color: '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isCrisis ? '#1c1917' : '#1e293b';
                        e.currentTarget.style.borderColor = isCrisis ? '#ef4444' : '#ffd166';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#111827';
                        e.currentTarget.style.borderColor = isCrisis ? '#450a0a' : '#2d3748';
                        e.currentTarget.style.borderLeftColor = isCrisis ? '#ef4444' : '#f59e0b';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '14.5px', color: '#f8fafc', lineHeight: '1.4' }}>
                        {cleanText}
                      </div>
                      <span style={{ color: '#64748b', fontSize: '16px', flexShrink: 0 }}>➔</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Action: Auto-decide */}
              <div style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                <button
                  onClick={() => {
                    const firstChoice = decision.choices?.[0];
                    if (firstChoice) setSelectedChoice(firstChoice);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ให้เกมสุ่มเลือกแทนอัตโนมัติ
                </button>
              </div>
            </>
          ) : (
            /* STEP 2: เลือกแล้วค่อยบอก! (Result Reveal Screen) */
            <div style={{
              backgroundColor: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '18px',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                borderRadius: '20px',
                padding: '3px 12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '13px' }}>✨</span>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>
                  ผลลัพธ์ที่เกิดขึ้น!
                </span>
              </div>

              <div style={{
                fontSize: '13px',
                color: '#94a3b8',
                marginBottom: '10px'
              }}>
                คุณตัดสินใจ: <span style={{ color: '#facc15', fontWeight: 'bold' }}>"{getCleanChoiceText(selectedChoice.text)}"</span>
              </div>

              <div style={{
                backgroundColor: '#111827',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '14px 16px',
                fontSize: '14px',
                color: '#f1f5f9',
                lineHeight: '1.6',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                {selectedChoice.log || selectedChoice.result || 'การตัดสินใจของคุณส่งผลต่อเส้นทางชีวิตอย่างยิ่งใหญ่!'}
              </div>

              <button
                onClick={() => onSelectChoice(selectedChoice)}
                style={{
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '12px 28px',
                  fontSize: '14.5px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(225, 29, 72, 0.4)',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f43f5e';
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e11d48';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span>ลุยต่อเลย</span>
                <span>➔</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
