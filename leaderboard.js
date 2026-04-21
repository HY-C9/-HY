// ========================================================
// 🏆 leaderboard.js - ระบบตารางคะแนน, ข้อความวิ่ง และ UI (Real-time Edition)
// ========================================================

window.getFirebaseDB = async function() {
    if (window.db) return window.db;
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js");
    const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
    const fbConfig = { 
        apiKey: "AIzaSyBq9ecmKEuBPOgnfWKDFlo3h4QnAEohmmw", 
        authDomain: "pimthai-e16c3.firebaseapp.com", 
        projectId: "pimthai-e16c3", 
        storageBucket: "pimthai-e16c3.firebasestorage.app", 
        messagingSenderId: "955936818307", 
        appId: "1:955936818307:web:273fa00d07f36894d207b6" 
    };
    const app = !getApps().length ? initializeApp(fbConfig) : getApp();
    window.db = getFirestore(app);
    return window.db;
};

// 🔥 สร้างตัวแปรเก็บฟังก์ชันหยุดการดึงข้อมูล (เพื่อประหยัดโควต้า Firebase เวลากดปิดหน้าต่าง)
let unsubTicker = null;
let unsubOnline = null;
let unsubRanking = null;
let unsubRankBoard = null;

window.loadTickerData = async function() {
    localStorage.removeItem('mySavedTickerHTML');
    const tickerEl = document.getElementById('tickerContent');
    if (tickerEl && tickerEl.innerHTML === "📢 แป๊บไอ้สัสนรก") {
        tickerEl.innerHTML = `<span style="color: #fbbf24; font-weight: bold;">⏳ กำลังเชื่อมต่อฐานข้อมูลแบบเรียลไทม์...</span>`;
    }

    if (window.currentUser && window.db) {
        import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js").then(({ doc, setDoc }) => {
            const uRef = doc(window.db, "users", window.currentUser);
            setDoc(uRef, { last_online: Date.now(), username: window.currentUser }, { merge: true }).catch(()=>{});
        });
    }

    let url = typeof window.SCRIPT_URL !== 'undefined' ? window.SCRIPT_URL : "";
    if (url !== "") {
        let deviceId = localStorage.getItem('myDeviceId') || "DEV-TEST";
        let pingUrl = url + (window.currentUser ? `?user=${encodeURIComponent(window.currentUser)}&deviceId=${encodeURIComponent(deviceId)}&action=ping&_t=${Date.now()}` : `?_t=${Date.now()}`);
        
        fetch(pingUrl).then(res => res.json()).then(data => {
            if(data) {
                if(typeof window.updateThemeCounts === 'function') window.updateThemeCounts(data); 
                
                if (typeof window.currentUser !== 'undefined' && window.currentUser && window.currentUser.toLowerCase() !== "") {
                    let activeSessions = data.active_sessions || (data[0] && data[0].active_sessions ? data[0].active_sessions : {});
                    let myDeviceId = localStorage.getItem('myDeviceId');
                    
                    if (activeSessions && activeSessions[window.currentUser] && activeSessions[window.currentUser].deviceId !== myDeviceId) {
                        let timeSinceLogin = window.lastLoginTime ? (Date.now() - window.lastLoginTime) : 99999;
                        if (timeSinceLogin > 15000) { alert("🚨มีคนล็อกอินไอดีมึงจากเครื่องอื่น!"); if(typeof window.handleLogout === 'function') window.handleLogout(true); } 
                        else { fetch(window.SCRIPT_URL + "?user=" + encodeURIComponent(window.currentUser) + "&deviceId=" + encodeURIComponent(myDeviceId) + "&action=login&_t=" + Date.now()); }
                    }
                }
            }
        }).catch(err => console.log("Ping Background Error:", err));
    }

    try {
        const dbInstance = await window.getFirebaseDB();
        const { collection, query, orderBy, limit, where, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        const usersRef = collection(dbInstance, "users");
        
        // 🎯 1. ดึงบอร์ดเลื่อน (Ticker) แบบ Real-time
        try {
            if (unsubTicker) unsubTicker(); // ล้างของเก่า
            const qTicker = query(usersRef, orderBy("last_played", "desc"), limit(15));
            
            unsubTicker = onSnapshot(qTicker, (snapshot) => {
                let tickerHtml = "";
                let count = 0;

                snapshot.forEach((doc) => {
                    let item = doc.data();
                    if(!item.username || !item.last_played) return;
                    
                    let displayWpm = item.latest_wpm !== undefined ? item.latest_wpm : (item.wpm || 0);
                    
                    // 🔥 เงื่อนไขเตะ 0 WPM ทิ้ง (ตามที่ขอ)
                    if (displayWpm <= 0) return; 
                    
                    // จำกัดให้โชว์แค่ 10 คนล่าสุด หลังจากกรองพวก 0 WPM ออกแล้ว
                    if (count >= 10) return;
                    count++;

                    let actualRank = "ทหารฝึก";
                    if(typeof window.getRankInfo === "function") actualRank = window.getRankInfo(item.exp || 0).current.name;
                    let rankIconUrl = window.rankIconUrls ? window.rankIconUrls[actualRank] : "";
                    
                    let defaultSVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzk0YTNiOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE3IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwIDEwMCBDMjAgNjUgMzAgNTUgNTAgNTUgQzcwIDU1IDgwIDY1IDgwIDEwMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+";
                    let userProfilePic = item.profilePic || defaultSVG;
                    
                    if (window.currentUser && item.username === window.currentUser) {
                        let dbCache = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
                        if (dbCache[window.currentUser] && dbCache[window.currentUser].profilePic) userProfilePic = dbCache[window.currentUser].profilePic;
                    }

                    tickerHtml += `<span style="display: inline-flex; align-items: center; background: linear-gradient(90deg, rgba(30,41,59,0.8) 0%, rgba(15,23,42,0.8) 100%); padding: 6px 16px; border-radius: 30px; border: 1px solid #334155; margin-right: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        <img src="${userProfilePic}" onerror="this.onerror=null; this.src='${defaultSVG}';" onclick="window.openImageViewer('${userProfilePic}')" style="cursor:pointer; height: 32px; width: 32px; border-radius: 50%; margin-right: 12px; border: 2px solid var(--primary); object-fit: cover;">
                        <span style="color: #f8fafc; font-weight: bold; margin-right: 10px; font-size: 15px; letter-spacing: 0.5px;">${item.username}</span> 
                        <span style="color: #64748b; font-size: 13px; margin-right: 10px;">ซัดไป</span>
                        <span style="color: #38bdf8; font-weight: 900; font-size: 18px; text-shadow: 0 0 10px rgba(56, 189, 248, 0.6);">${displayWpm}</span> <span style="color: #38bdf8; font-size: 12px; margin-right: 12px; margin-left: 3px;">WPM</span>
                        <img src="${rankIconUrl}" style="height: 24px; width: 24px; border-radius: 4px; object-fit: cover; box-shadow: 0 0 8px rgba(251, 191, 36, 0.4);">
                    </span>`;
                });
                
                let tEl = document.getElementById('tickerContent');
                if (tickerHtml !== "" && tEl) {
                    tEl.innerHTML = `<span style="display:inline-flex; align-items:center; color: #ef4444; font-weight: 800; margin-right: 20px; font-size: 16px; text-shadow: 0 0 8px rgba(239, 68, 68, 0.6);"><span style="font-size: 20px; margin-right: 5px;">🔥</span> อัปเดตล่าสุด:</span> ${tickerHtml}`;
                    
                    // รีเซ็ตแอนิเมชันให้วิ่งใหม่ทุกครั้งที่มีข้อมูลเข้า
                    tEl.style.animation = 'none';
                    void tEl.offsetWidth; 
                    tEl.style.animation = ''; 
                } else if (tEl) {
                    tEl.innerHTML = `<span style="color: #94a3b8; font-weight: bold;">ยังไม่มีใครพิมพ์เลย ไปประเดิมหน่อยดิวะ...</span>`;
                }
            });
        } catch(err1) { console.error("เกิดข้อผิดพลาดตอนดึงบอร์ดเลื่อน:", err1); }

        // 🎯 2. นับคนออนไลน์แบบ Real-time
        try {
            if (unsubOnline) unsubOnline();
            const fifteenMinsAgo = Date.now() - (15 * 60 * 1000);
            const qOnline = query(usersRef, where("last_online", ">", fifteenMinsAgo));
            
            unsubOnline = onSnapshot(qOnline, (snapshot) => {
                let badge = document.getElementById('onlineCount');
                if (badge) badge.innerText = snapshot.size || 1; 
            });
        } catch(err2) { console.error("เกิดข้อผิดพลาดตอนนับคนออนไลน์:", err2); }

    } catch (e) {
        console.error("Firebase Ticker Error:", e);
    }
}

// 🥇 2. ตารางอันดับความเร็ว (WPM) - Real-time
window.showRanking = async function() {
    document.getElementById('rankingModal').style.display = 'flex';
    document.getElementById('lbBody').innerHTML = "<tr><td colspan='4' style='text-align:center; padding:30px; color:#94a3b8;'>⏳ กำลังเชื่อมต่อตารางคะแนนสดๆ...</td></tr>";

    try {
        const dbInstance = await window.getFirebaseDB();
        const { collection, query, orderBy, limit, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        const usersRef = collection(dbInstance, "users");
        
        if (unsubRanking) unsubRanking(); // ป้องกันการเรียกซ้ำ
        
        const q = query(usersRef, orderBy("wpm", "desc"), limit(150));
        
        unsubRanking = onSnapshot(q, (snapshot) => {
            let html = "";
            let i = 0;
            
            snapshot.forEach((doc) => {
                const row = doc.data();
                if(!row.username || row.wpm === undefined || row.wpm === 0) return; 

                let rankColor = "#64748b"; let rankTrophy = i + 1; let bgStyle = "transparent";
                if (i === 0) { rankColor = "#fbbf24"; rankTrophy = "🥇 1"; bgStyle = "rgba(251, 191, 36, 0.05)"; }
                else if (i === 1) { rankColor = "#94a3b8"; rankTrophy = "🥈 2"; bgStyle = "rgba(148, 163, 184, 0.05)"; }
                else if (i === 2) { rankColor = "#b45309"; rankTrophy = "🥉 3"; bgStyle = "rgba(180, 83, 9, 0.05)"; }
                if (row.username === window.currentUser) { bgStyle = "rgba(56, 189, 248, 0.1)"; rankColor = "#38bdf8"; }
                
                let defaultSVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzk0YTNiOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE3IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwIDEwMCBDMjAgNjUgMzAgNTUgNTAgNTUgQzcwIDU1IDgwIDY1IDgwIDEwMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+";
                let userProfilePic = row.profilePic || window.profileCache?.[row.username] || defaultSVG;
                if (window.currentUser && row.username === window.currentUser) {
                    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
                    if (db[window.currentUser] && db[window.currentUser].profilePic) userProfilePic = db[window.currentUser].profilePic;
                }

                let actualRankName = "ทหารฝึก";
                if (typeof window.getRankInfo === "function") { actualRankName = window.getRankInfo(row.exp || 0).current.name; } 
                else { actualRankName = row.rank || "ทหารฝึก"; }
                
                let rankIconUrl = (window.rankIconUrls && window.rankIconUrls[actualRankName]) ? window.rankIconUrls[actualRankName] : defaultSVG;
                let rankText = typeof window.getRankText === "function" ? window.getRankText(row.wpm) : "กากๆ";

                html += `<tr style="border-bottom: 1px solid #333; background: ${bgStyle}; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='${bgStyle}'">
                    <td style="padding: 12px 15px; font-weight: bold; color: ${rankColor}; font-size: 16px; text-align: center;">${rankTrophy}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #fff; font-size: 15px; display: flex; align-items: center; gap: 10px;">
                        <img src="${userProfilePic}" onerror="this.onerror=null; this.src='${defaultSVG}';" onclick="window.openImageViewer('${userProfilePic}')" style="cursor:pointer; width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"> ${row.username}
                    </td>
                    <td style="padding: 12px 15px; font-weight: bold; color: var(--primary); font-size: 17px;">${row.wpm}</td>
                    <td style="padding: 12px 15px; display: flex; align-items: center; gap: 8px;">
                        <img src="${rankIconUrl}" style="height: 26px; width: 26px; border-radius: 4px;">
                        <span style="font-size: 12px; color: #94a3b8;">${rankText}</span>
                    </td></tr>`;
                i++;
            });
            
            let finalHtml = html || "<tr><td colspan='4' style='text-align:center; padding:30px; color:#94a3b8;'>ยังไม่มีคนกากคนไหนมาพิมพ์</td></tr>";
            document.getElementById('lbBody').innerHTML = finalHtml;
        });
        
    } catch(err) { console.error("Firebase Ranking Error:", err); }
}

// 🎖️ 3. ทำเนียบยศ (EXP) - Real-time
window.showRankBoard = async function() {
    document.getElementById('rankBoardModal').style.display = 'flex';
    document.getElementById('rankBoardBody').innerHTML = "<tr><td colspan='4' style='text-align:center; padding:30px; color:#94a3b8;'>⏳ กำลังเชื่อมต่อทำเนียบยศสดๆ...</td></tr>";

    try {
        const dbInstance = await window.getFirebaseDB();
        const { collection, query, orderBy, limit, onSnapshot } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
        const usersRef = collection(dbInstance, "users");
        
        if (unsubRankBoard) unsubRankBoard(); // ป้องกันการเรียกซ้ำ
        
        const q = query(usersRef, orderBy("exp", "desc"), limit(150));
        
        unsubRankBoard = onSnapshot(q, (snapshot) => {
            let html = "";
            let i = 0;
            
            snapshot.forEach((doc) => {
                const row = doc.data();
                if(!row.username || row.exp === undefined || row.exp === 0) return;

                let rankColor = "#64748b"; let rankTrophy = i + 1; let bgStyle = "transparent";
                if (i === 0) { rankColor = "#fbbf24"; rankTrophy = "🏆 1"; bgStyle = "rgba(251, 191, 36, 0.05)"; }
                else if (i === 1) { rankColor = "#94a3b8"; rankTrophy = "🥈 2"; bgStyle = "rgba(148, 163, 184, 0.05)"; }
                else if (i === 2) { rankColor = "#b45309"; rankTrophy = "🥉 3"; bgStyle = "rgba(180, 83, 9, 0.05)"; }
                if (row.username === window.currentUser) { bgStyle = "rgba(56, 189, 248, 0.1)"; rankColor = "#38bdf8"; }
                
                let actualRankName = "ทหารฝึก";
                if (typeof window.getRankInfo === "function") { actualRankName = window.getRankInfo(row.exp || 0).current.name; } 
                else { actualRankName = row.rank || "ทหารฝึก"; }
                
                let iconUrl = (window.rankIconUrls && window.rankIconUrls[actualRankName]) ? window.rankIconUrls[actualRankName] : "";

                let defaultSVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzk0YTNiOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE3IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwIDEwMCBDMjAgNjUgMzAgNTUgNTAgNTUgQzcwIDU1IDgwIDY1IDgwIDEwMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+";
                let userProfilePic = row.profilePic || window.profileCache?.[row.username] || defaultSVG;
                if (window.currentUser && row.username === window.currentUser) {
                    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
                    if (db[window.currentUser] && db[window.currentUser].profilePic) userProfilePic = db[window.currentUser].profilePic;
                }
                
                html += `<tr style="border-bottom: 1px solid #333; background: ${bgStyle}; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='${bgStyle}'">
                    <td style="padding: 12px 15px; font-weight: bold; color: ${rankColor}; font-size: 16px; text-align: center;">${rankTrophy}</td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #fff; font-size: 15px; display: flex; align-items: center; gap: 10px;">
                        <img src="${userProfilePic}" onerror="this.onerror=null; this.src='${defaultSVG}';" onclick="window.openImageViewer('${userProfilePic}')" style="cursor:pointer; width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"> ${row.username}
                    </td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #fbbf24; font-size: 14px;">
                        <img src="${iconUrl}" width="30" height="30" style="vertical-align: middle; border-radius: 4px; margin-right: 8px;"> 
                    </td>
                    <td style="padding: 12px 15px; font-weight: bold; color: #a855f7; font-size: 16px;">${Number(row.exp || 0).toLocaleString()}</td>
                </tr>`;
                i++;
            });
            
            let finalHtml = html || "<tr><td colspan='4' style='text-align:center; padding:30px; color:#94a3b8;'>ยังไม่มีคนเล่นเลยว่ะ</td></tr>";
            document.getElementById('rankBoardBody').innerHTML = finalHtml;
        });
        
    } catch(err) { console.error("Firebase RankBoard Error:", err); }
}

// 🧰 4. ฟังก์ชันควบคุมหน้าต่าง UI ต่างๆ
window.closeModal = function(id) { 
    let el = document.getElementById(id);
    if(el) el.style.display = 'none'; 
    
    // 🔥 ปิดตัวดึงข้อมูลเรียลไทม์เมื่อปิดหน้าต่าง Modal เพื่อประหยัดโควต้า Firebase
    if (id === 'rankingModal' && unsubRanking) { unsubRanking(); unsubRanking = null; }
    if (id === 'rankBoardModal' && unsubRankBoard) { unsubRankBoard(); unsubRankBoard = null; }
}

window.toggleActionMenu = function(e) { 
    if(e) e.stopPropagation(); 
    let menu = document.getElementById('actionMenu');
    if(menu) menu.classList.toggle('show'); 
}

window.closeActionMenu = function() { 
    const menu = document.getElementById('actionMenu'); 
    if(menu) menu.classList.remove('show'); 
}

window.addEventListener('click', function(e) {
    const menu = document.getElementById('actionMenu'); 
    const btn = document.querySelector('.hamburger-btn');
    if (menu && menu.classList.contains('show') && e.target !== btn && !menu.contains(e.target)) { 
        menu.classList.remove('show'); 
    }
});

window.setupDarkModal = function(title, desc, confirmText, confirmAction, cancelText = "ยกเลิก") {
    document.getElementById('darkTitle').innerHTML = title; 
    document.getElementById('darkDesc').innerHTML = desc;
    document.getElementById('darkInput1').style.display = 'none'; document.getElementById('darkInput1').value = '';
    document.getElementById('darkInput2').style.display = 'none'; document.getElementById('darkInput2').value = '';
    
    let input3 = document.getElementById('darkInput3');
    if(input3) { input3.style.display = 'none'; input3.value = ''; }
    
    let timeBox = document.getElementById('timeInputsBox');
    if(timeBox) { 
        timeBox.style.display = 'none'; 
        document.getElementById('darkInputDays').value = '';
        document.getElementById('darkInputHours').value = '';
    }

    let confirmBtn = document.getElementById('darkConfirmBtn'); 
    let cancelBtn = document.getElementById('darkCancelBtn');
    
    confirmBtn.innerHTML = confirmText; 
    confirmBtn.className = "dark-btn confirm"; 
    confirmBtn.onclick = confirmAction;
    
    cancelBtn.innerHTML = cancelText; 
    cancelBtn.style.display = "block";
    
    document.getElementById('darkActionModal').style.display = 'flex';
}
