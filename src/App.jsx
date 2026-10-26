import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { RACES } from './data/birthData.js';
import { REALMS, SOCIAL_CLASSES } from './data/darkWorldDemographics.js';
import { generateBestowedName } from './data/namesData.js';
import { FUNERAL_CHOICES } from './data/familyAndGenerations.js';
import { BLESSINGS_GACHA, INNATE_CURSES } from './data/blessingsData.js';
import { MEME_EQUIPMENT } from './data/itemsData.js';
import BirthCertificateView from './components/BirthCertificateView.jsx';
import LifeDashboardView from './components/LifeDashboardView.jsx';
import TitleScreenView from './components/TitleScreenView.jsx';
import MemePixelBackground from './components/MemePixelBackground.jsx';
import { playSound } from './utils/sound.js';

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
  const [generation, setGeneration] = useState(1);
  const [previousRaceIds, setPreviousRaceIds] = useState([]);

  // Character Profile & Demographics
  const [characterName, setCharacterName] = useState('กัตซ์ แห่งกองเถ้า');
  const [bestowedGiver, setBestowedGiver] = useState('แม่ผู้สิ้นใจกอดเจ้าแนบอกและกระซิบตั้งชื่อให้เจ้าว่า');
  const [character, setCharacter] = useState(null);
  const [gender, setGender] = useState('ชาย');
  const [realm, setRealm] = useState(REALMS[0]);
  const [socialClass, setSocialClass] = useState(SOCIAL_CLASSES[1]);
  const [familyFund, setFamilyFund] = useState(20);

  // Starting Economy, Boon, Curse & Equipment
  const [gold, setGold] = useState(25);
  const [debt, setDebt] = useState(0);
  const [boon, setBoon] = useState(null);
  const [innateCurse, setInnateCurse] = useState(null);
  const [weapon, setWeapon] = useState(MEME_EQUIPMENT[0]);
  const [armor, setArmor] = useState(MEME_EQUIPMENT[5]);
  const [potionsCount, setPotionsCount] = useState({ hp_potion: 1, san_potion: 1 });

  // End-of-Life & Inheritance Info
  const [children, setChildren] = useState([]);
  const [deathInfo, setDeathInfo] = useState(null);

  // Audio & Visual Preferences
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [crtFilter, setCrtFilter] = useState(false);

  const triggerSound = (type) => {
    if (soundEnabled) playSound(type);
  };

  // 1. Roll Birth (Demographics, Race, Boon, Curse, Inheritance)
  const handleRollBirth = (inheritedData = null) => {
    triggerSound('reincarnate');

    const pickedRealm = REALMS[Math.floor(Math.random() * REALMS.length)];
    const classRand = Math.random() * 100;
    let pickedClass;
    if (classRand < 35) pickedClass = SOCIAL_CLASSES[0];
    else if (classRand < 70) pickedClass = SOCIAL_CLASSES[1];
    else if (classRand < 90) pickedClass = SOCIAL_CLASSES[2];
    else if (classRand < 98) pickedClass = SOCIAL_CLASSES[3];
    else pickedClass = SOCIAL_CLASSES[4];

    let availableRaces = RACES.filter(r => !previousRaceIds.includes(r.id));
    if (availableRaces.length === 0) {
      availableRaces = RACES.filter(r => r.id !== character?.race?.id);
      if (availableRaces.length === 0) availableRaces = RACES;
      setPreviousRaceIds(character?.race ? [character.race.id] : []);
    }

    const getRaceWeight = (race) => {
      if (race.rarity.includes('SECRET')) return 0.8;
      if (race.rarity.includes('SSR')) return 2.0;
      if (race.rarity.includes('Rare')) return 4.0;
      if (race.rarity.includes('Uncommon')) return 7.0;
      return 12.0;
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

    setPreviousRaceIds(prev => [...prev, selectedRace.id]);

    if (selectedRace.rarity.includes('SSR') || selectedRace.rarity.includes('SECRET')) {
      try {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
      } catch (e) {
        // ignore confetti error in headless environments
      }
    }

    const genderPool = selectedRace.genderPool || ['ชาย', 'หญิง'];
    const pickedGender = genderPool[Math.floor(Math.random() * genderPool.length)];
    const { fullName: rolledName, giverText } = generateBestowedName(selectedRace, pickedGender);

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

    const rolledCurse = INNATE_CURSES[Math.floor(Math.random() * INNATE_CURSES.length)];

    const classGoldBonus =
      pickedClass.id === 'noble_lord' ? 100 :
      pickedClass.id === 'wealthy_knight' ? 40 :
      pickedClass.id === 'middle_craftsman' ? 15 : 0;

    let startingGold = (selectedRace.baseGold || 15) + classGoldBonus + (rolledBoon?.effect?.gold || 0) + (inheritedData?.gold || 0);
    let initialFamilyFund = pickedClass.familyFund !== undefined ? pickedClass.familyFund : 20;
    let startingDebt = (pickedClass.debt || 0) + (rolledCurse?.id === 'curse_soul_debt' ? 40 : 0);

    setCharacter({ race: selectedRace, bodyType: selectedRace.bodyType });
    setCharacterName(rolledName);
    setBestowedGiver(giverText);
    setGender(pickedGender);
    setRealm(pickedRealm);
    setSocialClass(pickedClass);
    setFamilyFund(initialFamilyFund);
    setGold(startingGold);
    setDebt(startingDebt);
    setBoon(rolledBoon);
    setInnateCurse(rolledCurse);
    setWeapon(inheritedData?.weapon || MEME_EQUIPMENT[0]);
    setArmor(inheritedData?.armor || MEME_EQUIPMENT[5]);
    setPotionsCount({ hp_potion: 1, san_potion: 1 });
    setChildren([]);
    setDeathInfo(null);

    if (!inheritedData) {
      setGeneration(1);
    }

    setGameState('BIRTH');
  };

  const handleStartLife = () => {
    triggerSound('click');
    setGameState('PLAYING');
  };

  // Death handling from LifeDashboardView (receives full family & inventory state)
  const handleDashboardDeath = (deathData) => {
    triggerSound('death');
    if (deathData?.netWorth !== undefined) setGold(deathData.netWorth);
    if (deathData?.children) setChildren(deathData.children);
    if (deathData?.weapon) setWeapon(deathData.weapon);
    if (deathData?.armor) setArmor(deathData.armor);

    setDeathInfo({
      age: deathData.age,
      cause: deathData.cause,
      name: characterName,
      race: character?.race?.name || '',
      gender,
      spouse: deathData.spouse || null,
      childrenCount: deathData.children?.length || 0,
      heritage: `"${characterName}" เผ่า ${character?.race?.name || ''} (เพศ: ${gender}) แห่ง ${realm.name}`
    });
    setGameState('FUNERAL');
  };

  const handleSelectFuneral = (funeral) => {
    triggerSound('gold');
    setGold(prev => Math.max(0, prev - (funeral.cost || 0)));
    setDeathInfo(prev => ({
      ...prev,
      funeral
    }));
    setGameState('DEAD');
  };

  const handleReincarnateAsChild = () => {
    const inheritedGold = Math.floor(gold * 0.7);
    setGeneration(prev => prev + 1);
    handleRollBirth({
      gold: inheritedGold,
      weapon,
      armor
    });
  };

  return (
    <div style={containerStyle} className={crtFilter ? 'crt-filter' : ''}>
      <MemePixelBackground gameState={gameState} age={deathInfo?.age || 0} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

        {/* Screen 1: Title Screen */}
        {gameState === 'TITLE' && (
          <TitleScreenView
            onRollBirth={() => handleRollBirth()}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            crtFilter={crtFilter}
            onToggleCrt={() => setCrtFilter(!crtFilter)}
          />
        )}

        {/* Screen 2: Birth Certificate View */}
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
            boon={boon}
            innateCurse={innateCurse}
            weapon={weapon}
            armor={armor}
            generation={generation}
            onStartLife={handleStartLife}
            onNameChange={(newName) => setCharacterName(newName)}
            onRerollName={() => {
              const { fullName, giverText } = generateBestowedName(character.race, gender);
              setCharacterName(fullName);
              setBestowedGiver(giverText);
            }}
          />
        )}

        {/* Screen 3: Life Simulation Dashboard */}
        {gameState === 'PLAYING' && character && (
          <LifeDashboardView
            character={character}
            characterName={characterName}
            gender={gender}
            realm={realm}
            socialClass={socialClass}
            gold={gold}
            debt={debt}
            boon={boon}
            innateCurse={innateCurse}
            weapon={weapon}
            armor={armor}
            potionsCount={potionsCount}
            generation={generation}
            soundEnabled={soundEnabled}
            onDie={handleDashboardDeath}
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
                          ค่าใช้จ่าย: {f.cost}G (แต้มบุญ +{f.karmaBonus})
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

              <div style={{ ...heritageBoxStyle, maxWidth: '600px', margin: '0 auto 20px', textAlign: 'left' }}>
                <h4 className="gothic-title" style={{ color: '#c99738', marginBottom: '10px' }}>
                  มรดกตกทอดสู่ทายาทรุ่นต่อไป:
                </h4>
                <div style={{ fontSize: '13.5px', color: '#f1f5f9', lineHeight: '1.8' }}>
                  <div>• ผู้ล่วงลับ: <strong style={{ color: '#ffd166' }}>{characterName}</strong> (เผ่า {character.race.name}, เพศ {gender})</div>
                  <div>• อายุขัยรวม: {deathInfo.age} ปี</div>
                  <div>• พิธีศพ: {deathInfo.funeral?.name}</div>
                  <div>• คู่ครอง & ทายาท: {deathInfo.spouse ? `${deathInfo.spouse.name} (ทายาท ${children.length} คน)` : 'ไม่มีทายาทสืบสกุล'}</div>
                  <div>• ทองคำที่เหลือ: {gold}G {children.length > 0 ? `(ส่งต่อให้ทายาท 70% = ${Math.floor(gold * 0.7)}G)` : '(ไม่มีทายาท ทองสูญหาย)'}</div>
                  <div>• อาวุธตกทอด: {weapon ? weapon.name : 'ไม่มี'}</div>
                  <div>• เกราะตกทอด: {armor ? armor.name : 'ไม่มี'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
                {children.length > 0 ? (
                  <button
                    onClick={handleReincarnateAsChild}
                    style={{ ...primaryButtonStyle, backgroundColor: '#c99738', color: '#000', border: '1px solid #fde047' }}
                  >
                    👶 เล่นต่อเป็นรุ่นลูก (Generation {generation + 1}) สืบทอดมรดก {Math.floor(gold * 0.7)}G!
                  </button>
                ) : (
                  <div style={{ fontSize: '12.5px', color: '#f87171', marginBottom: '6px' }}>
                    ⚠️ ชีวิตนี้ยังไม่มีทายาทสืบสายเลือด (สามารถกดแต่งงานและมีบุตรได้เมื่ออายุ 18+ ปีในรอบหน้า)
                  </div>
                )}

                <button onClick={() => handleRollBirth()} style={primaryButtonStyle}>
                  🔥 สุ่มเกิดใหม่เป็นรุ่นที่ 1 (เริ่มวัฏจักรชีวิตใหม่)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
  maxWidth: '1260px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '14px',
  borderBottom: '1px solid #283149',
  marginBottom: '18px',
  flexWrap: 'wrap',
  gap: '10px'
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

const soundBtnStyle = {
  backgroundColor: '#181f2f',
  border: '1px solid #334155',
  color: '#cbd5e1',
  padding: '7px 14px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '12.5px',
  fontWeight: 'bold'
};

const primaryButtonStyle = {
  backgroundColor: '#8a0303',
  border: '1.5px solid #c99738',
  color: '#ffffff',
  padding: '13px 22px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(138, 3, 3, 0.5)'
};

const actionSmallBtnStyle = {
  backgroundColor: '#25314d',
  border: '1px solid #3e4e73',
  color: '#ffd166',
  padding: '6px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '12px',
  fontWeight: 'bold'
};

const jobCardStyle = {
  backgroundColor: '#151b2b',
  border: '1px solid #283149',
  borderRadius: '8px',
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '10px'
};

const heritageBoxStyle = {
  backgroundColor: '#1a1625',
  border: '1.5px solid #c99738',
  borderRadius: '10px',
  padding: '14px 18px',
  color: '#fef08a',
  fontSize: '13.5px'
};
