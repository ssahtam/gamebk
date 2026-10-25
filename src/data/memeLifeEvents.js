// ==========================================
// คลังเหตุการณ์มีมและดาร์กแฟนตาซีกว่า 400+ เหตุการณ์แบบแบ่งตามช่วงอายุและสายพันธุ์
// ระบบป้องกันการเกิดซ้ำ (Non-Repetitive System) พร้อมค่าสถานะ (Buffs & Debuffs)
// ==========================================

// 1. รถบรรทุกอิเซไก & หุ่นยนต์ดูดฝุ่น (Truck-kun & Roomba Events)
export const TRUCK_MEME_EVENTS = [
  { id: 'truck_01', text: '🚚 แล่นข้ามสี่แยกไฟแดง ส่งพนักงานเงินเดือนหลุดมิติไปเกิดเป็นผู้กล้าต่างโลก 1 อัตรา ได้รับค่าธรรมเนียมข้ามมิติ', sceneId: 'truck', statDelta: { gold: 25, san: 5 } },
  { id: 'truck_02', text: '💨 ฝึกวิชาดริฟต์โค้งลงเขาอากินะ ยางไหม้ส่งกลิ่นหอมกรุ่น ทะลวงมิติมืดได้อย่างเร้าใจ', sceneId: 'truck', statDelta: { str: 4, san: 8, hp: -4 } },
  { id: 'truck_03', text: '🔧 ช่างคนแคระเปลี่ยนถ่ายน้ำมันเครื่องสูตรสกัดจากพิษไวเวิร์น พละกำลังพุ่งทะยาน 300 แรงม้า', sceneId: 'truck', statDelta: { hp: 15, str: 6, gold: -12 } },
  { id: 'truck_04', text: '⚠️ หม้อน้ำเดือดพล่านเพราะขับชนมังกรบินขวางทาง ชนจนมังกรกระเด็นแต่กันชนหน้าบุบเล็กน้อย', sceneId: 'truck', statDelta: { hp: -10, gold: -8, str: 5 } },
  { id: 'truck_05', text: '⚡ เปิดไฟสูงไล่ขบวนทัพอสูรกลางป่า มอนสเตอร์ตกใจกระเจิงคิดว่าเป็นเทพอัสนีบาตจุติ', sceneId: 'truck', statDelta: { san: 10, rel: 6 } },
  { id: 'truck_06', text: '⛽ เข้าสถานีเติมน้ำมันเวทมนตร์ ปั๊มปิโตรเลียมโบราณ จ่ายค่าน้ำมันไป 15G วิ่งฉิวตลอดปี', sceneId: 'truck', statDelta: { hp: 12, gold: -15 } },
  { id: 'truck_07', text: '📦 รับบรรทุกเสบียงกระป๋องและดาบศักดิ์สิทธิ์ส่งถึงหน้าประตูพระราชวังหลวง ได้รับเหรียญทองตอบแทน', sceneId: 'truck', statDelta: { gold: 35, rel: 8 } },
  { id: 'truck_08', text: '🌌 พุ่งทะลวงหมอกมืดด้วยความเร็ว 140 กม./ชม. ปล่อยควันท่อไอเสียเวทเป็นประกายวิบวับ', sceneId: 'truck', statDelta: { san: 6, hp: -3 } },
  { id: 'truck_09', text: '🛑 ระบบเบรก ABS ค้างกลางสี่แยกเฉียดชนเจ้าหญิงเอลฟ์ โดนทหารองครักษ์ปรับเงินค่าความเร็ว', sceneId: 'truck', statDelta: { gold: -20, san: -5 } },
  { id: 'truck_10', text: '✨ ติดตั้งแตรรถยนต์เสียงดนตรีสามช่า กดบีบแตรทีเหล่านักผจญภัยมือใหม่แห่กันมาเต้นระบำ', sceneId: 'truck', statDelta: { rel: 14, san: 8 } },
  { id: 'truck_11', text: '🛠️ ทำการยกเครื่องช่วงล่างใหม่ ทนต่อแรงกดดันของห้วงมิติมืดได้อย่างยอดเยี่ยม', sceneId: 'truck', statDelta: { hp: 20, gold: -25 } },
  { id: 'truck_12', text: '🌪️ เผชิญพายุทอร์นาโดมิติ ดูดเอารถยนต์เก่าเข้าสู่ระบบจัดเก็บพลังงานสำรอง', sceneId: 'truck', statDelta: { str: 4, hp: -6 } },
  { id: 'truck_13', text: '🤖 หุ่นยนต์ดูดฝุ่นชนกำแพงเด้งดึ๋ง 18 ครั้งติด แต่ดูดเหรียญทองตกตามซอกพื้นได้ 12 เหรียญ', sceneId: 'truck', statDelta: { gold: 12, san: 6 } },
  { id: 'truck_14', text: '📻 คลื่นวิทยุติดรถยนต์จูนติดสถานีเพลงแห่งสรวงสวรรค์ ขับรถไปฟังเพลงเพลินตลอดคืน', sceneId: 'truck', statDelta: { san: 15, rel: 5 } },
  { id: 'truck_15', text: '🌧️ พายุฝนกระหน่ำ ที่ปัดน้ำฝนเวทมนตร์ปัดหยดน้ำเป็นประกายแสงสีคราม นำทางขบวนเกวียนปลอดภัย', sceneId: 'truck', statDelta: { rel: 12, hp: 5 } },
  { id: 'truck_16', text: '🛡️ ติดตั้งเกราะกันกระสุนเวทมนตร์รอบตัวถัง โจรดักซุ่มยิงลูกธนูใส่จนลูกธนูหักหมด', sceneId: 'truck', statDelta: { hp: 18, str: 8, gold: -15 } },
  { id: 'truck_17', text: '🚚 ขนส่งลังโพชั่นสีแดงข้ามทวีป ส่งถึงไวใน 30 นาที ได้รับการประเมิน 5 ดาวจากกิลด์มาสเตอร์', sceneId: 'truck', statDelta: { gold: 45, rel: 10 } },
  { id: 'truck_18', text: '💥 ประลองความเร็วกับกริฟฟอนบนทางหลวง เข้าเส้นชัยแซงกริฟฟอนไปครึ่งคันรถ', sceneId: 'truck', statDelta: { str: 10, san: 12 } },
  { id: 'truck_19', text: '🛞 ยางระเบิดกลางสะพานแขวน ต้องจอดเปลี่ยนล้ออะไหล่เวทมนตร์ท่ามกลางลมหนาว', sceneId: 'truck', statDelta: { hp: -8, gold: -10 } },
  { id: 'truck_20', text: '🌟 พระอาทิตย์ตกดินเหนือถนนสายไหมแห่งต่างโลก สาดแสงสีทองสะท้อนกระจกรถอย่างงดงาม', sceneId: 'truck', statDelta: { san: 20 } }
];

// 2. ตู้กดน้ำอัตโนมัติ (Vending Machine Events)
export const VENDING_MEME_EVENTS = [
  { id: 'vend_01', text: '🥤 มีออร์คขี้เมาเตะตู้เพราะเหรียญติด โดนระบบปล่อยกระป๋องโค้กอัดแก๊สกระแทกแสกหน้าจนสร่างเมา', sceneId: 'vending', statDelta: { str: 4, san: 6, hp: -2 } },
  { id: 'vend_02', text: '✨ เผลอปล่อยโพชั่นฟื้นฟูระดับ SSR สีทองอร่ามลงช่องจ่าย นักผจญภัยมือใหม่ก้มกราบขอบคุณยกใหญ่', sceneId: 'vending', statDelta: { rel: 16, gold: -5 } },
  { id: 'vend_03', text: '🐱 แมวส้มประจำตรอกแอบปีนขึ้นมานอนหลับบนคอยล์ทำความร้อนด้านบนตัวถัง นอนกรนอย่างมีความสุข', sceneId: 'vending', statDelta: { san: 14, rel: 8 } },
  { id: 'vend_04', text: '❄️ ฤดูหนาวเยือกแข็ง คนทั้งหมู่บ้านมารุมต่อคิวกดซุปข้าวโพดอุ่นๆ ไออุ่นกระจายทั่วตรอก', sceneId: 'vending', statDelta: { gold: 35, rel: 12 } },
  { id: 'vend_05', text: '🪙 ช่างทองมาตรวจนับเหรียญในกล่องเก็บเงิน พบว่าปีนี้ทำกำไรได้เหรียญทองก้อนโต', sceneId: 'vending', statDelta: { gold: 45, san: 10 } },
  { id: 'vend_06', text: '⚡ จอมเวทสายฟ้ามาแอบชาร์จแบตเตอรี่ให้ แผงไฟ LED เรืองแสงเป็นสีนีออนสะดุดตา', sceneId: 'vending', statDelta: { hp: 12, san: 6 } },
  { id: 'vend_07', text: '🛑 โจรพยายามงัดตู้ด้วยลวด แต่โดนระบบล็อกนิรภัยหนีบมือจนร้องลั่นตรอก ยามจับกุมได้ทันควัน', sceneId: 'vending', statDelta: { rel: 10, san: 6, hp: -2 } },
  { id: 'vend_08', text: '🏆 ได้รับการยกย่องจากสมาพันธ์การค้าว่าเป็นตู้กดน้ำยอดเยี่ยมแห่งปี ผู้คนแวะมาเซลฟี่คู่ด้วย', sceneId: 'vending', statDelta: { rel: 22, gold: 25 } },
  { id: 'vend_09', text: '🍵 เพิ่มเมนูชาเขียวมัทฉะผสมยาถอนพิษ นักเดินทางที่รอดตายจากป่าพิษแวะมาอุดหนุนแน่นขนัด', sceneId: 'vending', statDelta: { gold: 40, rel: 12 } },
  { id: 'vend_10', text: '🔩 น็อตยึดฐานตู้หลวมเล็กน้อยจากการสั่นสะเทือนของแผ่นดินไหว จ้างช่างมาขันให้แน่นหนา', sceneId: 'vending', statDelta: { hp: 10, gold: -8 } },
  { id: 'vend_11', text: '🎵 ปรับเสียงหยอดเหรียญให้เป็นเสียงกระดิ่งเวทมนตร์ ลูกค้าแห่มาหยอดเหรียญฟังเพลงไม่ขาดสาย', sceneId: 'vending', statDelta: { gold: 30, san: 8 } },
  { id: 'vend_12', text: '🧃 คิดค้นเมนูน้ำส้มผสมมานาเกรดพรีเมียม จอมเวทฝึกหัดแวะมากดดื่มเพิ่มพลังก่อนสอบ', sceneId: 'vending', statDelta: { int: 8, gold: 35 } },
  { id: 'vend_13', text: '🌧️ ฝนตกหนัก มีคู่รักนักผจญภัยมายืนหลบฝนใต้กันสาดของตู้ ได้ยินบทสนทนาอันอบอุ่น', sceneId: 'vending', statDelta: { san: 12, rel: 8 } },
  { id: 'vend_14', text: '🎨 ศิลปินข้างถนนมาวาดภาพกราฟิตี้รูปมังกรสุดเท่ลงบนตัวถัง กลายเป็นแลนด์มาร์กใหม่', sceneId: 'vending', statDelta: { rel: 15, san: 10 } },
  { id: 'vend_15', text: '🧊 ระบบทำความเย็นอัปเกรดเป็นน้ำแข็งพันปี เสิร์ฟเครื่องดื่มเย็นชื่นใจคลายร้อนทั้งเมือง', sceneId: 'vending', statDelta: { hp: 15, gold: 20 } }
];

// 3. ดาบศักดิ์สิทธิ์มีชีวิต (Sentient Sword Events)
export const SWORD_MEME_EVENTS = [
  { id: 'sword_01', text: '🗡️ มีอัศวินหนุ่มพยายามดึงเจ้าออกจากแท่นศิลา แต่ดึงจนกางเกงขาดก็ดึงไม่ออก เจ้าแอบหัวเราะในใจ', sceneId: 'sword', statDelta: { san: 10, int: 4 } },
  { id: 'sword_02', text: '✨ ช่างตีเหล็กเอลฟ์นำน้ำมันสมุนไพรมาขัดเงาใบดาบ คมกริบสะท้อนแสงจันทร์เป็นประกายสีรุ้ง', sceneId: 'sword', statDelta: { hp: 16, str: 6, gold: -6 } },
  { id: 'sword_03', text: '🩸 สัมผัสได้ถึงไอสังหารจากสงครามแดนไกล ปลอกดาบสั่นสะเทือนส่งเสียงก้องกังวานในหุบเขา', sceneId: 'berserk', statDelta: { str: 8, san: -4 } },
  { id: 'sword_04', text: '🐉 ผู้กล้าคว้าเจ้าไปฟันหัวมังกรแดงขาดสะบั้น เลือดมังกรช่วยเสริมความทนทานของใบมีด', sceneId: 'radahn', statDelta: { str: 10, hp: 14, rel: 12 } },
  { id: 'sword_05', text: '🃏 โดนนักผจญภัยขี้เมานำไปวางเดิมพันในวงไพ่โรงเตี๊ยม สุดท้ายเจ้าปล่อยคำสาปจนวงแตก', sceneId: 'conan', statDelta: { gold: 20, san: 6 } },
  { id: 'sword_06', text: '🌿 ตะไคร่น้ำและเถาวัลย์โบราณขึ้นปกคลุมแท่นหิน เจ้าเข้าสู่ห้วงจำศีลอันสงบสุขใต้ร่มไม้', sceneId: 'forest', statDelta: { hp: 12, san: 12 } },
  { id: 'sword_07', text: '⚡ ฟ้าผ่าฟาดลงใบมีดตรงๆ ประจุสายฟ้าเวทมนตร์ถูกกักเก็บไว้ในคมดาบ กลายเป็นดาบสายฟ้า', sceneId: 'sword', statDelta: { str: 10, hp: -4 } },
  { id: 'sword_08', text: '📜 นักประวัติศาสตร์โบราณมาคัดลอกอักขระรูนบนใบดาบไปแปลความ เจ้าได้เผยแพร่ความรู้แก่โลก', sceneId: 'conan', statDelta: { int: 10, rel: 8 } },
  { id: 'sword_09', text: '⚔️ ลอยตัวขึ้นฟันหุ่นฟางฝึกซ้อมขาดกระจุยด้วยตนเอง ชาวบ้านกราบไหว้ว่ามีผีดาบสถิต', sceneId: 'sword', statDelta: { str: 8, san: 8 } },
  { id: 'sword_10', text: '💎 ได้รับการประดับอัญมณีสีชาดตรงด้ามจับ พลังเวทหมุนเวียนไหลลื่นทรงพลัง', sceneId: 'sword', statDelta: { int: 12, hp: 10 } }
];

// 4. หีบสมบัติมิมิกกินคน (Mimic Chest Events)
export const MIMIC_CHEST_EVENTS = [
  { id: 'mimic_01', text: '📦 อ้าปากโชว์เหรียญทองแวววาว นักผจญภัยโลภมากเอื้อมมือมาหยิบ โดนงับมือสะดุ้งโหยงร้องจ๊าก', sceneId: 'mimic', statDelta: { str: 6, gold: 18, san: 8 } },
  { id: 'mimic_02', text: '👅 แลบลิ้นสีม่วงยาว 2 เมตรเลียทำความสะอาดฟันแหลมคมรอบกล่อง รู้สึกสดชื่นสะอาดสะอ้าน', sceneId: 'mimic', statDelta: { hp: 10, san: 8 } },
  { id: 'mimic_03', text: '🧙‍♀️ จอมเวทสาวเอลฟ์เอาหัวมุดเข้ามาส่องดูสมบัติในตัวถัง โดนงับหัวจนผมฟูฟ่องวิ่งหนีไป', sceneId: 'mimic', statDelta: { rel: 10, san: 12 } },
  { id: 'mimic_04', text: '🪙 แอบย่อยสลายดาบและโล่ของนักรบที่กลืนเข้าไป กลายเป็นแร่เหล็กบริสุทธิ์สะสมในท้อง', sceneId: 'mimic', statDelta: { hp: 15, str: 8 } },
  { id: 'mimic_05', text: '💤 จำศีลแปลงกายเป็นกล่องไม้เก่าๆ ในห้องสมบัติใต้ดิน หลับฝันหวานถึงภูเขาทองคำ', sceneId: 'mimic', statDelta: { san: 15, hp: 8 } },
  { id: 'mimic_06', text: '🍖 มีก็อบลินเอาเนื้อย่างชิ้นโตมาเซ่นไหว้ขอพร อิ่มอร่อยและยอมปล่อยให้ก็อบลินผ่านทาง', sceneId: 'mimic', statDelta: { hp: 12, rel: 8 } },
  { id: 'mimic_07', text: '🗝️ กุญแจขึ้นสนิมหักคาช่องรูกุญแจ ต้องใช้ลิ้นดันเศษเหล็กออกมาอย่างทุลักทุเล', sceneId: 'mimic', statDelta: { hp: -4, int: 5 } }
];

// 5. วัตถุมีวิญญาณทั่วไป (Object / Broom / Onigiri / Duck / Golem Events)
export const OBJECT_GENERAL_EVENTS = [
  { id: 'obj_gen_01', text: '🧹 ไม้กวาดบินได้กวาดใบไม้หน้าบ้านพักจนสะอาดเอี่ยมอ่อง แม่มดชมเชยและหยอดน้ำมันหอมให้', sceneId: 'alley', statDelta: { rel: 12, san: 8 } },
  { id: 'obj_gen_02', text: '🍙 ข้าวปั้นไส้บ๊วยหลบการถูกกินโดยการกลิ้งมุดรอยแยกหนี กลิ้งไปเจอกล่องเงินเก่าเก็บ', sceneId: 'ramen', statDelta: { gold: 20, luk: 8 } },
  { id: 'obj_gen_03', text: '🦆 เป็ดเหลืองยางลอยล่องในแม่น้ำศักดิ์สิทธิ์ ดูดซับไอมานาจนตัวเปล่งแสงนีออนนำโชค', sceneId: 'capybara', statDelta: { luk: 15, san: 12 } },
  { id: 'obj_gen_04', text: '🗿 โกเลมหินหน้าโมอายยืนนิ่งขวางทางลมหนาวให้สัตว์ป่าตัวน้อย สัตว์ป่ามานอนซุกรอบตัว', sceneId: 'forest', statDelta: { rel: 15, hp: 12 } },
  { id: 'obj_gen_05', text: '🧪 ขวดยาฟื้นพลังสีแดงพูดจ้อให้กำลังใจนักผจญภัยที่บาดเจ็บจนฮึดสู้ชีวิตขึ้นมาได้', sceneId: 'ramen', statDelta: { rel: 14, san: 10 } },
  { id: 'obj_gen_06', text: '✨ คอร์วิญญาณภายในเปล่งแสงจ้า สะท้อนพลังงานด้านลบออกจากร่าง ตัวถังบริสุทธิ์ผ่องใส', sceneId: 'bamboo', statDelta: { hp: 15, san: 15 } }
];

// 6. นกพิราบสื่อสารสายข่าว & สัตว์ปีก (Bird & Pigeon Spy Events)
export const BIRD_SPY_EVENTS = [
  { id: 'bird_01', text: '🕊️ บินโฉบจิกหัวเหยี่ยวข่าวกรองฝ่ายศัตรู แย่งรหัสลับผูกข้อเท้ามาได้สำเร็จ ได้รับเมล็ดถั่วเหลืองเคลือบน้ำผึ้งเป็นรางวัล', sceneId: 'conan', statDelta: { gold: 30, int: 8, san: 6 } },
  { id: 'bird_02', text: '📜 แอบเกาะขอบหน้าต่างห้องประชุมสภาขุนนาง ได้ยินแผนการขึ้นภาษีเกลือ นำข่าวไปปล่อยให้พ่อค้าจนได้ค่าหัวข่าวกรอง 40G', sceneId: 'conan', statDelta: { gold: 40, int: 10 } },
  { id: 'bird_03', text: '🥖 แม่ค้าใจดีบิขนมปังฝรั่งเศสอบกรอบให้กินที่ลานจัตุรัส อิ่มท้องจนบินตัวหนักอุ้ยอ้ายอย่างมีความสุข', sceneId: 'ramen', statDelta: { hp: 8, san: 12 } },
  { id: 'bird_04', text: '🌧️ ฝนตกหนัก ขนปีกเปียกโชก ต้องแอบเกาะใต้ปีกรูปปั้นหินการ์กอยล์บนยอดวิหาร นั่งมองสายฝนอย่างสงบ', sceneId: 'famine', statDelta: { hp: -3, san: 10 } },
  { id: 'bird_05', text: '🐈 โดนแมวส้มอ้วนประจำตรอกกระโจนจับ แต่กระพือปีกตบหน้าแมวจนแมวร้องเหมียวเผ่นหนี ขับไล่ศัตรูสำเร็จ', sceneId: 'alley', statDelta: { str: 6, san: 8 } },
  { id: 'bird_06', text: '💨 โต้กระแสลมกรรโชกแรงเหนือเทือกเขาหิมะ ร่อนเวหาดั่งเครื่องบินขับไล่ ได้รับทักษะความเร็วเวหาขั้นสูง', sceneId: 'forest', statDelta: { str: 8, hp: 5 } },
  { id: 'bird_07', text: '🔍 ค้นพบห้องลับใต้หลังคาของคฤหาสน์ดยุก พบถุงเหรียญทองโบราณที่ขโมยซ่อนไว้ คาบกลับมารังได้ 25G', sceneId: 'conan', statDelta: { gold: 25, luk: 8 } },
  { id: 'bird_08', text: '🎯 ทหารยามฝึกซ้อมยิงหน้าไม้เฉียดขนหางไป 1 นิ้ว ต้องบินหักหลบแบบควงสว่านหนีสุดระทึก', sceneId: 'radahn', statDelta: { hp: -4, str: 6, san: 6 } },
  { id: 'bird_09', text: '🌸 สร้างรังอบอุ่นด้วยกิ่งไม้หอมและขนนกสีทองบนยอดหอระฆัง ลมพัดโชยเย็นสบายตลอดฤดูร้อน', sceneId: 'forest', statDelta: { san: 18, hp: 8 } },
  { id: 'bird_10', text: '🐔 รวมฝูงกับไก่ชนบ้านทุ่งและนกกระจอก ปิดล้อมทางเดินไล่จิกหัวหน้าแก๊งรีดไถจนวิ่งหนีตกคลอง', sceneId: 'alley', statDelta: { rel: 15, str: 6 } },
  { id: 'bird_11', text: '🍓 แอบบินไปจิกกินเบอร์รี่เวทมนตร์ในสวนสมุนไพรหลวง ขนปีกเปล่งประกายสีรุ้งเรืองแสงในความมืด', sceneId: 'forest', statDelta: { int: 8, hp: 10 } },
  { id: 'bird_12', text: '💌 ส่งสารบอกรักลับๆ ให้คู่นักผจญภัยหนุ่มสาว ทั้งคู่ขอบคุณด้วยการมอบเมล็ดทานตะวันเกรดพรีเมียมให้ 1 ถุง', sceneId: 'ramen', statDelta: { rel: 16, san: 12 } },
  { id: 'bird_13', text: '🦅 ทะยานหลบกรงเล็บพญาอินทรีภูเขาด้วยการทิ้งดิ่งแนวดิ่ง 90 องศา อินทรีชนกิ่งไม้จนยอมแพ้', sceneId: 'forest', statDelta: { str: 10, san: 8 } },
  { id: 'bird_14', text: '🌙 เกาะยอดเสากระโดงเรือสำเภา ร้องเพลงใต้แสงจันทร์นำทางให้ลูกเรือกลับเข้าฝั่งอย่างปลอดภัย', sceneId: 'bamboo', statDelta: { rel: 20, san: 15 } },
  { id: 'bird_15', text: '💎 คาบเศษพลอยสีครามตกหล่นบนทางเดินมาประดับขอบรัง รังกลายเป็นคฤหาสน์วิหคสุดหรูหรา', sceneId: 'conan', statDelta: { gold: 30, san: 10 } }
];

// 7. สัตว์อสูร คาปิบาร่า แมว หมา มังกร (Beast & Familiar Events)
export const BEAST_EVENTS = [
  { id: 'beast_01', text: '🌿 นอนแช่น้ำร้อนออนเซ็นกลางหุบเขา มีนกกระเต็นมาทำรังบนหัวอย่างสงบสุข จิตใจเปี่ยมสมาธิขั้นสูงสุด', sceneId: 'capybara', statDelta: { san: 20, hp: 12 } },
  { id: 'beast_02', text: '🍊 ส้มยูสุหล่นลงมาจากต้น ตกใส่หัวดังโป๊ก แต่ส้มหอมสดชื่นเลยงับกินอย่างเอร็ดอร่อย มีวิตามินซีเต็มเปี่ยม', sceneId: 'capybara', statDelta: { hp: 10, san: 10 } },
  { id: 'beast_03', text: '🐾 โดนลูกหมีป่าท้าประลองวิ่งแข่ง แต่วิ่งไปได้ครึ่งทางก็นอนกลิ้งเล่นกันกลางทุ่งหญ้า ผูกมิตรภาพสัตว์ป่า', sceneId: 'forest', statDelta: { str: 6, rel: 12 } },
  { id: 'beast_04', text: '🍖 ค้นพบโครงกระดูกกวางยักษ์ในถ้ำ มีเนื้อติดกระดูกเล็กน้อย แทะกินประทังหิวได้ทั้งสัปดาห์', sceneId: 'forest', statDelta: { hp: 12, str: 5 } },
  { id: 'beast_05', text: '🏹 พรานป่ายิงธนูเฉียดขนสีทอง ต้องรีบกระโจนมุดโพรงไม้หนีเอาชีวิตรอด ได้บทเรียนการระวังภัย', sceneId: 'forest', statDelta: { hp: -6, san: -4, str: 6 } },
  { id: 'beast_06', text: '🌸 เทศกาลดอกไม้ป่าบานสะพรั่ง ฝูงสัตว์ต่างมานอนอาบแดดร่วมกันอย่างสันติ ไร้การล่าเข่นฆ่า', sceneId: 'capybara', statDelta: { san: 16, rel: 12 } },
  { id: 'beast_07', text: '🐱 แมวส้มอ้วนวิ่งไล่จับแสงเลเซอร์เวทมนตร์ พุ่งชนแจกันโบราณแตกแต่กระโดดหลบได้อย่างว่องไว', sceneId: 'alley', statDelta: { str: 6, san: 10 } },
  { id: 'beast_08', text: '🐕 สุนัขคอร์กี้ส่ายตูดดุ๊กดิ๊ก ดมกลิ่นพบเห็ดทรัฟเฟิลดำใต้ต้นโอ๊ก นำไปขายให้ร้านอาหารได้ 35G', sceneId: 'forest', statDelta: { gold: 35, san: 8 } },
  { id: 'beast_09', text: '🐉 ลูกมังกรไฟจามออกมาเป็นลูกไฟเผาใบไม้แห้ง สร้างความอบอุ่นให้เพื่อนสัตว์ในคืนเหน็บหนาว', sceneId: 'forest', statDelta: { str: 8, rel: 10 } },
  { id: 'beast_10', text: '🦞 กุ้งสไนเปอร์ยิงกระสุนน้ำแรงดันสูงสอยผลไม้สุกจากยอดไม้หล่นลงมาแบ่งเพื่อนกินอย่างแม่นยำ', sceneId: 'capybara', statDelta: { int: 8, str: 6, rel: 8 } },
  { id: 'beast_11', text: '🐺 ลูกหมาป่าคาบดาบฝึกวิชาฟันดาบกับเถาวัลย์ กวัดแกว่งดาบคมกริบดั่งนักดาบมือฉมัง', sceneId: 'sword', statDelta: { str: 12, hp: 8 } },
  { id: 'beast_12', text: '🦊 จิ้งจอกเก้าหางตัวจิ๋วแปลงกายเป็นก้อนขนฟูนุ่มนิ่มหลอกขออาหารจากนักเดินทาง อิ่มแปล้ทุกมื้อ', sceneId: 'forest', statDelta: { rel: 14, gold: 15 } }
];

// 8. มอนสเตอร์ สไลม์ ก็อบลิน แมงมุม เห็ด (Monster & Slime Events)
export const SLIME_MONSTER_EVENTS = [
  { id: 'slime_01', text: '🟢 เผลอปล่อยน้ำย่อยกรดใส่กางเกงนักผจญภัยจนละลาย นักรบหนุ่มหน้าแดงรีบวิ่งหนีเตลิดไป', sceneId: 'mimic', statDelta: { san: 8, str: 4 } },
  { id: 'slime_02', text: '🍄 กลืนกินเห็ดเรืองแสงสีม่วงเข้าไป ร่างกายเปลี่ยนเป็นสไลม์กระพริบแสงดิสโก้ในความมืด', sceneId: 'mimic', statDelta: { hp: 8, san: 10, int: 4 } },
  { id: 'slime_03', text: '💦 พยายามแบ่งร่างออกเป็น 2 ก้อน แต่แบ่งครึ่งไม่เท่ากัน ก้อนเล็กเลยแง่งอนก้อนใหญ่', sceneId: 'mimic', statDelta: { san: -2, str: 5 } },
  { id: 'slime_04', text: '🏰 แอบแฝงตัวเข้าไปในห้องอาบน้ำของปราสาท ดื่มด่ำกับน้ำแร่สบู่หอมจนตัวนุ่มฟูผ่อนคลาย', sceneId: 'capybara', statDelta: { hp: 14, san: 15 } },
  { id: 'slime_05', text: '🛡️ กลืนกินดาบขึ้นสนิมของก็อบลิน ดูดซับแร่เหล็กเข้าไปเสริมเกราะผิวนอกให้แข็งแกร่งดั่งหิน', sceneId: 'mimic', statDelta: { hp: 16, str: 6 } },
  { id: 'slime_06', text: '☀️ แดดบ่ายส่องแรงจนผิวนอกเกือบแห้งเกรียม ต้องรีบกระดึ๊บหนีลงแอ่งน้ำใต้รากไม้ รอดตายหวุดหวิด', sceneId: 'forest', statDelta: { hp: -6, san: -3 } },
  { id: 'slime_07', text: '🧪 นักเล่นแร่แปรธาตุมาขอดูดเมือกไปปรุงยาฟื้นพลังให้หมู่บ้าน ได้รับขนมปังหวานและเหรียญทองตอบแทน', sceneId: 'ramen', statDelta: { gold: 20, rel: 10 } },
  { id: 'slime_08', text: '🕸️ แมงมุมตัวจิ๋วชักใยเรขาคณิตดักจับแมลงปอเวทมนตร์ ได้สารอาหารเสริมใยให้เหนียวแน่นดั่งเคฟลาร์', sceneId: 'mimic', statDelta: { str: 8, hp: 8 } },
  { id: 'slime_09', text: '🧌 ก็อบลินตัวจ้อยประดิษฐ์หนังสติ๊กยิงลูกหิน ปล้นกระเป๋าขนมของนักผจญภัยมาแบ่งฝูงอย่างมีความสุข', sceneId: 'alley', statDelta: { gold: 15, rel: 10 } },
  { id: 'slime_10', text: '🧼 สบู่ในห้องน้ำกิลด์ลื่นไถลหลบคนเหยียบได้อย่างคล่องแคล่ว สะสมพลังงานความสะอาดขั้นเทพ', sceneId: 'capybara', statDelta: { luk: 12, san: 10 } }
];

// 9. อันเดด โครงกระดูก วิญญาณ กองเถ้า (Undead & Skeleton Events)
export const UNDEAD_EVENTS = [
  { id: 'undead_01', text: '💀 ขี่สุนัขโครงกระดูกวิ่งเล่นรอบสุสาน กระดูกซี่โครงหลุดหายไป 1 ซี่ ต้องคุ้ยหาใต้กองดินจนเจอ', sceneId: 'catacombs', statDelta: { hp: -2, san: 6 } },
  { id: 'undead_02', text: '🕯️ นั่งฟังบาทหลวงสวดส่งวิญญาณในโบสถ์ร้าง รู้สึกง่วงนอนแต่หลับไม่ลงเพราะไม่มีเปลือกตา', sceneId: 'catacombs', statDelta: { int: 6, san: 8 } },
  { id: 'undead_03', text: '🦴 ขัดกระดูกตนเองจนขาวจั๊วะสะท้อนแสงจันทร์ ผีดิบตนอื่นมองด้วยความอิจฉาในความเงางาม', sceneId: 'catacombs', statDelta: { san: 10, rel: 8 } },
  { id: 'undead_04', text: '⚔️ ถูกพาลาดินฝึกหัดฟาดค้อนแสงใส่ แขนซ้ายหักกระเด็น ต้องรีบต่อกาวเวทมนตร์ซ่อมแซม', sceneId: 'radahn', statDelta: { hp: -12, str: 5 } },
  { id: 'undead_05', text: '📜 ค้นพบม้วนคัมภีร์เวทเนโครแมนซีโบราณในโลงศพหิน สติปัญญาในความมืดเริ่มก่อตัวเฉียบแหลม', sceneId: 'conan', statDelta: { int: 12, san: -2 } },
  { id: 'undead_06', text: '🌧️ ฝนกรดตกลงมาใส่เบ้าตา ไอน้ำเดือดพล่าน ต้องรีบหลบใต้หลังคาหลุมศพหินอ่อนอย่างว่องไว', sceneId: 'catacombs', statDelta: { hp: -4, san: -4 } },
  { id: 'undead_07', text: '🔥 เศษเสี้ยวราชันย์แห่งกองเถ้าจุดประกายไฟแห่งความหวัง เถ้าถ่านลุกโชนคืนชีพให้จิตวิญญาณแกร่งกล้า', sceneId: 'bonfire', statDelta: { str: 12, san: 15 } },
  { id: 'undead_08', text: '👻 วิญญาณเร่ร่อนลอยลอดกำแพงเข้าไปแอบดูละครสัตว์ฟรี ตลกจนขำตัวสั่นแม้ไม่มีปอด', sceneId: 'saitama', statDelta: { san: 14, rel: 6 } }
];

// 10. วัยทารก & เด็กเล็ก (Infant & Toddler: Ages 0 - 4 สำหรับมนุษย์/อมนุษย์)
export const INFANT_EVENTS = [
  { id: 'infant_01', text: '🍼 ดื่มนมแพะอุ่นๆ ผสมสมุนไพรบำรุงกำลัง ร่างกายเริ่มเติบโตแข็งแรงขึ้นตามลำดับ', sceneId: 'famine', statDelta: { hp: 10, san: 6 } },
  { id: 'infant_02', text: '🌧️ พายุฝนกระหน่ำหลังคาเพิงพักรั่ว น้ำหยดลงเตียงฟางทั้งคืน ต้องนอนกอดกันเพื่อความอบอุ่น', sceneId: 'famine', statDelta: { hp: -6, san: -4 } },
  { id: 'infant_03', text: '🐱 เผลอคว้าหางแมวส้มที่เดินผ่าน แมวแกล้งขู่ฟ่อแต่สุดท้ายก็ยอมให้นอนซุกพุงนุ่มๆ', sceneId: 'alley', statDelta: { san: 10, rel: 6 } },
  { id: 'infant_04', text: '🍞 กินขนมปังข้าวบาร์เลย์แข็งกระด้าง ฟันน้ำนมซี่แรกเริ่มโผล่พ้นเหงือก ร่างกายแข็งแรง', sceneId: 'famine', statDelta: { hp: 6, str: 2 } },
  { id: 'infant_05', text: '✨ เห็นละอองเวทมนตร์ลอยผ่านหน้าต่าง พยายามเอื้อมมือคว้า ละอองซึมเข้าสู่ผิวอย่างอบอุ่น', sceneId: 'alley', statDelta: { int: 5, san: 6 } },
  { id: 'infant_06', text: '🤒 ป่วยเป็นไข้ป่าฤดูหนาว ตัวร้อนจี๋ ครอบครัวต้มใบสะระแหน่ป่าให้ดื่มจนไข้ลดลง', sceneId: 'famine', statDelta: { hp: -8, san: -4 } },
  { id: 'infant_07', text: '🧸 ได้รับของเล่นไม้แกะสลักรูปอัศวินจากเพื่อนบ้าน ถือไว้ไม่ยอมปล่อยแม้กระทั่งตอนนอน', sceneId: 'alley', statDelta: { san: 8, rel: 6 } },
  { id: 'infant_08', text: '🐀 วิ่งไล่ตามหนูในตรอกจนสะดุดก้อนหิน หัวเข่าถลอกเล็กน้อยแต่ได้เรียนรู้การทรงตัว', sceneId: 'alley', statDelta: { hp: -2, str: 3 } },
  { id: 'infant_09', text: '🎶 ฟังเพลงกล่อมเด็กภาษาโบราณใต้แสงตะเกียงน้ำมัน จิตใจสงบและนอนหลับฝันดี', sceneId: 'famine', statDelta: { san: 12 } },
  { id: 'infant_10', text: '☀️ ออกไปนั่งตากแดดอุ่นๆ ยามเช้าบนชานเรือน รับวิตามินจากแสงแดดธรรมชาติอย่างสดชื่น', sceneId: 'alley', statDelta: { hp: 8, san: 8 } }
];

// 11. วัยเด็ก & วัยเรียนรู้ (Child: Ages 5 - 12)
export const CHILD_EVENTS = [
  { id: 'child_01', text: '🪙 ก้มเก็บเหรียญทองแดงตกในร่องระบายน้ำ นำไปซื้อขนมปังน้ำผึ้งกินอย่างมีความสุข', sceneId: 'alley', statDelta: { gold: 5, san: 6 } },
  { id: 'child_02', text: '📜 แอบมองดูเด็กบ้านขุนนางเรียนหนังสือผ่านช่องหน้าต่าง จดจำตัวอักษรรูนโบราณได้ 3 ตัว', sceneId: 'conan', statDelta: { int: 8, san: 4 } },
  { id: 'child_03', text: '🪨 โดนเด็กอันธพาลประจำตรอกไถเงินค่าขนม ต้องใช้ไหวพริบวิ่งมุดซอกตึกหลบหนีอย่างว่องไว', sceneId: 'alley', statDelta: { san: -3, str: 4 } },
  { id: 'child_04', text: '🪵 ช่วยคนเฒ่าคนแก่แบกฟืนขึ้นเนินเขา ได้รับเศษสตางค์และคำอวยพรให้มีอายุยืนยาว', sceneId: 'famine', statDelta: { gold: 8, rel: 10, hp: -2 } },
  { id: 'child_05', text: '🐔 ซุกซนวิ่งไล่จับไก่บ้านทุ่ง โดนฝูงไก่คุกโกะบินรุมจิกหัวจนต้องวิ่งหนีตกน้ำ', sceneId: 'alley', statDelta: { hp: -4, san: -2, str: 3 } },
  { id: 'child_06', text: '🧪 แอบเก็บขวดยาเปล่าที่นักผจญภัยโยนทิ้ง นำไปล้างขายคืนให้ร้านขายยา ได้เงินสะสม', sceneId: 'ramen', statDelta: { gold: 12, int: 4 } },
  { id: 'child_07', text: '🎭 มีคณะละครสัตว์เร่ร่อนมาจัดแสดง แอบปีนกำแพงดูการแสดงพ่นไฟ ตื่นตาตื่นใจเป็นที่สุด', sceneId: 'saitama', statDelta: { san: 12, int: 4 } },
  { id: 'child_08', text: '❄️ หิมะตกหนักจนต้องช่วยกันโกยหิมะออกจากหลังคา ได้ออกกำลังกายจนกล้ามเนื้อเริ่มแข็งแกร่ง', sceneId: 'famine', statDelta: { str: 6, hp: -3 } },
  { id: 'child_09', text: '🎣 ไปตกปลาที่ริมแม่น้ำ ได้ปลาเทราต์สีเงินตัวโต นำกลับมาต้มซุปกินอิ่มทั้งครอบครัว', sceneId: 'capybara', statDelta: { hp: 10, gold: 8, san: 8 } },
  { id: 'child_10', text: '🏹 เหลาไม้ไผ่ทำคันธนูของเล่น ยิงเป้าลูกแอปเปิลบนรั้วได้อย่างแม่นยำ ฉายแววมือธนู', sceneId: 'forest', statDelta: { str: 6, int: 4 } }
];

// 12. วัยรุ่น & วัยแรกรุ่น (Youth: Ages 13 - 20)
export const YOUTH_EVENTS = [
  { id: 'meme_horse_01', text: '🐴 สวนทางกับ "อัศวินทมิฬควบม้าหน้าคน" ที่กำลังวิ่งสปีด 120 กม./ชม. พร้อมรอยยิ้มหลับตาพริ้มสุดกวน ชวนให้อารมณ์ดีทั้งวัน', sceneId: 'meme_berserk_horse', statDelta: { san: 15, luk: 6 } },
  { id: 'meme_berserk_01', text: '⚔️ บังเอิญพบยอดนักรบเกราะทมิฬยืนหลับตาพริ้มตากลมหนาวบนยอดเขา ดูน่าเกรงขามแต่ก็แอบปั่นประสาทจนหลุดขำ', sceneId: 'meme_berserk_portrait', statDelta: { str: 6, san: 10 } },
  { id: 'youth_01', text: '🍜 ได้กลิ่นหอมชวนน้ำลายสอจากเพิงราเม็ง แอบสั่งราเม็งชามยักษ์กินจนพุงกาง มีพลังฮึดสู้ชีวิต', sceneId: 'ramen', statDelta: { hp: 10, san: 12, gold: -6 } },
  { id: 'youth_02', text: '👓 เดินสวนกับเด็กประถมสวมแว่นในตรอก ทันใดนั้นเกิดคดีฆาตกรรมปริศนาในโรงเตี๊ยม ต้องให้ปากคำกับยาม', sceneId: 'conan', statDelta: { int: 8, san: -6 } },
  { id: 'youth_03', text: '👨‍🦲 ชายศีรษะโล้นในชุดฮีโร่สีเหลืองวิ่งสปรินต์แซงหน้า ตะโกนว่า "เนื้อลดราคา!" ความเร็วดั่งลมกรด', sceneId: 'saitama', statDelta: { san: 10, str: 4 } },
  { id: 'youth_04', text: '😭 หญิงสาวผมฟ้าชุดนักบวชเกาะขาร้องไห้ ขอร้องให้ช่วยจ่ายหนี้ค่าเหล้าในบาร์ให้ที จำใจช่วยไปนิดหน่อย', sceneId: 'aqua', statDelta: { gold: -15, san: -4, rel: 8 } },
  { id: 'youth_05', text: '📦 เผลอเปิดหีบสมบัติกลางดันเจี้ยน ปรากฏว่าเป็นหีบมิมิกงับหัวครึ่งตัว ต้องดิ้นรนอยู่นานกว่าจะหลุด', sceneId: 'mimic', statDelta: { hp: -10, san: -6, str: 6 } },
  { id: 'youth_06', text: '🥚 เจอไข่หินสีเลือดประหลาดมีตาจมูกปาก (เบเฮริท) ตกอยู่ในโคลน แอบเก็บใส่กระเป๋าไว้ลุ้นโชค', sceneId: 'berserk', statDelta: { san: -4, int: 6, luk: 8 } },
  { id: 'youth_07', text: '☄️ ท้องฟ้าเปลี่ยนเป็นสีม่วงเข้ม เทศกาลราดานเปิดฉาก เหล่านักรบรวมพลใต้ห่าฝนดาวตกอย่างยิ่งใหญ่', sceneId: 'radahn', statDelta: { str: 8, san: 6 } },
  { id: 'youth_08', text: '💥 ได้ยินเสียงระเบิดดังกึกก้องจากยอดเขา มีจอมเวทสาวหมวกแหลมนอนหมดแรงเพราะใช้เวทระเบิดตูมเดียว', sceneId: 'explosion', statDelta: { san: 8, int: 6 } },
  { id: 'youth_09', text: '🪨 ชายหัวโล้นชื่อ "แพทเชส" ชวนไปชะโงกดูสมบัติตรงขอบหน้าผา โชคดีที่ไม่หลงเชื่อเลยไม่โดนถีบตกเหว', sceneId: 'patches', statDelta: { int: 8, san: 6 } },
  { id: 'youth_10', text: '⚔️ รับภารกิจปราบฝูงหนูยักษ์ในท่อระบายน้ำเมืองหลวง ได้รับเงินรางวัลและเหรียญตรากิลด์', sceneId: 'mimic', statDelta: { gold: 25, str: 6, hp: -4 } },
  { id: 'youth_11', text: '🍺 บาร์เหล้าจัดแข่งงัดข้อชิงเหรียญทอง ขึ้นเวทีประลองชนะแชมป์เก่า ได้รับเสียงเฮลั่นร้าน', sceneId: 'ramen', statDelta: { gold: 20, str: 8, san: 8 } },
  { id: 'youth_12', text: '📜 สมัครเข้าเป็นสมาชิกกิลด์นักผจญภัย ได้รับป้ายชื่อเหล็กกล้าและภารกิจเริ่มต้นประจำปี', sceneId: 'alley', statDelta: { rel: 12, gold: -5 } }
];

// 13. วัยผู้ใหญ่ & การสร้างตัว (Adult: Ages 21 - 40)
export const ADULT_EVENTS = [
  { id: 'meme_berserk_02', text: '🗡️ ชายหนุ่มหน้าตาผ่อนคลายแบกดาบเหล็กยักษ์ผ่ามิติเดินผ่านตรอกไป เขาชวนคุยอย่างเป็นกันเองและสอนเทคนิคการถือของหนัก', sceneId: 'meme_berserk_full', statDelta: { str: 8, hp: 5 } },
  { id: 'meme_chill_01', text: '🧘 ได้พบกับนักพรตลึกลับที่มีใบหน้ายิ้มหลับตาพริ้มไม่แคร์โลก เขาชี้นิ้วสอนว่า "ชีวิตมันสั้น อย่าคิดมากเพื่อน" บรรลุสัจธรรมทันที', sceneId: 'meme_face_chill', statDelta: { san: 20, int: 5 } },
  { id: 'adult_01', text: '🌾 ข้าวสาลีและอาหารแห้งในตลาดราคาพุ่งขึ้นสองเท่า ต้องรัดเข็มขัดและกินอาหารประหยัดขึ้น', sceneId: 'famine', statDelta: { gold: -15, san: -5 } },
  { id: 'adult_02', text: '👑 เจ้าเมืองสั่งเกณฑ์แรงงานไปขุดคูเมืองป้องกันสงคราม ต้องไปช่วยแบกหินแลกข้าวต้มวันละถ้วย', sceneId: 'radahn', statDelta: { hp: -6, str: 6, gold: 8 } },
  { id: 'adult_03', text: '🛡️ ทหารรักษาการณ์ออกตรวจค้นตรอกสลัมอย่างเข้มงวด ต้องจ่ายส่วยรักษาความปลอดภัยประจำปี', sceneId: 'alley', statDelta: { gold: -18, san: -4 } },
  { id: 'adult_04', text: '📉 กิลด์พ่อค้าประกาศลดค่าจ้างแรงงานชั่วคราว ข้าวของแพงขึ้น เงินเก็บร่อยหรอ', sceneId: 'famine', statDelta: { gold: -10, san: -6 } },
  { id: 'adult_05', text: '🏥 โรงหมอหลวงคิดค่ายารักษาแพงลิบลิ่ว หันไปต้มสมุนไพรพื้นบ้านดื่มเองตามยถากรรม สุขภาพดีขึ้น', sceneId: 'famine', statDelta: { hp: 5, gold: -5 } },
  { id: 'adult_06', text: '🏘️ เกิดเพลิงไหม้ในย่านชุมชนแออัด ทุกคนร่วมแรงร่วมใจกันขนน้ำมาดับไฟได้อย่างปลอดภัย', sceneId: 'alley', statDelta: { rel: 15, hp: -3, san: 6 } },
  { id: 'adult_07', text: '📜 สภาขุนนางประกาศขึ้นภาษีที่ดินประจำปี ต้องเจียดเงินเก็บไปจ่ายภาษีตามกฎหมาย', sceneId: 'conan', statDelta: { gold: -22, san: -5 } },
  { id: 'adult_08', text: '❄️ พายุหิมะพัดถล่มหลังคาพังเสียหาย ต้องปีนขึ้นไปตอกตะปูซ่อมแซมท่ามกลางอากาศหนาวเหน็บ', sceneId: 'famine', statDelta: { hp: -5, gold: -8 } },
  { id: 'adult_09', text: '💰 ช่วยเหลือนายหน้าค้าที่ดินไกล่เกลี่ยข้อพิพาท ได้รับค่านายหน้าก้อนโตอย่างไม่คาดฝัน', sceneId: 'conan', statDelta: { gold: 50, rel: 8 } },
  { id: 'adult_10', text: '🍷 ฉลองครบรอบวันเกิดในร้านอาหารประจำกับเพื่อนสนิท หัวเราะให้กับความยากลำบากที่ผ่านมา', sceneId: 'ramen', statDelta: { san: 16, rel: 12, gold: -8 } },
  { id: 'adult_11', text: '⚔️ ได้รับเชิญเข้าร่วมศึกชิงดินแดนชายแดน รอดตายกลับมาได้พร้อมรอยแผลเป็นแห่งเกียรติยศ', sceneId: 'radahn', statDelta: { str: 10, hp: -10, gold: 40 } },
  { id: 'adult_12', text: '🔮 ซื้อเครื่องรางคุ้มครองภัยจากแม่มดเฒ่า รู้สึกจิตใจสงบและแคล้วคลาดจากอุบัติเหตุ', sceneId: 'forest', statDelta: { san: 10, gold: -12, luk: 6 } }
];

// 14. วัยกรำศึก & ผู้อาวุโส (Veteran: Ages 41 - 60)
export const VETERAN_EVENTS = [
  { id: 'vet_01', text: '🧙‍♂️ ถ่ายทอดวิชาเอาตัวรอดในดันเจี้ยนให้นักผจญภัยรุ่นเยาว์ ได้รับความเคารพนับถือในฐานะอาจารย์', sceneId: 'mimic', statDelta: { rel: 18, int: 8, san: 10 } },
  { id: 'vet_02', text: '🦴 อาการปวดข้อเข่ากำเริบเมื่อฝนตก ต้องต้มน้ำขิงและสมุนไพรอบอุ่นร่างกาย บรรเทาลงได้', sceneId: 'famine', statDelta: { hp: -6, san: -2 } },
  { id: 'vet_03', text: '⚔️ ปฏิเสธคำเชิญเข้าร่วมสงครามครูเสดของขุนนาง เลือกที่จะอยู่ดูแลครอบครัวและชุมชนอย่างสงบ', sceneId: 'alley', statDelta: { san: 12, gold: -8 } },
  { id: 'vet_04', text: '📜 ตรวจสอบบัญชีทรัพย์สินและหนี้สินตลอดชีวิตที่ผ่านมา เริ่มวางแผนจัดการมรดกอย่างรอบคอบ', sceneId: 'conan', statDelta: { int: 8, gold: 20 } },
  { id: 'vet_05', text: '🐉 ฝูงไวเวิร์นบินผ่านยอดปราสาท ทุกคนหลบในห้องใต้ดินอย่างปลอดภัยด้วยการเตรียมพร้อมของท่าน', sceneId: 'radahn', statDelta: { rel: 15, san: 8 } },
  { id: 'vet_06', text: '🍲 เปิดโรงทานแจกจ่ายซุปกระดูกหมูให้คนยากไร้ในสลัม อิ่มเอมใจและสร้างสายสัมพันธ์อันแน่นแฟ้น', sceneId: 'ramen', statDelta: { gold: -18, rel: 20, san: 15 } },
  { id: 'vet_07', text: '🌿 ปลูกสวนสมุนไพรและต้นชาหลังบ้าน ใช้เวลาว่างชงชาดื่มด่ำกับธรรมชาติอันสงบ', sceneId: 'forest', statDelta: { hp: 12, san: 15 } },
  { id: 'vet_08', text: '⚡ สุริยุปราคาเกิดขึ้นเหนือเมือง เกิดลางบอกเหตุ แต่ท่านมีประสบการณ์รับมือได้อย่างมีสติ', sceneId: 'berserk', statDelta: { int: 10, san: 6 } }
];

// 15. วัยชราภาพ & ตำนาน (Elder: Ages 61+)
export const ELDER_EVENTS = [
  { id: 'elder_01', text: '♨️ เดินทางไปพักผ่อนแช่น้ำร้อนออนเซ็นร่วมกับคาปิบาร่า ปล่อยวางความขัดแย้งในโลกีย์อย่างสิ้นเชิง', sceneId: 'capybara', statDelta: { hp: 15, san: 25 } },
  { id: 'elder_02', text: '📖 เขียนบันทึกชีวประวัติ "หนึ่งในล้าน: บันทึกชีวิตผู้รอดชีวิตแห่งโลกมืด" สำนักพิมพ์ขอนำไปตีพิมพ์', sceneId: 'conan', statDelta: { gold: 60, int: 12, rel: 18 } },
  { id: 'elder_03', text: '👴 นั่งเก้าอี้โยกหน้าบ้าน เล่าตำนานการกำเนิดใหม่ให้ลูกหลานฟังใต้แสงดาวระยิบระยับ', sceneId: 'alley', statDelta: { san: 18, rel: 15 } },
  { id: 'elder_04', text: '🍂 ใบไม้ร่วงหล่นสู่พื้นดิน สุขภาพค่อยๆ เสื่อมถอยตามกาลเวลา แต่จิตวิญญาณยังคงสว่างไสว', sceneId: 'forest', statDelta: { hp: -8, san: 10 } },
  { id: 'elder_05', text: '🌟 เหล่าผู้กล้ารุ่นใหม่แวะมาก้มกราบขอคำชี้แนะก่อนออกเดินทางไปปราบจอมมาร', sceneId: 'sword', statDelta: { rel: 25, san: 15 } },
  { id: 'elder_06', text: '🍵 จิบชาเขียวอุ่นๆ กับเพื่อนร่วมรุ่นที่เหลือรอดเพียงไม่กี่คน รำลึกถึงวันวานอันบ้าคลั่ง', sceneId: 'ramen', statDelta: { san: 16, rel: 12 } }
];

// ==========================================
// ฟังก์ชันสุ่มเหตุการณ์แบบไม่มีวันซ้ำซาก (Non-Repetitive Dynamic Year Event)
// ==========================================
export function getRandomMemeYearEvent(age, character, taxonomy, seenEventIds = new Set()) {
  const raceId = (character?.race?.id || '').toLowerCase();
  const bodyType = (character?.race?.bodyType || taxonomy || '').toLowerCase();
  const isHumanoid = taxonomy === 'humanoid';

  // 1. คัดเลือกชุดเหตุการณ์เฉพาะสายพันธุ์อย่างแม่นยำ
  let speciesPool = [];
  if (bodyType === 'truck' || raceId.includes('truck') || raceId === 'roomba') {
    speciesPool = TRUCK_MEME_EVENTS;
  } else if (raceId.includes('vending') || character?.race?.name?.includes('ตู้กดน้ำ')) {
    speciesPool = VENDING_MEME_EVENTS;
  } else if (bodyType === 'sword' || raceId.includes('sword') || character?.race?.name?.includes('ดาบ')) {
    speciesPool = SWORD_MEME_EVENTS;
  } else if (bodyType === 'mimic' || raceId.includes('mimic')) {
    speciesPool = MIMIC_CHEST_EVENTS;
  } else if (bodyType === 'bird' || raceId.includes('pigeon') || raceId.includes('chicken') || raceId.includes('cucco')) {
    speciesPool = BIRD_SPY_EVENTS;
  } else if (bodyType === 'beast' || raceId.includes('capybara') || raceId.includes('corgi') || raceId.includes('cat') || raceId.includes('wolf') || bodyType === 'dragon' || bodyType === 'lobster') {
    speciesPool = BEAST_EVENTS;
  } else if (bodyType === 'skeleton' || bodyType === 'ghost' || taxonomy === 'undead' || raceId.includes('skeleton') || raceId.includes('ashen')) {
    speciesPool = UNDEAD_EVENTS;
  } else if (bodyType === 'slime' || bodyType === 'goblin' || bodyType === 'spider' || bodyType === 'mushroom' || taxonomy === 'monster') {
    speciesPool = SLIME_MONSTER_EVENTS;
  } else if (taxonomy === 'object') {
    speciesPool = OBJECT_GENERAL_EVENTS;
  }

  // 2. คัดเลือกเหตุการณ์ตามช่วงอายุจริง
  let agePool = [];
  if (age <= 4) {
    agePool = INFANT_EVENTS;
  } else if (age <= 12) {
    agePool = CHILD_EVENTS;
  } else if (age <= 20) {
    agePool = YOUTH_EVENTS;
  } else if (age <= 40) {
    agePool = ADULT_EVENTS;
  } else if (age <= 60) {
    agePool = VETERAN_EVENTS;
  } else {
    agePool = ELDER_EVENTS;
  }

  // สำหรับสิ่งที่ไม่ใช่มนุษย์ (สัตว์ปีก, นกพิราบ, ตู้กดน้ำ, สไลม์, อันเดด)
  // ให้ความสำคัญกับ Species Pool สูงถึง 85% เพื่อป้องกันการเจอบันทึกมนุษย์อย่าง "ฟันน้ำนมงอก" หรือ "ดื่มนมแพะ"
  let candidatePool = [];
  if (speciesPool.length > 0 && (!isHumanoid || Math.random() < 0.45)) {
    // กรองหาตัวที่ยังไม่เคยเกิดใน speciesPool
    const unseenSpecies = speciesPool.filter(ev => !seenEventIds.has(ev.id));
    if (unseenSpecies.length > 0) {
      candidatePool = unseenSpecies;
    } else {
      candidatePool = speciesPool;
    }
  } else {
    // กรองหาตัวที่ยังไม่เคยเกิดใน agePool
    const unseenAge = agePool.filter(ev => !seenEventIds.has(ev.id));
    if (unseenAge.length > 0) {
      candidatePool = unseenAge;
    } else {
      candidatePool = agePool;
    }
  }

  // กรองเฉพาะเหตุการณ์ที่ "ยังไม่เคยเกิด" ในชีวิตนี้ (Non-Repetitive Filter)
  let available = candidatePool.filter(ev => !seenEventIds.has(ev.id));

  // ถ้าใน pool นั้นสุ่มจนหมดแล้ว ให้ลองดูอีก pool หนึ่ง
  if (available.length === 0) {
    const backupPool = candidatePool === speciesPool ? agePool : speciesPool;
    available = backupPool.filter(ev => !seenEventIds.has(ev.id));
  }

  // ถ้ายังหมดเกลี้ยงอีก ให้รวบรวมเหตุการณ์ทั้งหมดที่ไม่เคยเกิด
  if (available.length === 0) {
    const allEvents = [
      ...TRUCK_MEME_EVENTS, ...VENDING_MEME_EVENTS, ...SWORD_MEME_EVENTS,
      ...MIMIC_CHEST_EVENTS, ...OBJECT_GENERAL_EVENTS, ...BIRD_SPY_EVENTS,
      ...BEAST_EVENTS, ...SLIME_MONSTER_EVENTS, ...UNDEAD_EVENTS,
      ...INFANT_EVENTS, ...CHILD_EVENTS, ...YOUTH_EVENTS,
      ...ADULT_EVENTS, ...VETERAN_EVENTS, ...ELDER_EVENTS
    ];
    available = allEvents.filter(ev => !seenEventIds.has(ev.id));
  }

  // กรณีเล่นยาวจนหมดสต็อก 400+ เหตุการณ์ ให้สุ่มจาก pool เดิมได้
  const finalPool = available.length > 0 ? available : candidatePool;
  const picked = finalPool[Math.floor(Math.random() * finalPool.length)];

  // บันทึก id ที่เคยเจอเพื่อป้องกันการเกิดซ้ำตลอดชาตินี้
  if (picked?.id && seenEventIds) {
    seenEventIds.add(picked.id);
  }

  return picked;
}
