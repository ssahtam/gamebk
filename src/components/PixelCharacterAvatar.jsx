import React, { useRef, useEffect } from 'react';

// ตัววาดรูปพอร์ตเทรตตัวละครสไตล์พิกเซลเรโทร 16/32-bit (Dark Fantasy & Meme Pixel Art Avatars)
// ครอบคลุมครบทุกเผ่าพันธุ์ 42 เผ่า ทั้งสิ่งของ มอนสเตอร์ อันเดด สัตว์อสูร และมนุษย์
export default function PixelCharacterAvatar({ raceId = 'slime', size = 80, animated = true, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // พื้นหลังกรอบพิกเซลดาร์กแฟนตาซี
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w / 2);
      bgGrad.addColorStop(0, '#151d30');
      bgGrad.addColorStop(1, '#070a12');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // เส้นตารางพิกเซลจางๆ
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < w; i += 8) {
        ctx.fillRect(i, 0, 1, h);
        ctx.fillRect(0, i, w, 1);
      }

      // วาดตัวละครตาม raceId หรือ bodyType
      const rId = (raceId || '').toLowerCase();

      // 1. สไลม์ (Slime)
      if (rId.includes('slime') || rId === 'guild_soap') {
        const isSoap = rId === 'guild_soap';
        const bounce = Math.sin(tick * 0.1) * 3;
        const color = isSoap ? '#f472b6' : '#38bdf8';
        const darkColor = isSoap ? '#db2777' : '#0284c7';

        // ตัวสไลม์หยุ่นๆ
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10 + bounce, 26, 20 - bounce, 0, 0, Math.PI * 2);
        ctx.fill();

        // เงาด้านล่าง
        ctx.fillStyle = darkColor;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 16 + bounce, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // ไฮไลต์ประกายแสง
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 14, cy + bounce, 6, 4);
        ctx.fillRect(cx - 18, cy + 5 + bounce, 4, 3);

        // ตาบ้องแบ๊ว
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 8, cy + 6 + bounce, 4, 6);
        ctx.fillRect(cx + 6, cy + 6 + bounce, 4, 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 8, cy + 6 + bounce, 2, 2);
        ctx.fillRect(cx + 6, cy + 6 + bounce, 2, 2);

        // ฟองสบู่ / ละอองมานา
        if (isSoap) {
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.beginPath();
          ctx.arc(cx + 18, cy - 8 + bounce, 5, 0, Math.PI * 2);
          ctx.arc(cx - 16, cy - 12 + bounce, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 2. โครงกระดูก (Skeleton)
      else if (rId.includes('skeleton')) {
        const nod = Math.sin(tick * 0.08) * 2;
        // กะโหลกสีขาวนวล
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 18, cy - 16 + nod, 36, 28);
        ctx.fillRect(cx - 12, cy + 12 + nod, 24, 12); // ขากรรไกร

        // เบ้าตากลวงโบ๋
        ctx.fillStyle = '#090d16';
        ctx.fillRect(cx - 14, cy - 6 + nod, 10, 10);
        ctx.fillRect(cx + 4, cy - 6 + nod, 10, 10);

        // ไอวิญญาณสีฟ้าเรืองแสงในเบ้าตา
        ctx.fillStyle = tick % 16 > 8 ? '#67e8f9' : '#38bdf8';
        ctx.fillRect(cx - 10, cy - 3 + nod, 4, 4);
        ctx.fillRect(cx + 8, cy - 3 + nod, 4, 4);

        // ฟันกระดูก
        ctx.fillStyle = '#cbd5e1';
        for (let t = 0; t < 4; t++) {
          ctx.fillRect(cx - 10 + t * 6, cy + 14 + nod, 4, 6);
        }
        // รอยแตกบนกะโหลก
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx + 6, cy - 14 + nod, 2, 6);
        ctx.fillRect(cx + 8, cy - 8 + nod, 3, 2);
      }
      // 3. เอลฟ์แห่งพงไพร (Elf - High/Wood Elf 32-Bit Pixel Art)
      else if (rId.includes('elf')) {
        const nod = Math.sin(tick * 0.05) * 1.5;
        // ผมยาวสลวยสีบลอนด์ทองด้านหลัง
        ctx.fillStyle = '#d97706';
        ctx.fillRect(cx - 22, cy - 18 + nod, 44, 42);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(cx - 20, cy - 16 + nod, 40, 40);

        // หูเอลฟ์แหลมยาวสองข้าง
        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy - 4 + nod);
        ctx.lineTo(cx - 30, cy - 16 + nod);
        ctx.lineTo(cx - 15, cy + 4 + nod);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 15, cy - 4 + nod);
        ctx.lineTo(cx + 30, cy - 16 + nod);
        ctx.lineTo(cx + 15, cy + 4 + nod);
        ctx.fill();
        // ตุ้มหูทองคำ
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 22, cy - 2 + nod, 3, 4);
        ctx.fillRect(cx + 19, cy - 2 + nod, 3, 4);

        // ใบหน้าเอลฟ์เรียวงาม
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(cx - 14, cy - 14 + nod, 28, 24);
        ctx.fillRect(cx - 10, cy + 10 + nod, 20, 6); // คางเรียว

        // มงกุฎรัดเกล้าเงิน (Silver Circlet)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 15, cy - 12 + nod, 30, 4);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cx - 14, cy - 11 + nod, 28, 2);
        // อัญมณีมรกตส่องแสงตรงกลาง
        const gemGlow = tick % 20 > 10 ? '#34d399' : '#10b981';
        ctx.fillStyle = gemGlow;
        ctx.fillRect(cx - 3, cy - 14 + nod, 6, 6);

        // ผมหน้าม้าสไตล์เอลฟ์
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 14, cy - 16 + nod, 28, 6);
        ctx.fillRect(cx - 16, cy - 10 + nod, 4, 18);
        ctx.fillRect(cx + 12, cy - 10 + nod, 4, 18);

        // ดวงตาสีมรกตเป็นประกาย
        ctx.fillStyle = '#065f46';
        ctx.fillRect(cx - 10, cy - 3 + nod, 6, 6);
        ctx.fillRect(cx + 4, cy - 3 + nod, 6, 6);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(cx - 9, cy - 2 + nod, 4, 4);
        ctx.fillRect(cx + 5, cy - 2 + nod, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 9, cy - 2 + nod, 2, 2);
        ctx.fillRect(cx + 5, cy - 2 + nod, 2, 2);

        // เสื้อคลุมสีเขียวป่ามรกตขลิบทอง
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(cx - 18, cy + 15 + nod, 36, 22);
        ctx.fillStyle = '#047857';
        ctx.fillRect(cx - 14, cy + 15 + nod, 28, 22);
        ctx.fillStyle = '#fbbf24'; // ขลิบทอง
        ctx.fillRect(cx - 2, cy + 15 + nod, 4, 22);

        // ละอองมานาแห่งป่าเวทมนตร์
        for (let i = 0; i < 3; i++) {
          const spX = cx + Math.sin(tick * 0.08 + i * 2) * 28;
          const spY = cy - 10 + Math.cos(tick * 0.06 + i * 2) * 20;
          ctx.fillStyle = '#6ee7b7';
          ctx.fillRect(spX, spY, 2, 2);
        }
      }
      // 4. ออร์กนักรบคลั่ง (Orc Warchief 32-Bit Pixel Art)
      else if (rId.includes('orc')) {
        const nod = Math.sin(tick * 0.07) * 2;
        // แผ่นหลังและเกราะไหล่เหล็กหนา
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 26, cy + 12 + nod, 52, 26);
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx - 28, cy + 10 + nod, 12, 12); // สนับไหล่ซ้าย
        ctx.fillRect(cx + 16, cy + 10 + nod, 12, 12); // สนับไหล่ขวา
        // หนามแหลมบนเกราะไหล่
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 24, cy + 6 + nod, 4, 5);
        ctx.fillRect(cx + 20, cy + 6 + nod, 4, 5);

        // ใบหน้าและคอออร์กกำยำสีเขียวขี้ม้า
        ctx.fillStyle = '#365314';
        ctx.fillRect(cx - 18, cy - 16 + nod, 36, 32);
        ctx.fillStyle = '#4d7c0f';
        ctx.fillRect(cx - 16, cy - 14 + nod, 32, 28);

        // ผมทรงโมฮอว์กมัดจุกนักรบ
        ctx.fillStyle = '#090d16';
        ctx.fillRect(cx - 4, cy - 26 + nod, 8, 14);
        ctx.fillStyle = '#e2e8f0'; // แหวนกระดูกรัดจุกผม
        ctx.fillRect(cx - 5, cy - 22 + nod, 10, 3);

        // ลายสักสีแดงแห่งสงคราม (War Paint)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 14, cy - 4 + nod, 8, 3);
        ctx.fillRect(cx + 6, cy - 4 + nod, 8, 3);
        ctx.fillRect(cx - 2, cy - 12 + nod, 4, 8);

        // ดวงตาสีส้มแดงดุดัน
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(cx - 12, cy - 6 + nod, 6, 5);
        ctx.fillRect(cx + 6, cy - 6 + nod, 6, 5);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(cx - 10, cy - 5 + nod, 3, 3);
        ctx.fillRect(cx + 7, cy - 5 + nod, 3, 3);

        // ขากรรไกรล่างและเขี้ยวยักษ์สีงาช้างชี้ขึ้น
        ctx.fillStyle = '#3f6212';
        ctx.fillRect(cx - 14, cy + 6 + nod, 28, 10);
        ctx.fillStyle = '#fef08a'; // เขี้ยวซ้าย
        ctx.fillRect(cx - 12, cy + 2 + nod, 5, 8);
        ctx.fillRect(cx - 11, cy - 2 + nod, 3, 4);
        ctx.fillStyle = '#fef08a'; // เขี้ยวขวา
        ctx.fillRect(cx + 7, cy + 2 + nod, 5, 8);
        ctx.fillRect(cx + 8, cy - 2 + nod, 3, 4);

        // รอยแผลเป็นบากที่แก้ม
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(cx - 14, cy - 10 + nod, 2, 8);
      }
      // 5. จอมปีศาจแห่งอเวจี (Demon Lord 32-Bit Pixel Art)
      else if (rId.includes('demon')) {
        const nod = Math.sin(tick * 0.06) * 1.8;
        // ปีกค้างคาวปีศาจกางสยายด้านหลัง
        const wingFlap = Math.sin(tick * 0.12) * 3;
        ctx.fillStyle = '#1e1b4b';
        // ปีกซ้าย
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy + 6 + nod);
        ctx.lineTo(cx - 36, cy - 18 + nod + wingFlap);
        ctx.lineTo(cx - 34, cy + 4 + nod);
        ctx.lineTo(cx - 20, cy + 16 + nod);
        ctx.fill();
        // ปีกขวา
        ctx.beginPath();
        ctx.moveTo(cx + 14, cy + 6 + nod);
        ctx.lineTo(cx + 36, cy - 18 + nod + wingFlap);
        ctx.lineTo(cx + 34, cy + 4 + nod);
        ctx.lineTo(cx + 20, cy + 16 + nod);
        ctx.fill();

        // เขาสัตว์อสูรสีดำทมิฬโค้งตระหง่าน
        ctx.fillStyle = '#0f172a';
        // เขาซ้าย
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy - 16 + nod);
        ctx.lineTo(cx - 24, cy - 30 + nod);
        ctx.lineTo(cx - 16, cy - 32 + nod);
        ctx.lineTo(cx - 6, cy - 16 + nod);
        ctx.fill();
        // เขาขวา
        ctx.beginPath();
        ctx.moveTo(cx + 10, cy - 16 + nod);
        ctx.lineTo(cx + 24, cy - 30 + nod);
        ctx.lineTo(cx + 16, cy - 32 + nod);
        ctx.lineTo(cx + 6, cy - 16 + nod);
        ctx.fill();
        // ปลายเขาเรืองแสงสีชาด
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 22, cy - 32 + nod, 4, 4);
        ctx.fillRect(cx + 18, cy - 32 + nod, 4, 4);

        // ใบหน้าปีศาจสีม่วงเลือดนก
        ctx.fillStyle = '#4c0519';
        ctx.fillRect(cx - 15, cy - 16 + nod, 30, 26);
        ctx.fillStyle = '#881337';
        ctx.fillRect(cx - 13, cy - 14 + nod, 26, 22);

        // ผมทรงแหลมสีดำม่วง
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(cx - 14, cy - 20 + nod, 28, 6);
        ctx.fillRect(cx - 16, cy - 14 + nod, 4, 16);
        ctx.fillRect(cx + 12, cy - 14 + nod, 4, 16);

        // ดวงตาปีศาจสีแดงเพลิงส่องแสงวาวโรจน์
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 10, cy - 5 + nod, 6, 6);
        ctx.fillRect(cx + 4, cy - 5 + nod, 6, 6);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(cx - 9, cy - 4 + nod, 4, 4);
        ctx.fillRect(cx + 5, cy - 4 + nod, 4, 4);
        ctx.fillStyle = '#fef08a'; // แสงไฟในดวงตา
        ctx.fillRect(cx - 8, cy - 3 + nod, 2, 2);
        ctx.fillRect(cx + 6, cy - 3 + nod, 2, 2);

        // รอยยิ้มเขี้ยวแหลมปีศาจ
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 6, cy + 4 + nod, 2, 3);
        ctx.fillRect(cx + 4, cy + 4 + nod, 2, 3);

        // เกราะแห่งความมืดและแกนวิญญาณสีม่วง
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 16, cy + 12 + nod, 32, 24);
        // แกนพลังงานอเวจีเต้นเป็นจังหวะ
        const pulse = Math.sin(tick * 0.15) * 2;
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(cx, cy + 20 + nod, 5 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // สะเก็ดเพลิงทมิฬลอยขึ้น
        for (let i = 0; i < 3; i++) {
          const fx = cx + Math.sin(tick * 0.1 + i * 2) * 16;
          const fy = cy + 24 - ((tick * 1.5 + i * 15) % 45);
          ctx.fillStyle = '#f43f5e';
          ctx.fillRect(fx, fy, 2, 2);
        }
      }
      // 6. วีรบุรุษต่างโลก / มนุษย์ (Human Isekai Hero 32-Bit Pixel Art)
      else if (rId.includes('human')) {
        const nod = Math.sin(tick * 0.06) * 1.5;
        // ดาบเหล็กกล้าสะพายหลัง
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx + 12, cy - 28 + nod, 4, 18); // ใบดาบชี้ขึ้น
        ctx.fillStyle = '#f59e0b'; // ด้ามดาบทอง
        ctx.fillRect(cx + 10, cy - 12 + nod, 8, 3);
        ctx.fillStyle = '#78350f'; // ด้ามจับ
        ctx.fillRect(cx + 13, cy - 9 + nod, 2, 6);

        // ผ้าคลุมสีแดงสดสะบัดด้านหลัง
        const capeWave = Math.sin(tick * 0.1) * 2;
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(cx - 20, cy + 8 + nod, 40, 28);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 18, cy + 10 + nod + capeWave, 36, 26);

        // ทรงผมอนิเมะสีน้ำตาลชี้ฟู (Spiky Anime Hair)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 16, cy - 22 + nod, 32, 16);
        ctx.fillRect(cx - 18, cy - 16 + nod, 6, 18);
        ctx.fillRect(cx + 12, cy - 16 + nod, 6, 18);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 14, cy - 20 + nod, 28, 12);
        // ปอยผมด้านหน้า
        ctx.fillRect(cx - 8, cy - 14 + nod, 4, 6);
        ctx.fillRect(cx + 2, cy - 14 + nod, 4, 6);

        // ผ้าคาดหัวสีแดงของผู้กล้าพร้อมตราเงิน
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(cx - 15, cy - 14 + nod, 30, 4);
        ctx.fillStyle = '#e2e8f0'; // ตราเงิน
        ctx.fillRect(cx - 3, cy - 14 + nod, 6, 4);

        // ใบหน้าและผิวพรรณสดใส
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 13, cy - 10 + nod, 26, 20);
        ctx.fillRect(cx - 9, cy + 10 + nod, 18, 4);

        // ดวงตามุ่งมั่นสีฟ้าครามของผู้กล้า (Determined Blue Eyes)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 9, cy - 4 + nod, 5, 5);
        ctx.fillRect(cx + 4, cy - 4 + nod, 5, 5);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 8, cy - 3 + nod, 3, 3);
        ctx.fillRect(cx + 5, cy - 3 + nod, 3, 3);
        ctx.fillStyle = '#ffffff'; // ประกายตา
        ctx.fillRect(cx - 8, cy - 3 + nod, 1, 1);
        ctx.fillRect(cx + 5, cy - 3 + nod, 1, 1);

        // รอยยิ้มมั่นใจ
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx - 2, cy + 4 + nod, 4, 2);

        // เกราะอกอัศวินขลิบน้ำเงินและทอง
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 15, cy + 12 + nod, 30, 24);
        ctx.fillStyle = '#64748b'; // สนับอกเหล็ก
        ctx.fillRect(cx - 11, cy + 14 + nod, 22, 20);
        ctx.fillStyle = '#f59e0b'; // หัวเข็มขัดทอง
        ctx.fillRect(cx - 4, cy + 22 + nod, 8, 5);
      }
      // 3. กอบลิน (Goblin)
      else if (rId.includes('goblin')) {
        // หูแหลมยาวสีเขียว
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(cx - 24, cy - 8);
        ctx.lineTo(cx - 38, cy - 18);
        ctx.lineTo(cx - 22, cy + 4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 24, cy - 8);
        ctx.lineTo(cx + 38, cy - 18);
        ctx.lineTo(cx + 22, cy + 4);
        ctx.fill();

        // หัวกอบลิน
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(cx - 20, cy - 14, 40, 32);

        // จมูกโตแหลม
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(cx - 4, cy - 2, 8, 12);

        // ตาสีเหลืองเจ้าเล่ห์
        ctx.fillStyle = '#fde047';
        ctx.fillRect(cx - 14, cy - 6, 8, 6);
        ctx.fillRect(cx + 6, cy - 6, 8, 6);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 10, cy - 5, 4, 4);
        ctx.fillRect(cx + 10, cy - 5, 4, 4);

        // เขี้ยวล่างยื่นขึ้น
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 10, cy + 14, 4, 6);
        ctx.fillRect(cx + 6, cy + 14, 4, 6);
      }
      // 4. ดาบศักดิ์สิทธิ์มีชีวิต (Sentient Sword)
      else if (rId.includes('sword')) {
        const floatY = Math.sin(tick * 0.08) * 3;
        // ใบมีดสีเงินเรืองแสง
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(cx - 5, cy - 32 + floatY, 10, 48);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(cx, cy - 32 + floatY, 5, 48); // สันดาบ

        // ปลายแหลม
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy - 32 + floatY);
        ctx.lineTo(cx, cy - 40 + floatY);
        ctx.lineTo(cx + 5, cy - 32 + floatY);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();

        // กระบังดาบสีทอง (Crossguard)
        ctx.fillStyle = '#eab308';
        ctx.fillRect(cx - 20, cy + 16 + floatY, 40, 8);

        // อัญมณีตาวิเศษสีแดงกลางกระบังดาบ
        ctx.fillStyle = tick % 20 > 10 ? '#ef4444' : '#dc2626';
        ctx.beginPath();
        ctx.arc(cx, cy + 20 + floatY, 5, 0, Math.PI * 2);
        ctx.fill();

        // ด้ามจับและหัวดาบ
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 3, cy + 24 + floatY, 6, 14);
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(cx, cy + 38 + floatY, 5, 0, Math.PI * 2);
        ctx.fill();

        // ละอองเวทมนตร์รอบดาบ
        for (let i = 0; i < 4; i++) {
          const sparkY = (cy - 20 + ((tick * 1.5 + i * 20) % 50)) + floatY;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(cx - 12 + (i % 2) * 24, sparkY, 3, 3);
        }
      }
      // 5. แมงมุมในเขาวงกต (Spider)
      else if (rId.includes('spider')) {
        const legWave = Math.sin(tick * 0.12) * 2;
        // ลำตัวและก้นแมงมุม
        ctx.fillStyle = '#4c1d95';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 8, 16, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#311042';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 8, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // ขา 8 ข้าง
        ctx.strokeStyle = '#581c87';
        ctx.lineWidth = 3;
        for (let side = -1; side <= 1; side += 2) {
          for (let l = 0; l < 4; l++) {
            ctx.beginPath();
            ctx.moveTo(cx + side * 8, cy - 4 + l * 4);
            ctx.lineTo(cx + side * (26 + l * 3), cy - 10 + l * 8 + (l % 2 === 0 ? legWave : -legWave));
            ctx.stroke();
          }
        }

        // ตาแมงมุมสีแดง 4 คู่
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 6, cy - 10, 3, 3);
        ctx.fillRect(cx + 3, cy - 10, 3, 3);
        ctx.fillRect(cx - 9, cy - 8, 2, 2);
        ctx.fillRect(cx + 7, cy - 8, 2, 2);
        ctx.fillRect(cx - 4, cy - 6, 2, 2);
        ctx.fillRect(cx + 2, cy - 6, 2, 2);
      }
      // 6. ตู้กดน้ำอัตโนมัติ (Vending Machine)
      else if (rId.includes('vending') || rId.includes('machine')) {
        // ตัวตู้สีแดงสด
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 24, cy - 32, 48, 64);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(cx + 20, cy - 32, 4, 64);

        // หน้าต่างกระจกมองเห็นกระป๋อง
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 20, cy - 28, 40, 30);

        // กระป๋องน้ำหลากสีในตู้
        const colors = ['#60a5fa', '#4ade80', '#fbbf24', '#f43f5e'];
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 4; col++) {
            ctx.fillStyle = colors[(row + col) % colors.length];
            ctx.fillRect(cx - 18 + col * 9, cy - 25 + row * 13, 6, 9);
          }
        }

        // ป้ายไฟและจอหยอดเหรียญ
        ctx.fillStyle = tick % 30 > 15 ? '#fef08a' : '#22c55e';
        ctx.fillRect(cx - 18, cy + 6, 22, 6);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(cx + 8, cy + 6, 8, 2); // ช่องหยอดเหรียญ

        // ช่องรับกระป๋องด้านล่าง
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 16, cy + 18, 32, 10);
      }
      // 7. กล่องสมบัติมิมิก (Mimic Chest)
      else if (rId.includes('mimic')) {
        const bite = Math.sin(tick * 0.1) * 3;
        // ฐานหีบไม้
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 25, cy + 2, 50, 24);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 25, cy + 2, 50, 24);

        // ฝาหีบอ้าปาก
        ctx.fillStyle = '#92400e';
        ctx.fillRect(cx - 25, cy - 20 - bite, 50, 16);
        ctx.strokeRect(cx - 25, cy - 20 - bite, 50, 16);

        // ภายในปากสีม่วงเข้ม
        ctx.fillStyle = '#4a044e';
        ctx.fillRect(cx - 22, cy - 4 - bite, 44, 8 + bite);

        // ฟันแหลมคมสีขาว
        ctx.fillStyle = '#f8fafc';
        for (let t = 0; t < 6; t++) {
          ctx.fillRect(cx - 20 + t * 7, cy - 4 - bite, 4, 5);
          ctx.fillRect(cx - 20 + t * 7, cy + 2, 4, 5);
        }

        // ลิ้นสีม่วงแลบออกมา
        ctx.fillStyle = '#c026d3';
        ctx.fillRect(cx - 6, cy + 3, 12, 10 + bite);

        // ตาสีเหลืองเจ้าเล่ห์สองข้าง
        ctx.fillStyle = '#fde047';
        ctx.fillRect(cx - 15, cy - 14 - bite, 5, 5);
        ctx.fillRect(cx + 10, cy - 14 - bite, 5, 5);
      }
      // 8. แมวส้มอ้วน (Orange Cat)
      else if (rId.includes('cat') || rId === 'orange_cat') {
        const purr = Math.sin(tick * 0.1) * 2;
        // ตัวแมวสีส้มกลมปุ๊ก
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 8 + purr, 26, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // ลายพาดสีส้มเข้ม
        ctx.fillStyle = '#c2410c';
        ctx.fillRect(cx - 12, cy - 4 + purr, 24, 3);
        ctx.fillRect(cx - 16, cy + 4 + purr, 32, 3);

        // หูแมวสามเหลี่ยม
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 10 + purr);
        ctx.lineTo(cx - 26, cy - 26 + purr);
        ctx.lineTo(cx - 8, cy - 14 + purr);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 18, cy - 10 + purr);
        ctx.lineTo(cx + 26, cy - 26 + purr);
        ctx.lineTo(cx + 8, cy - 14 + purr);
        ctx.fill();

        // ตาแมวกลมโตสีเขียวมรกต
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(cx - 9, cy - 2 + purr, 5, 0, Math.PI * 2);
        ctx.arc(cx + 9, cy - 2 + purr, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 10, cy - 4 + purr, 2, 5);
        ctx.fillRect(cx + 8, cy - 4 + purr, 2, 5);

        // จมูกชมพูและหนวด
        ctx.fillStyle = '#fda4af';
        ctx.fillRect(cx - 2, cy + 4 + purr, 4, 3);
        ctx.strokeStyle = '#fdba74';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 22, cy + 5 + purr, 12, 1);
        ctx.strokeRect(cx + 10, cy + 5 + purr, 12, 1);
      }
      // 9. หมาป่าคาบดาบ / คอร์กี้ (Wolf / Corgi)
      else if (rId.includes('wolf') || rId.includes('corgi')) {
        const isCorgi = rId.includes('corgi');
        const bob = Math.sin(tick * 0.1) * 2;
        const furColor = isCorgi ? '#f59e0b' : '#64748b';
        const darkFur = isCorgi ? '#d97706' : '#475569';

        // หัวหมา
        ctx.fillStyle = furColor;
        ctx.beginPath();
        ctx.ellipse(cx, cy + bob, 22, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // หูตั้งใหญ่
        ctx.fillStyle = darkFur;
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 12 + bob);
        ctx.lineTo(cx - 22, cy - 30 + bob);
        ctx.lineTo(cx - 4, cy - 14 + bob);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + 14, cy - 12 + bob);
        ctx.lineTo(cx + 22, cy - 30 + bob);
        ctx.lineTo(cx + 4, cy - 14 + bob);
        ctx.fill();

        // ขนแผงคอสีขาว
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 12 + bob, 16, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // ดาบในปาก (ถ้าเป็นหมาป่า)
        if (!isCorgi) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(cx - 30, cy + 6 + bob, 60, 4);
          ctx.fillStyle = '#eab308';
          ctx.fillRect(cx - 8, cy + 4 + bob, 16, 8);
        } else {
          // จมูกดำและลิ้นห้อยของคอร์กี้
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(cx - 4, cy + 4 + bob, 8, 5);
          ctx.fillStyle = '#fb7185';
          ctx.fillRect(cx - 2, cy + 9 + bob, 5, 6);
        }

        // ตาเป็นประกาย
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 10, cy - 3 + bob, 4, 4);
        ctx.fillRect(cx + 6, cy - 3 + bob, 4, 4);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 10, cy - 3 + bob, 2, 2);
        ctx.fillRect(cx + 6, cy - 3 + bob, 2, 2);
      }
      // 10. รถบรรทุกอิเซไก (Truck-kun) หรือ รูมบ้า (Roomba)
      else if (rId.includes('truck') || rId === 'roomba') {
        const isRoomba = rId === 'roomba';
        if (isRoomba) {
          // หุ่นยนต์ดูดฝุ่นกลมดำ
          const rot = tick * 0.05;
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(cx, cy, 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 3;
          ctx.stroke();

          // ปุ่มและไฟสถานะ
          ctx.fillStyle = tick % 20 > 10 ? '#ef4444' : '#22c55e';
          ctx.beginPath();
          ctx.arc(cx, cy, 7, 0, Math.PI * 2);
          ctx.fill();

          // ธงอิเซไกปักบนรูมบ้า
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(cx + 6, cy - 25, 2, 25);
          ctx.fillStyle = '#e11d48';
          ctx.fillRect(cx + 8, cy - 25, 14, 10);
        } else {
          // หน้ารถบรรทุกอิเซไก (Hino-kun)
          const shake = Math.sin(tick * 0.2) * 1.5;
          // กระจังหน้าและกันชน
          ctx.fillStyle = '#3b82f6';
          ctx.fillRect(cx - 26, cy - 24 + shake, 52, 48);

          // กระจกหน้าพร้อมเงาสะท้อนท้องฟ้า
          ctx.fillStyle = '#67e8f9';
          ctx.fillRect(cx - 20, cy - 20 + shake, 40, 20);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx - 16, cy - 18 + shake, 8, 4);

          // ตะแกรงระบายความร้อน
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(cx - 18, cy + 4 + shake, 36, 12);
          ctx.fillStyle = '#94a3b8';
          for (let g = 0; g < 4; g++) {
            ctx.fillRect(cx - 14 + g * 8, cy + 6 + shake, 4, 8);
          }

          // ไฟหน้าส่องแสงสีเหลืองจ้า
          ctx.fillStyle = '#fde047';
          ctx.fillRect(cx - 24, cy + 14 + shake, 8, 6);
          ctx.fillRect(cx + 16, cy + 14 + shake, 8, 6);

          // ล้อคู่ด้านข้าง
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(cx - 30, cy + 10 + shake, 6, 16);
          ctx.fillRect(cx + 24, cy + 10 + shake, 6, 16);
        }
      }
      // 11. มนุษย์เงินเดือนโอเวอร์เวิร์ก (Salaryman)
      else if (rId.includes('salaryman')) {
        const slump = Math.sin(tick * 0.05) * 1.5;
        // หน้าตาเหนื่อยล้า ขอบตาดำ
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(cx - 14, cy - 22 + slump, 28, 22);

        // ผมยุ่งเหยิงสีดำ
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cx - 16, cy - 28 + slump, 32, 10);

        // ตาปรือและขอบตาดำคล้ำ
        ctx.fillStyle = '#78716c';
        ctx.fillRect(cx - 12, cy - 14 + slump, 8, 6);
        ctx.fillRect(cx + 4, cy - 14 + slump, 8, 6);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 10, cy - 13 + slump, 4, 2);
        ctx.fillRect(cx + 6, cy - 13 + slump, 4, 2);

        // เสื้อเชิ้ตขาวและเนกไทสีแดงเบี้ยว
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cx - 18, cy + slump, 36, 30);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 3, cy + 2 + slump, 6, 18); // เนกไท
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy + 20 + slump);
        ctx.lineTo(cx, cy + 26 + slump);
        ctx.lineTo(cx + 3, cy + 20 + slump);
        ctx.fill();

        // กระเป๋าเอกสารสีน้ำตาลในมือ
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx + 14, cy + 12 + slump, 16, 14);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(cx + 20, cy + 10 + slump, 4, 2); // หูหิ้ว

        // ละอองเวทมนตร์สีฟ้าเริ่มห้อมล้อม (โดนวาปข้ามมิติ!)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.fillRect(cx - 24, cy - 10 + Math.sin(tick * 0.2) * 5, 4, 4);
        ctx.fillRect(cx + 26, cy + 5 + Math.cos(tick * 0.2) * 5, 4, 4);
      }
      // 12. นักบวชสาวติดหนี้ (Debt Priestess / Aqua)
      else if (rId.includes('debt') || rId.includes('priestess')) {
        const tearWave = Math.sin(tick * 0.2) * 4;
        // ผมสีฟ้าอควายาวสยาย
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx - 22, cy - 28, 44, 46);

        // ใบหน้า
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 14, cy - 18, 28, 24);

        // ตาโตและสายน้ำตาพุ่งออกมาสองข้าง
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 10, cy - 10, 6, 6);
        ctx.fillRect(cx + 4, cy - 10, 6, 6);
        // น้ำตาพุ่งทะลัก
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(cx - 14, cy - 6, 6, 26 + tearWave);
        ctx.fillRect(cx + 8, cy - 6, 6, 26 - tearWave);

        // เครื่องประดับหัวโมเลกุลน้ำสีฟ้า
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(cx, cy - 30, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 32, 3, 0, Math.PI * 2);
        ctx.fill();

        // ชุดนักบวชสีน้ำเงินขาว
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(cx - 18, cy + 8, 36, 24);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cx - 8, cy + 8, 16, 24);
      }
      // 13. ผู้ถูกตีตรา (The Branded One / Guts)
      else if (rId.includes('branded') || rId === 'branded_one') {
        // ผมสั้นชี้สีดำและผ้าคลุมทมิฬ
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 16, cy - 26, 32, 14);

        // ใบหน้าคมเข้มมีแผลเป็น
        ctx.fillStyle = '#d4a373';
        ctx.fillRect(cx - 14, cy - 14, 28, 26);
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(cx - 4, cy - 10, 2, 16); // แผลเป็นผ่าหน้า

        // ปิดตาขวาข้างหนึ่ง
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx + 3, cy - 6, 6, 3);
        // ตาซ้ายคมกริบ
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 9, cy - 7, 5, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 7, cy - 6, 3, 3);

        // ตราประทับแห่งการสังเวยเรืองแสงสีเลือดตรงคอ
        ctx.fillStyle = tick % 16 > 8 ? '#ef4444' : '#991b1b';
        ctx.fillRect(cx + 8, cy + 6, 5, 8);

        // ดาบยักษ์ฟันมังกรสะพายหลัง
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 26, cy - 34, 12, 54);
      }
      // 14. คาปิบาร่าแช่น้ำร้อน (Capybara)
      else if (rId.includes('capybara')) {
        const floatY = Math.sin(tick * 0.08) * 2;
        // หัวและหน้าทื่อๆ สีน้ำตาลทอง
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx - 24, cy - 16 + floatY, 48, 34);

        // หูเล็กๆ สองข้าง
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 22, cy - 22 + floatY, 8, 6);
        ctx.fillRect(cx + 14, cy - 22 + floatY, 8, 6);

        // จมูกทู่ๆ ปากนิ่งสงบ
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 6, cy + 6 + floatY, 12, 8);

        // ตาหรี่ฟินหลับสบาย
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 16, cy - 4 + floatY, 7, 2);
        ctx.fillRect(cx + 9, cy - 4 + floatY, 7, 2);

        // ส้มยูสุสีเหลืองวางบนหัว
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(cx, cy - 22 + floatY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#15803d';
        ctx.fillRect(cx - 1, cy - 30 + floatY, 3, 3); // ใบส้ม

        // ผิวน้ำร้อนออนเซ็น
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(cx - 30, cy + 18 + floatY, 60, 14);
      }
      // 15. เป็ดยางสีเหลือง / ไก่คุกโกะ (Rubber Duck / Cucco)
      else if (rId.includes('duck') || rId.includes('cucco') || rId.includes('chicken')) {
        const isDuck = rId.includes('duck');
        const color = isDuck ? '#facc15' : '#f8fafc';
        const bob = Math.sin(tick * 0.1) * 2;

        // ตัวเป็ด/ไก่
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 6 + bob, 22, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - 8, cy - 10 + bob, 14, 0, Math.PI * 2);
        ctx.fill();

        // จะงอยปากสีส้ม
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(cx - 24, cy - 10 + bob, 12, 6);

        // หงอนไก่แดง (ถ้าเป็นคุกโกะ)
        if (!isDuck) {
          ctx.fillStyle = '#dc2626';
          ctx.fillRect(cx - 10, cy - 28 + bob, 8, 8);
          // ออร่าความโกรธ
          ctx.fillStyle = '#ef4444';
          ctx.fillText('💢', cx + 12, cy - 16 + bob);
        }

        // ตาจุดดำ
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 12, cy - 12 + bob, 4, 4);
      }
      // 16. นักรบหัวหอม (Onion Knight)
      else if (rId.includes('onion')) {
        const rot = Math.sin(tick * 0.08) * 1.5;
        // หมวกเกราะทรงหอมหัวใหญ่
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(cx, cy - 4 + rot, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy - 30 + rot);
        ctx.lineTo(cx, cy - 38 + rot);
        ctx.lineTo(cx + 4, cy - 30 + rot);
        ctx.fill();

        // ช่องมองสีดำแคบๆ ตรงกลางหมวก
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 16, cy - 6 + rot, 32, 4);

        // เกราะลำตัวป่องกลม
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 22 + rot, 24, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // 17. ก้อนทองคำนำโชค / อึทองคำ (Golden Poop / Gold Ore)
      else if (rId.includes('gold') || rId === 'golden_poop') {
        // ก้อนทองคำเกลียวประกายดาว
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 14, 26, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 20, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 10, 13, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 3, cy - 20, 6, 8);

        // ประกายวิ้งๆ RPG (Sparkles)
        const spTick = (tick * 0.1);
        ctx.fillStyle = '#ffffff';
        for (let s = 0; s < 3; s++) {
          const sx = cx + Math.cos(spTick + s * 2) * 25;
          const sy = cy + Math.sin(spTick + s * 2) * 20;
          ctx.fillRect(sx - 2, sy, 4, 1);
          ctx.fillRect(sx, sy - 2, 1, 4);
        }
      }
      // 18. กุ้งล็อบสเตอร์สไนเปอร์ (Sniper Lobster)
      else if (rId.includes('lobster')) {
        // กุ้งล็อบสเตอร์สีแดงเข้ม
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.ellipse(cx, cy, 22, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // ก้ามยักษ์ทรงพลังเล็งเป้า
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 34, cy - 18, 16, 24);
        ctx.fillRect(cx + 18, cy - 18, 16, 24);

        // ตาโปนและเลเซอร์เล็งเป้าสีฟ้าพุ่งออกมา
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 8, cy - 14, 4, 4);
        ctx.fillRect(cx + 4, cy - 14, 4, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx, cy - 24, 2, 10); // เลเซอร์
      }
      // 19. ขวดยาฟื้นพลังมีชีวิต (Sentient Potion)
      else if (rId.includes('potion')) {
        const float = Math.sin(tick * 0.08) * 3;
        // ปากขวดแก้วและจุกไม้ก๊อก
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx - 8, cy - 30 + float, 16, 8);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - 6, cy - 22 + float, 12, 8);

        // ตัวขวดแก้วกลมบรรจุยาแดง
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.beginPath();
        ctx.arc(cx, cy + 4 + float, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // ตาและรอยยิ้มบนขวด
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 10, cy + float, 5, 5);
        ctx.fillRect(cx + 5, cy + float, 5, 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 8, cy + 2 + float, 3, 3);
        ctx.fillRect(cx + 7, cy + 2 + float, 3, 3);

        // ฟองอากาศลอยขึ้นในขวด
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(cx - 4, cy + 12 + float - ((tick * 0.5) % 15), 3, 3);
      }
      // 20. วิญญาณเร่ร่อน (Ghost / Lost Wisp)
      else if (rId.includes('ghost') || rId.includes('wisp')) {
        const floatY = Math.sin(tick * 0.1) * 4;
        // ดวงไฟสีฟ้าครามโปร่งแสง
        const wispGrad = ctx.createRadialGradient(cx, cy + floatY, 4, cx, cy + floatY, 26);
        wispGrad.addColorStop(0, '#ffffff');
        wispGrad.addColorStop(0.3, '#38bdf8');
        wispGrad.addColorStop(0.7, '#0284c7');
        wispGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = wispGrad;
        ctx.beginPath();
        ctx.arc(cx, cy + floatY, 26, 0, Math.PI * 2);
        ctx.fill();

        // ตาไฟวิญญาณ
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 8, cy - 4 + floatY, 4, 6);
        ctx.fillRect(cx + 4, cy - 4 + floatY, 4, 6);
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(cx - 8, cy - 2 + floatY, 2, 2);
        ctx.fillRect(cx + 4, cy - 2 + floatY, 2, 2);

        // ละอองวิญญาณลอยตามหลัง
        for (let i = 0; i < 4; i++) {
          const trailY = cy + 14 + floatY + (i * 5);
          const trailX = cx + Math.sin(tick * 0.2 + i) * 6;
          ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.fillRect(trailX, trailY, 4 - i, 4 - i);
        }
      }
      // 21. ลอร์ดแห่งเถ้าถ่าน (Ashen Lord / Dark Knight)
      else if (rId.includes('ashen') || rId.includes('lord')) {
        const breathe = Math.sin(tick * 0.06) * 1.5;
        // เกราะหมวกเหล็กทมิฬ
        ctx.fillStyle = '#1e1b2e';
        ctx.fillRect(cx - 18, cy - 22 + breathe, 36, 26);
        ctx.fillStyle = '#0f0e17';
        ctx.fillRect(cx - 14, cy - 8 + breathe, 28, 14);

        // รอยแยกตาสีแดงเพลิง
        ctx.fillStyle = tick % 14 > 7 ? '#ef4444' : '#f97316';
        ctx.fillRect(cx - 12, cy - 4 + breathe, 10, 3);
        ctx.fillRect(cx + 2, cy - 4 + breathe, 10, 3);

        // เขาหมวกเกราะมังกร
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(cx - 20, cy - 28 + breathe, 5, 12);
        ctx.fillRect(cx + 15, cy - 28 + breathe, 5, 12);

        // ผ้าคลุมไหล่ขาดวิ่น
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(cx - 24, cy + 8 + breathe, 48, 22);
        // ละอองเถ้าถ่านลอย
        ctx.fillStyle = '#fca5a5';
        ctx.fillRect(cx + Math.sin(tick * 0.1) * 16, cy - 18 - ((tick * 0.8) % 30), 2, 2);
      }
      // 22. นกพิราบสื่อสารสายข่าว (Pigeon Spy)
      else if (rId.includes('pigeon') || rId.includes('bird')) {
        const flap = Math.sin(tick * 0.2) * 3;
        // ลำตัวนกสีเทา
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // หัวนกเงาวับสีเขียวม่วง
        ctx.fillStyle = '#0d9488';
        ctx.beginPath();
        ctx.arc(cx - 10, cy - 8, 11, 0, Math.PI * 2);
        ctx.fill();

        // จะงอยปากสีส้ม
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy - 7);
        ctx.lineTo(cx - 28, cy - 5);
        ctx.lineTo(cx - 20, cy - 3);
        ctx.fill();

        // ตานกกลมโต
        ctx.fillStyle = '#facc15';
        ctx.fillRect(cx - 14, cy - 11, 5, 5);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 13, cy - 10, 3, 3);

        // ปีกขยับ
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 4, cy - 2 + flap, 18, 10);

        // ม้วนกระดาษจดหมายลับผูกที่ขา
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(cx - 2, cy + 16, 8, 4);
      }
      // 23. หลุมดำจิ๋ว (Black Hole Anomaly)
      else if (rId.includes('black_hole') || rId.includes('anomaly')) {
        const pulse = Math.sin(tick * 0.15) * 4;
        // วงแหวนบิดเบือนมิติรอบนอก
        const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 32 + pulse);
        auraGrad.addColorStop(0, '#000000');
        auraGrad.addColorStop(0.5, '#7c3aed');
        auraGrad.addColorStop(0.8, '#ec4899');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 32 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // ใจกลางหลุมดำมืดสนิท
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(cx, cy, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.stroke();

        // สสารที่โดนดูดเป็นเส้นหมุนวน
        for (let i = 0; i < 4; i++) {
          const ang = tick * 0.08 + (i * Math.PI / 2);
          const px = cx + Math.cos(ang) * (24);
          const py = cy + Math.sin(ang) * (24);
          ctx.fillStyle = '#fde047';
          ctx.fillRect(px, py, 3, 3);
        }
      }
      // 24. เผ่าพันธุ์มนุษย์ / อัศวิน / อื่นๆ ทั่วไป (Humanoid Default 32-Bit)
      else {
        const nod = Math.sin(tick * 0.06) * 1.5;
        // ดาบเหล็กกล้าสะพายหลัง
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx + 12, cy - 28 + nod, 4, 18);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx + 10, cy - 12 + nod, 8, 3);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx + 13, cy - 9 + nod, 2, 6);

        // เสื้อคลุมสีแดงสด
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(cx - 18, cy + 10 + nod, 36, 26);

        // ทรงผมอนิเมะสีน้ำตาล
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 16, cy - 22 + nod, 32, 16);
        ctx.fillRect(cx - 18, cy - 16 + nod, 6, 18);
        ctx.fillRect(cx + 12, cy - 16 + nod, 6, 18);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 14, cy - 20 + nod, 28, 12);

        // ผ้าคาดหัวสีแดงของผู้กล้า
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(cx - 15, cy - 14 + nod, 30, 4);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(cx - 3, cy - 14 + nod, 6, 4);

        // หัวและใบหน้า
        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(cx - 13, cy - 10 + nod, 26, 20);

        // ดวงตามุ่งมั่นสีฟ้า
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 9, cy - 4 + nod, 5, 5);
        ctx.fillRect(cx + 4, cy - 4 + nod, 5, 5);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 8, cy - 3 + nod, 3, 3);
        ctx.fillRect(cx + 5, cy - 3 + nod, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 8, cy - 3 + nod, 1, 1);
        ctx.fillRect(cx + 5, cy - 3 + nod, 1, 1);

        // เสื้อเกราะ / สนับอกเหล็ก
        ctx.fillStyle = '#334155';
        ctx.fillRect(cx - 15, cy + 12 + nod, 30, 24);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(cx - 11, cy + 14 + nod, 22, 20);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 4, cy + 22 + nod, 8, 5);
      }

      if (animated) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [raceId, animated]);

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1.5px solid #334155',
        backgroundColor: '#070a12',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
