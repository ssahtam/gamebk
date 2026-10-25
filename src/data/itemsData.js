// คลังอุปกรณ์สวมใส่สุดมีม: บางชิ้นมีดีบัฟ บางชิ้นเหมือนจะเทพแต่ห่วย
export const MEME_EQUIPMENT = [
  // --- อาวุธ (Weapons) ---
  {
    id: 'rusty_iron_pipe',
    name: 'ท่อนเหล็กขึ้นสนิมข้างทาง',
    type: 'weapon',
    rarity: 'Common',
    atk: 5,
    durability: 5,
    maxDurability: 5,
    desc: 'ท่อนเหล็กธรรมดาที่มีคราบสนิมเขรอะ ฟาดแล้วศัตรูอาจเป็นบาดทะยัก',
    curse: null,
    price: 15
  },
  {
    id: 'dragonslayer_slab',
    name: 'ท่อนเหล็กยักษ์ผ่ามังกร (Berserk)',
    type: 'weapon',
    rarity: 'SSR',
    atk: 88,
    durability: 8,
    maxDurability: 8,
    desc: 'ใหญ่เกินกว่าจะเรียกว่าดาบ มันคือแผ่นเหล็กหนาเตอะ',
    curse: 'เหมือนจะเทพแต่ห่วย: พลังโจมตีมหาศาล แต่หนักมาก ทุกครั้งที่โจมตี ผู้ใส่ปวดหลังเสีย 8 HP!',
    debuff: { hpPerTurn: -8, speedPenalty: true },
    price: 350
  },
  {
    id: 'excalibur_annoying',
    name: 'ดาบศักดิ์สิทธิ์เอ็กซ์คาลิเบอร์ขี้บ่น',
    type: 'weapon',
    rarity: 'Rare',
    atk: 35,
    durability: 6,
    maxDurability: 6,
    desc: 'ดาบมีใบหน้าและร้องเพลงโอเปร่าไม่หยุดตั้งแต่เช้าจรดค่ำ',
    curse: 'น่ารำคาญจัด: ลดค่าสติ SAN -5 ทุกปีที่สวมใส่ เพราะมันไม่ยอมหยุดร้องเพลง!',
    debuff: { sanPerYear: -5 },
    price: 180
  },
  {
    id: 'rubber_chicken',
    name: 'ไก่โอ๊กบีบมีเสียงระดับตำนาน',
    type: 'weapon',
    rarity: 'Common',
    atk: 2,
    durability: 10,
    maxDurability: 10,
    desc: 'ของเล่นยางสีเหลือง บีบแล้วมีเสียง "แว้กกก!"',
    curse: 'เหมือนจะห่วยแต่ฮา: ตีเบามาก แต่มีโอกาส 30% ทำให้ศัตรูหัวเราะจนลืมโจมตี',
    debuff: null,
    price: 10
  },
  {
    id: 'fake_death_note',
    name: 'สมุดเดธโน้ตสั่งพิมพ์จากช้อปปี้',
    type: 'weapon',
    rarity: 'Rare',
    atk: 15,
    durability: 4,
    maxDurability: 4,
    desc: 'หน้าปกสีดำ เขียนชื่อศัตรูลงไปแล้วหมึกจะซึมเปื้อนมือ',
    curse: 'ของก็อปเกรดเอ: คนที่ถูกเขียนชื่อจะไม่ตาย แต่จะจามใส่หน้าเรา 1 ที (ลด SAN -3)',
    debuff: { sanPerTurn: -3 },
    price: 120
  },

  // --- ชุดเกราะ (Armors) ---
  {
    id: 'cardboard_armor',
    name: 'เกราะกล่องกระดาษส่งพัสดุ',
    type: 'armor',
    rarity: 'Common',
    def: 3,
    maxHpBonus: 10,
    durability: 3,
    maxDurability: 3,
    desc: 'กล่องกระดาษลูกฟูกตัดแปะ กันลมได้นิดหน่อย',
    curse: 'แพ้น้ำ: ถ้าโดนฝนหรือมอนสเตอร์น้ำ เกราะจะเปื่อยยุ่ยและพังทันที!',
    debuff: null,
    price: 20
  },
  {
    id: 'invisibility_cloak_fail',
    name: 'ผ้าคลุมล่องหน (แต่คนไม่ล่องหนตาม)',
    type: 'armor',
    rarity: 'Rare',
    def: 12,
    maxHpBonus: 25,
    durability: 6,
    maxDurability: 6,
    desc: 'ผ้าคลุมเวทมนตร์ที่ตัวผ้าล่องหนได้ 100%',
    curse: 'ดีบัฟประจาน: ตัวผ้าล่องหน แต่ตัวเราไม่ล่องหน คนมองเห็นเหมือนเราแก้ผ้าเดิน (SAN -10 ทุกปี)',
    debuff: { sanPerYear: -10 },
    price: 200
  },
  {
    id: 'stone_mask_armor',
    name: 'เกราะติดหน้ากากศิลา (JoJo)',
    type: 'armor',
    rarity: 'SSR',
    def: 45,
    maxHpBonus: 100,
    durability: 8,
    maxDurability: 8,
    desc: 'เกราะโบราณที่สกัดจากหินลึกลับ เพิ่มพลังชีวิตมหาศาล',
    curse: 'แวมไพร์ตกอับ: พลังชีวิตสูงมาก แต่ถ้าเดินตากแดดเลือดจะลดปีละ 15 HP!',
    debuff: { hpPerYear: -15 },
    price: 450
  },

  // --- เครื่องประดับ (Accessories) ---
  {
    id: 'red_bow_tie',
    name: 'หูกระต่ายสีแดงปรับเสียง (โคนัน)',
    type: 'accessory',
    rarity: 'Rare',
    intBonus: 20,
    durability: 7,
    maxDurability: 7,
    desc: 'หูกระต่ายที่มีปุ่มหมุนปรับความถี่เสียงได้เหมือนผู้ใหญ่',
    curse: 'คำสาปเด็กแว่น: ฉลาดขึ้นมาก (INT +20) แต่ดึงดูดคดีฆาตกรรมเข้ามาในชีวิตบ่อยขึ้น 2 เท่า!',
    debuff: { murderMagnet: true },
    price: 150
  },
  {
    id: 'naruto_headband',
    name: 'ผ้าคาดหน้าผากนินจาวิ่งกางแขน',
    type: 'accessory',
    rarity: 'Common',
    lukBonus: 10,
    durability: 5,
    maxDurability: 5,
    desc: 'ผ้าคาดเหล็กสัญลักษณ์ก้นหอย ใส่แล้ววิ่งท่ากางแขนไปข้างหลังเร็วขึ้น 50%',
    curse: 'สะดุดรากไม้: ทุกครั้งที่วิ่งหนี มีโอกาส 25% ที่จะสะดุดขาตัวเองหัวทิ่มเสีย 15 HP',
    debuff: { tripChance: 0.25 },
    price: 40
  },
  {
    id: 'salt_amulet',
    name: 'สร้อยคอถุงเกลือกาชาบริสุทธิ์',
    type: 'accessory',
    rarity: 'Uncommon',
    lukBonus: -5,
    durability: 9,
    maxDurability: 9,
    desc: 'ถุงผ้าใส่เกลือแกงจากการกดกาชา 300 โรลไม่เคยออกเรต',
    curse: 'ความเค็มระดับจักรวาล: ดวงตก (LUK -5) แต่ทำให้จิตใจด้านชา ไม่เสียสติง่ายๆ (SAN +20)',
    debuff: { sanBonus: 20 },
    price: 60
  }
];

export const POTIONS = [
  { id: 'hp_potion', name: '🧪 ยาแดงฟื้นฟูเลือด (HP +40)', cost: 25, healHp: 40, healSan: 0 },
  { id: 'san_potion', name: '🍵 ยาเขียวบ๊วยเค็มเรียกสติ (SAN +30)', cost: 20, healHp: 0, healSan: 30 },
  { id: 'full_elixir', name: '✨ น้ำยาเทพธิดาฟื้นฟูเต็มหลอด (HP & SAN +100)', cost: 90, healHp: 100, healSan: 100 }
];
