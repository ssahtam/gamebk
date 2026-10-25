import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { RACES } from './data/birthData';
import { REALMS, SOCIAL_CLASSES, RELIGIONS, GENDERS } from './data/darkWorldDemographics';
import { generateBestowedName } from './data/namesData';
import { FUNERAL_CHOICES } from './data/familyAndGenerations';
import { BLESSINGS_GACHA, INNATE_CURSES } from './data/blessingsData';
import { MEME_EQUIPMENT } from './data/itemsData';
import { getRandomEventForAge, checkChoiceAvailability } from './data/lifeStoryEngine';
import SceneViewport from './components/SceneViewport';
import CharacterVisualCard, { PORTRAIT_IMAGE_MAP } from './components/CharacterVisualCard';
import BirthCertificateView from './components/BirthCertificateView';
import LifeDashboardView from './components/LifeDashboardView';
import TitleScreenView from './components/TitleScreenView';
import MemePixelBackground from './components/MemePixelBackground';
import { playSound } from './utils/sound';

class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("GameErrorBoundary caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#07060a',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💀🕯️</div>
          <h2 style={{ color: '#ef4444', marginBottom: '8px', fontSize: '24px' }}>
            มิติแปรปรวนในแดนมรณะ (Game Recovered)
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '500px', fontSize: '14px', marginBottom: '24px' }}>
            เกิดข้อผิดพลาดชั่วขณะในระบบจำลองโชคชะตา: {this.state.error?.message || 'ข้อผิดพลาดระบบ'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              backgroundColor: '#8a0303',
              border: '1.5px solid #c99738',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔥 รีเฟรชและเริ่มชีวิตใหม่
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <GameErrorBoundary>
      <GameContent />
    </GameErrorBoundary>
  );
}

function GameContent() {
  // Screens: 'TITLE' | 'BIRTH' | 'PLAYING' | 'FUNERAL' | 'DEAD'
  const [gameState, setGameState] = useState('TITLE');

  // Generation counter
  const [generation, setGeneration] = useState(1);

  // Reincarnation history to ensure 100% unique lives ("1 ในล้าน เกิดใหม่ไม่ซ้ำชีวิตเดิม")
  const [previousRaceIds, setPreviousRaceIds] = useState([]);
  const [lastLifeInfo, setLastLifeInfo] = useState(null);

  // Character Profile & Demographics
  const [characterName, setCharacterName] = useState('กัตซ์ แห่งกองเถ้า');
  const [bestowedGiver, setBestowedGiver] = useState('แม่ผู้สิ้นใจกอดเจ้าแนบอกและกระซิบตั้งชื่อให้เจ้าว่า');
  const [character, setCharacter] = useState(null);
  const [gender, setGender] = useState('ชาย');
  const [realm, setRealm] = useState(REALMS[0]);
  const [socialClass, setSocialClass] = useState(SOCIAL_CLASSES[1]);
  const [familyFund, setFamilyFund] = useState(20);

  // Vital Stats
  const [age, setAge] = useState(0);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [san, setSan] = useState(60);
  const [gold, setGold] = useState(0);
  const [debt, setDebt] = useState(0);
  const [str, setStr] = useState(10);
  const [intStat, setIntStat] = useState(10);
  const [luk, setLuk] = useState(10);

  // Boon & Curse
  const [boon, setBoon] = useState(null);
  const [innateCurse, setInnateCurse] = useState(null);

  // Equipment & Inventory (ให้ดูแค่อุปกรณ์ที่มี)
  const [weapon, setWeapon] = useState(MEME_EQUIPMENT[0]);
  const [armor, setArmor] = useState(MEME_EQUIPMENT[5]);
  const [accessory, setAccessory] = useState(null);
  const [potionsCount, setPotionsCount] = useState({ hp_potion: 1, san_potion: 1 });

  // Life Status
  const [education, setEducation] = useState('ยังไม่ถึงเกณฑ์เรียน');
  const [spouse, setSpouse] = useState(null);
  const [children, setChildren] = useState([]);
  const [currentJobTitle, setCurrentJobTitle] = useState('ทารกแรกเกิด');

  // Dynamic Randomized Event Engine State
  const [currentEvent, setCurrentEvent] = useState(null);
  const [seenEventIds, setSeenEventIds] = useState(new Set());
  const [choiceOutcome, setChoiceOutcome] = useState(null);
  const [deathInfo, setDeathInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtFilter, setCrtFilter] = useState(false);

  const historyEndRef = useRef(null);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const triggerSound = (type) => {
    if (soundEnabled) playSound(type);
  };

  // 1. Roll Birth (Authentic Demographics & Capital)
  const handleRollBirth = (inheritedData = null) => {
    triggerSound('reincarnate');

    // Roll Realm & Social Class
    const pickedRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
    const classRand = Math.random() * 100;
    let pickedClass;
    if (classRand < 35) pickedClass = SOCIAL_CLASSES[0];
    else if (classRand < 70) pickedClass = SOCIAL_CLASSES[1];
    else if (classRand < 90) pickedClass = SOCIAL_CLASSES[2];
    else if (classRand < 98) pickedClass = SOCIAL_CLASSES[3];
    else pickedClass = SOCIAL_CLASSES[4];

    // Roll Race from full spectrum of beings (คนเราเลือกเกิดไม่ได้! สุ่มจาก 42 เผ่า และไม่ซ้ำชีวิตเดิม)
    let availableRaces = RACES.filter(r => !previousRaceIds.includes(r.id));
    if (availableRaces.length === 0) {
      // เมื่อเล่นจนครบทุกเผ่า จะล้างประวัติโดยกันเฉพาะเผ่าของชาติล่าสุด
      availableRaces = RACES.filter(r => r.id !== character?.race?.id);
      if (availableRaces.length === 0) availableRaces = RACES;
      setPreviousRaceIds(character?.race ? [character.race.id] : []);
    }

    // น้ำหนักโอกาสเกิดตามระดับความหายาก (SECRET 0.5%, SSR 1.5%, Rare 3.5%, Uncommon 6%, Common 10%)
    const getRaceWeight = (race) => {
      if (race.rarity.includes('SECRET')) return 0.5;
      if (race.rarity.includes('SSR')) return 1.5;
      if (race.rarity.includes('Rare')) return 3.5;
      if (race.rarity.includes('Uncommon')) return 6.0;
      return 10.0;
    };

    const totalWeight = availableRaces.reduce((sum, r) => sum + getRaceWeight(r), 0);
    let randRoll = Math.random() * totalWeight;
    let selectedRace = availableRaces[0];

    for (const r of availableRaces) {
      const w = getRaceWeight(r);
      if (randRoll < w) {
        selectedRace = r;
        break;
      }
      randRoll -= w;
    }

    // บันทึกเผ่าพันธุ์ลงในประวัติการเวียนว่ายตายเกิด เพื่อให้ชีวิตถัดไปไม่ซ้ำเดิม
    setPreviousRaceIds(prev => [...prev, selectedRace.id]);

    // จุดพลุฉลองหากสุ่มได้สิ่งมีชีวิตระดับ SSR หรือ SECRET
    if (selectedRace.rarity.includes('SSR') || selectedRace.rarity.includes('SECRET')) {
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
    }

    // Roll Gender from Race's biological gender pool (คนเราเลือกเพศเกิดไม่ได้ สุ่ม 100%)
    const genderPool = selectedRace.genderPool || ['ชาย', 'หญิง'];
    const pickedGender = genderPool[Math.floor(Math.random() * genderPool.length)];

    // Generate Bestowed Name & Giver Lore
    const { fullName: rolledName, giverText } = generateBestowedName(selectedRace, pickedGender);
    setCharacterName(rolledName);
    setBestowedGiver(giverText);
    setGender(pickedGender);

    // Roll Boon (SSR 5%, SR 15%, Common 50%, None 30%)
    const boonRand = Math.random() * 100;
    let rolledBoon;
    if (boonRand < 5) {
      const ssrPool = BLESSINGS_GACHA.filter(b => b.rarity === 'SSR');
      rolledBoon = ssrPool[Math.floor(Math.random() * ssrPool.length)];
    } else if (boonRand < 20) {
      const srPool = BLESSINGS_GACHA.filter(b => b.rarity === 'SR');
      rolledBoon = srPool[Math.floor(Math.random() * srPool.length)];
    } else if (boonRand < 70) {
      const comPool = BLESSINGS_GACHA.filter(b => b.rarity === 'Common');
      rolledBoon = comPool[Math.floor(Math.random() * comPool.length)];
    } else {
      rolledBoon = BLESSINGS_GACHA.find(b => b.rarity === 'NONE') || BLESSINGS_GACHA[BLESSINGS_GACHA.length - 1];
    }

    // Roll Innate Curse
    const curseIndex = Math.floor(Math.random() * INNATE_CURSES.length);
    const rolledCurse = INNATE_CURSES[curseIndex];

    // Compute Starting Capital & Family Support Fund
    const classGoldBonus = pickedClass.id === 'noble_lord' ? 100 : pickedClass.id === 'wealthy_knight' ? 40 : pickedClass.id === 'middle_craftsman' ? 15 : 0;
    let startingGold = (selectedRace.baseGold || 15) + classGoldBonus + (inheritedData?.gold || 0);
    let initialFamilyFund = pickedClass.familyFund !== undefined ? pickedClass.familyFund : 20;
    let startingDebt = pickedClass.debt || 0;

    // Base attributes
    let baseHp = selectedRace.baseHp || 70;
    let baseSan = selectedRace.baseSan || 50;
    let baseStr = selectedRace.str || 10;
    let baseInt = selectedRace.int || 10;
    let baseLuk = selectedRace.luk || 10;

    // Apply Boon
    if (rolledBoon?.effect?.hp) baseHp += rolledBoon.effect.hp;
    if (rolledBoon?.effect?.maxHp) baseHp += rolledBoon.effect.maxHp;
    if (rolledBoon?.effect?.gold) startingGold += rolledBoon.effect.gold;
    if (rolledBoon?.effect?.str) baseStr += rolledBoon.effect.str;
    if (rolledBoon?.effect?.int) baseInt += rolledBoon.effect.int;
    if (rolledBoon?.effect?.luk) baseLuk += rolledBoon.effect.luk;
    if (rolledBoon?.effect?.san) baseSan = Math.min(100, Math.max(10, baseSan + rolledBoon.effect.san));

    // Apply Curse
    if (rolledCurse?.id === 'curse_soul_debt') startingDebt += 40;

    // Inherited equipment
    let initWeapon = inheritedData?.weapon || MEME_EQUIPMENT[0];
    let initArmor = inheritedData?.armor || MEME_EQUIPMENT[5];

    setCharacter({ race: selectedRace, bodyType: selectedRace.bodyType });
    setRealm(pickedRealm);
    setSocialClass(pickedClass);
    setFamilyFund(initialFamilyFund);
    setGold(startingGold);
    setDebt(startingDebt);

    setAge(0);
    setHp(baseHp);
    setMaxHp(baseHp);
    setSan(baseSan);
    setStr(baseStr);
    setIntStat(baseInt);
    setLuk(baseLuk);

    setBoon(rolledBoon);
    setInnateCurse(rolledCurse);
    setWeapon(initWeapon);
    setArmor(initArmor);
    setAccessory(null);
    setPotionsCount({ hp_potion: 1, san_potion: 1 });

    setEducation('วัยแรกเกิด (ยังไม่ถึงเกณฑ์เรียน)');
    setSpouse(null);
    setChildren([]);
    setCurrentJobTitle('ทารกแรกเกิด');

    const firstEvent = getRandomEventForAge(0, new Set(), { race: selectedRace });
    setCurrentEvent(firstEvent);
    setSeenEventIds(new Set([firstEvent.id]));
    setChoiceOutcome(null);
    setDeathInfo(null);
    setHistory([
      `✨ ถือกำเนิดในโลกมืด (รุ่นที่ ${generation}): "${rolledName}" เผ่า ${selectedRace.name} (เพศ: ${pickedGender})`,
      `🏰 ถิ่นกำเนิด: ${pickedRealm.name} | ชนชั้น: ${pickedClass.name}`,
      `💰 ทุนชีวิตครอบครัว: งบเรียน ${initialFamilyFund}G | ทองติดตัว ${startingGold}G ${startingDebt > 0 ? `(หนี้ ${startingDebt}G)` : ''}`,
      `🌟 พรแห่งโชคชะตา: ${rolledBoon.name} (${rolledBoon.rarity})`,
      `💀 คำสาปประจำตัว: ${rolledCurse.name}`
    ]);

    setGameState('BIRTH');
  };

  // 2. Start Narrative Journey
  const handleStartLife = () => {
    triggerSound('click');
    setGameState('PLAYING');
  };

  // 3. Make a Narrative Choice
  const handleMakeChoice = (choice, chapter) => {
    triggerSound('click');

    // Check Gold Cost
    if (choice.reqGold && gold < choice.reqGold) {
      alert(`เหรียญทองไม่เพียงพอ! ต้องการ ${choice.reqGold}G (คุณมี ${gold}G)`);
      return;
    }

    // Check Stat Requirement (Success / Failure check)
    let isSuccess = true;
    let chosenResultText = choice.result;
    let chosenChanges = choice.changes || {};

    if (choice.reqStat) {
      if (choice.reqStat.str && str < choice.reqStat.str) isSuccess = false;
      if (choice.reqStat.int && intStat < choice.reqStat.int) isSuccess = false;
      if (choice.reqStat.luk && luk < choice.reqStat.luk) isSuccess = false;

      if (isSuccess) {
        triggerSound('victory');
        chosenResultText = choice.successResult;
        chosenChanges = choice.successChanges || {};
      } else {
        triggerSound('hurt');
        chosenResultText = choice.failResult;
        chosenChanges = choice.failChanges || {};
      }
    } else {
      if (choice.changes?.gold && choice.changes.gold > 0) triggerSound('gold');
      else if (choice.changes?.hp && choice.changes.hp < 0) triggerSound('hurt');
    }

    // Apply Stat Changes with defensive parsing
    let newHp = Number(hp) || 70;
    let newMaxHp = Number(maxHp) || 70;
    let newSan = Number(san) || 50;
    let newGold = Number(gold) || 0;
    let newDebt = Number(debt) || 0;
    let newStr = Number(str) || 10;
    let newInt = Number(intStat) || 10;
    let newLuk = Number(luk) || 10;

    if (choice.reqGold) newGold = Math.max(0, newGold - Number(choice.reqGold));
    if (chosenChanges.gold) newGold += Number(chosenChanges.gold);
    if (chosenChanges.debt) newDebt += Number(chosenChanges.debt);
    if (chosenChanges.maxHp) newMaxHp += Number(chosenChanges.maxHp);
    if (chosenChanges.hp) newHp = Math.min(newMaxHp, Math.max(0, newHp + Number(chosenChanges.hp)));
    if (chosenChanges.san) newSan = Math.min(100, Math.max(0, newSan + Number(chosenChanges.san)));
    if (chosenChanges.str) newStr += Number(chosenChanges.str);
    if (chosenChanges.int) newInt += Number(chosenChanges.int);
    if (chosenChanges.luk) newLuk += Number(chosenChanges.luk);

    // Update state
    setHp(newHp);
    setMaxHp(newMaxHp);
    setSan(newSan);
    setGold(newGold);
    setDebt(newDebt);
    setStr(newStr);
    setIntStat(newInt);
    setLuk(newLuk);

    // Life metadata updates
    if (choice.education) setEducation(choice.education);
    if (choice.job) setCurrentJobTitle(choice.job);
    if (choice.spouse) setSpouse({ name: choice.spouse });
    if (choice.addChild) setChildren(prev => [...prev, choice.addChild]);

    // Item Grants
    if (choice.grantItem) {
      const item = choice.grantItem;
      if (item.type === 'weapon') setWeapon(item);
      else if (item.type === 'armor') setArmor(item);
      else if (item.type === 'accessory') setAccessory(item);
    }

    // Append history
    setHistory(prev => [
      ...prev,
      `📍 [อายุ ${age} ปี] ${choice.text}`,
      `💬 ${chosenResultText}`
    ]);

    // Check Death immediately
    if (chosenChanges.isDead || newHp <= 0 || newSan <= 0) {
      triggerSound('gameover');
      let cause = chosenChanges.deathReason || choice.deathReason;
      if (!cause) {
        if (newSan <= 0) {
          cause = 'ค่าสติดิ่งลงเหลือ 0 จนสติแตก กลายร่างเป็นอสูรบ้าคลั่งในเงามืด';
        } else {
          cause = `บาดเจ็บสาหัสจนสิ้นใจจากเหตุการณ์ "${chapter.title}"`;
        }
      }
      setDeathInfo({
        age: age,
        cause: cause,
        name: characterName,
        race: character.race.name,
        gender: gender,
        heritage: `"${characterName}" เผ่า ${character.race.name} (เพศ: ${gender}) แห่ง ${realm.name}`
      });
      setLastLifeInfo({
        name: characterName,
        raceName: character.race.name,
        age: age,
        generation: generation
      });
      setGameState('FUNERAL');
      return;
    }

    // Set Outcome Card for player to review
    setChoiceOutcome({
      text: chosenResultText,
      changes: chosenChanges,
      nextAge: chapter.nextAge,
      grantedItem: choice.grantItem || null
    });
  };

  // 4. Advance to Next Age & Chapter
  const handleAdvanceAge = () => {
    triggerSound('click');
    if (!choiceOutcome) return;

    const nextAgeValue = choiceOutcome.nextAge;
    setAge(nextAgeValue);

    // Weapon/Armor Durability Decay (Every 3 years)
    if (nextAgeValue % 3 === 0) {
      if (weapon && weapon.durability > 0) {
        const nextDur = weapon.durability - 1;
        if (nextDur <= 0) {
          setWeapon(null);
          setHistory(prev => [...prev, `💥 อาวุธ "${weapon.name}" พังทลายลงตามกาลเวลา!`]);
        } else {
          setWeapon({ ...weapon, durability: nextDur });
        }
      }
      if (armor && armor.durability > 0) {
        const nextDur = armor.durability - 1;
        if (nextDur <= 0) {
          setArmor(null);
          setHistory(prev => [...prev, `💥 เกราะ "${armor.name}" ชำรุดแตกหักแล้ว!`]);
        } else {
          setArmor({ ...armor, durability: nextDur });
        }
      }
    }

    // Check if reached old age and natural end (Age 65+)
    if (nextAgeValue >= 65) {
      triggerSound('victory');
      setDeathInfo({
        age: nextAgeValue,
        cause: 'สิ้นอายุขัยอย่างสงบสุขในบั้นปลายชีวิต หลังผ่านมหากาพย์ชีวิตอันโชกโชน',
        name: characterName,
        race: character.race.name,
        gender: gender,
        heritage: `"${characterName}" เผ่า ${character.race.name} (เพศ: ${gender}) แห่ง ${realm.name}`
      });
      setLastLifeInfo({
        name: characterName,
        raceName: character.race.name,
        age: age,
        generation: generation
      });
      setGameState('FUNERAL');
      return;
    }

    // Dynamic Draw: Pick next random event for the new age!
    const nextEvent = getRandomEventForAge(nextAgeValue, seenEventIds, character);
    setCurrentEvent(nextEvent);
    setSeenEventIds(prev => new Set([...prev, nextEvent.id]));
    setChoiceOutcome(null);
  };

  // Drink Potion directly from Equipment Bag
  const usePotion = (type) => {
    if (potionsCount[type] > 0) {
      triggerSound('victory');
      setPotionsCount(prev => ({ ...prev, [type]: prev[type] - 1 }));
      if (type === 'hp_potion') {
        setHp(h => Math.min(maxHp, h + 40));
        setHistory(prev => [...prev, '🧪 ดื่มน้ำยาฟื้นเลือด (HP +40)']);
      } else if (type === 'san_potion') {
        setSan(s => Math.min(100, s + 30));
        setHistory(prev => [...prev, '🧪 ดื่มยาแก้คลั่งคืนสติ (SAN +30)']);
      }
    }
  };

  // Death handling from 1in8b.life Dashboard
  const handleDashboardDeath = (deathData) => {
    triggerSound('death');
    if (deathData && deathData.netWorth !== undefined) {
      setGold(deathData.netWorth);
    }
    setDeathInfo({
      age: deathData.age,
      cause: deathData.cause,
      name: characterName,
      race: character.race.name,
      gender: gender,
      heritage: `"${characterName}" เผ่า ${character.race.name} (เพศ: ${gender}) แห่ง ${realm.name}`
    });
    setLastLifeInfo({
      name: characterName,
      raceName: character.race.name,
      age: deathData.age,
      generation: generation
    });
    setGameState('FUNERAL');
  };

  // Funeral Selection & Inheritance
  const handleSelectFuneral = (funeral) => {
    triggerSound('gold');
    setDeathInfo(prev => ({
      ...prev,
      funeral: funeral
    }));
    setGameState('DEAD');
  };

  // Reincarnate as Next Generation (Child)
  const handleReincarnateAsChild = () => {
    const inheritedGold = Math.floor(gold * 0.7);
    const inheritedWeapon = weapon;
    const inheritedArmor = armor;

    setGeneration(prev => prev + 1);
    handleRollBirth({
      gold: inheritedGold,
      weapon: inheritedWeapon,
      armor: inheritedArmor
    });
  };

  const currentChapter = currentEvent || getRandomEventForAge(age || 0, seenEventIds, character);

  return (
    <div style={containerStyle} className={crtFilter ? 'crt-filter' : ''}>
      {/* 16-Bit Meme Dynamic Multi-Layer Background */}
      <MemePixelBackground gameState={gameState} age={age} />

      {/* Gothic Atmospheric Top Bar */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px', filter: 'drop-shadow(0 0 6px #c99738)' }}>🕯️</span>
          <div>
            <div className="gothic-title" style={{ fontWeight: 'bold', fontSize: '18px', color: '#c99738', letterSpacing: '1.5px', textShadow: '0 0 10px rgba(201, 151, 56, 0.4)' }}>
              1 ในร้อยล้าน: ดาร์กแฟนตาซีต่างโลก
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              รุ่นที่ {generation} • ทุกการตัดสินใจกำหนดชะตากรรม
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCrtFilter(!crtFilter)}
            style={{
              ...soundBtnStyle,
              backgroundColor: crtFilter ? 'rgba(201, 151, 56, 0.2)' : '#181f2f',
              border: crtFilter ? '1px solid #c99738' : '1px solid #334155',
              color: crtFilter ? '#ffd166' : '#cbd5e1'
            }}
            title="สลับโหมดจอแก้วเรโทร CRT Scanlines"
          >
            📺 CRT {crtFilter ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={soundBtnStyle}
            title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
          >
            {soundEnabled ? '🔊 มีเสียง' : '🔇 ปิดเสียง'}
          </button>
        </div>
      </div>

      {/* Screen 1: Title Screen (Revamped Aseprite Retro Pixel Hub) */}
      {gameState === 'TITLE' && (
        <TitleScreenView
          onRollBirth={() => handleRollBirth()}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          crtFilter={crtFilter}
          onToggleCrt={() => setCrtFilter(!crtFilter)}
        />
      )}

      {/* Screen 2: Birth Certificate View (Exact 1 in 8 Billion Replica) */}
      {gameState === 'BIRTH' && character && (
        <BirthCertificateView
          character={character}
          characterName={characterName}
          bestowedGiver={bestowedGiver}
          gender={gender}
          realm={realm}
          socialClass={socialClass}
          familyFund={familyFund}
          gold={gold}
          debt={debt}
          onStartLife={handleStartLife}
          onNameChange={(newName) => setCharacterName(newName)}
          onRerollName={() => {
            const { fullName, giverText } = generateBestowedName(character.race, gender);
            setCharacterName(fullName);
            setBestowedGiver(giverText);
          }}
        />
      )}

      {/* Screen 3: Life Simulation Dashboard (Exact 1 in 8 Billion 3-Column Layout) */}
      {gameState === 'PLAYING' && character && (
        <LifeDashboardView
          character={character}
          characterName={characterName}
          gender={gender}
          realm={realm}
          socialClass={socialClass}
          gold={gold}
          debt={debt}
          onDie={handleDashboardDeath}
          onReincarnate={() => handleRollBirth()}
        />
      )}

      {/* Screen 4: Funeral Choice on Death */}
      {gameState === 'FUNERAL' && deathInfo && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: '65px', marginBottom: '10px' }}>💀⚰️🕯️</div>
            <h1 className="gothic-title" style={{ color: '#ef4444', fontSize: '24px', marginBottom: '8px' }}>
              คุณถึงแก่ความตาย ณ วัย {deathInfo.age} ปี!
            </h1>
            <p style={{ color: '#ffd166', fontSize: '15.5px', marginBottom: '16px' }}>
              สาเหตุการเสียชีวิต: <strong>"{deathInfo.cause}"</strong>
            </p>
            <p className="story-text" style={{ maxWidth: '600px', margin: '0 auto 24px', textAlign: 'center' }}>
              ชะตากรรมของ {deathInfo.heritage} สิ้นสุดลงแล้ว... ถึงเวลาที่ญาติมิตรหรือผู้คนในแดนมรณะต้องจัดการพิธีศพให้เจ้า
            </p>

            <h3 className="gothic-title" style={{ color: '#c99738', fontSize: '16px', marginBottom: '14px' }}>
              เลือกรูปแบบพิธีศพและการระลึกถึง (ตามทุนทรัพย์ที่มี {gold}G):
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', textAlign: 'left' }}>
              {FUNERAL_CHOICES.map(f => {
                const canAfford = gold >= f.cost;
                return (
                  <div key={f.id} style={{ ...jobCardStyle, opacity: canAfford ? 1 : 0.6 }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: canAfford ? '#c99738' : '#64748b', fontSize: '14px' }}>{f.name}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{f.desc}</div>
                      <div style={{ fontSize: '11.5px', color: '#4ade80', marginTop: '4px', fontWeight: 'bold' }}>
                        ค่าใช้จ่าย: {f.cost}G
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectFuneral(f)}
                      disabled={!canAfford}
                      style={{ ...actionSmallBtnStyle, marginTop: '8px', width: '100%' }}
                    >
                      {canAfford ? 'เลือกพิธีนี้' : 'เงินไม่พอ'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Screen 5: Death Summary & Generation Succession */}
      {gameState === 'DEAD' && deathInfo && (
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: '65px', marginBottom: '10px' }}>👑✨🔥</div>
            <h1 className="cinzel-decor" style={{ color: '#c99738', fontSize: '24px', marginBottom: '16px' }}>
              บทสรุปแห่งวัฏจักร (จบการใช้ชีวิตรุ่นที่ {generation})
            </h1>

            {/* Legacy Box */}
            <div style={{ ...heritageBoxStyle, maxWidth: '600px', margin: '0 auto 20px', textAlign: 'left' }}>
              <h4 className="gothic-title" style={{ color: '#c99738', marginBottom: '10px' }}>
                มรดกตกทอดสู่ทายาทรุ่นต่อไป:
              </h4>
              <div style={{ fontSize: '13.5px', color: '#f1f5f9', lineHeight: '1.8' }}>
                <div>• ผู้ล่วงลับ: <strong style={{ color: '#ffd166' }}>{characterName}</strong> (เผ่า {character.race.name}, เพศ {gender})</div>
                <div>• อายุขัยรวม: {deathInfo.age} ปี</div>
                <div>• พิธีศพ: {deathInfo.funeral?.name}</div>
                <div>• ทองคำที่เหลือ: {gold}G {children.length > 0 ? `(ส่งต่อให้ทายาท 70% = ${Math.floor(gold * 0.7)}G)` : '(ไม่มีทายาท ทองสูญหาย)'}</div>
                <div>• อาวุธตกทอด: {weapon ? weapon.name : 'ไม่มี'}</div>
                <div>• เกราะตกทอด: {armor ? armor.name : 'ไม่มี'}</div>
              </div>
            </div>

            {/* Succession Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
              {children.length > 0 ? (
                <button onClick={handleReincarnateAsChild} style={{ ...primaryButtonStyle, backgroundColor: '#c99738', color: '#000', border: '1px solid #fde047' }}>
                  👶 เล่นต่อเป็นรุ่นลูก (Generation {generation + 1}) สืบทอดมรดก 70%!
                </button>
              ) : (
                <div style={{ fontSize: '12.5px', color: '#f87171', marginBottom: '6px' }}>
                  ⚠️ เจ้าไม่มีทายาทสืบสายเลือด ไม่สามารถเล่นต่อเป็นรุ่นลูกได้
                </div>
              )}

              <button onClick={() => handleRollBirth()} style={primaryButtonStyle}>
                🔥 สุ่มเกิดใหม่เป็นรุ่นที่ 1 (เริ่มชีวิตใหม่)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Dark Fantasy Theme & UX Styles
// ==========================================
const containerStyle = {
  backgroundColor: 'transparent',
  color: '#cbd5e1',
  minHeight: '100vh',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1
};

const headerStyle = {
  width: '100%',
  maxWidth: '1150px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '14px',
  borderBottom: '1px solid #283149',
  marginBottom: '18px'
};

const cardStyle = {
  backgroundColor: '#11141e',
  border: '1px solid #283149',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '820px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.5)'
};

const sidebarCardStyle = {
  backgroundColor: '#11141e',
  border: '1px solid #283149',
  borderRadius: '12px',
  padding: '18px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.5)'
};

const storyDescBoxStyle = {
  backgroundColor: '#090b12',
  border: '1px solid #1e2638',
  borderRadius: '8px',
  padding: '16px 18px',
  marginBottom: '18px',
  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.6)'
};

const choiceButtonStyle = (disabled) => ({
  backgroundColor: disabled ? '#0b0f19' : '#131b2e',
  border: disabled ? '1.5px solid #283149' : '1.5px solid #334155',
  borderLeft: disabled ? '4px solid #475569' : '4px solid #c99738',
  borderRadius: '8px',
  padding: '14px 18px',
  textAlign: 'left',
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.4)',
  color: disabled ? '#94a3b8' : '#f8fafc'
});

const outcomeCardStyle = {
  backgroundColor: '#0a101d',
  border: '1px solid #1e3a5f',
  borderRadius: '8px',
  padding: '18px',
  marginBottom: '16px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
};

const diffBadgeStyle = (isPositive) => ({
  backgroundColor: isPositive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(248, 113, 113, 0.12)',
  border: `1px solid ${isPositive ? '#4ade80' : '#f87171'}`,
  color: isPositive ? '#4ade80' : '#f87171',
  padding: '4px 10px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold'
});

const chronicleBoxStyle = {
  marginTop: '22px',
  paddingTop: '14px',
  borderTop: '1px solid #283149'
};

const primaryButtonStyle = {
  backgroundColor: '#8a0303',
  color: '#fff',
  border: '1px solid #c99738',
  borderRadius: '6px',
  padding: '13px 26px',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 12px rgba(138, 3, 3, 0.4)',
  textShadow: '0 1px 3px rgba(0,0,0,0.8)'
};

const soundBtnStyle = {
  backgroundColor: '#181f2f',
  border: '1px solid #334155',
  color: '#cbd5e1',
  padding: '7px 14px',
  borderRadius: '6px',
  fontSize: '12.5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const heritageBoxStyle = {
  backgroundColor: '#0a0d14',
  border: '1px solid #283149',
  borderRadius: '8px',
  padding: '14px',
  margin: '14px 0'
};

const boonBoxStyle = {
  backgroundColor: 'rgba(201, 151, 56, 0.08)',
  border: '1px solid #c99738',
  borderRadius: '8px',
  padding: '12px'
};

const curseBoxStyle = {
  backgroundColor: 'rgba(248, 113, 113, 0.08)',
  border: '1px solid #f87171',
  borderRadius: '8px',
  padding: '12px'
};

const meterBgStyle = {
  backgroundColor: '#07090e',
  height: '8px',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '4px',
  border: '1px solid #1e293b'
};

const meterFillStyle = {
  height: '100%',
  transition: 'width 0.3s ease'
};

const gearSlotStyle = {
  backgroundColor: '#0f1422',
  border: '1px solid #283149',
  borderRadius: '8px',
  padding: '9px 12px'
};

const potionSmallBtnStyle = (disabled) => ({
  backgroundColor: disabled ? '#1e293b' : '#8a0303',
  color: disabled ? '#64748b' : '#fff',
  border: '1px solid #334155',
  borderRadius: '4px',
  padding: '3px 10px',
  fontSize: '11px',
  fontWeight: 'bold',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

const jobCardStyle = {
  backgroundColor: '#0f1422',
  border: '1px solid #283149',
  borderRadius: '8px',
  padding: '12px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const actionSmallBtnStyle = {
  backgroundColor: '#8a0303',
  color: '#fff',
  border: '1px solid #c99738',
  borderRadius: '4px',
  padding: '7px 14px',
  fontSize: '12.5px',
  fontWeight: 'bold',
  cursor: 'pointer'
};
