import React, { useRef, useEffect, useState } from 'react';

// แมปปิ้งรูปภาพฉากศิลปะระดับมาสเตอร์เวิร์ก (Master Dark Fantasy Concept Art)
export const SCENE_IMAGE_MAP = {
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

  // ป้ายรถม้าหน้าดันเจี้ยน & ตู้หยอดเหรียญเวทมนตร์
  vending: '/scenes/vending.svg',
  vending_machine: '/scenes/vending.svg',
  machine: '/scenes/vending.svg',

  // ป่าไผ่ซ่อนดาบซามูไรพเนจร & แท่นศิลาศักดิ์สิทธิ์
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
  meme_face_chill: { tag: 'รอยยิ้มพริ้มแห่งผู้รู้แจ้งมัลติเวิร์ส', weather: 'sparks', mood: 'สบายใจเฉิบ หลับตาไม่แคร์โลก' }
};

// 4x4 Bayer Dithering Matrix สำหรับสไตล์ Aseprite เรโทรแท้
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

export default function SceneViewport({
  sceneId = 'famine',
  age = 0,
  pixelMode = '16bit', // '16bit' (Aseprite chunky), '32bit' (Enhanced pixel), 'hd' (High Def)
  height = 240
}) {
  const canvasRef = useRef(null);
  const [loadedImage, setLoadedImage] = useState(null);
  const [imgError, setImgError] = useState(false);

  // Fallback อัจฉริยะตามช่วงอายุ
  const getSmartFallbackScene = (currentAge) => {
    if (currentAge <= 2) return 'famine';
    if (currentAge <= 6) return 'alley';
    if (currentAge <= 12) return 'market';
    if (currentAge <= 17) return 'tavern';
    if (currentAge <= 35) return 'battlefield';
    return 'bonfire';
  };

  const resolvedSceneKey = SCENE_IMAGE_MAP[sceneId] ? sceneId : getSmartFallbackScene(age);
  const imageSrc = SCENE_IMAGE_MAP[resolvedSceneKey] || SCENE_IMAGE_MAP.famine;
  const theme = SCENE_THEMES[resolvedSceneKey] || SCENE_THEMES.famine;

  // โหลดรูปภาพฉากจริง (Master Illustration)
  useEffect(() => {
    let isMounted = true;
    setImgError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      if (isMounted) {
        setLoadedImage(img);
        setImgError(false);
      }
    };

    img.onerror = () => {
      if (isMounted) {
        console.warn(`[SceneViewport] Could not load image: ${imageSrc}, falling back to procedural pixel art.`);
        setLoadedImage(null);
        setImgError(true);
      }
    };

    return () => {
      isMounted = false;
    };
  }, [imageSrc]);

  // Real-time Canvas Rendering Loop (Pixel Shader + Weather)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let frameId;
    let tick = 0;

    // ระบบ Particles แบบ 16-Bit Chunky Pixels
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: 0.8 + Math.random() * 2.2,
      size: Math.random() < 0.7 ? 2 : 3, // Chunky square pixel blocks (2px or 3px)
      alpha: Math.random() * 0.7 + 0.3
    }));

    // Offscreen Canvas สำหรับประมวลผล Pixelation
    const pixelWidth = pixelMode === '16bit' ? 240 : pixelMode === '32bit' ? 360 : 640;
    const pixelHeight = pixelMode === '16bit' ? 135 : pixelMode === '32bit' ? 202 : 360;

    const offCanvas = document.createElement('canvas');
    offCanvas.width = pixelWidth;
    offCanvas.height = pixelHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (loadedImage && !imgError) {
        // ==========================================
        // 1. ถ่ายทอดภาพจริงผ่าน Aseprite 16-Bit Pixel Shader
        // ==========================================
        if (pixelMode === '16bit' || pixelMode === '32bit') {
          // วาดภาพขนาดเล็กลงบน Offscreen Canvas
          offCtx.imageSmoothingEnabled = false;
          offCtx.drawImage(loadedImage, 0, 0, pixelWidth, pixelHeight);

          // แปลงสี (Color Quantization & Bayer Dithering)
          if (pixelMode === '16bit') {
            try {
              const imgData = offCtx.getImageData(0, 0, pixelWidth, pixelHeight);
              const data = imgData.data;
              const levels = 24; // 24 discrete color steps per channel (16-bit SNES style)
              const step = 255 / (levels - 1);

              for (let y = 0; y < pixelHeight; y++) {
                for (let x = 0; x < pixelWidth; x++) {
                  const idx = (y * pixelWidth + x) * 4;
                  const dither = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * (step * 0.75);

                  data[idx] = Math.min(255, Math.max(0, Math.round((data[idx] + dither) / step) * step));
                  data[idx + 1] = Math.min(255, Math.max(0, Math.round((data[idx + 1] + dither) / step) * step));
                  data[idx + 2] = Math.min(255, Math.max(0, Math.round((data[idx + 2] + dither) / step) * step));
                }
              }
              offCtx.putImageData(imgData, 0, 0);
            } catch (e) {
              // กรณี cross-origin taint ให้ข้ามการ dithering
            }
          }

          // สเกลขยายขึ้นสู่หน้าจอด้วย Nearest-Neighbor (Crisp Chunky Pixel Art)
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
        } else {
          // โหมด HD
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
        }
      } else {
        // ==========================================
        // 2. Procedural Fallback: ฉากพิกเซลอาร์ตทิวเขาและกระท่อมแบบละเอียดสูง
        // ==========================================
        // ท้องฟ้ายามค่ำคืนดาร์กแฟนตาซี
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#060913');
        skyGrad.addColorStop(0.6, '#131d33');
        skyGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ดวงดาวระยิบระยับแบบพิกเซล
        for (let s = 0; s < 35; s++) {
          const starX = (s * 37 + Math.sin(tick * 0.02 + s) * 2) % canvas.width;
          const starY = (s * 19) % (canvas.height * 0.6);
          const starBrightness = (Math.sin(tick * 0.05 + s) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${starBrightness * 0.8 + 0.2})`;
          ctx.fillRect(Math.floor(starX), Math.floor(starY), 2, 2);
        }

        // พระจันทร์เสี้ยวสีทองอร่าม
        const mx = canvas.width - 70, my = 40;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(mx, my, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#060913';
        ctx.beginPath();
        ctx.arc(mx - 6, my - 3, 16, 0, Math.PI * 2);
        ctx.fill();

        // ทิวเขาพิกเซลชั้นไกล (Silhouette Mountains)
        ctx.fillStyle = '#0c1526';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.65);
        ctx.lineTo(80, canvas.height * 0.45);
        ctx.lineTo(170, canvas.height * 0.62);
        ctx.lineTo(260, canvas.height * 0.42);
        ctx.lineTo(360, canvas.height * 0.65);
        ctx.lineTo(440, canvas.height * 0.48);
        ctx.lineTo(canvas.width, canvas.height * 0.65);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.fill();

        // ป่าสนพิกเซลชั้นกลาง
        ctx.fillStyle = '#0f172a';
        for (let t = 0; t < 18; t++) {
          const treeX = t * 28 + (t % 3) * 6;
          const treeY = canvas.height * 0.62 + (t % 4) * 5;
          ctx.fillRect(treeX, treeY, 14, 45);
          ctx.fillRect(treeX - 4, treeY + 12, 22, 12);
          ctx.fillRect(treeX - 8, treeY + 24, 30, 14);
        }

        // พื้นดินหิมะและกระท่อมฟางอบอุ่น
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);

        // กระท่อมอบอุ่น
        const hx = 60, hy = canvas.height * 0.62;
        ctx.fillStyle = '#451a03'; // ผนังไม้
        ctx.fillRect(hx, hy, 60, 45);
        ctx.fillStyle = '#78350f'; // หลังคาฟาง
        ctx.beginPath();
        ctx.moveTo(hx - 8, hy);
        ctx.lineTo(hx + 30, hy - 22);
        ctx.lineTo(hx + 68, hy);
        ctx.fill();

        // หน้าต่างส่องแสงสีส้มอบอุ่น
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(hx + 12, hy + 12, 14, 14);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.beginPath();
        ctx.arc(hx + 19, hy + 19, 25, 0, Math.PI * 2);
        ctx.fill();

        // ปล่องควันและไอน้ำควันไฟ
        ctx.fillStyle = '#334155';
        ctx.fillRect(hx + 42, hy - 16, 8, 16);
        for (let sm = 0; sm < 4; sm++) {
          const smX = hx + 46 + Math.sin(tick * 0.08 + sm) * 6;
          const smY = hy - 22 - ((tick * 0.8 + sm * 15) % 40);
          ctx.fillStyle = 'rgba(203, 213, 225, 0.4)';
          ctx.fillRect(Math.floor(smX), Math.floor(smY), 4, 4);
        }
      }

      // ==========================================
      // 3. Dynamic 16-Bit Chunky Weather Particles
      // ==========================================
      const weather = theme.weather;

      if (weather === 'snow') {
        // หิมะตกแบบเม็ดพิกเซล 16-bit
        ctx.fillStyle = '#ffffff';
        particles.forEach(p => {
          ctx.globalAlpha = p.alpha;
          // วาดพิกเซลสี่เหลี่ยมคมชัด ไม่ใช้เส้นกลมมน
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

          p.y += p.speedY * 0.85;
          p.x += Math.sin(tick * 0.02 + p.y) * 0.5;
          if (p.y > canvas.height) {
            p.y = -4;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (weather === 'embers' || weather === 'sparks') {
        // สะเก็ดไฟ / เถ้าถ่านลอยละล่อง
        particles.forEach((p, idx) => {
          ctx.globalAlpha = p.alpha * (0.6 + Math.sin(tick * 0.1 + idx) * 0.4);
          ctx.fillStyle = idx % 2 === 0 ? '#f97316' : '#ef4444';
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);

          p.y -= p.speedY * 0.9;
          p.x += Math.sin(tick * 0.03 + p.y) * 0.8;
          if (p.y < 0) {
            p.y = canvas.height + 4;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (weather === 'rain') {
        // สายฝนเฉียงคมแบบ 16-bit
        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = 0.65;
        particles.forEach(p => {
          ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1.5, 6);
          p.y += p.speedY * 3.0;
          p.x -= 1.2;
          if (p.y > canvas.height) {
            p.y = -6;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (weather === 'mist') {
        // ไอหมอกพวยพุ่งเหนือผิวน้ำ/พื้นดิน
        ctx.fillStyle = 'rgba(226, 232, 240, 0.12)';
        for (let m = 0; m < 6; m++) {
          const mx = ((tick * 0.5 + m * 80) % (canvas.width + 120)) - 60;
          const my = canvas.height * 0.68 + Math.sin(tick * 0.04 + m) * 8;
          ctx.fillRect(Math.floor(mx), Math.floor(my), 80, 24);
        }
      }

      ctx.globalAlpha = 1.0;
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [loadedImage, imgError, sceneId, theme.weather, pixelMode]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        backgroundColor: '#05070c',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1.5px solid #283149',
        boxShadow: 'inset 0 0 25px rgba(0,0,0,0.8), 0 6px 18px rgba(0,0,0,0.6)',
        marginBottom: '14px'
      }}
    >
      {/* 1. Main Aseprite Pixel Art Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={height}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated', // CSS crisp-edges for retro look
          objectFit: 'cover'
        }}
      />

      {/* 2. Retro CRT Scanlines Effect Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none'
        }}
      />

      {/* 3. Dark Fantasy Edge Vignette */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.05) 50%, rgba(5,7,12,0.75) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* 4. Top Scene Location & Atmosphere Badge */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '12px',
          backgroundColor: 'rgba(9, 13, 22, 0.9)',
          border: '1px solid #c99738',
          borderRadius: '4px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
        }}
      >
        <span style={{ fontSize: '12px', color: '#ffd166', fontWeight: 'bold' }}>
          📍 {theme.tag}
        </span>
        <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
          ({theme.mood})
        </span>
      </div>

      {/* 5. Age & Style Tag Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          border: '1px solid #334155',
          borderRadius: '4px',
          padding: '2px 8px',
          fontSize: '11px',
          color: '#cbd5e1',
          display: 'flex',
          gap: '6px',
          alignItems: 'center'
        }}
      >
        <span style={{ color: '#38bdf8' }}>
          {pixelMode === '16bit' ? '👾 16-Bit Pixel' : pixelMode === '32bit' ? '✨ 32-Bit Pixel' : '🖼️ HD Art'}
        </span>
        <span style={{ color: '#64748b' }}>|</span>
        <span>วัย {age} ปี</span>
      </div>

      {/* Corner Filigree Retro Borders */}
      <div style={{ position: 'absolute', top: '4px', left: '4px', width: '8px', height: '8px', borderTop: '2px solid #c99738', borderLeft: '2px solid #c99738', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderTop: '2px solid #c99738', borderRight: '2px solid #c99738', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '4px', left: '4px', width: '8px', height: '8px', borderBottom: '2px solid #c99738', borderLeft: '2px solid #c99738', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '8px', height: '8px', borderBottom: '2px solid #c99738', borderRight: '2px solid #c99738', pointerEvents: 'none' }} />
    </div>
  );
}
