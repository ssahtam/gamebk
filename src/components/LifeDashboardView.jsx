import React, { useState, useEffect, useRef } from 'react';
import PixelSceneBox from './PixelSceneBox';
import SceneViewport from './SceneViewport';
import PixelSceneIllustrator from './PixelSceneIllustrator';
import PixelCharacterAvatar from './PixelCharacterAvatar';
import PixelMemeAvatar from './PixelMemeAvatar';
import { PORTRAIT_IMAGE_MAP } from './CharacterVisualCard';
import MajorDecisionModal from './MajorDecisionModal';
import { getMajorDecisionForAge, generateAnnualLog, MAJOR_DECISIONS } from '../data/lifeSimulationEngine';
import { getTaxonomyCategory, getLineageOrigin, checkAnnualCrisis } from '../data/lifeCrisesEngine';

const statBadgeStyle = (isPositive) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
  border: isPositive ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
  color: isPositive ? '#86efac' : '#fca5a5',
  padding: '1px 5px',
  borderRadius: '3px',
  fontSize: '10.5px',
  fontWeight: '600'
});

export default function LifeDashboardView({
  character,
  characterName,
  gender,
  realm,
  socialClass,
  gold,
  debt: initialDebt,
  onDie,
  onReincarnate
}) {
  const taxonomy = getTaxonomyCategory(character?.race);
  const lineage = getLineageOrigin(character, realm, socialClass);
  const seenEventsRef = useRef(new Set());
  const seenDecisionsRef = useRef(new Set());

  // Simulation Timer State
  // เริ่มต้นแบบ "หยุดชั่วคราว" (PAUSED) เสมอ เพื่อให้ผู้เล่นได้อ่านประวัติตัวละครและสเตตัสอย่างสบายใจ
  const [age, setAge] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x (8s/ปี), 0.5x (12s/ปี), 2x (4s/ปี), 4x (2s/ปี)
  const [autoDecide, setAutoDecide] = useState(false);

  // High-precision ticking progress bar for the current year (0% - 100%)
  const [yearProgress, setYearProgress] = useState(0);

  // Center Viewport Display Mode: Locked to 32-bit Retro Pixel Art
  const viewportMode = '32bit';
  const [currentSceneId, setCurrentSceneId] = useState(
    socialClass?.id === 'destitute' ? 'famine' :
    (realm?.id?.includes('bamboo') || realm?.name?.includes('ไผ่') || realm?.name?.includes('Forest') || realm?.name?.includes('ป่า') || realm?.name?.includes('Bamboo')) ? 'forest' :
    taxonomy === 'object' ? 'mimic' : 'alley'
  );

  // 4 Core Vital Status Bars (0 - 100)
  const [health, setHealth] = useState(character?.race?.baseHp ? Math.min(100, character.race.baseHp + 10) : 85);
  const [happiness, setHappiness] = useState(character?.race?.baseSan ? Math.min(100, character.race.baseSan + 10) : 65);
  const [knowledge, setKnowledge] = useState(character?.race?.int ? Math.min(100, character.race.int * 4) : 45);
  const [relationships, setRelationships] = useState(55);

  // Finances & Housing
  const [netWorth, setNetWorth] = useState(gold || 25);
  const [debt, setDebt] = useState(initialDebt || 0);
  const [housing, setHousing] = useState(
    taxonomy === 'object' ? (character?.race?.id === 'vending_machine' ? 'ป้ายรถม้าข้างทางเข้าดันเจี้ยน' : 'แท่นศิลาในป่าไผ่') :
    taxonomy === 'undead' ? 'สุสานใต้ดินวิหารร้าง' :
    taxonomy === 'monster' ? 'ซอกหินใต้ดันเจี้ยน' :
    taxonomy === 'beast' ? 'บ่อน้ำแร่ออนเซ็นธรรมชาติ' :
    'ยังอาศัยอยู่กับครอบครัว'
  );
  const [education, setEducation] = useState(
    taxonomy === 'object' ? 'ติดตั้งระบบปฏิบัติการเวทมนตร์' :
    taxonomy === 'undead' ? 'ตื่นรู้จากไอวิญญาณมืด' :
    taxonomy === 'beast' ? 'สัญชาตญาณสัตว์ป่า' :
    'ยังไม่ถึงเกณฑ์เรียน'
  );
  const [jobTitle, setJobTitle] = useState(
    taxonomy === 'object' ? 'วัตถุมีวิญญาณเปิดใช้งานใหม่' :
    taxonomy === 'undead' ? 'อันเดดตื่นจากหลุมศพ' :
    taxonomy === 'monster' ? 'มอนสเตอร์แรกเกิด' :
    taxonomy === 'beast' ? 'สัตว์อสูรแรกเกิด' :
    'ทารกแรกเกิด'
  );

  // Active Major Decision or Random Life Crisis Modal
  const [activeDecision, setActiveDecision] = useState(null);

  // Life Timeline Stream Logs
  const [chronicleLogs, setChronicleLogs] = useState([
    {
      id: 'init_birth_0',
      age: 0,
      text: `เดือนกรกฎาคม ปี 2026 คุณถือกำเนิดเป็น "${characterName}" เผ่า ${character?.race?.name || 'โนเนม'} (${lineage?.title || 'สายเลือด'}) ณ แคว้น ${realm?.name || ''} ชนชั้น ${socialClass?.name || ''}`,
      sceneId: socialClass?.id === 'destitute' ? 'famine' : (realm?.id?.includes('bamboo') || realm?.name?.includes('ไผ่') || realm?.name?.includes('Forest') || realm?.name?.includes('ป่า') || realm?.name?.includes('Bamboo')) ? 'forest' : taxonomy === 'object' ? 'vending' : 'alley',
      statDelta: { hp: character?.race?.baseHp || 80, gold: gold || 25 },
      highlight: true
    },
    {
      id: 'init_birth_1',
      age: 0,
      text: taxonomy === 'object' ? 'คอร์พลังงานและเฟืองเวทมนตร์ภายในเริ่มหมุนทำงาน อัตราการสึกหรอยังเป็น 0%' :
            taxonomy === 'undead' ? 'ไอวิญญาณสีครามจุดประกายในเบ้าตา ซากกระดูกเริ่มขยับเขยื้อน' :
            taxonomy === 'monster' ? 'หยดตัวลงสู่แอ่งน้ำมืดมิด สัญชาตญาณการเอาชีวิตรอดทำงานทันที' :
            taxonomy === 'beast' ? 'ลืมตาดูโลกริมลำธาร ขนอ่อนนุ่มช่วยกันลมหนาวได้อย่างอบอุ่น' :
            `ได้รับไออุ่นจากครอบครัว อัตราการรอดชีวิตในแคว้นราว ${socialClass?.id === 'destitute' ? '92%' : '99%'}`,
      sceneId: taxonomy === 'object' ? 'vending' : taxonomy === 'undead' ? 'graveyard' : taxonomy === 'beast' ? 'capybara' : 'alley',
      statDelta: {},
      highlight: false
    }
  ]);

  // Life Grid Map: 80 boxes (1 box = 1 year)
  const [lifeGridHistory, setLifeGridHistory] = useState([
    { age: 0, year: 2026, health: health, happiness: happiness, summary: 'กำเนิดในโลกมืด' }
  ]);
  const [hoveredGridYear, setHoveredGridYear] = useState(null);

  // Parallel Cohort tracking in the fantasy world
  const [cohort] = useState([
    { name: 'กัตซ์', realm: 'ค่ายผาหิน (ออร์ค)', stage: 'วัยเด็กเล็ก' },
    { name: 'เลโกลัส', realm: 'พงไพรศักดิ์สิทธิ์ (เอลฟ์)', stage: 'วัยเด็กเล็ก' },
    { name: 'ริมุรุ', realm: 'ถ้ำมืด (สไลม์)', stage: 'วัยเด็กเล็ก' },
    { name: 'บรู๊ค', realm: 'สุสานโบราณ (โครงกระดูก)', stage: 'วัยเด็กเล็ก' }
  ]);

  const chronicleEndRef = useRef(null);

  // Speed mapping in milliseconds (ปรับให้ช้าลงมาก เพื่อให้อ่านเรื่องราวและสเตตัสทัน):
  // 0.5x = 12000ms (12 วินาที/ปี อ่านสบายๆ ไม่รีบร้อน)
  // 1x = 8000ms (8 วินาที/ปี ความเร็วมาตรฐาน)
  // 2x = 4000ms (4 วินาที/ปี)
  // 4x = 2000ms (2 วินาที/ปี)
  const getIntervalMs = (s) => {
    switch (s) {
      case 4: return 2000;
      case 2: return 4000;
      case 0.5: return 12000;
      case 1:
      default: return 8000;
    }
  };

  // High-precision ticking loop for smooth year progress
  useEffect(() => {
    if (!isRunning || activeDecision !== null) return;

    const intervalMs = getIntervalMs(speed);
    const tickStepMs = 100;
    const increment = (tickStepMs / intervalMs) * 100;

    const interval = setInterval(() => {
      setYearProgress(prev => {
        if (prev + increment >= 100) {
          handleAdvanceYear();
          return 0;
        }
        return prev + increment;
      });
    }, tickStepMs);

    return () => clearInterval(interval);
  }, [isRunning, speed, age, activeDecision, health, netWorth]);

  // Advance 1 Year of Life
  const handleAdvanceYear = () => {
    const nextAge = age + 1;

    // Check if reaches death threshold
    if (health <= 0 || nextAge > (character?.race?.maxAge || 80)) {
      setIsRunning(false);
      onDie({
        age: age,
        cause: health <= 0 ? 'สุขภาพทรุดโทรมจนสิ้นใจตามธรรมชาติในโลกมืด' : 'สิ้นอายุขัยของสายพันธุ์อย่างสงบ',
        name: characterName,
        race: character?.race?.name || 'โนเนม',
        netWorth: netWorth
      });
      return;
    }

    // 1. Check for Tailored Major Decision (ตามสายพันธุ์: object, beast, monster, undead, humanoid)
    const pendingDecision = getMajorDecisionForAge(nextAge, character, seenDecisionsRef.current);

    if (pendingDecision && !autoDecide) {
      setActiveDecision(pendingDecision);
      setAge(nextAge);
      setYearProgress(0);
      return;
    }

    if (pendingDecision && autoDecide) {
      const defaultChoice = pendingDecision.choices[0];
      applyDecisionChoice(defaultChoice, nextAge);
      setAge(nextAge);
      setYearProgress(0);
      return;
    }

    // 2. Check for Random Life Crises (วิกฤตการณ์ชีวิตสุ่มแทรกซ้อน ห้ามซ้ำ ID ในชีวิตเดียว)
    const crisis = checkAnnualCrisis(nextAge, character, { health, happiness }, seenDecisionsRef.current);
    if (crisis && !autoDecide) {
      seenDecisionsRef.current.add(crisis.id);
      setActiveDecision({
        ...crisis,
        age: nextAge,
        isCrisis: true,
        title: crisis.name,
        desc: crisis.desc
      });
      setAge(nextAge);
      setYearProgress(0);
      return;
    }

    // 3. Normal Year Advance
    setAge(nextAge);
    setYearProgress(0);

    // Apply class inequality effects: Slum dwellers have harsher health fluctuation
    const isSlum = socialClass?.id === 'destitute';
    const hpDelta = isSlum ? (Math.floor(Math.random() * 8) - 5) : (Math.floor(Math.random() * 5) - 2);
    const hapDelta = Math.floor(Math.random() * 5) - 2;

    const newHp = Math.min(100, Math.max(5, health + hpDelta));
    const newHap = Math.min(100, Math.max(5, happiness + hapDelta));
    setHealth(newHp);
    setHappiness(newHap);

    // Generate dynamic species-appropriate non-repetitive chronicle log with stats and scene
    const annualEvent = generateAnnualLog(nextAge, character, { realm, socialClass }, { health: newHp, happiness: newHap }, seenEventsRef.current);

    // Apply stat changes from annual event (Buffs & Debuffs)
    const delta = annualEvent.statDelta || {};
    let finalHp = newHp;
    let finalHap = newHap;
    if (delta.hp) {
      finalHp = Math.min(100, Math.max(5, newHp + delta.hp));
      setHealth(finalHp);
    }
    if (delta.san) {
      finalHap = Math.min(100, Math.max(5, newHap + delta.san));
      setHappiness(finalHap);
    }
    if (delta.gold) setNetWorth(prev => Math.max(0, prev + delta.gold));
    if (delta.int) setKnowledge(prev => Math.min(100, Math.max(5, prev + delta.int)));
    if (delta.rel) setRelationships(prev => Math.min(100, Math.max(5, prev + delta.rel)));
    if (delta.debt) setDebt(prev => Math.max(0, prev + delta.debt));

    // Update dynamic scene backdrop immediately to match this event's scene!
    if (annualEvent.sceneId) {
      setCurrentSceneId(annualEvent.sceneId);
    }

    setChronicleLogs(prev => [
      {
        id: annualEvent.id || `ev_${nextAge}_${Date.now()}`,
        age: nextAge,
        text: annualEvent.text,
        sceneId: annualEvent.sceneId || 'alley',
        statDelta: annualEvent.statDelta || {},
        highlight: false,
        isCrisis: false
      },
      ...prev
    ]);

    // Update Life Grid
    setLifeGridHistory(prev => [
      ...prev,
      { age: nextAge, year: 2026 + nextAge, health: finalHp, happiness: finalHap, summary: annualEvent.text }
    ]);
  };

  // Handle choice made in Decision/Crisis Modal
  const applyDecisionChoice = (choice, decisionAge) => {
    const targetAge = decisionAge || age;

    const changes = choice.statEffect || choice.changes || {};

    if (changes.hp) setHealth(prev => Math.min(100, Math.max(5, prev + changes.hp)));
    if (changes.san) setHappiness(prev => Math.min(100, Math.max(5, prev + changes.san)));
    if (changes.int) setKnowledge(prev => Math.min(100, Math.max(5, prev + changes.int)));
    if (changes.rel) setRelationships(prev => Math.min(100, Math.max(5, prev + changes.rel)));
    if (changes.gold) setNetWorth(prev => Math.max(0, prev + changes.gold));
    if (changes.debt) setDebt(prev => Math.max(0, prev + changes.debt));

    if (choice.education) setEducation(choice.education);
    if (choice.job) setJobTitle(choice.job);
    if (choice.housing) setHousing(choice.housing);

    const choiceSceneId = activeDecision?.sceneId || (activeDecision?.isCrisis ? 'berserk' : 'alley');
    setCurrentSceneId(choiceSceneId);

    const logEntry = choice.log || choice.result || choice.text;
    setChronicleLogs(prev => [
      {
        id: `decision_${targetAge}_${Date.now()}`,
        age: targetAge,
        text: `อายุ ${targetAge} ปี (${activeDecision?.isCrisis ? '⚠️ วิกฤตการณ์' : 'การตัดสินใจ'}): ${logEntry}`,
        sceneId: choiceSceneId,
        statDelta: changes,
        highlight: true,
        isCrisis: activeDecision?.isCrisis
      },
      ...prev
    ]);

    setLifeGridHistory(prev => [
      ...prev,
      { age: targetAge, year: 2026 + targetAge, health: health, happiness: happiness, summary: logEntry }
    ]);

    setActiveDecision(null);
  };

  // Jump to Next Major Decision button
  const handleJumpToNextDecision = () => {
    const candidateAges = [2, 5, 8, 13, 18, 25, 35, 50, 65];
    const nextDecisionAge = candidateAges.find(a => a > age);
    if (nextDecisionAge) {
      setAge(nextDecisionAge);
      const dec = getMajorDecisionForAge(nextDecisionAge, character, seenDecisionsRef.current);
      if (dec) setActiveDecision(dec);
    } else {
      handleAdvanceYear();
    }
  };

  // Maximum Lifespan of this race
  const maxLifespan = character?.race?.maxAge || 80;

  return (
    <div style={{
      width: '100%',
      maxWidth: '1260px',
      margin: '0 auto',
      backgroundColor: '#090d16',
      color: '#cbd5e1',
      fontFamily: "'Sarabun', sans-serif"
    }}>
      {/* ======================================================== */}
      {/* 1. TOP SIMULATION SPEED & CONTROL BAR                    */}
      {/* ======================================================== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 18px',
        backgroundColor: '#060911',
        borderBottom: '1px solid #1a2233',
        marginBottom: '10px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Title, Current Age & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#e11d48', fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.5px' }}>
            1 ใน 100 ล้าน
          </span>
          <span style={{
            backgroundColor: '#1e293b',
            color: '#f8fafc',
            padding: '3px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '1px solid #334155'
          }}>
            อายุ {age} ปี
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            ปี {2026 + age} • <strong style={{ color: '#ffd166' }}>{characterName}</strong> ({character.race.name})
          </span>
        </div>

        {/* Speed & Control Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Pause / Play */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              backgroundColor: isRunning ? '#1f293d' : '#e11d48',
              border: '1px solid #334155',
              color: '#fff',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isRunning ? '❚❚ หยุดชั่วคราว' : '▶ เล่นต่อ'}
          </button>

          {/* Manual Step +1 Year Button (Player can advance year by year at own pace!) */}
          <button
            onClick={() => {
              setIsRunning(false);
              handleAdvanceYear();
            }}
            style={{
              backgroundColor: '#8a0303',
              border: '1.5px solid #c99738',
              color: '#ffd166',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(138, 3, 3, 0.4)'
            }}
            title="ก้าวไปข้างหน้าทีละ 1 ปีตามใจชอบ อ่านเรื่องราวทีละปีสบายๆ"
          >
            ⏩ ก้าวไปปีถัดไป (+1 ปี)
          </button>

          {/* Speed Presets (ผ่อนคลาย อ่านทันแน่นอน) */}
          {[
            { spd: 0.5, label: '0.5x (12วิ)' },
            { spd: 1, label: '1x (8วิ)' },
            { spd: 2, label: '2x (4วิ)' },
            { spd: 4, label: '4x (2วิ)' }
          ].map(({ spd, label }) => (
            <button
              key={spd}
              onClick={() => {
                setSpeed(spd);
                setIsRunning(true);
              }}
              style={{
                backgroundColor: speed === spd ? '#e11d48' : '#0f172a',
                border: speed === spd ? '1px solid #f43f5e' : '1px solid #1e293b',
                color: speed === spd ? '#fff' : '#94a3b8',
                padding: '5px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              title={`ปรับความเร็ว ${label}`}
            >
              {label}
            </button>
          ))}

          {/* Jump to Next Decision */}
          <button
            onClick={handleJumpToNextDecision}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#38bdf8',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ข้ามไปการตัดสินใจถัดไป »
          </button>

          {/* Auto Decide Toggle */}
          <button
            onClick={() => setAutoDecide(!autoDecide)}
            style={{
              backgroundColor: autoDecide ? 'rgba(16, 185, 129, 0.2)' : '#0f172a',
              border: autoDecide ? '1px solid #10b981' : '1px solid #1e293b',
              color: autoDecide ? '#34d399' : '#64748b',
              padding: '5px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            อัตโนมัติ {autoDecide ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VISUAL TIMELINE PROGRESS BAR (Year Tick & Life Span)  */}
      {/* ======================================================== */}
      <div style={{
        backgroundColor: '#0c1017',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 16px',
        marginBottom: '14px'
      }}>
        {/* A. Current Year Countdown Bar (แถบเวลาเดินของปีปัจจุบัน) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', marginBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: isRunning ? '#38bdf8' : '#ffd166', fontWeight: 'bold' }}>
              ⏱️ {isRunning ? `กำลังจำลองปีที่ ${age} (เหลืออีก ${((getIntervalMs(speed) / 1000) * (1 - yearProgress / 100)).toFixed(1)} วินาที)` : '⏸️ หยุดเวลาชั่วคราวเพื่อให้คุณอ่านเรื่องราว (กด [▶ เล่นต่อ] หรือคลิก [⏩ ก้าวไปปีถัดไป (+1 ปี)] เมื่อพร้อม)'}
            </span>
          </div>
          <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>
            {yearProgress.toFixed(0)}%
          </span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{
            width: `${yearProgress}%`,
            height: '100%',
            backgroundColor: isRunning ? '#38bdf8' : '#f59e0b',
            transition: 'width 0.1s linear'
          }} />
        </div>

        {/* B. Full Lifetime Stages Track (แถบช่วงชีวิต 0 - 80+ ปี) */}
        <div style={{ position: 'relative', paddingTop: '4px' }}>
          <div style={{ height: '8px', backgroundColor: '#07090e', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1e293b', position: 'relative' }}>
            {/* Filled progress up to current age */}
            <div style={{
              width: `${Math.min(100, (age / maxLifespan) * 100)}%`,
              height: '100%',
              backgroundColor: '#e11d48',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Age Stages Indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#64748b',
            marginTop: '5px'
          }}>
            <span style={{ color: age <= 5 ? '#38bdf8' : '#64748b' }}>🐣 ทารก (0-5)</span>
            <span style={{ color: age > 5 && age <= 12 ? '#38bdf8' : '#64748b' }}>🎒 วัยเด็ก (6-12)</span>
            <span style={{ color: age > 12 && age <= 17 ? '#38bdf8' : '#64748b' }}>⚔️ แรกรุ่น (13-17)</span>
            <span style={{ color: age >= 18 && age < 50 ? '#38bdf8' : '#64748b' }}>🛡️ ผู้ใหญ่ (18-49)</span>
            <span style={{ color: age >= 50 ? '#38bdf8' : '#64748b' }}>👑 อาวุโส/ชรา (50-{maxLifespan})</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN 3-COLUMN DASHBOARD LAYOUT                        */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '290px 1fr 310px',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* ======================================================== */}
        {/* LEFT COLUMN: Passport ID Card + 4 Vital Status Bars      */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Identity Dossier Card */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            {/* Top Pink Strip */}
            <div style={{
              backgroundColor: '#e11d48',
              padding: '4px 10px',
              fontSize: '10.5px',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'monospace'
            }}>
              <span>ทะเบียนประวัติ • {taxonomy.toUpperCase()}</span>
              <span>{2026 + age}</span>
            </div>

            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                {/* Character Portrait */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '8px',
                  backgroundColor: '#07090e',
                  border: `2px solid ${character?.race?.badgeColor || '#38bdf8'}`,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {(character?.race?.portrait || PORTRAIT_IMAGE_MAP[character?.race?.id]) ? (
                    <img
                      src={character?.race?.portrait || PORTRAIT_IMAGE_MAP[character?.race?.id]}
                      alt={character?.race?.name || 'ตัวละคร'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerHTML = `<span style="font-size: 32px;">${character?.race?.avatar || '👤'}</span>`;
                      }}
                    />
                  ) : (
                    <PixelCharacterAvatar raceId={character?.race?.id} size={64} animated={true} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 className="gothic-title" style={{
                    fontSize: '16px',
                    color: '#f8fafc',
                    fontWeight: 'bold',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {characterName}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '2px', fontWeight: 'bold' }}>
                    {character?.race?.name || 'โนเนม'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '1px' }}>
                    เพศ: {gender} • {realm?.name || ''}
                  </div>
                </div>
              </div>

              {/* Taxonomy & Lineage Details */}
              <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>หมวดสปีชีส์:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{character?.race?.badge || character?.race?.name || 'ทั่วไป'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>ชนชั้นสังคม:</span>
                  <span style={{ color: '#ffd166' }}>{socialClass?.name || ''}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>การเรียนรู้/พัฒนา:</span>
                  <span style={{ color: '#cbd5e1' }}>{education}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>บทบาท/อาชีพ:</span>
                  <span style={{ color: '#34d399', fontWeight: 'bold' }}>{jobTitle}</span>
                </div>
              </div>

              {/* Fantasy Seal */}
              <div style={{
                marginTop: '10px',
                paddingTop: '8px',
                borderTop: '1px dashed #1e293b',
                fontSize: '10.5px',
                color: '#64748b',
                textAlign: 'center',
                letterSpacing: '0.5px'
              }}>
                ✦ ตราประทับวิญญาณแห่งแดนมรณะ ✦
              </div>
            </div>
          </div>

          {/* 4 Vital Status Meters (0 - 100) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 'bold', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>สถานะชีวภาพ</span>
              <span>0-100</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Health */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#4ade80' }}>สุขภาพ / โครงสร้าง (Health)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{health}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${health}%`, height: '100%', backgroundColor: health < 30 ? '#ef4444' : '#10b981' }} />
                </div>
              </div>

              {/* Happiness */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#facc15' }}>ความสุข / สติ (Sanity)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{happiness}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${happiness}%`, height: '100%', backgroundColor: '#eab308' }} />
                </div>
              </div>

              {/* Knowledge */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#38bdf8' }}>ความรู้ / การประมวลผล (INT)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{knowledge}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${knowledge}%`, height: '100%', backgroundColor: '#0ea5e9' }} />
                </div>
              </div>

              {/* Relationships */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#f472b6' }}>ความสัมพันธ์ / บริวาร (REL)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{relationships}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${relationships}%`, height: '100%', backgroundColor: '#ec4899' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Finances, Debt & Living Situation */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '11.5px',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>ทรัพย์สินสุทธิ:</span>
              <strong style={{ color: '#4ade80', fontSize: '13.5px' }}>{netWorth} Gold</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>หนี้สินคงค้าง:</span>
              <span style={{ color: debt > 0 ? '#f87171' : '#cbd5e1', fontWeight: debt > 0 ? 'bold' : 'normal' }}>
                {debt}G {debt > 0 && '(ดอกเบี้ยทมิฬ!)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>ที่อยู่อาศัย / จุดติดตั้ง:</span>
              <span style={{ color: '#f8fafc', maxWidth: '140px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {housing}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CENTER COLUMN: Scene Viewport + Pixel Canvas + Chronicle */}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Viewport Header (32-Bit Retro Pixel Art) */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0c1017',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '6px 14px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>⚔️</span>
              <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                32-Bit Retro Pixel Art Canvas
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '2px 10px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>32-BIT ENGINE</span>
            </div>
          </div>

          {/* Unified Cinematic Aseprite Pixel Scene Viewport */}
          <SceneViewport
            sceneId={currentSceneId}
            age={age}
            pixelMode={viewportMode}
            height={250}
          />

          {/* Year Focus Callout (จุดเน้นของปีนี้) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '14px',
            fontSize: '12px'
          }}>
            <div style={{ color: '#ffd166', fontWeight: 'bold', marginBottom: '2px' }}>
              🌟 จุดเน้นของปีนี้ ({age} ปี)
            </div>
            <div style={{ color: '#94a3b8', lineHeight: '1.5' }}>
              {taxonomy === 'object' ? (
                age <= 2 ? 'วิญญาณในวัตถุกำลังตื่นรู้และสั่งสมพลังงานมานาสำรอง' :
                age <= 6 ? 'เริ่มเป็นที่รู้จักในชุมชน ผู้คนแวะเวียนมาใช้งานและจ่ายเหรียญอย่างต่อเนื่อง' :
                age <= 12 ? 'การดูแลรักษาโครงสร้างให้ทนทานต่อสภาพอากาศและการสึกหรอ' :
                age <= 18 ? 'ก้าวสู่การเป็นวัตถุในตำนาน เลือกสังกัดวิหาร กองทัพ หรือสมาพันธ์การค้า' :
                'การบริหารพลังงาน ป้องกันการโจรกรรม และส่งต่อคุณค่าแห่งมรดกจักรกล'
              ) : (
                age <= 2 ? 'วัยทารกแรกเกิด กำลังปรับตัวเข้ากับสภาพแวดล้อมโลกมืด' :
                age <= 6 ? 'วัยเด็กเล็ก เริ่มวิ่งเล่นสำรวจชุมชนและมีปฏิสัมพันธ์กับสิ่งแวดล้อมรอบตัว' :
                age <= 12 ? 'วัยเรียนรู้และช่วยงานครอบครัว สะสมทักษะชีวิตและความรู้เบื้องต้น' :
                age <= 18 ? 'วัยแรกรุ่น เลือกสังกัดกิลด์และวิถีแห่งการประกอบอาชีพในโลกมืด' :
                'วัยผู้ใหญ่ บริหารจัดการรายได้ สุขภาพ และสร้างความมั่นคงในระยะยาว'
              )}
            </div>
          </div>

          {/* Life Chronicle Timeline Stream (บันทึกชีวิต) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            minHeight: '260px',
            maxHeight: '440px',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1e293b',
              paddingBottom: '8px',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc' }}>
                📜 บันทึกชีวิต (Timeline Stream)
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                กำลังจำลองคู่ขนานไปพร้อมกับ 11,377 ดวงวิญญาณ
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chronicleLogs.map((log, idx) => {
                const delta = log.statDelta || {};
                const hasStats = delta.hp !== undefined || delta.san !== undefined || delta.gold !== undefined ||
                                 delta.int !== undefined || delta.str !== undefined || delta.luk !== undefined ||
                                 delta.rel !== undefined || delta.debt !== undefined;

                return (
                  <div
                    key={log.id || idx}
                    onClick={() => {
                      if (log.sceneId) setCurrentSceneId(log.sceneId);
                    }}
                    style={{
                      fontSize: '12.5px',
                      lineHeight: '1.5',
                      color: log.isCrisis ? '#fca5a5' : log.highlight ? '#fef08a' : '#cbd5e1',
                      backgroundColor: log.isCrisis ? 'rgba(239, 68, 68, 0.12)' : log.highlight ? 'rgba(254, 240, 138, 0.08)' : '#070a12',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: log.sceneId === currentSceneId ? '1.5px solid #ffd166' : '1px solid #1e293b',
                      borderLeft: log.isCrisis ? '3px solid #ef4444' : log.highlight ? '3px solid #facc15' : '3px solid #334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}
                    title="คลิกเพื่อเปลี่ยนฉากพิกเซลอาร์ตด้านบนเป็นฉากนี้"
                  >
                    {/* Mini Pixel Scene Thumbnail paired with dialogue (ภาพประกอบพิกเซลคู่กับไดอาล็อก) */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      flexShrink: 0,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid #334155',
                      backgroundColor: '#000000',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                    }}>
                      <PixelSceneIllustrator sceneId={log.sceneId || 'alley'} height={44} animated={false} />
                    </div>

                    {/* Dialogue Text and Status Pills */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: '#1e293b',
                          color: '#38bdf8',
                          fontSize: '10.5px',
                          fontWeight: 'bold',
                          padding: '1px 5px',
                          borderRadius: '3px'
                        }}>
                          อายุ {log.age} ปี
                        </span>
                        {log.isCrisis && (
                          <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px' }}>
                            ⚠️ วิกฤต
                          </span>
                        )}
                        {log.highlight && !log.isCrisis && (
                          <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', fontSize: '10px', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px' }}>
                            👑 ตัดสินใจ
                          </span>
                        )}
                      </div>

                      <div style={{ color: log.isCrisis ? '#fecaca' : log.highlight ? '#fef08a' : '#cbd5e1' }}>
                        {log.text}
                      </div>

                      {/* Explicit Stat Gains & Losses (สถานะที่ได้รับทั้งเสียทั้งดี) */}
                      {hasStats && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                          {delta.hp !== undefined && (
                            <span style={statBadgeStyle(delta.hp > 0)}>
                              {delta.hp > 0 ? `❤️ HP +${delta.hp}` : `💔 HP ${delta.hp}`}
                            </span>
                          )}
                          {delta.san !== undefined && (
                            <span style={statBadgeStyle(delta.san > 0)}>
                              {delta.san > 0 ? `🧠 สติ +${delta.san}` : `⚠️ สติ ${delta.san}`}
                            </span>
                          )}
                          {delta.gold !== undefined && (
                            <span style={statBadgeStyle(delta.gold > 0)}>
                              {delta.gold > 0 ? `🪙 +${delta.gold}G` : `💸 ${delta.gold}G`}
                            </span>
                          )}
                          {delta.int !== undefined && (
                            <span style={statBadgeStyle(delta.int > 0)}>
                              {delta.int > 0 ? `📖 INT +${delta.int}` : `INT ${delta.int}`}
                            </span>
                          )}
                          {delta.str !== undefined && (
                            <span style={statBadgeStyle(delta.str > 0)}>
                              {delta.str > 0 ? `💪 STR +${delta.str}` : `STR ${delta.str}`}
                            </span>
                          )}
                          {delta.luk !== undefined && (
                            <span style={statBadgeStyle(delta.luk > 0)}>
                              {delta.luk > 0 ? `🍀 LUK +${delta.luk}` : `LUK ${delta.luk}`}
                            </span>
                          )}
                          {delta.rel !== undefined && (
                            <span style={statBadgeStyle(delta.rel > 0)}>
                              {delta.rel > 0 ? `🤝 สัมพันธ์ +${delta.rel}` : `สัมพันธ์ ${delta.rel}`}
                            </span>
                          )}
                          {delta.debt !== undefined && (
                            <span style={statBadgeStyle(false)}>
                              หนี้ +${delta.debt}G
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chronicleEndRef} />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: Lineage & Bonds + Cohort + 80-Year Life Grid*/}
        {/* ======================================================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Species-Accurate Origin & Bonds Box (ครอบครัวและจุดกำเนิดตามสายพันธุ์) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px' }}>
              {lineage.title}
            </div>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>
                <span style={{ color: '#64748b' }}>{lineage.primaryLabel} </span>
                <span style={{ color: '#cbd5e1', fontWeight: 'bold' }}>{lineage.primaryValue}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>{lineage.secondaryLabel} </span>
                <span style={{ color: '#cbd5e1' }}>{lineage.secondaryValue}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>{lineage.detailLabel} </span>
                <span style={{ color: '#4ade80' }}>{lineage.detailValue}</span>
              </div>
            </div>
          </div>

          {/* People Born in Same Second (คู่ขนาน 4 คน) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '8px' }}>
              คนที่เกิดในวินาทีเดียวกัน
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
              {cohort.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#cbd5e1' }}>{c.name}</span>
                  <span style={{ color: '#64748b' }}>{c.stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multiverse Meme Traveler Cameo (สหายต่างมิติ 16-Bit) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '12px 14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '6px',
              overflow: 'hidden',
              border: '1px solid #c99738',
              flexShrink: 0,
              backgroundColor: '#000'
            }}>
              <PixelMemeAvatar memeKey={['horse', 'portrait', 'full', 'chill'][age % 4]} size={42} />
            </div>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
              <div style={{ color: '#ffd166', fontWeight: 'bold' }}>
                {age % 4 === 0 ? '🐴 อัศวินม้าหน้าคน' :
                 age % 4 === 1 ? '⚔️ จอมทัพเกราะทมิฬ' :
                 age % 4 === 2 ? '🗡️ จอมดาบยักษ์ผ่ามิติ' :
                 '🧘 ผู้รู้แจ้งหน้าชิล'}
              </div>
              <div style={{ color: '#94a3b8', lineHeight: '1.4', fontSize: '10.5px' }}>
                {age % 4 === 0 ? 'ควบม้าทะลุมิติด้วยความเร็ว 120 กม./ชม. พร้อมรอยยิ้มสุดชิล' :
                 age % 4 === 1 ? 'ยืนตากลมหนาวอย่างสงบ เกราะหนัก 200 กก. แต่ใจเบาสบาย' :
                 age % 4 === 2 ? 'ถือดาบยักษ์ผ่ามิติ รอสอนวิชาฟันเหล็กให้ผู้กล้าที่คู่ควร' :
                 'ส่งพลังจิตแห่งความชิลมาปลอบประโลมจิตใจในยามลำบาก'}
              </div>
            </div>
          </div>

          {/* 80-Year Life Grid (1 box = 1 year) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
                แผนที่ชีวิต (Life Grid)
              </span>
              <span style={{ fontSize: '10.5px', color: '#64748b' }}>
                1 ช่อง = 1 ปี ({maxLifespan} ปี)
              </span>
            </div>

            {/* Grid 10 columns x 8 rows */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: '4px'
            }}>
              {Array.from({ length: 80 }).map((_, boxIndex) => {
                const isPassed = boxIndex < age;
                const isCurrent = boxIndex === age;
                const historyItem = lifeGridHistory.find(h => h.age === boxIndex);

                return (
                  <div
                    key={boxIndex}
                    onMouseEnter={() => setHoveredGridYear(historyItem || { age: boxIndex, year: 2026 + boxIndex, summary: 'อนาคต' })}
                    onMouseLeave={() => setHoveredGridYear(null)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '3px',
                      backgroundColor: isPassed ? '#1e3a5f' : isCurrent ? '#e11d48' : '#111827',
                      border: isCurrent ? '1.5px solid #fb7185' : '1px solid #1f293d',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  />
                );
              })}
            </div>

            {/* Hover Tooltip display below grid */}
            <div style={{
              marginTop: '10px',
              padding: '8px',
              backgroundColor: '#080c14',
              borderRadius: '6px',
              border: '1px solid #1e293b',
              fontSize: '11px',
              minHeight: '44px',
              color: '#94a3b8'
            }}>
              {hoveredGridYear ? (
                <div>
                  <strong style={{ color: '#ffd166' }}>อายุ {hoveredGridYear.age} ปี (ปี {hoveredGridYear.year}): </strong>
                  <span>{hoveredGridYear.summary}</span>
                </div>
              ) : (
                <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                  ชี้ที่ช่องเพื่อดูบันทึกเหตุการณ์ของปีนั้นๆ
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAJOR DECISION OR HARSH CRISIS MODAL                  */}
      {/* ======================================================== */}
      {activeDecision && (
        <MajorDecisionModal
          decision={activeDecision}
          characterName={characterName}
          onSelectChoice={(choice) => applyDecisionChoice(choice, activeDecision.age)}
          onAutoDecide={() => {
            const firstChoice = activeDecision.choices[0];
            applyDecisionChoice(firstChoice, activeDecision.age);
          }}
          onDismiss={() => setActiveDecision(null)}
        />
      )}
    </div>
  );
}
