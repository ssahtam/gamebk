import React, { useState, useEffect, useRef } from 'react';
import SceneViewport from './SceneViewport.jsx';
import PixelSceneIllustrator from './PixelSceneIllustrator.jsx';
import PixelCharacterAvatar from './PixelCharacterAvatar.jsx';
import PixelMemeAvatar from './PixelMemeAvatar.jsx';
import { PORTRAIT_IMAGE_MAP } from './CharacterVisualCard.jsx';
import MajorDecisionModal from './MajorDecisionModal.jsx';
import {
  getMajorDecisionForAge,
  getLoreChapterForAge,
  generateAnnualLog,
  LORE_MILESTONE_AGES
} from '../data/lifeSimulationEngine.js';
import { getTaxonomyCategory, getLineageOrigin, checkAnnualCrisis } from '../data/lifeCrisesEngine.js';
import { POTENTIAL_PARTNERS } from '../data/familyAndGenerations.js';
import { playSound } from '../utils/sound.js';

const DECISION_AGES = [2, 5, 8, 13, 18, 25, 35, 50, 65];

const YEARLY_FOCUS_OPTIONS = [
  { id: 'balanced', label: '⚖️ ใช้ชีวิตสมดุล', desc: 'ดูแลสุขภาพกายและใจควบคู่กัน (+HP/+SAN เล็กน้อย)', bonus: { hp: 2, san: 2 } },
  { id: 'training', label: '💪 ฝึกฝนร่างกาย & อาวุธ', desc: 'เคี่ยวกรำกล้ามเนื้อและการต่อสู้ (+STR +2, +HP +3)', bonus: { str: 2, hp: 3 } },
  { id: 'wealth', label: '💰 เร่งทำงานหาเงิน', desc: 'รับงานเสริมและค้าขายแลกเหรียญทอง (+Gold +8G, -SAN -1)', bonus: { gold: 8, san: -1 } },
  { id: 'study', label: '📖 ค้นคว้าตำราเวท/ความรู้', desc: 'สะสมสติปัญญาและทักษะวิชาชีพ (+INT +3, +LUK +1)', bonus: { int: 3, luk: 1 } },
  { id: 'social', label: '🤝 ผูกมิตร & ดูแลครอบครัว', desc: 'สร้างสายสัมพันธ์กับผู้คนรอบข้าง (+REL +4, +SAN +2)', bonus: { rel: 4, san: 2 } }
];

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
  boon,
  innateCurse,
  weapon: initialWeapon,
  armor: initialArmor,
  potionsCount: initialPotions,
  generation = 1,
  soundEnabled = true,
  onDie
}) {
  const taxonomy = getTaxonomyCategory(character?.race);
  const lineage = getLineageOrigin(character, realm, socialClass);
  const seenEventsRef = useRef(new Set());
  const seenDecisionsRef = useRef(new Set());
  const seenLoreRef = useRef(new Set());

  const triggerSound = (type) => {
    if (soundEnabled) playSound(type);
  };

  // Simulation Timer State
  const [age, setAge] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [autoDecide, setAutoDecide] = useState(false);
  const [yearProgress, setYearProgress] = useState(0);
  const [yearFocus, setYearFocus] = useState('balanced');

  const [currentSceneId, setCurrentSceneId] = useState(
    socialClass?.id === 'destitute' ? 'famine' :
    (realm?.name?.includes('ไผ่') || realm?.name?.includes('ป่า')) ? 'forest' :
    taxonomy === 'object' ? 'vending' :
    taxonomy === 'undead' ? 'catacombs' :
    taxonomy === 'beast' ? 'capybara' : 'alley'
  );

  // 4 Core Vital Status Bars (0 - 100) + Combat/Destiny Stats
  const [health, setHealth] = useState(
    Math.min(100, Math.max(20, (character?.race?.baseHp || 75) + (boon?.effect?.hp || 0) + (boon?.effect?.maxHp ? 15 : 0)))
  );
  const [happiness, setHappiness] = useState(
    Math.min(100, Math.max(15, (character?.race?.baseSan || 65) + (boon?.effect?.san || 0)))
  );
  const [knowledge, setKnowledge] = useState(
    Math.min(100, Math.max(10, ((character?.race?.int || 10) + (boon?.effect?.int || 0)) * 3))
  );
  const [relationships, setRelationships] = useState(55);
  const [str, setStr] = useState((character?.race?.str || 10) + (boon?.effect?.str || 0));
  const [luk, setLuk] = useState((character?.race?.luk || 10) + (boon?.effect?.luk || 0));
  const [reviveUsed, setReviveUsed] = useState(false);

  // Finances, Equipment & Family
  const [netWorth, setNetWorth] = useState(gold !== undefined ? gold : 25);
  const [debt, setDebt] = useState(initialDebt || 0);
  const [weapon, setWeapon] = useState(initialWeapon || null);
  const [armor, setArmor] = useState(initialArmor || null);
  const [potions, setPotions] = useState(initialPotions || { hp_potion: 1, san_potion: 1 });
  const [spouse, setSpouse] = useState(null);
  const [children, setChildren] = useState([]);

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
    taxonomy === 'beast' ? 'สัญชาตญาณธรรมชาติ' :
    taxonomy === 'monster' ? 'สัญชาตญาณดันเจี้ยน' :
    'ยังไม่ถึงเกณฑ์เรียน'
  );
  const [jobTitle, setJobTitle] = useState(
    taxonomy === 'object' ? 'วัตถุมีวิญญาณเปิดใช้งานใหม่' :
    taxonomy === 'undead' ? 'อันเดดตื่นจากหลุมศพ' :
    taxonomy === 'monster' ? 'มอนสเตอร์แรกเกิด' :
    taxonomy === 'beast' ? 'สัตว์อสูรแรกเกิด' :
    'ทารกแรกเกิด'
  );

  const [activeDecision, setActiveDecision] = useState(null);

  const [chronicleLogs, setChronicleLogs] = useState([
    {
      id: 'init_birth_0',
      age: 0,
      text: `รุ่นที่ ${generation}: คุณถือกำเนิดเป็น "${characterName}" เผ่า ${character?.race?.name || 'โนเนม'} ณ ${realm?.name || ''} (${socialClass?.name || ''})`,
      sceneId: currentSceneId,
      statDelta: { hp: health, gold: netWorth },
      highlight: true
    },
    ...(boon ? [{
      id: 'init_boon_1',
      age: 0,
      text: `${boon.icon || '🌟'} พรติดตัว: ${boon.name} (${boon.rarity}) • ${innateCurse?.icon || '💀'} คำสาป: ${innateCurse?.name || 'ไม่มี'}`,
      sceneId: currentSceneId,
      statDelta: {},
      highlight: false
    }] : [])
  ]);

  const [lifeGridHistory, setLifeGridHistory] = useState([
    { age: 0, year: 2026, health, happiness, summary: `กำเนิดในโลกมืด (${character?.race?.name || ''})`, type: 'birth' }
  ]);
  const [hoveredGridYear, setHoveredGridYear] = useState(null);

  // Dynamic Parallel Cohort (4 ชีวิตที่เกิดในวินาทีเดียวกัน เติบโตและอาจสิ้นใจไปตามปีจริง!)
  const [cohort, setCohort] = useState([
    { id: 'c1', name: 'กัตซ์ (ออร์ค)', realm: 'ค่ายผาหิน', stage: 'ทารกแรกเกิด', alive: true, deathAge: null },
    { id: 'c2', name: 'ไฟรเรน (เอลฟ์)', realm: 'พงไพรพฤกษา', stage: 'ทารกแรกเกิด', alive: true, deathAge: null },
    { id: 'c3', name: 'ริมุรุ (สไลม์)', realm: 'ถ้ำมืดชั้น 1', stage: 'ก้อนเจลลี่แรกเกิด', alive: true, deathAge: null },
    { id: 'c4', name: 'บรู๊ค (โครงกระดูก)', realm: 'สุสานโบราณ', stage: 'ตื่นจากหลุมศพ', alive: true, deathAge: null }
  ]);

  const maxLifespan = character?.race?.maxAge || 80;

  const getIntervalMs = (s) => {
    switch (s) {
      case 4: return 1600;
      case 2: return 3200;
      case 0.5: return 10000;
      case 1:
      default: return 6000;
    }
  };

  const getCohortStageForAge = (peerAge) => {
    if (peerAge <= 4) return `วัยเตาะแตะ (${peerAge} ปี)`;
    if (peerAge <= 12) return `ฝึกวิชาพื้นฐาน (${peerAge} ปี)`;
    if (peerAge <= 19) return `นักผจญภัยฝึกหัด (${peerAge} ปี)`;
    if (peerAge <= 35) return `ออกล่าดันเจี้ยน (${peerAge} ปี)`;
    if (peerAge <= 55) return `จอมยุทธ์มีชื่อเสียง (${peerAge} ปี)`;
    return `ผู้อาวุโสแห่งแคว้น (${peerAge} ปี)`;
  };

  // Core function to simulate 1 year (used by both normal tick and Jump to Next Decision)
  const advanceSingleYear = (targetAge, currentState, forceAutoChoice = false) => {
    let {
      hp,
      hap,
      know,
      rel,
      curStr,
      curLuk,
      curGold,
      curDebt,
      curReviveUsed
    } = currentState;

    // 1. ตรวจสอบความตายหรือสิ้นอายุขัย (พร้อมระบบ Return by Death SSR!)
    if (hp <= 0 || targetAge > maxLifespan) {
      if (hp <= 0 && targetAge <= maxLifespan && boon?.effect?.reviveOnce && !curReviveUsed) {
        triggerSound('victory');
        curReviveUsed = true;
        hp = 100;
        hap = Math.max(40, hap - 10);
        const reviveLog = {
          id: `revive_${targetAge}_${Date.now()}`,
          age: targetAge,
          text: `⏳ [พร SSR ทำงาน: หวนคืนจากความตาย!] แม้ร่างจะแหลกสลายแต่เวลาได้ย้อนกลับมาอีกครั้ง ฟื้นฟูพลังชีวิตเต็ม 100%!`,
          sceneId: 'berserk',
          statDelta: { hp: 100, san: -10 },
          highlight: true,
          isCrisis: false
        };
        setReviveUsed(true);
        setHealth(hp);
        setHappiness(hap);
        setChronicleLogs(prev => [reviveLog, ...prev]);
        setLifeGridHistory(prev => [...prev, { age: targetAge, year: 2026 + targetAge, health: hp, happiness: hap, summary: reviveLog.text, type: 'decision' }]);
      } else {
        setIsRunning(false);
        triggerSound('gameover');
        onDie({
          age: targetAge - 1,
          cause: hp <= 0 ? 'สุขภาพทรุดโทรมและบาดเจ็บเกินรับไหวในโลกมืด' : 'สิ้นอายุขัยของสายพันธุ์อย่างสงบสุข',
          name: characterName,
          race: character?.race?.name || 'โนเนม',
          netWorth: curGold,
          spouse,
          children,
          weapon,
          armor
        });
        return { stopped: true };
      }
    }

    // อัปเดตเพื่อนคู่ขนาน 4 คนที่เกิดพร้อมกัน
    setCohort(prev => prev.map(peer => {
      if (!peer.alive) return peer;
      if (targetAge >= 12 && Math.random() < 0.018) {
        return { ...peer, alive: false, deathAge: targetAge, stage: `💀 สิ้นใจในวัย ${targetAge} ปี` };
      }
      return { ...peer, stage: getCohortStageForAge(targetAge) };
    }));

    // 2. ตรวจสอบ Major Decision ตามสายพันธุ์
    const pendingDecision = getMajorDecisionForAge(targetAge, character, seenDecisionsRef.current);
    if (pendingDecision && !autoDecide && !forceAutoChoice) {
      setActiveDecision(pendingDecision);
      setAge(targetAge);
      setYearProgress(0);
      return { stopped: true, modalOpened: true };
    }

    // 3. ตรวจสอบบทละครเนื้อเรื่องข้ามวัย (จาก lifeStoryEngine.js)
    const loreChapter = !pendingDecision ? getLoreChapterForAge(targetAge, character, seenLoreRef.current) : null;
    if (loreChapter && !autoDecide && !forceAutoChoice) {
      setActiveDecision(loreChapter);
      setAge(targetAge);
      setYearProgress(0);
      return { stopped: true, modalOpened: true };
    }

    // 4. ตรวจสอบวิกฤตการณ์สุ่ม (รวมผลของคำสาปและพร)
    const extraCrisisChance =
      (innateCurse?.id === 'curse_beast_scent' ? 0.08 : 0) +
      (innateCurse?.id === 'curse_troll_magnet' ? 0.08 : 0) +
      (boon?.effect?.aggro ? 0.05 : 0);

    const crisis = checkAnnualCrisis(targetAge, character, { health: hp, happiness: hap }, seenDecisionsRef.current, extraCrisisChance);
    if (crisis && !autoDecide && !forceAutoChoice) {
      seenDecisionsRef.current.add(crisis.id);
      setActiveDecision({
        ...crisis,
        age: targetAge,
        isCrisis: true,
        title: crisis.name,
        desc: crisis.desc
      });
      setAge(targetAge);
      setYearProgress(0);
      return { stopped: true, modalOpened: true };
    }

    // 5. คำนวณผลประจำปี (Focus + Boon/Curse + Annual Event)
    const focusObj = YEARLY_FOCUS_OPTIONS.find(f => f.id === yearFocus) || YEARLY_FOCUS_OPTIONS[0];
    const fBonus = focusObj.bonus || {};

    const isSlum = socialClass?.id === 'destitute';
    let hpDelta = (isSlum ? (Math.floor(Math.random() * 6) - 3) : (Math.floor(Math.random() * 5) - 1)) + (fBonus.hp || 0);
    let hapDelta = (Math.floor(Math.random() * 5) - 2) + (fBonus.san || 0);
    let goldDelta = (fBonus.gold || 0) + (spouse ? 5 : 0);
    let intDelta = fBonus.int || 0;
    let relDelta = fBonus.rel || 0;
    let strDelta = fBonus.str || 0;
    let lukDelta = fBonus.luk || 0;

    // ผลของพรและคำสาปประจำปี
    if (boon?.id === 'pouch_of_moldy_bread' && hp < 80) hpDelta += 3;
    if (innateCurse?.id === 'curse_eclipse_nightmare' && targetAge % 3 === 0) hapDelta -= 5;
    if (curDebt > 0 && targetAge >= 16) {
      // ดอกเบี้ยหนี้ปีละ 2G
      curDebt += 2;
    }

    const annualEvent = generateAnnualLog(targetAge, character, { realm, socialClass }, { health: hp, happiness: hap }, seenEventsRef.current);
    const evDelta = annualEvent.statDelta || {};

    let rawHpChange = hpDelta + (evDelta.hp || 0);
    if (rawHpChange < 0 && innateCurse?.id === 'curse_brittle_bones') {
      rawHpChange = Math.floor(rawHpChange * 1.25);
    }

    hp = Math.min(100, Math.max(0, hp + rawHpChange));
    hap = Math.min(100, Math.max(5, hap + hapDelta + (evDelta.san || 0)));
    know = Math.min(100, Math.max(5, know + intDelta + (evDelta.int || 0)));
    rel = Math.min(100, Math.max(5, rel + relDelta + (evDelta.rel || 0)));
    curStr = Math.max(1, curStr + strDelta + (evDelta.str || 0));
    curLuk = Math.max(1, curLuk + lukDelta + (evDelta.luk || 0));
    curGold = Math.max(0, curGold + goldDelta + (evDelta.gold || 0));
    curDebt = Math.max(0, curDebt + (evDelta.debt || 0));

    // หากเปิด Auto Decide และมี Decision/Lore ในปีนี้ ให้เลือกตัวเลือกแรกที่จ่ายไหวอัตโนมัติ
    const autoPending = pendingDecision || loreChapter;
    if (autoPending && (autoDecide || forceAutoChoice)) {
      const affordable = (autoPending.choices || []).filter(c => curGold >= Number(c.reqGold || 0));
      const chosen = affordable[0] || autoPending.choices?.[0];
      if (chosen) {
        const ch = chosen.statEffect || chosen.changes || {};
        hp = Math.min(100, Math.max(5, hp + (ch.hp || 0)));
        hap = Math.min(100, Math.max(5, hap + (ch.san || 0)));
        know = Math.min(100, Math.max(5, know + (ch.int || 0)));
        rel = Math.min(100, Math.max(5, rel + (ch.rel || 0)));
        curStr = Math.max(1, curStr + (ch.str || 0));
        curLuk = Math.max(1, curLuk + (ch.luk || 0));
        curGold = Math.max(0, curGold + (ch.gold || 0) - Number(chosen.reqGold || 0));
        if (chosen.education) setEducation(chosen.education);
        if (chosen.job) setJobTitle(chosen.job);
        if (chosen.housing) setHousing(chosen.housing);
      }
    }

    setAge(targetAge);
    setYearProgress(0);
    setHealth(hp);
    setHappiness(hap);
    setKnowledge(know);
    setRelationships(rel);
    setStr(curStr);
    setLuk(curLuk);
    setNetWorth(curGold);
    setDebt(curDebt);

    if (annualEvent.sceneId) {
      setCurrentSceneId(annualEvent.sceneId);
    }

    const combinedDelta = {
      ...evDelta,
      hp: rawHpChange !== 0 ? rawHpChange : evDelta.hp,
      gold: (goldDelta + (evDelta.gold || 0)) !== 0 ? (goldDelta + (evDelta.gold || 0)) : evDelta.gold
    };

    setChronicleLogs(prev => [
      {
        id: `${annualEvent.id || 'ev'}_${targetAge}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        age: targetAge,
        text: annualEvent.text,
        sceneId: annualEvent.sceneId || currentSceneId,
        statDelta: combinedDelta,
        highlight: false,
        isCrisis: false
      },
      ...prev
    ]);

    setLifeGridHistory(prev => [
      ...prev,
      {
        age: targetAge,
        year: 2026 + targetAge,
        health: hp,
        happiness: hap,
        summary: annualEvent.text,
        type: 'normal'
      }
    ]);

    return {
      stopped: false,
      nextState: {
        hp,
        hap,
        know,
        rel,
        curStr,
        curLuk,
        curGold,
        curDebt,
        curReviveUsed
      }
    };
  };

  const handleAdvanceYear = () => {
    advanceSingleYear(age + 1, {
      hp: health,
      hap: happiness,
      know: knowledge,
      rel: relationships,
      curStr: str,
      curLuk: luk,
      curGold: netWorth,
      curDebt: debt,
      curReviveUsed: reviveUsed
    });
  };

  // เก็บฟังก์ชันเดินปีล่าสุดไว้ใน ref เพื่อให้ setInterval เรียกใช้ได้อย่างปลอดภัยโดยไม่มีปัญหา Stale Closure
  const advanceYearRef = useRef(handleAdvanceYear);
  useEffect(() => {
    advanceYearRef.current = handleAdvanceYear;
  });

  useEffect(() => {
    if (!isRunning || activeDecision !== null) return;

    const intervalMs = getIntervalMs(speed);
    const tickStepMs = 100;
    const increment = (tickStepMs / intervalMs) * 100;

    const interval = setInterval(() => {
      setYearProgress(prev => {
        if (prev + increment >= 100) {
          setTimeout(() => {
            if (advanceYearRef.current) advanceYearRef.current();
          }, 0);
          return 0;
        }
        return prev + increment;
      });
    }, tickStepMs);

    return () => clearInterval(interval);
  }, [isRunning, speed, activeDecision]);

  // รับผลลัพธ์จากการเลือกใน Modal (Decision / Lore / Crisis)
  const applyDecisionChoice = (choice, decisionAge) => {
    triggerSound('click');
    const targetAge = decisionAge || age;
    const changes = choice.resolvedChanges || choice.statEffect || choice.changes || {};

    let nextHp = health;
    let nextHap = happiness;
    if (changes.hp) {
      let deltaHp = Number(changes.hp);
      if (deltaHp < 0 && innateCurse?.id === 'curse_brittle_bones') {
        deltaHp = Math.floor(deltaHp * 1.25);
      }
      nextHp = Math.min(100, Math.max(0, health + deltaHp));
      setHealth(nextHp);
    }
    if (changes.san) {
      nextHap = Math.min(100, Math.max(5, happiness + Number(changes.san)));
      setHappiness(nextHap);
    }
    if (changes.int) setKnowledge(prev => Math.min(100, Math.max(5, prev + Number(changes.int))));
    if (changes.rel) setRelationships(prev => Math.min(100, Math.max(5, prev + Number(changes.rel))));
    if (changes.str) setStr(prev => Math.max(1, prev + Number(changes.str)));
    if (changes.luk) setLuk(prev => Math.max(1, prev + Number(changes.luk)));
    if (changes.gold) setNetWorth(prev => Math.max(0, prev + Number(changes.gold)));
    if (changes.debt) setDebt(prev => Math.max(0, prev + Number(changes.debt)));

    if (choice.education) setEducation(choice.education);
    if (choice.job) setJobTitle(choice.job);
    if (choice.housing) setHousing(choice.housing);
    if (choice.spouse) setSpouse({ name: choice.spouse });
    if (choice.addChild) setChildren(prev => [...prev, choice.addChild]);
    if (choice.grantItem) {
      if (choice.grantItem.type === 'weapon') setWeapon(choice.grantItem);
      else if (choice.grantItem.type === 'armor') setArmor(choice.grantItem);
    }

    const choiceSceneId = activeDecision?.sceneId || (activeDecision?.isCrisis ? 'berserk' : 'alley');
    setCurrentSceneId(choiceSceneId);

    const logEntry = choice.resolvedLog || choice.log || choice.result || choice.text;
    const prefixLabel = activeDecision?.isCrisis ? '⚠️ วิกฤตการณ์' : activeDecision?.isLoreChapter ? '📜 บทละครชะตา' : '👑 การตัดสินใจ';

    setChronicleLogs(prev => [
      {
        id: `decision_${targetAge}_${Date.now()}`,
        age: targetAge,
        text: `อายุ ${targetAge} ปี (${prefixLabel}): ${logEntry}`,
        sceneId: choiceSceneId,
        statDelta: changes,
        highlight: true,
        isCrisis: activeDecision?.isCrisis
      },
      ...prev
    ]);

    setLifeGridHistory(prev => [
      ...prev.filter(item => item.age !== targetAge),
      {
        age: targetAge,
        year: 2026 + targetAge,
        health: nextHp,
        happiness: nextHap,
        summary: `${prefixLabel}: ${logEntry}`,
        type: activeDecision?.isCrisis ? 'crisis' : 'decision'
      }
    ]);

    setActiveDecision(null);

    // หากตัวเลือกทำให้เสียชีวิตทันที
    if (changes.isDead || nextHp <= 0) {
      if (boon?.effect?.reviveOnce && !reviveUsed) {
        setReviveUsed(true);
        setHealth(100);
        setChronicleLogs(prev => [
          {
            id: `revive_modal_${Date.now()}`,
            age: targetAge,
            text: `⏳ [พร SSR: หวนคืนจากความตาย!] คุณรอดพ้นจากความตายอย่างปาฏิหาริย์ เลือดฟื้นเต็ม 100%!`,
            sceneId: 'bonfire',
            statDelta: { hp: 100 },
            highlight: true
          },
          ...prev
        ]);
      } else {
        setIsRunning(false);
        onDie({
          age: targetAge,
          cause: changes.deathReason || choice.deathReason || `จบชีวิตลงจากเหตุการณ์ "${activeDecision?.title || ''}"`,
          name: characterName,
          race: character?.race?.name || 'โนเนม',
          netWorth,
          spouse,
          children,
          weapon,
          armor
        });
      }
    }
  };

  // ข้ามไปการตัดสินใจถัดไปแบบจำลองทุกปีระหว่างทาง (ตาราง 80 ปีไม่แหว่ง!)
  const handleJumpToNextDecision = () => {
    setIsRunning(false);
    const allMilestones = Array.from(new Set([...DECISION_AGES, ...LORE_MILESTONE_AGES])).sort((a, b) => a - b);
    const nextTargetAge = allMilestones.find(a => a > age) || Math.min(maxLifespan, age + 5);

    let simState = {
      hp: health,
      hap: happiness,
      know: knowledge,
      rel: relationships,
      curStr: str,
      curLuk: luk,
      curGold: netWorth,
      curDebt: debt,
      curReviveUsed: reviveUsed
    };

    for (let y = age + 1; y <= nextTargetAge; y++) {
      const res = advanceSingleYear(y, simState, false);
      if (res.stopped) break;
      if (res.nextState) simState = res.nextState;
    }
  };

  // ใช้ยาฟื้นพลังจากกระเป๋า หรือซื้อยาเพิ่ม
  const handleUseOrBuyPotion = (type) => {
    if (type === 'hp_potion') {
      if (potions.hp_potion > 0) {
        triggerSound('victory');
        setPotions(prev => ({ ...prev, hp_potion: prev.hp_potion - 1 }));
        setHealth(h => Math.min(100, h + 35));
        setChronicleLogs(prev => [{
          id: `pot_hp_${Date.now()}`,
          age,
          text: '🧪 ดื่มน้ำยาฟื้นฟูพลังชีวิต (HP +35)',
          sceneId: currentSceneId,
          statDelta: { hp: 35 },
          highlight: false
        }, ...prev]);
      } else if (netWorth >= 20) {
        triggerSound('gold');
        setNetWorth(g => g - 20);
        setHealth(h => Math.min(100, h + 35));
        setChronicleLogs(prev => [{
          id: `buy_hp_${Date.now()}`,
          age,
          text: '🧪 ซื้อและดื่มโพชั่นสีแดงจากร้านค้ากิลด์ (-20G, HP +35)',
          sceneId: 'market',
          statDelta: { gold: -20, hp: 35 },
          highlight: false
        }, ...prev]);
      }
    } else if (type === 'san_potion') {
      if (potions.san_potion > 0) {
        triggerSound('victory');
        setPotions(prev => ({ ...prev, san_potion: prev.san_potion - 1 }));
        setHappiness(s => Math.min(100, s + 25));
        setChronicleLogs(prev => [{
          id: `pot_san_${Date.now()}`,
          age,
          text: '🍵 ดื่มชาสมุนไพรเรียกสติ (สติ/ความสุข +25)',
          sceneId: currentSceneId,
          statDelta: { san: 25 },
          highlight: false
        }, ...prev]);
      } else if (netWorth >= 15) {
        triggerSound('gold');
        setNetWorth(g => g - 15);
        setHappiness(s => Math.min(100, s + 25));
        setChronicleLogs(prev => [{
          id: `buy_san_${Date.now()}`,
          age,
          text: '🍵 ซื้อและดื่มชาบ๊วยเค็มฟื้นฟูจิตใจ (-15G, สติ +25)',
          sceneId: 'ramen',
          statDelta: { gold: -15, san: 25 },
          highlight: false
        }, ...prev]);
      }
    }
  };

  // ชำระหนี้สิน
  const handlePayDebt = () => {
    if (debt <= 0 || netWorth <= 0) return;
    triggerSound('gold');
    const payAmount = Math.min(debt, netWorth);
    setNetWorth(prev => prev - payAmount);
    setDebt(prev => prev - payAmount);
    setHappiness(prev => Math.min(100, prev + 8));
    setChronicleLogs(prev => [{
      id: `pay_debt_${Date.now()}`,
      age,
      text: `💳 นำเหรียญทองไปชำระหนี้สินจำนวน ${payAmount}G (หนี้คงเหลือ ${debt - payAmount}G)`,
      sceneId: 'market',
      statDelta: { gold: -payAmount, debt: -payAmount, san: 8 },
      highlight: true
    }, ...prev]);
  };

  // สร้างครอบครัว / มีทายาทสืบสกุล (เพื่อปลดล็อกการเล่นต่อเป็นรุ่นลูก Generation + 1!)
  const handleFamilyAction = () => {
    if (age < 18) return;
    if (!spouse) {
      if (netWorth < 20) return;
      triggerSound('victory');
      const partner = POTENTIAL_PARTNERS[Math.floor(Math.random() * POTENTIAL_PARTNERS.length)];
      const netGain = (partner.dowry || 30) - 20;
      setSpouse(partner);
      setNetWorth(prev => Math.max(0, prev + netGain));
      setHappiness(prev => Math.min(100, prev + 20));
      setRelationships(prev => Math.min(100, prev + 20));
      setCurrentSceneId('market');
      setChronicleLogs(prev => [{
        id: `marry_${Date.now()}`,
        age,
        text: `💍 เข้าพิธีวิวาห์กับ "${partner.name}" (${partner.trait}) ได้รับสินสมรสสุทธิ ${netGain >= 0 ? `+${netGain}G` : `${netGain}G`}`,
        sceneId: 'market',
        statDelta: { gold: netGain, san: 20, rel: 20 },
        highlight: true
      }, ...prev]);
    } else if (children.length < 3) {
      triggerSound('victory');
      const childNum = children.length + 1;
      const childObj = { id: `child_${childNum}`, name: `ทายาทคนที่ ${childNum} แห่งตระกูล`, birthParentAge: age };
      setChildren(prev => [...prev, childObj]);
      setHappiness(prev => Math.min(100, prev + 15));
      setRelationships(prev => Math.min(100, prev + 15));
      setCurrentSceneId('birth');
      setChronicleLogs(prev => [{
        id: `child_${Date.now()}`,
        age,
        text: `👶 ต้อนรับสมาชิกใหม่! "${childObj.name}" ถือกำเนิดขึ้นท่ามกลางความยินดี พร้อมสืบทอดมรดกสู่รุ่นที่ ${generation + 1}!`,
        sceneId: 'birth',
        statDelta: { san: 15, rel: 15 },
        highlight: true
      }, ...prev]);
    }
  };

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
        gap: '10px',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: '#e11d48', fontWeight: 'bold', fontSize: '15px', letterSpacing: '0.5px' }}>
            1 ใน 100 ล้าน (รุ่นที่ {generation})
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
            อายุ {age} / {maxLifespan} ปี
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>
            ปี {2026 + age} • <strong style={{ color: '#ffd166' }}>{characterName}</strong> ({character.race.name})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
            title="ก้าวไปข้างหน้าทีละ 1 ปี"
          >
            ⏩ +1 ปี
          </button>

          {[
            { spd: 0.5, label: '0.5x' },
            { spd: 1, label: '1x' },
            { spd: 2, label: '2x' },
            { spd: 4, label: '4x' }
          ].map(({ spd, label }) => (
            <button
              key={spd}
              onClick={() => {
                setSpeed(spd);
                setIsRunning(true);
              }}
              style={{
                backgroundColor: speed === spd && isRunning ? '#e11d48' : '#0f172a',
                border: speed === spd && isRunning ? '1px solid #f43f5e' : '1px solid #1e293b',
                color: speed === spd && isRunning ? '#fff' : '#94a3b8',
                padding: '5px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {label}
            </button>
          ))}

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
            title="จำลองปีระหว่างทางไปจนถึงเหตุการณ์ตัดสินใจครั้งถัดไป"
          >
            ข้ามไปการตัดสินใจถัดไป »
          </button>

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
      {/* 2. VISUAL TIMELINE PROGRESS BAR                          */}
      {/* ======================================================== */}
      <div style={{
        backgroundColor: '#0c1017',
        border: '1px solid #1e293b',
        borderRadius: '8px',
        padding: '10px 16px',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', marginBottom: '4px' }}>
          <span style={{ color: isRunning ? '#38bdf8' : '#ffd166', fontWeight: 'bold' }}>
            ⏱️ {isRunning
              ? `กำลังจำลองปีที่ ${age} (ความเร็ว ${speed}x)`
              : '⏸️ หยุดเวลาชั่วคราว (กด [▶ เล่นต่อ], [⏩ +1 ปี] หรือ [ข้ามไปการตัดสินใจถัดไป »] ได้เลย)'}
          </span>
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

        <div style={{ position: 'relative', paddingTop: '2px' }}>
          <div style={{ height: '8px', backgroundColor: '#07090e', borderRadius: '4px', overflow: 'hidden', border: '1px solid #1e293b' }}>
            <div style={{
              width: `${Math.min(100, (age / maxLifespan) * 100)}%`,
              height: '100%',
              backgroundColor: '#e11d48',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#64748b',
            marginTop: '5px',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: age <= 5 ? '#38bdf8' : '#64748b' }}>🐣 ทารก (0-5)</span>
            <span style={{ color: age > 5 && age <= 12 ? '#38bdf8' : '#64748b' }}>🎒 วัยเด็ก (6-12)</span>
            <span style={{ color: age > 12 && age <= 17 ? '#38bdf8' : '#64748b' }}>⚔️ แรกรุ่น (13-17)</span>
            <span style={{ color: age >= 18 && age < 50 ? '#38bdf8' : '#64748b' }}>🛡️ ผู้ใหญ่ (18-49)</span>
            <span style={{ color: age >= 50 ? '#38bdf8' : '#64748b' }}>👑 อาวุโส (50-{maxLifespan})</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MAIN 3-COLUMN DASHBOARD LAYOUT                        */}
      {/* ======================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Dossier + 4 Vital Status Bars + RPG Gear & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Identity Dossier Card */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
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
              <span>รุ่นที่ {generation} • {2026 + age}</span>
            </div>

            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
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
                  <PixelCharacterAvatar raceId={character?.race?.id} size={64} animated={true} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
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

              <div style={{ fontSize: '11.5px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>คู่ครอง & ทายาท:</span>
                  <span style={{ color: '#f472b6', fontWeight: 'bold' }}>
                    {spouse ? `${spouse.name.split(' (')[0]} (ลูก ${children.length} คน)` : 'ยังโสด'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Vital Status Meters (0 - 100) + STR & LUK */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 'bold', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span>สถานะชีวภาพ & ค่าพลัง</span>
              <span>0–100</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#4ade80' }}>❤️ สุขภาพ / โครงสร้าง (Health)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{health}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${health}%`, height: '100%', backgroundColor: health < 30 ? '#ef4444' : '#10b981' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#facc15' }}>🧠 ความสุข / สติ (Sanity)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{happiness}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${happiness}%`, height: '100%', backgroundColor: '#eab308' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#38bdf8' }}>📖 ความรู้ / ปัญญา (INT)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{knowledge}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${knowledge}%`, height: '100%', backgroundColor: '#0ea5e9' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#f472b6' }}>🤝 ความสัมพันธ์ / บริวาร (REL)</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{relationships}</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${relationships}%`, height: '100%', backgroundColor: '#ec4899' }} />
                </div>
              </div>

              {/* Combat & Destiny Secondary Stats Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px',
                marginTop: '6px',
                paddingTop: '8px',
                borderTop: '1px solid #1e293b',
                textAlign: 'center',
                fontSize: '11px'
              }}>
                <div style={{ backgroundColor: '#070a12', padding: '5px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>💪 พละกำลัง</div>
                  <strong style={{ color: '#f87171' }}>STR {str}</strong>
                </div>
                <div style={{ backgroundColor: '#070a12', padding: '5px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>🍀 โชคชะตา</div>
                  <strong style={{ color: '#4ade80' }}>LUK {luk}</strong>
                </div>
                <div style={{ backgroundColor: '#070a12', padding: '5px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  <div style={{ color: '#64748b', fontSize: '10px' }}>⚔️ อาวุธ</div>
                  <strong style={{ color: '#fbbf24' }}>+{weapon?.atk || 0} ATK</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Finances, Potions, Debt & Family Actions Card */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '11.5px',
            color: '#94a3b8',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>ทรัพย์สินสุทธิ:</span>
              <strong style={{ color: '#4ade80', fontSize: '14px' }}>🪙 {netWorth} Gold</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>หนี้สินคงค้าง:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: debt > 0 ? '#f87171' : '#cbd5e1', fontWeight: debt > 0 ? 'bold' : 'normal' }}>
                  {debt}G
                </span>
                {debt > 0 && netWorth > 0 && (
                  <button
                    onClick={handlePayDebt}
                    style={{
                      backgroundColor: '#dc2626',
                      border: 'none',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    💳 ชำระหนี้
                  </button>
                )}
              </div>
            </div>

            {/* Boon & Curse Status */}
            {boon && (
              <div style={{ fontSize: '11px', backgroundColor: '#070a12', padding: '6px 8px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                  {boon.icon || '🌟'} พร: {boon.name.split(' (')[0]} ({boon.rarity})
                </div>
                {boon.effect?.reviveOnce && (
                  <div style={{ color: reviveUsed ? '#64748b' : '#38bdf8', fontSize: '10px', marginTop: '2px' }}>
                    {reviveUsed ? '⏳ ใช้สิทธิ์ฟื้นคืนชีพไปแล้ว' : '⏳ พร้อมฟื้นคืนชีพอัตโนมัติ 1 ครั้งเมื่อ HP หมด'}
                  </div>
                )}
                {innateCurse && (
                  <div style={{ color: '#fca5a5', fontSize: '10.5px', marginTop: '2px' }}>
                    {innateCurse.icon || '💀'} คำสาป: {innateCurse.name}
                  </div>
                )}
              </div>
            )}

            {/* Quick Action Buttons: Potions & Family */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '2px' }}>
              <button
                onClick={() => handleUseOrBuyPotion('hp_potion')}
                disabled={potions.hp_potion <= 0 && netWorth < 20}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #10b981',
                  color: '#86efac',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: (potions.hp_potion > 0 || netWorth >= 20) ? 'pointer' : 'not-allowed',
                  opacity: (potions.hp_potion > 0 || netWorth >= 20) ? 1 : 0.5
                }}
              >
                🧪 ยาเลือด ({potions.hp_potion > 0 ? `ฟรี x${potions.hp_potion}` : '20G'})
              </button>

              <button
                onClick={() => handleUseOrBuyPotion('san_potion')}
                disabled={potions.san_potion <= 0 && netWorth < 15}
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #eab308',
                  color: '#fde047',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: (potions.san_potion > 0 || netWorth >= 15) ? 'pointer' : 'not-allowed',
                  opacity: (potions.san_potion > 0 || netWorth >= 15) ? 1 : 0.5
                }}
              >
                🍵 ยาสติ ({potions.san_potion > 0 ? `ฟรี x${potions.san_potion}` : '15G'})
              </button>
            </div>

            {age >= 18 && children.length < 3 && (
              <button
                onClick={handleFamilyAction}
                disabled={!spouse && netWorth < 20}
                style={{
                  backgroundColor: '#1e1b4b',
                  border: '1px solid #f472b6',
                  color: '#fbcfe8',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: 'bold',
                  cursor: (!spouse && netWorth < 20) ? 'not-allowed' : 'pointer',
                  opacity: (!spouse && netWorth < 20) ? 0.6 : 1
                }}
              >
                {!spouse
                  ? `💍 แต่งงานสร้างครอบครัว (ใช้สินสอด 20G)`
                  : `👶 มีบุตร/ทายาทสืบสกุลคนที่ ${children.length + 1} (ส่งต่อมรดกรุ่นถัดไป)`}
              </button>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Living Animated Scene Diorama + Yearly Focus + Chronicle */}
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Unified Living 1in8b-Style Animated Scene Diorama */}
          <SceneViewport
            sceneId={currentSceneId}
            age={age}
            character={character}
            characterName={characterName}
            realm={realm}
            housing={housing}
            spouse={spouse}
            children={children}
            weapon={weapon}
            height={225}
          />

          {/* Interactive Year Focus Selector (จุดเน้นของปีนี้ — เลือกเปลี่ยนได้จริงเหมือน 1in8b!) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '14px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ color: '#ffd166', fontWeight: 'bold' }}>
                🌟 จุดเน้นของปีนี้ (วัย {age} ปี • เปลี่ยนได้ตลอดเวลา):
              </span>
              <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                {YEARLY_FOCUS_OPTIONS.find(f => f.id === yearFocus)?.desc}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {YEARLY_FOCUS_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setYearFocus(opt.id)}
                  style={{
                    backgroundColor: yearFocus === opt.id ? 'rgba(245, 158, 11, 0.2)' : '#070a12',
                    border: yearFocus === opt.id ? '1px solid #f59e0b' : '1px solid #1e293b',
                    color: yearFocus === opt.id ? '#fde047' : '#94a3b8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: yearFocus === opt.id ? 'bold' : 'normal',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
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
            maxHeight: '430px',
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
                📜 บันทึกชีวิต (Timeline Stream • คลิกเพื่อดูฉากเหตุการณ์)
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {chronicleLogs.length} เหตุการณ์
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
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '44px',
                      flexShrink: 0,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: '1px solid #334155',
                      backgroundColor: '#000000'
                    }}>
                      <PixelSceneIllustrator sceneId={log.sceneId || 'alley'} height={44} animated={false} age={log.age} character={character} />
                    </div>

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
                            👑 จุดสำคัญ
                          </span>
                        )}
                      </div>

                      <div style={{ color: log.isCrisis ? '#fecaca' : log.highlight ? '#fef08a' : '#cbd5e1' }}>
                        {log.text}
                      </div>

                      {hasStats && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                          {delta.hp !== undefined && delta.hp !== 0 && (
                            <span style={statBadgeStyle(delta.hp > 0)}>
                              {delta.hp > 0 ? `❤️ HP +${delta.hp}` : `💔 HP ${delta.hp}`}
                            </span>
                          )}
                          {delta.san !== undefined && delta.san !== 0 && (
                            <span style={statBadgeStyle(delta.san > 0)}>
                              {delta.san > 0 ? `🧠 สติ +${delta.san}` : `⚠️ สติ ${delta.san}`}
                            </span>
                          )}
                          {delta.gold !== undefined && delta.gold !== 0 && (
                            <span style={statBadgeStyle(delta.gold > 0)}>
                              {delta.gold > 0 ? `🪙 +${delta.gold}G` : `💸 ${delta.gold}G`}
                            </span>
                          )}
                          {delta.int !== undefined && delta.int !== 0 && (
                            <span style={statBadgeStyle(delta.int > 0)}>
                              {delta.int > 0 ? `📖 INT +${delta.int}` : `INT ${delta.int}`}
                            </span>
                          )}
                          {delta.str !== undefined && delta.str !== 0 && (
                            <span style={statBadgeStyle(delta.str > 0)}>
                              {delta.str > 0 ? `💪 STR +${delta.str}` : `STR ${delta.str}`}
                            </span>
                          )}
                          {delta.luk !== undefined && delta.luk !== 0 && (
                            <span style={statBadgeStyle(delta.luk > 0)}>
                              {delta.luk > 0 ? `🍀 LUK +${delta.luk}` : `LUK ${delta.luk}`}
                            </span>
                          )}
                          {delta.rel !== undefined && delta.rel !== 0 && (
                            <span style={statBadgeStyle(delta.rel > 0)}>
                              {delta.rel > 0 ? `🤝 สัมพันธ์ +${delta.rel}` : `สัมพันธ์ ${delta.rel}`}
                            </span>
                          )}
                          {delta.debt !== undefined && delta.debt !== 0 && (
                            <span style={statBadgeStyle(delta.debt < 0)}>
                              {delta.debt > 0 ? `หนี้ +${delta.debt}G` : `ลดหนี้ ${delta.debt}G`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Lineage & Bonds + Dynamic Cohort + 80-Year Life Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Species-Accurate Origin & Bonds Box */}
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

          {/* People Born in Same Second (Dynamic Cohort!) */}
          <div style={{
            backgroundColor: '#0c1017',
            border: '1.5px solid #1e293b',
            borderRadius: '10px',
            padding: '14px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#f8fafc' }}>
                คนที่เกิดในวินาทีเดียวกัน
              </span>
              <span style={{ fontSize: '10.5px', color: '#38bdf8' }}>
                รอดชีวิต {cohort.filter(c => c.alive).length}/4
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
              {cohort.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', opacity: c.alive ? 1 : 0.6 }}>
                  <span style={{ color: c.alive ? '#cbd5e1' : '#64748b' }}>{c.name}</span>
                  <span style={{ color: c.alive ? '#34d399' : '#f87171', fontSize: '11px' }}>{c.stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Multiverse Meme Traveler Cameo */}
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

          {/* 80-Year Life Grid */}
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

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: '4px'
            }}>
              {Array.from({ length: 80 }).map((_, boxIndex) => {
                const isPassed = boxIndex < age;
                const isCurrent = boxIndex === age;
                const historyItem = lifeGridHistory.find(h => h.age === boxIndex);

                let boxBg = '#111827';
                if (isCurrent) boxBg = '#e11d48';
                else if (isPassed) {
                  if (historyItem?.type === 'crisis') boxBg = '#991b1b';
                  else if (historyItem?.type === 'decision') boxBg = '#b45309';
                  else boxBg = '#1e3a5f';
                }

                return (
                  <div
                    key={boxIndex}
                    onMouseEnter={() => setHoveredGridYear(historyItem || { age: boxIndex, year: 2026 + boxIndex, summary: 'อนาคตที่ยังมาไม่ถึง' })}
                    onMouseLeave={() => setHoveredGridYear(null)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '3px',
                      backgroundColor: boxBg,
                      border: isCurrent ? '1.5px solid #fb7185' : '1px solid #1f293d',
                      cursor: 'pointer'
                    }}
                  />
                );
              })}
            </div>

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
                  ชี้ที่ช่องเพื่อดูบันทึกเหตุการณ์ของปีนั้นๆ (สีทอง = จุดเปลี่ยน, สีแดง = วิกฤต)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAJOR DECISION / LORE / CRISIS MODAL                  */}
      {/* ======================================================== */}
      {activeDecision && (
        <MajorDecisionModal
          decision={activeDecision}
          characterName={characterName}
          character={character}
          netWorth={netWorth}
          stats={{ str, int: Math.round(knowledge / 3), luk }}
          onSelectChoice={(choice) => applyDecisionChoice(choice, activeDecision.age)}
          onDismiss={() => setActiveDecision(null)}
        />
      )}
    </div>
  );
}
