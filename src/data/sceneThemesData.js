import { getAssetUrl } from '../utils/assets';

// แมปปิ้งรูปภาพฉากศิลปะระดับมาสเตอร์เวิร์ก (Master Dark Fantasy Concept Art)
const RAW_SCENE_IMAGE_MAP = {
  // วัยทารก & ความยากแค้น & ฤดูหนาว
  famine: '/scenes/famine.jpg',
  poverty: '/scenes/famine.jpg',
  winter: '/scenes/famine.jpg',
  birth: '/scenes/famine.jpg',
  moldy_bread: '/scenes/famine.jpg',
  snow_cabin: '/scenes/famine.jpg',
  abandoned_church: '/scenes/famine.jpg',

  // วัยเด็ก & การสำรวจตรอกมืด & สลัม
  alley: '/scenes/alley.jpg',
  slum: '/scenes/alley.jpg',
  dark_alley: '/scenes/alley.jpg',
  toddler_crawl: '/scenes/alley.jpg',
  exploration: '/scenes/alley.jpg',
  rat_chase: '/scenes/alley.jpg',
  gutter_gold: '/scenes/alley.jpg',
  thief_gang: '/scenes/alley.jpg',
  shadow_door: '/scenes/alley.jpg',
  street_brawl: '/scenes/alley.jpg',

  // สุสาน & ดันเจี้ยนกระดูก & ทางเดินใต้ดิน
  catacombs: '/portraits/skeleton.jpg',
  crypt: '/portraits/skeleton.jpg',
  graveyard: '/portraits/skeleton.jpg',
  tomb: '/portraits/skeleton.jpg',

  // แท่นบูชาไฟ & กองเถ้า & บัลลังก์โบราณ
  bonfire: '/portraits/ashen_lord.jpg',
  shrine: '/portraits/ashen_lord.jpg',
  altar: '/portraits/ashen_lord.jpg',
  sanctuary: '/portraits/ashen_lord.jpg',
  throne: '/portraits/ashen_lord.jpg',

  // แท่นศิลาปักดาบ & โรงตีเหล็ก & คลังแสง
  armory: '/portraits/sentient_sword.jpg',
  forge: '/portraits/sentient_sword.jpg',
  sword_shrine: '/portraits/sentient_sword.jpg',

  // ตลาดสด & ย่านการค้า & แสงอาทิตย์อัสดง
  market: '/scenes/saitama.jpg',
  bazaar: '/scenes/saitama.jpg',
  street: '/scenes/saitama.jpg',
  saitama: '/scenes/saitama.jpg',
  bargain_sprint: '/scenes/saitama.jpg',

  // โรงเตี๊ยม & สืบสวน & แหล่งชุมนุมคนพเนจร
  tavern: '/scenes/conan.jpg',
  inn: '/scenes/conan.jpg',
  conan: '/scenes/conan.jpg',
  mystery: '/scenes/conan.jpg',
  tavern_murder: '/scenes/conan.jpg',
  detective: '/scenes/conan.jpg',
  inquisition: '/scenes/conan.jpg',

  // ดันเจี้ยนเขาวงกต & กล่องสมบัติมิมิก
  dungeon: '/scenes/mimic.jpg',
  vault: '/scenes/mimic.jpg',
  mimic: '/scenes/mimic.jpg',
  frieren: '/scenes/mimic.jpg',
  dungeon_chest: '/scenes/mimic.jpg',

  // บ่อน้ำแร่ออนเซ็น & ธรรมชาติ & สัตว์อสูร (Capybara Master Scene)
  capybara: '/scenes/capybara.jpg',
  nature_spring: '/scenes/capybara.jpg',
  river: '/scenes/capybara.jpg',
  oasis: '/scenes/capybara.jpg',
  hotspring: '/scenes/capybara.jpg',

  // ร้านอาหารริมทาง & เพิงราเม็ง & เสบียง
  ramen: '/scenes/ramen.jpg',
  food_stall: '/scenes/ramen.jpg',
  feast: '/scenes/ramen.jpg',
  naruto: '/scenes/ramen.jpg',

  // สมรภูมิสงคราม & มหากาพย์ & ซากปรักหักพัง
  radahn: '/scenes/radahn.jpg',
  battlefield: '/scenes/radahn.jpg',
  war: '/scenes/radahn.jpg',
  ruins: '/scenes/radahn.jpg',
  radahn_festival: '/scenes/radahn.jpg',

  // ห้วงอเวจี & สุริยุปราคาโลหิต & พลีชีพ
  berserk: '/scenes/berserk.jpg',
  abyss: '/scenes/berserk.jpg',
  eclipse: '/scenes/berserk.jpg',
  nightmare: '/scenes/berserk.jpg',
  behelit: '/scenes/berserk.jpg',

  // หน้าผาหมอก & กับดัก & มรณะ
  patches: '/scenes/patches.jpg',
  cliff: '/scenes/patches.jpg',
  cliff_kick: '/scenes/patches.jpg',
  trap: '/scenes/patches.jpg',

  // มหาเวททำลายล้าง & หุบเขาระเบิด
  explosion: '/scenes/explosion.jpg',
  blast: '/scenes/explosion.jpg',
  magic: '/scenes/explosion.jpg',
  megumin: '/scenes/explosion.jpg',

  // สายฝน & ทางข้ามมิติ & รถบรรทุก
  truck: '/scenes/truck.jpg',
  storm: '/scenes/truck.jpg',
  crossroad: '/scenes/truck.jpg',
  reincarnation: '/scenes/truck.jpg',

  // ตรอกกิลด์ & สายน้ำชำระล้าง
  aqua: '/scenes/aqua.jpg',
  water_shrine: '/scenes/aqua.jpg',
  goddess_trash: '/scenes/aqua.jpg',

  // ป้ายรถม้าหน้าดันเจี้ยน & ตู้กดน้ำเวทมนตร์
  vending: '/scenes/vending.svg',
  vending_machine: '/scenes/vending.svg',
  machine: '/scenes/vending.svg',

  // ป่าไผ่ & ธรรมชาติซามูไรพเนจร & ดาบซ่อนคม
  forest: '/scenes/forest.svg',
  bamboo: '/scenes/forest.svg',
  sword: '/scenes/forest.svg',
  sentient_sword: '/scenes/forest.svg',

  // มีมระดับตำนาน: อัศวินคลั่ง & ม้าหน้าคน & หน้ากวนระดับพระเจ้า
  meme_berserk_horse: '/memes/meme_berserk_horse.jpg',
  berserk_horse: '/memes/meme_berserk_horse.jpg',
  horse_guts: '/memes/meme_berserk_horse.jpg',
  meme_berserk_portrait: '/memes/meme_berserk_portrait.jpg',
  berserk_portrait: '/memes/meme_berserk_portrait.jpg',
  meme_berserk_full: '/memes/meme_berserk_full.jpg',
  berserk_full: '/memes/meme_berserk_full.jpg',
  meme_face_chill: '/memes/meme_face_chill.jpg',
  face_chill: '/memes/meme_face_chill.jpg'
};

export const SCENE_IMAGE_MAP = Object.fromEntries(
  Object.entries(RAW_SCENE_IMAGE_MAP).map(([k, v]) => [k, getAssetUrl(v)])
);

// สไตล์บรรยากาศฉากและสภาพอากาศ
export const SCENE_THEMES = {
  vending: { tag: 'ป้ายรถม้าหน้าดันเจี้ยนชั้น 1', weather: 'mist', mood: 'ลึกลับ เวทมนตร์ สว่างไสว' },
  forest: { tag: 'ป่าไผ่ซ่อนดาบซามูไรพเนจร', weather: 'mist', mood: 'เงียบสงบ มนต์ขลัง คมกริบ' },
  famine: { tag: 'กระท่อมฟางกลางลมหนาว', weather: 'snow', mood: 'แร้นแค้น หนาวเหน็บ' },
  alley: { tag: 'ตรอกหินโบราณยามราตรี', weather: 'mist', mood: 'มืดมน อันตราย' },
  catacombs: { tag: 'สุสานโบราณและโถงกระดูกใต้พิภพ', weather: 'mist', mood: 'เย็นยะเยือก วังเวง' },
  bonfire: { tag: 'แท่นบูชาแห่งกองเถ้าศักดิ์สิทธิ์', weather: 'embers', mood: 'อบอุ่น มนต์ขลัง ลี้ลับ' },
  armory: { tag: 'แท่นศิลาปักศาสตราวุธโบราณ', weather: 'sparks', mood: 'ศักดิ์สิทธิ์ คมกริบ' },
  market: { tag: 'ย่านการค้าและตลาดสดเมืองหลวง', weather: 'wind', mood: 'คึกคัก วุ่นวาย มีชีวิตชีวา' },
  tavern: { tag: 'โรงเตี๊ยมคนพเนจรและโต๊ะไม้เก่า', weather: 'sparks', mood: 'อบอวลด้วยไอเบียร์และข่าวลือ' },
  dungeon: { tag: 'โถงทางเดินหินในดันเจี้ยนโบราณ', weather: 'mist', mood: 'กับดัก ความลับ สมบัติ' },
  capybara: { tag: 'บ่อน้ำแร่ออนเซ็นธรรมชาติกลางป่าหมอก', weather: 'mist', mood: 'สงบสุข ผ่อนคลาย เซน' },
  nature_spring: { tag: 'บ่อน้ำแร่ออนเซ็นธรรมชาติกลางป่าหมอก', weather: 'mist', mood: 'สงบสุข ผ่อนคลาย เซน' },
  ramen: { tag: 'เพิงอาหารสายฝนข้างทางมิติแยก', weather: 'rain', mood: 'อบอุ่น อิ่มหนำสำราญ' },
  battlefield: { tag: 'สมรภูมิแดงฉานใต้เงาพายุทราย', weather: 'embers', mood: 'ดุเดือด มหากาพย์สงคราม' },
  radahn: { tag: 'สมรภูมิเทศกาลราดานใต้สายฝนดาวตก', weather: 'embers', mood: 'ดุเดือด มหากาพย์สงคราม' },
  berserk: { tag: 'แดนสังเวยสุริยุปราคาโลหิต', weather: 'embers', mood: 'ดาร์กแฟนตาซี สิ้นหวัง' },
  patches: { tag: 'หน้าผาหมอกแห่งแดนมรณะ', weather: 'wind', mood: 'ระทึกขวัญ หวาดเสียว' },
  explosion: { tag: 'หุบเขาเวทมนตร์ระเบิดตูมเดียว', weather: 'embers', mood: 'อลังการ วินาศสันตะโร' },
  truck: { tag: 'ถนนหินสายฟ้าพายุฝนข้ามมิติ', weather: 'rain', mood: 'หายนะ โชคชะตา' },
  aqua: { tag: 'ตรอกหลังกิลด์นักผจญภัย', weather: 'rain', mood: 'ตลกร้าย วุ่นวาย' },
  meme_berserk_horse: { tag: 'อัศวินทมิฬควบม้าหน้าคนยิ้มกวน', weather: 'embers', mood: 'มีมระดับตำนาน ตลกร้าย ทรงพลัง' },
  berserk_horse: { tag: 'อัศวินทมิฬควบม้าหน้าคนยิ้มกวน', weather: 'embers', mood: 'มีมระดับตำนาน ตลกร้าย ทรงพลัง' },
  meme_berserk_portrait: { tag: 'อัศวินเกราะคลั่งหน้ากวนโอ๊ย', weather: 'embers', mood: 'ดุดันแต่แอบอมยิ้ม กวนประสาท' },
  meme_berserk_full: { tag: 'อัศวินดาบยักษ์ฟาดฟันจักรวาล', weather: 'embers', mood: 'มหากาพย์เกราะดำ แบกดาบควาย' },
  meme_face_chill: { tag: 'ชายหนุ่มหน้าชิลหลับตาพริ้ม', weather: 'sparks', mood: 'ยิ้มสู้ชีวิต ไม่แคร์โลก สบายใจ' }
};
