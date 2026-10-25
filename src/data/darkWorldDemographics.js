// ข้อมูลโครงสร้างประชากรและสถิติการเกิดในแดนต่างโลก (ดัดแปลงจากระบบ 1 ใน 65 ล้าน / 1 ในร้อยล้าน)
export const REALMS = [
  { name: 'นครหลวงทองคำลินเดล (Royal Capital)', popPercent: '12%', wealth: 'high', desc: 'ศูนย์กลางอำนาจและอารยธรรม มีโอกาสเกิดในครอบครัวมีฐานะสูง' },
  { name: 'แคว้นเถ้าถ่านคาเอลิด (Caelid Wastelands)', popPercent: '8%', wealth: 'low', desc: 'ดินแดนรกร้างปนเปื้อนพิษ ประชากรยากจนแต่มีความอดทนสูง' },
  { name: 'นครหมอกยาฮาร์กูล (Yahar\'gul Valley)', popPercent: '7%', wealth: 'medium', desc: 'เมืองหุบเขาที่คลาคล่ำไปด้วยนักล่าและพ่อค้าสมุนไพร' },
  { name: 'ชุมชนคนยากบึงพิษบลายท์ (Blighttown Swamps)', popPercent: '7%', wealth: 'destitute', desc: 'แหล่งเสื่อมโทรมใต้พิภพ เต็มไปด้วยผู้ลี้ภัยและคนไร้บ้าน' },
  { name: 'ป้อมปราการชายแดนสุริยุปราคา (Eclipse Outpost)', popPercent: '6%', wealth: 'medium', desc: 'ดินแดนแนวหน้ารับศึกสงคราม ผู้คนนิยมฝึกวิชาทหารแต่เด็ก' },
  { name: 'เกาะศักดิ์สิทธิ์พฤกษาบรรพกาล (Erdtree Isle)', popPercent: '3%', wealth: 'very_high', desc: 'เกาะปิดของเหล่านักบวชและชนชั้นสูง อุดมสมบูรณ์และมั่งคั่ง' },
  { name: 'ป่าโบราณพันปีของเอลฟ์ (Great Elven Forest)', popPercent: '5%', wealth: 'medium', desc: 'ป่าดึกดำบรรพ์ที่เต็มไปด้วยเห็ดเรืองแสง สายลมบริสุทธิ์ และสัตว์วิเศษ' },
  { name: 'ดันเจี้ยนเขาวงกตใต้พิภพชั้น 1 (Labyrinth Floor 1)', popPercent: '6%', wealth: 'destitute', desc: 'ถ้ำหินชื้นแฉะที่มีสไลม์ ค้างคาว และแอ่งน้ำแร่เรืองแสง' },
  { name: 'ตรอกหลังร้านสะดวกซื้อข้ามภพ (Isekai Convenience Alley)', popPercent: '5%', wealth: 'low', desc: 'ตรอกลึกลับที่มีเศษกล่องลัง เศษขนมปัง และเสาไฟกะพริบแปลกตา' },
  { name: 'หมู่บ้านกบกระโดดริมหนองน้ำ (Giant Frog Marshes)', popPercent: '5%', wealth: 'low', desc: 'พื้นที่ชุ่มน้ำชานเมืองที่กบยักษ์ชอบกระโดดเหยียบบ้านเรือนชาวบ้าน' },
  { name: 'ยอดเขาไฟมังกรแดงหลับใหล (Sleeping Dragon Volcano)', popPercent: '3%', wealth: 'low', desc: 'ปล่องภูเขาไฟระอุที่เต็มไปด้วยแร่โลหะร้อนและสะเก็ดไฟ' },
  { name: 'สุสานไร้นามแดนหิมะโปรย (Snowy Nameless Crypt)', popPercent: '4%', wealth: 'destitute', desc: 'สุสานหินอ่อนใต้หิมะขาวโพลน หนาวเหน็บจนน้ำลายแทบกลายเป็นน้ำแข็ง' },
  { name: 'ตลาดมืดท่าเรือโจรสลัด (Black Market Docks)', popPercent: '5%', wealth: 'medium', desc: 'ท่าเรือเถื่อนที่พ่อค้าคนแคระและนักลักลอบค้าของเถื่อนชุมนุม' },
  { name: 'หอคอยดวงดาวสถาบันมนตรา (Glintstone Academy)', popPercent: '4%', wealth: 'high', desc: 'สถาบันเวทมนตร์ที่มีคัมภีร์ลอยได้ ผลึกคริสตัลสีฟ้า และนักปราชญ์สวมหน้ากาก' },
  { name: 'ซากโบสถ์ร้างกลางดงหมาป่า (Abandoned Wolf Church)', popPercent: '4%', wealth: 'destitute', desc: 'โบสถ์โบราณหลังคาพังทลาย มีฝูงหมาป่าคอยเฝ้าซากแท่นบูชา' },
  { name: 'ถ้ำรังแมงมุมลึกใต้พิภพ (Abyssal Spider Nest)', popPercent: '3%', wealth: 'destitute', desc: 'ถ้ำมืดทึบที่เต็มไปด้วยเส้นใยเหนียวหนึบและไข่มอนสเตอร์' },
  { name: 'สลัมกองขยะแห่งนครลอยฟ้า (Floating Sky Slums)', popPercent: '3%', wealth: 'destitute', desc: 'ชุมชนแออัดใต้ท้องเรือเหาะที่คอยเก็บเศษเหล็กและของเหลือทิ้ง' },
  { name: 'ทุ่งดอกไม้ลวงตาสีเลือด (Blood Lily Meadow)', popPercent: '2%', wealth: 'low', desc: 'ทุ่งหญ้ากว้างที่ดอกไม้ส่งกลิ่นหอมหวานชวนหลับใหลและฝันประหลาด' },
  { name: 'รังโจรหุบเขากะโหลกคู่ (Twin Skull Canyon)', popPercent: '2%', wealth: 'low', desc: 'หุบผาสูงชันที่มีกองโจรดักซุ่มปล้นกองคาราวานสินค้า' },
  { name: 'หมู่บ้านคนแคระช่างตีเหล็ก (Dwarven Forge Village)', popPercent: '2%', wealth: 'medium', desc: 'เมืองใต้ผาหินที่มีเสียงค้อนกระทบทั่งดังสนั่นและกลิ่นถ่านหินหอมฉุย' },
  { name: 'บ่อน้ำพุร้อนเทพธิดาจอมป่วน (Hot Spring of Goddess)', popPercent: '1%', wealth: 'high', desc: 'บ่อน้ำแร่ธรรมชาติที่อุดมไปด้วยพลังศักดิ์สิทธิ์และเรื่องตลกร้าย' },
  { name: 'ห้วงมิติมืดทางหลวงสายฟ้า (Void Rift Highway)', popPercent: '1%', wealth: 'medium', desc: 'ถนนหินสายฟ้าผ่าที่รถบรรทุกปีศาจข้ามมิติชอบพุ่งผ่าน' },
  { name: 'คฤหาสน์ผีสิงตระกูลขุนนางเก่า (Haunted Manor)', popPercent: '1%', wealth: 'medium', desc: 'ปราสาทโบราณที่มีชุดเกราะเดินตรวจตราเองและภาพวาดขยับตาได้' },
  { name: 'ไร่กะหล่ำปลีบินได้ (Flying Cabbage Farms)', popPercent: '1%', wealth: 'low', desc: 'ทุ่งเกษตรกรรมที่ชาวบ้านต้องถือสวิงไล่จับกะหล่ำปลีที่บินหนี' },
  { name: 'แท่นบูชาดวงจันทร์มืด (Dark Moon Altar)', popPercent: '1%', wealth: 'high', desc: 'แท่นหินโบราณบนยอดผาที่อาบแสงจันทร์สีครามเย็นเยียบไร้สุ้มเสียง' },
  { name: 'ห้องครัวหลวงพระราชาสายกิน (Royal Feast Kitchen)', popPercent: '1%', wealth: 'very_high', desc: 'ห้องครัววังหลวงที่มีกลิ่นขาแกะอบน้ำผึ้งและขนมอบลอยฟุ้งตลอด 24 ชั่วโมง' },
  { name: 'ตู้คีบตุ๊กตาร้างในดันเจี้ยน (Abandoned Claw Machine Dungeon)', popPercent: '1%', wealth: 'destitute', desc: 'ซากโบราณวัตถุจากมิติอื่นที่มีขาเหล็กห้อยต่องแต่งและมีเหรียญทองหล่นใต้เครื่อง' },
  { name: 'เกาะแมวส้มอ้วนไร้กังวล (Fat Orange Cat Isle)', popPercent: '1%', wealth: 'medium', desc: 'เกาะกลางทะเลสาบที่แมวส้มนอนเกลือกกลิ้งรับแสงแดดอย่างมีความสุข ไร้ศัตรูใดๆ' },
  { name: 'ป่าไผ่ซ่อนดาบซามูไรพเนจร (Whispering Bamboo Forest)', popPercent: '2%', wealth: 'medium', desc: 'ดงไผ่เขียวขจีที่ใบไผ่พลิ้วไหวตามสายลม คลาคล่ำไปด้วยนักดาบพเนจรฝึกกระบวนท่า' },
  { name: 'ยิมเพาะกายกล้ามโตแห่งกิลด์นักรบ (Iron Muscle Warrior Gym)', popPercent: '2%', wealth: 'medium', desc: 'โรงฝึกที่มีเสียงยกดัมเบลล์หินและเสียงเบ่งกล้ามตะโกนคำรามลั่นทุ่ง' },
  { name: 'ร้านราเม็งข้างทางมิติแยก (Dimensional Ramen Stall)', popPercent: '1%', wealth: 'low', desc: 'เพิงไม้เล็กๆ ริมทางที่มีกลิ่นน้ำซุปกระดูกหมูเข้มข้น และมีนินจาชุดส้มแวะมากินบ่อยๆ' },
  { name: 'สุสานรถบรรทุกข้ามมิติ (Isekai Truck Graveyard)', popPercent: '1%', wealth: 'low', desc: 'ลานกว้างที่เต็มไปด้วยซากรถ 10 ล้อจากต่างโลก มีประกายไฟแปล๊บๆ ชวนขนลุก' },
  { name: 'หอสมุดต้องห้ามแห่งหนังสือบินได้ (Forbidden Flying Tome Library)', popPercent: '2%', wealth: 'high', desc: 'ห้องสมุดยักษ์ที่หนังสือเวทมนตร์กางปีกบินว่อนตามเพดานสูง' },
  { name: 'น้ำตกศักดิ์สิทธิ์เทพธิดาน้ำตาคลอ (Goddess Weeping Waterfall)', popPercent: '1%', wealth: 'high', desc: 'น้ำตกสีฟ้าครามที่หยดน้ำมีกลิ่นไวน์ผลไม้ และมีเสียงเทพธิดาร้องไห้งอแงแว่วมา' },
  { name: 'ถ้ำลาวาสะเก็ดดาวตก (Meteorite Magma Cavern)', popPercent: '1%', wealth: 'medium', desc: 'ถ้ำใต้พิภพที่หินอุกกาบาตลอยเรืองแสงอยู่เหนือธารลาวาร้อนระอุ' }
];

export const SOCIAL_CLASSES = [
  {
    id: 'destitute',
    name: 'ยาจกไร้แผ่นดิน (หนี้สินล้นพ้นตัว)',
    chance: 35,
    familyFund: 0,
    debt: 50,
    desc: 'พ่อแม่เป็นทาสติดหนี้ ไม่มีเงินสนับสนุน ต้องดิ้นรนหาเลี้ยงชีพเองตั้งแต่วัยเยาว์'
  },
  {
    id: 'poor_peasant',
    name: 'ชาวบ้านหาเช้ากินค่ำ (ยากจน)',
    chance: 35,
    familyFund: 20,
    debt: 0,
    desc: 'พอมีข้าวก้นบาตรประทังชีวิต มีเงินก้นถุงสนับสนุนการเรียนเพียงเล็กน้อย'
  },
  {
    id: 'middle_craftsman',
    name: 'ช่างฝีมือ / พ่อค้ากิลด์ (ปานกลาง)',
    chance: 20,
    familyFund: 80,
    debt: 0,
    desc: 'ครอบครัวพอมีอันจะกิน สามารถส่งเสียให้เข้าโรงเรียนฝึกวิชาชีพหรือซื้ออุปกรณ์ได้'
  },
  {
    id: 'wealthy_knight',
    name: 'ตระกูลอัศวินเจ้าที่ดิน (ร่ำรวย)',
    chance: 8,
    familyFund: 250,
    debt: 0,
    desc: 'มีเกียรติและมรดกที่ดิน มีงบส่งเสียเข้าสถาบันวิชาการชั้นสูง'
  },
  {
    id: 'noble_lord',
    name: 'ขุนนางศักดินาชั้นสูง (ไฮโซต่างโลก)',
    chance: 2,
    familyFund: 800,
    debt: 0,
    desc: 'ชนชั้นปกครอง มีเงินทองมหาศาลและอิทธิพลค้ำฟ้า'
  }
];

export const RELIGIONS = [
  'ลัทธิบูชาเปลวไฟศักดิ์สิทธิ์ (Flame Keepers)',
  'ภาคีดวงจันทร์มืด (Dark Moon Order)',
  'ลัทธิสุริยุปราคาบรรพชน (Eclipse Cult)',
  'ไม่เลื่อมใสใคร (เชื่อมั่นในพลังตนเอง)'
];

export const GENDERS = ['ชาย', 'หญิง'];
