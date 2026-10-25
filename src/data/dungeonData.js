// ข้อมูลดันเจี้ยนและศัตรูในแดนรกร้าง (No Spoilers, Pure Dark Fantasy Exploration)
export const DUNGEONS = [
  {
    id: 'dungeon_blighttown',
    name: '☠️ บึงพิษและท่อระบายน้ำร้าง (Blighttown Swamps) - Tier 1',
    minAge: 10,
    recAtk: 12,
    roomsCount: 3,
    goldReward: 60,
    expReward: 45,
    desc: 'พื้นที่ชุ่มน้ำรกชัฏ กลิ่นโคลนและพืชเน่าฟุ้งกระจาย มีสิ่งมีชีวิตดักซุ่มอยู่ในพุ่มไม้',
    boss: {
      name: '🕶️ เงาปริศนานักล่ายามวิกาล (Shadow Hunter)',
      avatar: '🕵️‍♂️',
      hp: 130,
      maxHp: 130,
      atk: 15,
      def: 6,
      skillName: 'เข็มสกัดจุดและระเบิดควัน',
      skillDesc: 'ซัดเข็มสกัดจุดทำให้คุณติดสตันขยับไม่ได้ 1 เทิร์น!',
      loot: 'red_bow_tie'
    },
    monsters: [
      { name: 'ยุงยักษ์ดูดเลือดบึงพิษ', avatar: '🦟', hp: 35, atk: 9, def: 2 },
      { name: 'สุนัขจรจัดดุร้ายแห่งป่าหมอก', avatar: '🐕', hp: 50, atk: 12, def: 4 }
    ]
  },
  {
    id: 'dungeon_eclipse',
    name: '🏰 ปราสาทโบราณใต้ท้องฟ้าสีชาด (Crimson Keep) - Tier 2',
    minAge: 20,
    recAtk: 28,
    roomsCount: 4,
    goldReward: 190,
    expReward: 140,
    desc: 'ปราสาทหินสูงตระหง่าน แว่วเสียงแตรศึกโบราณ บรรยากาศกดดันจนสัมผัสได้ถึงไอสังหาร',
    boss: {
      name: '🦅 ร่างอวตารแห่งเหยี่ยวทมิฬ (Dark Falcon)',
      avatar: '🦹‍♂️',
      hp: 310,
      maxHp: 310,
      atk: 30,
      def: 13,
      skillName: 'คมดาบสายลมมืดผ่ามิติ',
      skillDesc: 'ตวัดดาบอย่างรวดเร็ว สร้างความเสียหาย 30 ดาเมจ และลดค่าสติ SAN 15!',
      loot: 'dragonslayer_slab'
    },
    monsters: [
      { name: 'อัศวินเกราะเหล็กผู้พิทักษ์ประตู', avatar: '🤺', hp: 105, atk: 20, def: 10 },
      { name: 'สัตว์ปีกปีศาจเฝ้าหอคอย', avatar: '👹', hp: 90, atk: 24, def: 6 }
    ]
  },
  {
    id: 'dungeon_blood_moon',
    name: '🌙 นครหลวงใต้แสงจันทร์โบราณ (Ancient Metropolis) - Tier 3',
    minAge: 32,
    recAtk: 55,
    roomsCount: 5,
    goldReward: 520,
    expReward: 350,
    desc: 'เมืองหลวงเก่าแก่ที่ถูกทิ้งร้าง เสียงระฆังหอนาฬิกาดังก้องกังวานในความมืดมิด',
    boss: {
      name: '🚚💨 มหาจักรกลทมิฬผู้กวาดล้าง (Abyssal Engine)',
      avatar: '🚚',
      hp: 620,
      maxHp: 620,
      atk: 50,
      def: 22,
      skillName: 'แรงกระแทกความเร็วสูงทะลุบาเรีย',
      skillDesc: 'เร่งความเร็วพุ่งเข้าชนอย่างรุนแรง บดขยี้เกราะป้องกัน!',
      loot: 'stone_mask_armor'
    },
    monsters: [
      { name: 'กล่องสมบัติมิมิคมีฟันแหลม', avatar: '📦', hp: 170, atk: 33, def: 15 },
      { name: 'ยักษ์หินศิลาผู้พิทักษ์บัลลังก์', avatar: '🧟', hp: 210, atk: 36, def: 12 }
    ]
  }
];
