// ========================================================
// 🎮 game.js - ระบบการเล่น, จับเวลา, คะแนน โกง
// ========================================================

const fullWordList = [
      "พี่", "เพื่อน", "ดาว", "บิน", "โสม", "แสง", "โต", "ใหญ่", "น้อย", "แผนก","ห้อง","ใจ","ลอย","กลุ่ม","กาก","ร้าน","ซ่อม","ผอม", "อ้วน", "อ้อน", "แดง", "เพลง", "หอม", 
      "ต่อ", "เติม", "ห้าม", "เช็ค", "เชือด", "แอดมิน", "สมาชิก", "พร้อม",  "ไม่ถูก", "ไม่ผิด", "ถูก", "ผิด", "ขอโทษ", "ท้อ", "ว่าง", 
      "พ่อ", "เครียด", "ป่วย", "หวย", "หมา", "เวียน", "งับ", 
      "มอง", "ดาว", "แฉ", "ไพลิน", "ปอย", "มด", "พยายาม", "เบื่อ", "ลูกค้า", 
      "ใจ", "หัว", "กำ", "หมัด", "ชก", "เหี้ย", "เสือก", "วันนี้", "จน", "นรก", "มาร", "ดอก", "กบ", "แมว", "ก้อย", "กล้าม", "บล็อค", 
      "โกง", "หมี", "หมวย", "สาว", "หนุ่ม", "พูด", "ลาบ", "แตก", "หน่อ", "หล่อ", "ทราบ", "ทราย", "บาง", "ไก่", "ปลา", "ต้ม", "ห้อง", 
      "งง", "ปลอม", "แท้", "จริง", "สิว", "ลิง", "สิบ", "เก้า", "หก", "บอง","โอน","จ่าย","สาย","โดน","ปรับ","หลับ","เงิน","ทอน", "จอง", 
      "ห้า", "สี่", "สาม", "สอง", "สิง", "ควาย", "จ้า", "ข้า", "พอต", "ยา", "กัน", "เนื้อ", "ลำ", "ทอง", "ส้ม", "เหลือง", "เขียว", "เกย์", "พิมพ์", "ท้อง", "เกม", "จำ", 
      "จำนำ", "พระ", 
      "ฉัน", "เธอ", "เวร", "เพื่อ", "สัส", "ควย", "สี", "อ้อ", "หมอ", "หม้อ", "พอ", "ท่อ", "ชวน", "ทวี", "ตัดสิน", "ชอบ", "โคม", "แจ้ง", 
      "เฉพาะ", "งาน", "ตรง", "ตุลาคม", "ขึ้น", "ขวาง", "ย้อย", "ช้า", "คูณ", "ดง", "กระดูก", "เท้า", "ซิ", "เทียบ", "ชีพ", "ชิง", "จับ", 
      "ชั่ว", "ใกล้", "ด้วย", "ตรวจ", "ทำไม", "กล้า", "ชัวร์", "คลาย", "ธรรม", "กลาง", "ตัด", "นั่ง", "จำนวน", "จริต", "ทั้ง", "หิน", "แอด", 
      "ใต้", "เดือด", "แดด", "ตาม", "จึง", "ต้น", "ช้าง", "ทัน", "เชื้อ", "เดี๋ยว", "คับ", "กล่าว", "เที่ยง", "โต๊ะ", "คลุม", "ตรา", "เหล็ก", "จ้อง", 
      "ค่า", "ทหาร", "แจ้ง", "ขัง", "ขาด", "เจริญ", "ข้าง", "กว้าง", "ดับ", "ชาติ", "ไกล", "แกะ", "ดวง", "ขอบ", "แถว", "งาม", "ขา", "ลำ", 
      "ใคร", "ตน", "ค่ำ", "ชา", "เตียง", "แจง", "ดำ", "ทิ้ง", "ขยาย", "จัก", "ด้าน", "ถวาย", "คอ", "การ", "ธง", "ช่อง", "เกิน", "พร้อม", 
      "ดื่ม", "ติด", "ต้อง", "ช่าง", "ทอง", "จบ", "คณะ", "ทิศ", "เขา", "จด", "ตู้", "เคย", "คะ", "ถนน", "ควร", "กิน", "กี่", "ไฟ", "รายงาน", 
      "ขัด", "กว่า", "ช่วย", "ซ้ำ", "นอน", "ดิน", "จง", "กาย", "กรุง", "ครอง","เหยด", "เห่า", "ไหล", "ล้าน", "เหมียว", "บอก", "หยอก", "เนย", "อ้วก", "แลก", "ซึ่ง", "โชค", "เด็ก", "เช่น", "ขี่", "คอย", 
      "ขน", "คดี", "ไข", "โดย", "ขัน", "จาก", "แทน", "กา", "ที", "ทาย", "จิต", "เครื่อง", "ข้าม", "เกาะ", "จม", "บาป","บุญ", "ท่อม", "มั่ว",  
      "เดือน", "ซ้าย", "เงิน", "คน", "ตำ", "กู้", "ท้าย", "ชน", "ก่อ", "ดี", "เตือน", "เงียบ", "เขต", "โทษ", "ความ", "ข้าว", "ชัก", "จัง", "ขณะ", 
      "จันทร์", "ขวด", "เที่ยว", "จีน", "จะ", "ใช่", "ทอด", "ตั้ง", "ครู", "ตัว", "ตก", "ถอย", "เช้า", "นม", "ก็", "ทรง", "ทา", "เบียร์", "แม่น", 
      "ธาตุ", "ชนะ", "ก้อน", "โง่", "แก้", "คำ", "ตาย", "นัก", "ค้า", "ชี้", "คืน", "แตก", "ได้", "ต่ำ", "งอก", "จ่าย", "ค้น", "พื้น", "หลัง", 
      "ค่อย", "ขาย", "ขีด", "กลม", "ชัด", "เดิน", "ไทย", "คือ", "ชีวิต", "ข่าว", "ญาติ", "ทุกข์", "ชนิด", "ทะเล", "เชื่อ", "เท", "ใช้", "เกิด", 
      "ขนาด", "กรรม", "ถ้า", "เดิม", "ชื่อ", "แต่ง", "ทุ่ง", "ทุก", "ชั้น", "ง่าย", "ขับ", "ตลอด", "นอก", "ตลาด", "จังหวัด", "ถาม", "ตา", 
      "เถียง", "แก้ว", "เจ็ด", "เจ้า", "กรม", "ถั่ว", "กลับ", "เท็จ", "กะ", "เคียง", "ไถ", "ใคร่", "จัด", "เล็บ", "โทรม","หวี", "กล้วย", "เหล้า",  
      "กาชาด", "ตอน", "กาง", "ทูต", "กำไร", "ดุจ", "แจ่ม", "เก้าอี้", "ฉบับ", "เข้า", "จดหมาย", "ซ่อน", "ทั้งปวง", "ทัพ", "โกรธ", "ตื่น", 
      "เท่า", "เกี่ยว", "ต้อน", "เก่า", "เดี่ยว", "โจทย์", "ของ", "ครอบครัว", "ชั่วโมง", "กลัว", "เต็ม", "ลุง", "ป้า", "น้า", "อา", "ปู่", "ย่า", "ตา", "ยาย",       
      "กิน", "ทรัพย์", "ร่วง", "จักร", "กฎหมาย", "ขอ", "เคลื่อน", "ดำเนิน", "นคร", "ครั้ง", "แข็ง", "ซื้อ", "เกรง", "แตงโม", "หน้า", "หลบ", 
      "คู", "ทับ", "ชำนาญ", "ทาน", "ไข่", "คุณ", "ทีเดียว", "ข้าศึก", "ฉะนั้น", "แต่", "ชม", "กำหนด", "ค่ะ", "ตะเกียง", "เม็ด", "หลับ", 
      "เกียจ", "ทั่ว", "ทาง", "กสิกรรม", "ธุระ", "กร", "ฉะนี้", "เขียน", "เถิด", "เกี่ยว", "คิด", "นก", "กรรมการ", "ขด", "ดำริ", "ขนาด", "เต็ม", 
      "ขาว", "ธรรมดา", "งู", "หนู",  "เก็บ", "แขก", "จ้าง", "ตึก", "น้อง", "เข้าหู", "เกือบ", "ทน", "กุมาร", "ทดลอง", "ทาบ", "ข้าง", "ครับ", 
      "เจาะ", "แก", "ข้าพเจ้า", "ทูน", "ครึ่ง", "ทำ", "กอบ", "นอกจาก", "เท่าไร", "ชาว", "กระด้าง", "ไข้", "ชนวน", "เว็บ", "ระดับ", "หน่อย", 
      "จำพวก", "ใด", "จูบ", "ไต่", "ต้าน", "เรา", "เทียม", "ขอรับ", "ไฉน", "ตระกูล", "ดัง", "ชาย", "ก่อน", "ทำลาย", "เสี้ยน", "บริษัท", 
      "เทวดา", "ดู", "ตรัส", "คลอง", "ตะวัน", "ท่าน", "ถ้อย", "กระทำ", "แก่", "ข้าราชการ", "ทวีป", "เกล้า", "ตอบ", "เจ็บ", "ร้อง", "ต่อย", 
      "เสร็จ", "เพชร", "แก้ว", "หมา", "ลิง", "หมก", "ลาบ", "ถวาย", "รำ", "ชก", "ต่อย", "แฟน", "พลาน", "ถ้วย", "หอย", "บี้", "ขยี้", "บด"
     ];

let words = [], currentIdx = 0, timeLeft = 60, isStarted = false, timer = null;
let correctCount = 0, wrongCount = 0, totalTypeAttempts = 0, totalChars = 0, correctChars = 0;
let rankAtStart = ""; 
let keyTimings = []; 
let lastKeyTime = 0;

window.init = function() {
    try {
        words = [...fullWordList].sort(() => Math.random() - 0.5);
        
        let wordContainer = document.getElementById('wordContainer');
        if(!wordContainer) return;

        wordContainer.innerHTML = words.map((w, i) => {
            let trap = `<b style="width:0; height:0; overflow:hidden; display:inline-block; position:absolute; user-select:none;">_BOT</b>`;
            return `<span class="word" id="w-${i}" style="margin: 0 14px 12px 0; display: inline-block;">${w}${trap}</span>`;
        }).join(' '); 

        currentIdx = 0; timeLeft = 60; isStarted = false; correctCount = 0;
        wrongCount = 0; totalTypeAttempts = 0; totalChars = 0; correctChars = 0;
        keyTimings = []; 
        lastKeyTime = 0;

        let userInput = document.getElementById('userInput');
        if(userInput) {
            userInput.value = ''; 
            userInput.style.color = '';
            userInput.disabled = false;
        }
        
        let timerDisplay = document.getElementById('timer');
        if(timerDisplay) timerDisplay.innerText = 60; 

        document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none'); 
        wordContainer.style.transform = `translateY(0)`; 
        window.updateFocus();

        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
        if (window.currentUser && db[window.currentUser]) {
            rankAtStart = (typeof window.getRankInfo === 'function') ? window.getRankInfo(db[window.currentUser].exp || 0).current.name : "ทหารฝึก";
        }
    } catch(err) {
        console.error("Game Init Error:", err);
    }
}

window.updateFocus = function() {
    document.querySelectorAll('.word.current').forEach(el => el.classList.remove('current', 'is-correct', 'is-wrong'));
    const active = document.getElementById(`w-${currentIdx}`);
    if(active) { 
        active.classList.add('current'); 
        let container = document.getElementById('wordContainer');
        if(container && active.offsetTop > 40) {
            container.style.transform = `translateY(-${active.offsetTop - 10}px)`; 
        }
    }
}

// ⌨️ 4. ตัวจับการพิมพ์
document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    
    if (userInput) {
        userInput.addEventListener('input', (e) => {
            if (e.isTrusted === false) { e.preventDefault(); return; }

            let now = Date.now();
            if (lastKeyTime > 0) { keyTimings.push(now - lastKeyTime); }
            lastKeyTime = now;

            if(!isStarted && e.target.value.length > 0) {
                isStarted = true; 
                timer = setInterval(() => { 
                    timeLeft--; 
                    let tEl = document.getElementById('timer');
                    if(tEl) tEl.innerText = timeLeft; 
                    if(timeLeft <= 0) window.endGame(); 
                }, 1000);
            }
            
            const val = e.target.value; 
            const target = words[currentIdx]; 
            const activeWord = document.getElementById(`w-${currentIdx}`);
            
            if (activeWord && target) {
                if (val.length > 0) {
                    if (target.startsWith(val)) { 
                        e.target.style.color = '#10b981'; activeWord.classList.add('is-correct'); activeWord.classList.remove('is-wrong');
                    } else { 
                        e.target.style.color = '#ef4444'; activeWord.classList.add('is-wrong'); activeWord.classList.remove('is-correct'); 
                    }
                } else { 
                    e.target.style.color = ''; activeWord.classList.remove('is-correct', 'is-wrong'); 
                }
            }
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.isTrusted === false) { e.preventDefault(); alert('หยุดใช้สคริปต์ปลอมคีย์บอร์ดเดี๋ยวนี้นะไอ้กาก!'); return; }

            if(e.key === ' ' || e.key === 'Enter') {
                e.preventDefault(); 
                const val = userInput.value.trim(); 
                if(!val) return;
                
                totalTypeAttempts++; 
                const target = words[currentIdx]; 
                if(target) totalChars += target.length; 
                
                const activeWord = document.getElementById(`w-${currentIdx}`);
                if(activeWord) activeWord.classList.remove('is-correct', 'is-wrong');
                
                if(target && val === target) { 
                    if(activeWord) activeWord.classList.add('correct'); correctCount++; correctChars += target.length; 
                } else { 
                    if(activeWord) activeWord.classList.add('wrong'); wrongCount++; 
                }
                
                currentIdx++; 
                userInput.value = ''; 
                userInput.style.color = ''; 
                window.updateFocus();
            }
        });

        // 🛡️ ป้องกันการก็อปปี้/วาง
        userInput.addEventListener('paste', e => { e.preventDefault(); alert('จะก็อปวางหรอไอ้สัส พิมพ์เองดิวะ!'); });
        userInput.addEventListener('copy', e => e.preventDefault());
        userInput.addEventListener('cut', e => e.preventDefault());
        userInput.addEventListener('drop', e => e.preventDefault());
    }
});

window.endGame = async function() {
    clearInterval(timer); 
    let userInput = document.getElementById('userInput');
    if(userInput) userInput.disabled = true;

    if (correctCount > 180) { alert("ใช้โปรแกรมหรอออ กูริบคะแนน!"); correctCount = 0; wrongCount = 999; }
    if (keyTimings && keyTimings.length > 20) {
        let sum = keyTimings.reduce((a, b) => a + b, 0);
        let avg = sum / keyTimings.length;
        let variance = keyTimings.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / keyTimings.length;
        if (variance < 20) { alert("พิมพ์เนียนเกินไปแล้วไอ้บอท! โดนแบนคะแนน!"); correctCount = 0; wrongCount = 999; }
    }

    const finalAcc = totalChars > 0 ? Math.round((correctChars/totalChars)*100) : 0; 
    let dbLocal = JSON.parse(localStorage.getItem('typingDB_Final')) || {};
    if (!dbLocal[window.currentUser]) dbLocal[window.currentUser] = { best: 0, exp: 0, history: [] };
    
    let expMultiplier = Number(dbLocal[window.currentUser].multiplier) || 10; 
    let gainedExp = correctCount * expMultiplier;
    
    if (!dbLocal[window.currentUser].history) dbLocal[window.currentUser].history = []; 
    dbLocal[window.currentUser].history.unshift({ wpm: correctCount, acc: finalAcc, date: new Date().toLocaleString('th-TH') });
    if (dbLocal[window.currentUser].history.length > 50) dbLocal[window.currentUser].history.pop(); 
    
    let optimisticExp = Number(dbLocal[window.currentUser].exp || 0) + gainedExp;
    dbLocal[window.currentUser].exp = optimisticExp; 
    
    let newBest = correctCount > dbLocal[window.currentUser].best ? correctCount : dbLocal[window.currentUser].best;
    dbLocal[window.currentUser].best = newBest;
    
    let bestWpmEl = document.getElementById('bestWPM');
    let currentPersonalBest = bestWpmEl ? parseInt(bestWpmEl.innerText) || 0 : 0;
    if(correctCount > currentPersonalBest && bestWpmEl) { bestWpmEl.innerText = correctCount; }
    
    localStorage.setItem('typingDB_Final', JSON.stringify(dbLocal));

    if (typeof window.forceUpdateExpBar === 'function') {
        window.forceUpdateExpBar(optimisticExp);
    }

    let updateEl = (id, val) => { let el = document.getElementById(id); if(el) el.innerText = val; };
    updateEl('resWpm', correctCount);
    updateEl('resExp', "+" + gainedExp.toLocaleString());
    updateEl('resAcc', finalAcc + "%");
    updateEl('resCorrect', correctCount);
    updateEl('resWrong', wrongCount);
    updateEl('resAttempts', totalTypeAttempts);
    
    updateEl('syncStatus', "⏳ กำลังอัปโหลดข้อมูล..."); 
    
    let resModal = document.getElementById('resultModal');
    if(resModal) resModal.style.display = 'flex';

    localStorage.removeItem('cachedRankingHtml');
    localStorage.removeItem('cachedRankBoardHtml');
    localStorage.removeItem('mySavedTickerHTML');

    if (window.currentUser && window.db) {
        try {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const currentRankName = (typeof window.getRankInfo === 'function') ? window.getRankInfo(optimisticExp).current.name : "ทหารฝึก";
            
            const userRef = doc(window.db, "users", window.currentUser);
            await setDoc(userRef, {
            username: window.currentUser,
            wpm: newBest,
            latest_wpm: correctCount,
            exp: optimisticExp, 
            last_played: Date.now(),
            last_online: Date.now(), // 🔥 เพิ่มให้ระบบรู้ว่าพิมพ์เสร็จก็ยังออนไลน์อยู่
            rank: currentRankName
        }, { merge: true });

            updateEl('syncStatus', "✅ ดำเนินการเรียบร้อย!");

            if (typeof window.loadTickerData === 'function') {
                console.log("🔄 กำลังอัปเดตโปรดรอสักครู่...");
                window.loadTickerData(); 
            }
        } catch(err) {
            console.error("Firebase Sync Error:", err);
            updateEl('syncStatus', "❌ บันทึกพลาด เน็ตอาจจะหลุด: " + err.message);
        }
    }
}

// 🔄 รีเซ็ตเกมเพื่อเล่นตาใหม่
window.resetGame = function() {
    window.closeModal('resultModal');
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    let rankNow = (typeof window.getRankInfo === 'function') ? window.getRankInfo(db[window.currentUser]?.exp || 0).current.name : "ทหารฝึก";
    
    // เช็คว่าได้เลื่อนยศไหม ถ้าได้ให้โชว์ป๊อปอัปยินดีด้วย!
    if (rankNow !== rankAtStart && rankAtStart !== "") {
        window.showPromotion(rankNow);
    } else {
        clearInterval(timer); window.init(); 
        let ui = document.getElementById('userInput');
        if(ui) setTimeout(() => ui.focus(), 100);
    }
}

// 🏅 ป๊อปอัปเลื่อนยศ
window.showPromotion = function(newRank) {
    let rn = document.getElementById('newRankName'); if(rn) rn.innerText = newRank;
    let pi = document.getElementById('promoIcon'); if(pi) pi.innerHTML = window.getRankIcon ? window.getRankIcon(newRank) : "🎖️"; 
    let pm = document.getElementById('promotionModal'); if(pm) pm.style.display = 'flex';
}

window.closePromotion = function() {
    window.closeModal('promotionModal'); 
    rankAtStart = ""; // รีเซ็ตยศเริ่มต้นใหม่
    clearInterval(timer); 
    window.init();
    let ui = document.getElementById('userInput');
    if(ui) setTimeout(() => ui.focus(), 100);
}

// 📜 ประวัติการพิมพ์
window.showHistory = function() {
    let hb = document.getElementById('historyBody');
    let db = JSON.parse(localStorage.getItem('typingDB_Final')) || {};
    let myHistory = db[window.currentUser] ? db[window.currentUser].history : [];
    
    if (myHistory && myHistory.length > 0 && hb) {
        let tempHtml = "";
        myHistory.forEach((record, index) => {
            let accText = record.acc ? `<br><span style="font-size: 12px; color: #10b981;">(แม่นยำ ${record.acc}%)</span>` : "";
            tempHtml += `<tr style="border-bottom: 1px solid #333; background: rgba(255,255,255,0.02); transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
                <td style="padding: 12px 10px; color: #94a3b8; text-align: center;">${index + 1}</td>
                <td style="padding: 12px 10px; color: var(--primary); font-weight: bold; text-align: center;">${record.wpm} WPM ${accText}</td>
                <td style="padding: 12px 10px; color: #cbd5e1; font-size: 13px; text-align: center;">${record.date}</td>
            </tr>`;
        });
        hb.innerHTML = tempHtml;
    } else if (hb) {
        hb.innerHTML = "<tr><td colspan='3' style='text-align:center; padding:30px; color:#94a3b8;'>ยังไม่มีประวัติเลยไอ้กาก ไปพิมพ์ก่อน!</td></tr>";
    }
    
    let hm = document.getElementById('historyModal');
    if(hm) hm.style.display = 'flex';
}

document.addEventListener('contextmenu', event => event.preventDefault()); // 🔥 กันคลิกขวา

window.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || e.keyCode === 123 || 
       (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
       (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) ||
       (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.keyCode === 83))) { // 🔥 เพิ่มดักจับ Ctrl+S ตรงนี้
        e.preventDefault(); 
        e.stopPropagation(); 
        return false; 
    }
}, true);
