// ระบบสุ่มพรต่างโลก (Blessings Gacha) และ คำสาปกำเนิด (Innate Curses)
// กำหนดเรต: SSR 5%, SR 15%, Common 50%, ไม่มีพร 30%

export const BLESSINGS_GACHA = [
  // --- SSR (5% - พรโกงระดับตำนานแต่มีข้อแลกเปลี่ยน) ---
  {
    id: 'return_by_death',
    name: 'หวนคืนจากความตาย (Return by Death - Re:Zero)',
    rarity: 'SSR',
    rate: 2,
    badgeColor: '#e0a800',
    icon: '⏳',
    desc: 'เมื่อพลังชีวิตเหลือ 0 จะฟื้นคืนชีพทันที 1 ครั้งต่อชีวิต (HP ฟื้น 100%)',
    effectDesc: 'ฟื้นชีพฟรี 1 ครั้ง แต่กลิ่นอายแม่มดจะทำให้มอนสเตอร์ดุร้ายขึ้น 20%',
    effect: { reviveOnce: true, aggro: true }
  },
  {
    id: 'berserker_armor_soul',
    name: 'จิตวิญญาณเกราะคลั่งแห่งความมืด (Berserk Armor Soul)',
    rarity: 'SSR',
    rate: 1.5,
    badgeColor: '#e0a800',
    icon: '🐺',
    desc: 'พลังโจมตีพื้นฐานสูงขึ้นมหาศาล (STR +20, ATK +30)',
    effectDesc: 'กระดูกหักแต่ไม่รู้สึกเจ็บปวด (Max HP +50 แต่เสีย SAN -15)',
    effect: { str: 20, maxHp: 50, san: -15 }
  },
  {
    id: 'ainz_treasury',
    name: 'มรดกตกทอดจากมหาสุสานนาซาริก (Overlord Ring)',
    rarity: 'SSR',
    rate: 1.5,
    badgeColor: '#e0a800',
    icon: '💍',
    desc: 'เกิดมาพร้อมแหวนเวทมนตร์โบราณ พกทองติดตัว +250G และ INT +15',
    effectDesc: 'เงินทองไม่ขาดมือ แต่มีสายตาของขุนนางจ้องจะยึดแหวน',
    effect: { gold: 250, int: 15 }
  },

  // --- SR (15% - พรระดับดี ช่วยให้เอาชีวิตรอดได้) ---
  {
    id: 'frenzy_flame_spark',
    name: 'ประกายไฟแห่งลัทธิคลั่ง (Frenzy Flame - Elden Ring)',
    rarity: 'SR',
    rate: 5,
    badgeColor: '#a370f7',
    icon: '🔥',
    desc: 'เปลวไฟสีเหลืองในดวงตา เพิ่มพลังโจมตีเวท (INT +10, STR +8)',
    effectDesc: 'เผาผลาญศัตรูรุนแรง แต่ทำให้ค่าสติเริ่มต้นลดลง (SAN -10)',
    effect: { int: 10, str: 8, san: -10 }
  },
  {
    id: 'hunter_visceral',
    name: 'สัญชาตญาณควักไส้นักล่า (Bloodborne Visceral)',
    rarity: 'SR',
    rate: 5,
    badgeColor: '#a370f7',
    icon: '🩸',
    desc: 'โจมตีติดคริติคอลบ่อยขึ้น และเมื่อสังหารศัตรูจะดูดเลือดฟื้นฟู 15 HP',
    effectDesc: 'เอาตัวรอดในดันเจี้ยนเก่งมาก (LUK +8, STR +6)',
    effect: { luk: 8, str: 6 }
  },
  {
    id: 'mushoku_mana',
    name: 'เส้นสายมานามหาศาลแต่กำเนิด (Laplace Factor)',
    rarity: 'SR',
    rate: 5,
    badgeColor: '#a370f7',
    icon: '🌀',
    desc: 'เรียนรู้เวทมนตร์ได้ไวกว่าคนทั่วไป (INT +18, เรียนหนังสือฟรี)',
    effectDesc: 'ฉลาดหลักแหลม แต่ร่างกายบอบบาง (HP -15)',
    effect: { int: 18, hp: -15 }
  },

  // --- Common (50% - พรขยะ / พรไร้ประโยชน์แบบ KonoSuba) ---
  {
    id: 'aqua_party_trick',
    name: 'ปาร์ตี้ทริกเสกน้ำพุ่ง (Aqua Party Trick - KonoSuba)',
    rarity: 'Common',
    rate: 15,
    badgeColor: '#6c757d',
    icon: '🌊',
    desc: 'สามารถเสกน้ำพุ่งออกจากพัดได้เพื่อความบันเทิงในวงเหล้า',
    effectDesc: 'ไม่มีประโยชน์ในการต่อสู้ แต่เพิ่มเสน่ห์ในโรงเตี๊ยม (SAN +5, Gold +5)',
    effect: { san: 5, gold: 5 }
  },
  {
    id: 'pouch_of_moldy_bread',
    name: 'กระเป๋าเก็บขนมปังขึ้นราไม่อั้น',
    rarity: 'Common',
    rate: 15,
    badgeColor: '#6c757d',
    icon: '🍞',
    desc: 'ทุกปีจะมีขนมปังขึ้นราโผล่มาในกระเป๋า 1 ก้อน พอกินกันตาย',
    effectDesc: 'ช่วยลดโอกาสอดอยากตาย (HP +5 แต่กินแล้วท้องอืด)',
    effect: { hp: 5 }
  },
  {
    id: 'fast_naked_run',
    name: 'วิชาถอดผ้าวิ่งสับตีนแตก',
    rarity: 'Common',
    rate: 20,
    badgeColor: '#6c757d',
    icon: '🏃',
    desc: 'ถ้าไม่ใส่เสื้อเกราะจะวิ่งหนีศัตรูเร็วขึ้น 30%',
    effectDesc: 'หนีเก่งแต่โดนคนมองเป็นตัวประหลาด (LUK +4, SAN -5)',
    effect: { luk: 4, san: -5 }
  },

  // --- ไม่มีพร (30% - มนุษย์ธรรมดาไร้พลัง) ---
  {
    id: 'none_mortal',
    name: 'ไม่มีพรใดๆ ทั้งสิ้น (Ordinary Soul)',
    rarity: 'NONE',
    rate: 30,
    badgeColor: '#495057',
    icon: '🌫️',
    desc: 'เทพธิดาละเลยไม่มอบพรใดๆ ให้คุณ คุณคือสิ่งมีชีวิตธรรมดาที่ต้องดิ้นรนด้วยตัวเอง 100%',
    effectDesc: 'ไม่มีโบนัสใดๆ เริ่มต้นจากศูนย์อย่างแท้จริง',
    effect: {}
  }
];

// คำสาปกำเนิด (Innate Curses) ที่ติดตัวมาแต่กำเนิด
export const INNATE_CURSES = [
  {
    id: 'curse_beast_scent',
    name: 'กลิ่นอายแม่มดต้องสาป (Witch Miasma)',
    icon: '🟣',
    desc: 'ร่างกายส่งกลิ่นมรณะดึงดูดมอนสเตอร์เลเวลสูงเข้ามาหาบ่อยขึ้น 50%'
  },
  {
    id: 'curse_soul_debt',
    name: 'หนี้สินวิญญาณแห่งราชอาณาจักร',
    icon: '💸',
    desc: 'บรรพบุรุษกู้เงินสร้างปราสาทไว้ คุณเริ่มต้นชีวิตด้วยหนี้ติดลบ -40G!'
  },
  {
    id: 'curse_brittle_bones',
    name: 'กระดูกเปราะบางร้าวราน',
    icon: '🦴',
    desc: 'ทุกครั้งที่ได้รับความเสียหายจากการต่อสู้ จะเจ็บปวดขึ้นเป็น 1.25 เท่า'
  },
  {
    id: 'curse_eclipse_nightmare',
    name: 'ฝันร้ายแห่งสุริยุปราคา',
    icon: '🌑',
    desc: 'ทุกๆ 3 ปี จะฝันเห็นปีศาจฉีกเนื้อตัวเอง ทำให้ค่าสติลดลง SAN -10'
  },
  {
    id: 'curse_troll_magnet',
    name: 'ดวงดึงดูดคนเหลี่ยมจัด',
    icon: '🤡',
    desc: 'มีโอกาสเจอเหตุการณ์ดักควายและถูกหลอกลวงบ่อยขึ้นเป็นพิเศษ'
  }
];
