// ข้อมูลการดำรงชีวิต อาชีพ และที่พักอาศัย (Dark Fantasy Life Choices)
export const LIFE_STAGES = [
  { minAge: 0, maxAge: 8, name: 'วัยเด็กเร่ร่อน', desc: 'เรียนรู้การเอาตัวรอดขั้นพื้นฐานในโลกกว้าง' },
  { minAge: 9, maxAge: 16, name: 'วัยรุ่นฝึกฝนวิชา', desc: 'เริ่มฝึกฝนร่างกายและมองหาลู่ทางประกอบอาชีพ' },
  { minAge: 17, maxAge: 30, name: 'วัยหนุ่มสาวจับอาวุธ', desc: 'สร้างเนื้อสร้างตัว เข้าร่วมกิลด์ หรือรับภารกิจเสี่ยงภัย' },
  { minAge: 31, maxAge: 48, name: 'วัยกรำศึกมากประสบการณ์', desc: 'มีชื่อเสียงในวงการ บริหารทรัพย์สินและพละกำลัง' },
  { minAge: 49, maxAge: 999, name: 'วัยชราภาพผู้ผ่านโลก', desc: 'ผู้เฒ่าที่ผ่านมรสุมชีวิตมาอย่างโชกโชน' }
];

export const HOUSINGS = [
  {
    id: 'ash_heap',
    name: 'นอนซุกตัวในกองขี้เถ้าและซากกระดูก',
    costPerYear: 0,
    hpBonus: -8,
    sanBonus: -6,
    desc: 'ไม่มีค่าใช้จ่าย ลมหนาวพัดผ่านตลอดคืน ป่วยง่าย'
  },
  {
    id: 'toxic_shack',
    name: 'เพิงไม้ริมบึงน้ำ',
    costPerYear: 15,
    hpBonus: 0,
    sanBonus: 0,
    desc: 'มีหลังคากันฝน บรรยากาศเงียบสงบพอพักผ่อนได้'
  },
  {
    id: 'crypt_cell',
    name: 'ห้องเช่าใต้ดินโบสถ์เก่า',
    costPerYear: 45,
    hpBonus: 6,
    sanBonus: 4,
    desc: 'กำแพงหินมิดชิด ปลอดภัยจากสัตว์ร้ายภายนอก'
  },
  {
    id: 'stone_outpost',
    name: 'ป้อมปราการหินพร้อมกองไฟ (Bonfire Outpost)',
    costPerYear: 140,
    hpBonus: 18,
    sanBonus: 15,
    desc: 'มีกองไฟอบอุ่นช่วยฟื้นฟูเรี่ยวแรงและจิตใจ'
  },
  {
    id: 'gothic_manor',
    name: 'คฤหาสน์หินสไตล์โกธิค',
    costPerYear: 350,
    hpBonus: 28,
    sanBonus: 22,
    desc: 'รั้วรอบขอบชิด สะดวกสบาย มีพื้นที่ฝึกซ้อมส่วนตัว'
  },
  {
    id: 'tarnished_throne',
    name: 'ปราสาทบัลลังก์มัวหมอง (Elden Throne)',
    costPerYear: 900,
    hpBonus: 45,
    sanBonus: 35,
    desc: 'ที่พำนักระดับสูงสุด ปลอดภัยและมีสิ่งอำนวยความสะดวกครบครัน'
  }
];

export const JOBS = [
  {
    id: 'grave_digger',
    name: 'คนขุดหลุมฝังศพในสุสาน',
    minAge: 8,
    salary: 25,
    reqStat: null,
    risk: 'medium',
    desc: 'งานใช้แรงงานในสุสาน ขุดหลุมและเก็บกวาดพื้นที่'
  },
  {
    id: 'ash_bearer',
    name: 'คนขนถ่ายขี้เถ้าและถ่านหิน',
    minAge: 12,
    salary: 50,
    reqStat: { str: 10 },
    risk: 'medium',
    desc: 'ขนถ่านหินส่งโรงหลอมโลหะของช่างตีเหล็ก'
  },
  {
    id: 'mercenary_hawk',
    name: 'ทหารรับจ้างกองพันเหยี่ยว (Band of the Hawk)',
    minAge: 16,
    salary: 110,
    reqStat: { str: 18 },
    risk: 'high',
    desc: 'กองพันทหารรับจ้างชื่อดังที่นำโดยแม่ทัพหนุ่มผมขาว รับภารกิจแนวหน้าเพื่อเงินรางวัล'
  },
  {
    id: 'blood_alchemist',
    name: 'นักปรุงยาสมุนไพรและสารสกัด',
    minAge: 18,
    salary: 180,
    reqStat: { int: 20 },
    risk: 'low',
    desc: 'สกัดตัวยาจากพืชสมุนไพรและแร่ธาตุ ขายให้เหล่านักผจญภัย'
  },
  {
    id: 'beast_hunter',
    name: 'นักล่าสัตว์อสูรแห่งค่ำคืน (Beast Hunter)',
    minAge: 20,
    salary: 350,
    reqStat: { str: 32, int: 20 },
    risk: 'extreme',
    desc: 'รับจ้างปราบสัตว์ร้ายที่ออกอาละวาดแถบชายแดน'
  },
  {
    id: 'fire_keeper',
    name: 'ผู้พิทักษ์กองไฟโบราณ (Fire Keeper Guard)',
    minAge: 25,
    salary: 680,
    reqStat: { str: 45, int: 35 },
    risk: 'medium',
    desc: 'เฝ้าระวังสถานที่ศักดิ์สิทธิ์และคอยต้อนรับผู้แสวงบุญ'
  }
];

export const ACTIVITIES = [
  {
    id: 'rest_bonfire',
    name: '🔥 นั่งพักผ่อนข้างกองไฟ (Rest at Bonfire)',
    cost: 10,
    desc: 'นั่งผิงไฟอบอุ่น ฟื้นฟูบาดแผลและสติ (HP +30, SAN +20, ค่าฟืน 10G)',
    effect: { hp: 30, san: 20, gold: -10 }
  },
  {
    id: 'forage_maggots',
    name: '🌿 คุ้ยหาของป่าและสมุนไพร',
    cost: 0,
    desc: 'หาของกินง่ายๆ ประทังชีวิต (HP +8, SAN -5)',
    effect: { hp: 8, san: -5 }
  },
  {
    id: 'train_greatsword',
    name: '🗡️ ฝึกฝนวิชาดาบและพละกำลัง',
    cost: 0,
    desc: 'ฝึกเหวี่ยงอาวุธเพิ่มความแข็งแกร่ง (STR +3, HP -5 จากความเหนื่อยล้า)',
    effect: { str: 3, hp: -5 }
  },
  {
    id: 'study_forbidden_tome',
    name: '📜 ศึกษาตำราเวทมนตร์และคัมภีร์โบราณ',
    cost: 15,
    desc: 'เพิ่มพูนสติปัญญาและความรู้ (INT +3, SAN +5, ค่าเช่าตำรา 15G)',
    effect: { int: 3, san: 5, gold: -15 }
  },
  {
    id: 'pay_lord_tax',
    name: '🪙 จ่ายภาษีบำรุงเมืองให้กองทหาร',
    cost: 25,
    desc: 'รักษาความสงบเรียบร้อยและได้รับความคุ้มครอง (SAN +10, Gold -25)',
    effect: { san: 10, gold: -25 }
  }
];
