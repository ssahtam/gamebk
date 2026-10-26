import React, { useState } from 'react';
import PixelSceneIllustrator from './PixelSceneIllustrator.jsx';

export default function MajorDecisionModal({
  decision,
  characterName = 'ผู้ถูกเลือก',
  character = null,
  netWorth = 0,
  stats = { str: 10, int: 10, luk: 10 },
  onSelectChoice,
  onDismiss
}) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [resolvedOutcome, setResolvedOutcome] = useState(null);

  if (!decision) return null;

  const isCrisis = Boolean(decision.isCrisis);
  const isLore = Boolean(decision.isLoreChapter);

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

  const getCleanChoiceText = (rawText) => {
    if (!rawText) return '';
    let t = rawText;
    if (t.includes(':')) {
      t = t.split(':')[0];
    } else if (t.includes(' - ')) {
      t = t.split(' - ')[0];
    }
    t = t.replace(/\[.*?\]/g, '').trim();
    return t;
  };

  const handlePickOption = (choice) => {
    // ตรวจสอบเงื่อนไขค่าสเตตัส (reqStat) หากมี
    let isSuccess = true;
    let finalLog = choice.log || choice.result || 'การตัดสินใจของคุณส่งผลต่อเส้นทางชีวิตอย่างยิ่งใหญ่!';
    let rawChanges = { ...(choice.statEffect || choice.changes || {}) };

    if (choice.reqStat) {
      if (choice.reqStat.str && (stats.str || 10) < choice.reqStat.str) isSuccess = false;
      if (choice.reqStat.int && (stats.int || 10) < choice.reqStat.int) isSuccess = false;
      if (choice.reqStat.luk && (stats.luk || 10) < choice.reqStat.luk) isSuccess = false;

      if (isSuccess) {
        finalLog = choice.successResult || finalLog;
        rawChanges = { ...(choice.successChanges || rawChanges) };
      } else {
        finalLog = choice.failResult || finalLog;
        rawChanges = { ...(choice.failChanges || rawChanges) };
      }
    }

    // หักค่าใช้จ่าย reqGold หากยังไม่ได้รวมใน changes.gold
    if (choice.reqGold && rawChanges.gold === undefined) {
      rawChanges.gold = -Number(choice.reqGold);
    }

    const enrichedChoice = {
      ...choice,
      resolvedLog: finalLog,
      resolvedChanges: rawChanges,
      isSuccess
    };

    setSelectedChoice(choice);
    setResolvedOutcome(enrichedChoice);
  };

  const delta = resolvedOutcome?.resolvedChanges || {};

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
        border: isCrisis ? '2px solid #ef4444' : isLore ? '2px solid #a855f7' : '1.5px solid #f59e0b',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        boxShadow: isCrisis
          ? '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(239, 68, 68, 0.35)'
          : '0 20px 50px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.25)',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid #1e293b',
          backgroundColor: isCrisis ? 'rgba(153, 27, 27, 0.35)' : isLore ? 'rgba(88, 28, 135, 0.35)' : '#080c14'
        }}>
          <span style={{
            backgroundColor: isCrisis ? '#ef4444' : isLore ? 'rgba(168, 85, 247, 0.25)' : 'rgba(245, 158, 11, 0.2)',
            border: isCrisis ? '1px solid #f87171' : isLore ? '1px solid #c084fc' : '1px solid #f59e0b',
            color: isCrisis ? '#ffffff' : isLore ? '#e9d5ff' : '#fbbf24',
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.5px'
          }}>
            {isCrisis
              ? `🚨 เกิดเรื่องด่วน! (วัย ${decision.age} ปี)`
              : isLore
              ? `📜 บทละครแห่งโชคชะตา (วัย ${decision.age} ปี)`
              : `⭐ จุดเปลี่ยนชีวิต (วัย ${decision.age} ปี)`}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#4ade80', fontWeight: 'bold' }}>
              🪙 ทุนที่มี: {netWorth}G
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

        {/* Animated Living Diorama Banner */}
        <div style={{ padding: '14px 18px 0 18px' }}>
          <PixelSceneIllustrator
            sceneId={sceneId}
            height={145}
            animated={true}
            character={character}
            age={decision.age || 18}
          />
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 20px 20px 20px' }}>
          {!selectedChoice ? (
            <>
              <h2 style={{
                fontSize: '18px',
                color: isCrisis ? '#fca5a5' : '#f8fafc',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
                lineHeight: '1.4'
              }}>
                {decision.title}
              </h2>

              <p style={{
                fontSize: '13.5px',
                color: '#cbd5e1',
                lineHeight: '1.65',
                marginBottom: '14px'
              }}>
                {decision.desc ? decision.desc.replace(/เจ้า/g, characterName) : ''}
              </p>

              {decision.insight && (
                <div style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.08)',
                  borderLeft: '3px solid #38bdf8',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#93c5fd',
                  marginBottom: '14px',
                  borderRadius: '0 6px 6px 0'
                }}>
                  💡 {decision.insight}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {decision.choices && decision.choices.map((choice, index) => {
                  const cleanText = getCleanChoiceText(choice.text);
                  const reqGold = Number(choice.reqGold || 0);
                  const canAfford = netWorth >= reqGold;

                  return (
                    <button
                      key={choice.id || index}
                      disabled={!canAfford}
                      onClick={() => canAfford && handlePickOption(choice)}
                      style={{
                        backgroundColor: !canAfford ? '#090d16' : '#111827',
                        border: isCrisis ? '1.5px solid #450a0a' : '1.5px solid #2d3748',
                        borderLeft: !canAfford ? '4px solid #475569' : isCrisis ? '4px solid #ef4444' : '4px solid #f59e0b',
                        borderRadius: '8px',
                        padding: '13px 16px',
                        textAlign: 'left',
                        color: !canAfford ? '#64748b' : '#f8fafc',
                        cursor: !canAfford ? 'not-allowed' : 'pointer',
                        opacity: !canAfford ? 0.65 : 1,
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', lineHeight: '1.4' }}>
                          {cleanText}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {reqGold > 0 && (
                            <span style={{
                              fontSize: '11px',
                              color: canAfford ? '#fde047' : '#f87171',
                              fontWeight: 'bold'
                            }}>
                              🪙 ใช้ {reqGold}G {!canAfford && `(เงินไม่พอ ขาดอีก ${reqGold - netWorth}G)`}
                            </span>
                          )}
                          {choice.reqStat && (
                            <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                              🎲 ทดสอบค่าสถานะ ({Object.entries(choice.reqStat).map(([k, v]) => `${k.toUpperCase()} ≥ ${v}`).join(', ')})
                            </span>
                          )}
                        </div>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '16px', flexShrink: 0 }}>➔</span>
                    </button>
                  );
                })}
              </div>

              <div style={{ textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                <button
                  onClick={() => {
                    const affordableChoices = (decision.choices || []).filter(c => netWorth >= Number(c.reqGold || 0));
                    const pickPool = affordableChoices.length > 0 ? affordableChoices : (decision.choices || []);
                    if (pickPool[0]) {
                      handlePickOption(pickPool[Math.floor(Math.random() * pickPool.length)]);
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  🎲 ให้โชคชะตาสุ่มเลือกทางที่จ่ายไหวให้อัตโนมัติ
                </button>
              </div>
            </>
          ) : (
            <div style={{
              backgroundColor: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '18px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: resolvedOutcome?.isSuccess === false ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: resolvedOutcome?.isSuccess === false ? '1px solid #ef4444' : '1px solid #38bdf8',
                borderRadius: '20px',
                padding: '3px 12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '13px' }}>{resolvedOutcome?.isSuccess === false ? '💥' : '✨'}</span>
                <span style={{ fontSize: '12px', color: resolvedOutcome?.isSuccess === false ? '#fca5a5' : '#38bdf8', fontWeight: 'bold' }}>
                  {resolvedOutcome?.isSuccess === false ? 'ค่าสถานะไม่ถึงเกณฑ์ • เกิดผลลัพธ์พลิกผัน!' : 'ผลลัพธ์ที่เกิดขึ้น!'}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>
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
                marginBottom: '14px',
                textAlign: 'left'
              }}>
                {resolvedOutcome?.resolvedLog}
              </div>

              {/* แสดงผลกระทบค่าสถานะอย่างชัดเจน */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '18px' }}>
                {delta.hp !== undefined && delta.hp !== 0 && (
                  <span style={pillStyle(delta.hp > 0)}>
                    {delta.hp > 0 ? `❤️ สุขภาพ +${delta.hp}` : `💔 สุขภาพ ${delta.hp}`}
                  </span>
                )}
                {delta.san !== undefined && delta.san !== 0 && (
                  <span style={pillStyle(delta.san > 0)}>
                    {delta.san > 0 ? `🧠 สติ/ความสุข +${delta.san}` : `⚠️ สติ/ความสุข ${delta.san}`}
                  </span>
                )}
                {delta.gold !== undefined && delta.gold !== 0 && (
                  <span style={pillStyle(delta.gold > 0)}>
                    {delta.gold > 0 ? `🪙 ทอง +${delta.gold}G` : `💸 ทอง ${delta.gold}G`}
                  </span>
                )}
                {delta.int !== undefined && delta.int !== 0 && (
                  <span style={pillStyle(delta.int > 0)}>
                    {delta.int > 0 ? `📖 ความรู้ +${delta.int}` : `📖 ความรู้ ${delta.int}`}
                  </span>
                )}
                {delta.rel !== undefined && delta.rel !== 0 && (
                  <span style={pillStyle(delta.rel > 0)}>
                    {delta.rel > 0 ? `🤝 ความสัมพันธ์ +${delta.rel}` : `🤝 ความสัมพันธ์ ${delta.rel}`}
                  </span>
                )}
                {delta.str !== undefined && delta.str !== 0 && (
                  <span style={pillStyle(delta.str > 0)}>
                    {delta.str > 0 ? `💪 STR +${delta.str}` : `💪 STR ${delta.str}`}
                  </span>
                )}
                {delta.luk !== undefined && delta.luk !== 0 && (
                  <span style={pillStyle(delta.luk > 0)}>
                    {delta.luk > 0 ? `🍀 LUK +${delta.luk}` : `🍀 LUK ${delta.luk}`}
                  </span>
                )}
                {delta.debt !== undefined && delta.debt !== 0 && (
                  <span style={pillStyle(delta.debt < 0)}>
                    {delta.debt > 0 ? `⚠️ หนี้ +${delta.debt}G` : `✅ ลดหนี้ ${delta.debt}G`}
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectChoice(resolvedOutcome)}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
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

const pillStyle = (positive) => ({
  backgroundColor: positive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
  border: positive ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
  color: positive ? '#86efac' : '#fca5a5',
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '11.5px',
  fontWeight: 'bold'
});
