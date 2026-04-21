// ========================================================
// 🔐 auth.js - ระบบล็อกอิน, สมัครสมาชิก, ธีมสี และโปรไฟล์
// ========================================================
window.IMGBB_API_KEY = "69dc1d1d5c746220fd5d13c2f66613b0"; 

window.currentUser = localStorage.getItem('currentUser') || "";
window.SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyn-42qkA8MP5LD5kD8_9Wl6SHjbhlByRRI0Tt0R40FKPRSZgNnRxwFaOjAUJ0RwmvI/exec"; 
window.myDeviceId = localStorage.getItem('myDeviceId') || ('DEV-' + Math.random().toString(36).substr(2, 9));
localStorage.setItem('myDeviceId', window.myDeviceId);

window.getBoundUsers = function() {
    let users = localStorage.getItem('deviceBoundUsers');
    if (users) return JSON.parse(users);
    let oldUser = localStorage.getItem('deviceBoundUser');
    if (oldUser) {
        localStorage.setItem('deviceBoundUsers', JSON.stringify([oldUser]));
        localStorage.removeItem('deviceBoundUser');
        return [oldUser];
    }
    return [];
}

window.addBoundUser = function(user) {
    if (user.toLowerCase() === "") return;
    let users = window.getBoundUsers();
    if (!users.includes(user)) {
        users.push(user);
        localStorage.setItem('deviceBoundUsers', JSON.stringify(users));
    }
}

// ==========================================
// 🔑 ระบบล็อกอิน / สมัครสมาชิก
// ==========================================

window.switchAuth = function(type) {
    if(type === 'login') {
        document.getElementById('loginForm').style.display = 'block'; document.getElementById('registerForm').style.display = 'none';
        document.getElementById('tabLogin').style.background = 'var(--primary)'; document.getElementById('tabRegister').style.background = '#222';
    } else {
        document.getElementById('loginForm').style.display = 'none'; document.getElementById('registerForm').style.display = 'block';
        document.getElementById('tabLogin').style.background = '#222'; document.getElementById('tabRegister').style.background = '#ef4444';
    }
}

window.handleLogin = async function() {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    if(!user || !pass) return alert("กรอกข้อมูลให้ครบดอแม่เย็ด!");

    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    const btn = document.querySelector('#loginForm .btn-main'); 
    const originalText = btn.innerText;
    btn.innerText = "กำลังโหลดดดดดด.....";
    btn.disabled = true;

    try {
        if (window.db) {
            const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const docRef = doc(window.db, "users", user);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 10 };
                db[user].pass = pass; 
                db[user].best = userData.wpm || 0;
                db[user].exp = userData.exp || 0;
                if (userData.profilePic) db[user].profilePic = userData.profilePic;
                
                window.proceedLogin(user, pass, db);
                btn.innerText = originalText; btn.disabled = false;
                return; 
            }
        }

        let res = await fetch(window.SCRIPT_URL + "?_t=" + Date.now());
        let data = await res.json();
        let userRecords = data.filter(item => item.username === user);
        
        if(userRecords.length > 0) {
            let latestPass = "";
            let bestWPM = 0;
            let latestExp = 0; 
            let latestMultiplier = 10; 
            let latestProfilePic = "";

            for(let r of userRecords) {
                if(r.password !== undefined && r.password !== null && r.password !== "ไม่มีรหัส" && r.password !== "") { latestPass = String(r.password).trim(); }
                if(Number(r.wpm) > bestWPM) { bestWPM = Number(r.wpm); }
                latestExp = Number(r.exp) || 0; 
                latestMultiplier = Number(r.multiplier) || 10; 
                if (r.profilePic) latestProfilePic = r.profilePic;
            }
            
            if (latestPass !== "") {
                if(latestPass === pass) {
                    if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 10 };
                    db[user].pass = pass; 
                    db[user].best = bestWPM; 
                    db[user].exp = latestExp; 
                    db[user].multiplier = latestMultiplier; 
                    if (latestProfilePic) db[user].profilePic = latestProfilePic;
                    window.proceedLogin(user, pass, db);
                } else { alert("รหัสผ่านผิดไอ้สัส มึงจำไม่ได้หรอ?!"); }
            } else {
                if (!db[user]) db[user] = { history: [], exp: 0, multiplier: 5 };
                db[user].pass = pass; db[user].best = bestWPM; db[user].exp = latestExp; db[user].multiplier = latestMultiplier; 
                if (latestProfilePic) db[user].profilePic = latestProfilePic;
                fetch(window.SCRIPT_URL, { method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'changePassword', username: user, password: pass }) }).catch(() => {});
                alert("✅ กู้คืนบัญชีเก่าสำเร็จ! ระบบบันทึกรหัสใหม่ให้มึงแล้ว"); 
                window.proceedLogin(user, pass, db);
            }
        } else { alert("ไม่พบชื่อนี้ในระบบเลย ไปสมัครก่อนไอ้กาก!"); }
    } catch(e) { alert("โหลดข้อมูลไม่สำเร็จ เน็ตมึงมีปัญหาป่าว?"); }
    
    btn.innerText = originalText; btn.disabled = false;
}

window.handleRegister = async function() {
    let boundUsers = window.getBoundUsers();
    const user = document.getElementById('regUser').value.trim();
    if (boundUsers.length >= 2 && !boundUsers.includes(user)) {
        return alert(`อย่าสมัครเยอะไอ้สัส (${boundUsers.join(', ')})!\nไปเล่นไอดีเดิมมึงไป`);
    }

    const pass = document.getElementById('regPass').value.trim();
    if(!user || !pass) return alert("กรอกข้อมูลให้ครบ!");
    if(user.length > 30) return alert("ชื่อยาวไป!");
    if(pass.length < 4) { return window.setupDarkModal("🚨 รหัสสั้นไป!", "ต้อง 4 ตัวขึ้นไป", "รับทราบ", () => { window.closeModal('darkActionModal'); }, "ซ่อน"); }
    if(user === pass) { return window.setupDarkModal("🚨 เตือนสติ!", "ชื่อกับรหัสห้ามเหมือนกัน!", "รับทราบ", () => { window.closeModal('darkActionModal'); }, "ซ่อน"); }
    
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if(db[user]) return alert("ชื่อนี้มีคนใช้แล้ว!");
    
    const payload = {
        action: 'saveScore', username: user, wpm: 0, accuracy: 0, correctWords: 0, wrongWords: 0, totalAttempts: 0, exp: 0, multiplier: 10, rank: "ทหารฝึก", password: pass, token: btoa((0 * 13 + 0 * 7) + "-ANTI-GAK") 
    };

    try {
        if (window.db) {
            const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const userRef = doc(window.db, "users", user);
            await setDoc(userRef, { username: user, wpm: 0, exp: 0, rank: "ทหารฝึก", profilePic: "" }, { merge: true });
        }

        let response = await fetch(window.SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) 
        });
        let result = await response.json();
        if (result.status === "success") {
            db[user] = { pass: pass, best: 0, exp: 0, multiplier: 10, history: [] }; 
            window.proceedLogin(user, pass, db);
        } else {
            alert("❌ ระบบขัดข้อง: " + (result.message || "ไม่สามารถสมัครได้ในขณะนี้"));
        }
    } catch (error) {
        alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง!");
    }
}

window.proceedLogin = function(user, pass, db) {
    if(!db[user].history) db[user].history = [];
    if(db[user].exp === undefined) db[user].exp = 0; 
    window.addBoundUser(user);

    localStorage.setItem('typingDB_Final', JSON.stringify(db));
    localStorage.setItem('isLoggedIn', user); 
    window.currentUser = user;
    window.lastLoginTime = Date.now();

    fetch(window.SCRIPT_URL + "?user=" + encodeURIComponent(user) + "&deviceId=" + encodeURIComponent(window.myDeviceId) + "&action=login&_t=" + Date.now())
    .then(() => {
        window.showGame(user, db[user].best); 
        if(typeof window.loadTickerData === 'function') window.loadTickerData();
    });
}

window.showGame = function(user, best) {
    document.getElementById('displayUser').innerText = user;
    document.getElementById('bestWPM').innerText = best;
    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
    if (db[user].exp === undefined) db[user].exp = 0;
    
    window.profileCache = window.profileCache || {};
    let defaultSVG = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzk0YTNiOCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE3IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIwIDEwMCBDMjAgNjUgMzAgNTUgNTAgNTUgQzcwIDU1IDgwIDY1IDgwIDEwMCBaIiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+";
    let profilePicUrl = db[user].profilePic || window.profileCache[user] || defaultSVG;
    document.getElementById('userProfilePic').src = profilePicUrl;

    if(typeof window.updateExpUI === 'function') window.updateExpUI(db[user].exp);
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('gameMain').style.display = 'block'; 
    if(typeof window.init === 'function') window.init();
}

// ==========================================
// ⚙️ ระบบจัดการบัญชี (เปลี่ยนชื่อเข้าสู่ระบบ = เปลี่ยน ID ทุกอย่าง)
// ==========================================

window.showEditName = function() {
    window.setupDarkModal("✏️ แก้ไขชื่อเข้าสู่ระบบ", "เปลี่ยนชื่อใหม่แล้ว ต่อไปต้องใช้ชื่อนี้ล็อกอินนะไอ้สัส!", "เปลี่ยนชื่อเลย", async () => {
        const newName = document.getElementById('darkInput1').value.trim(); 
        if(!newName || newName === window.currentUser) return;
        if(newName.length > 30) { document.getElementById('darkDesc').innerHTML = "<span style='color:red'>ชื่อยาวไปไอ้เวร! เอาแค่ไม่เกิน 30 ตัวอักษรพอ!</span>"; return; }
        
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
        if(db[newName]) { document.getElementById('darkDesc').innerHTML = "<span style='color:red'>ชื่อนี้มีคนใช้แล้ว เปลี่ยนใหม่ดิวะ!</span>"; return; }
        
        const oldName = window.currentUser; 
        let btn = document.getElementById('darkConfirmBtn');
        btn.innerHTML = "⚡ กำลังเปลี่ยน...";
        btn.disabled = true;

        try {
            if (window.db) {
                const { doc, getDoc, setDoc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
                
                const newDocRef = doc(window.db, "users", newName);
                const newDocSnap = await getDoc(newDocRef);

                if (newDocSnap.exists()) {
                    document.getElementById('darkDesc').innerHTML = "<span style='color:red'>ชื่อนี้มีคนใช้ในระบบแล้ว เปลี่ยนใหม่!</span>";
                    btn.innerHTML = "เปลี่ยนชื่อเลย"; btn.disabled = false;
                    return;
                }

                const oldDocRef = doc(window.db, "users", oldName);
                const oldDocSnap = await getDoc(oldDocRef);

                if (oldDocSnap.exists()) {
                    let userData = oldDocSnap.data();
                    userData.username = newName; 

                    await setDoc(newDocRef, userData);
                    await deleteDoc(oldDocRef);
                } else {
                    await setDoc(newDocRef, { username: newName, wpm: 0, exp: 0, rank: "ทหารฝึก", profilePic: "" });
                }
            }

            if (window.SCRIPT_URL) {
                await fetch(window.SCRIPT_URL, { 
                    method: 'POST', keepalive: true, headers: { "Content-Type": "text/plain;charset=utf-8" }, 
                    body: JSON.stringify({ action: 'editName', oldName: oldName, newName: newName }) 
                });
            }

            db[newName] = db[oldName]; 
            delete db[oldName];
            localStorage.setItem('typingDB_Final', JSON.stringify(db)); 
            localStorage.setItem('isLoggedIn', newName); 

            let boundUsers = window.getBoundUsers();
            let index = boundUsers.indexOf(oldName);
            if (index !== -1) {
                boundUsers[index] = newName;
                localStorage.setItem('deviceBoundUsers', JSON.stringify(boundUsers));
            }

            window.profileCache = window.profileCache || {};
            if(window.profileCache[oldName]) { 
                window.profileCache[newName] = window.profileCache[oldName]; 
                delete window.profileCache[oldName];
            }
            
            window.currentUser = newName;
            alert("✅ เปลี่ยนชื่อเข้าสู่ระบบสำเร็จ! รอบหน้าต้องใช้ชื่อใหม่ล็อกอินนะ");
            location.reload(); 

        } catch (error) {
            console.error("Error changing name:", error);
            btn.innerHTML = "เปลี่ยนชื่อเลย"; btn.disabled = false; 
            alert("❌ เปลี่ยนชื่อไม่ได้ โปรดลองใหม่อีกครั้ง!");
        }
    });
    
    document.getElementById('darkInput1').style.display = 'block'; 
    document.getElementById('darkInput1').value = window.currentUser; 
    setTimeout(() => document.getElementById('darkInput1').focus(), 100);
}

window.showChangePassword = function() {
    window.setupDarkModal("🔑 เปลี่ยนรหัสกากๆของมึง", "พิมพ์รหัสเดิม และรหัสใหม่มาให้ครบ กูจะได้จำให้", "เปลี่ยนรหัส", () => {
        const oldPass = document.getElementById('darkInput1').value.trim(); const newPass = document.getElementById('darkInput2').value.trim();
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}'); if(!oldPass || !newPass) return;
        if(db[window.currentUser].pass !== oldPass) { document.getElementById('darkDesc').innerHTML = "<span style='color:red'>รหัสเดิมมึงยังผิดเลย ไอ้ควาย!</span>"; return; }
        if(newPass.length < 4) { document.getElementById('darkDesc').innerHTML = "<span style='color:red'>รหัสใหม่สั้นไป! ต้อง 4 ตัวขึ้นไป</span>"; return; }
        
        db[window.currentUser].pass = newPass; localStorage.setItem('typingDB_Final', JSON.stringify(db)); window.closeModal('darkActionModal');
        window.setupDarkModal("✅ เปลี่ยนแล้ว", "รหัสของมึงเปลี่ยนใหม่แล้ว", "ปิด", () => window.closeModal('darkActionModal'));
        document.getElementById('darkCancelBtn').style.display = "none";
        fetch(window.SCRIPT_URL, { method: 'POST',headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'changePassword', username: window.currentUser, password: newPass }) }).catch(() => {});
    });
    document.getElementById('darkInput1').style.display = 'block'; document.getElementById('darkInput1').type = 'password'; document.getElementById('darkInput1').placeholder = "รหัสเก่า...";
    document.getElementById('darkInput2').style.display = 'block'; document.getElementById('darkInput2').placeholder = "รหัสใหม่ 4 ตัวขึ้นไป...";
    setTimeout(() => document.getElementById('darkInput1').focus(), 100);
}

window.showDeleteAccount = function() {
    window.setupDarkModal("🗑️ ยืนยันจะลบทิ้ง?", "มึงแน่ใจนะว่าจะลบบัญชี? <br><span style='color:#ef4444'>ลบแล้วข้อมูลหายหมดเกลี้ยง!</span>", "ลบแม่งเลย!", async () => {
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}'); 
        delete db[window.currentUser]; 
        localStorage.setItem('typingDB_Final', JSON.stringify(db));

        if (window.db) {
            const { doc, deleteDoc } = await import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js");
            const userRef = doc(window.db, "users", window.currentUser);
            await deleteDoc(userRef).catch(e => console.log("Firebase Delete Error:", e));
        }

        window.closeModal('darkActionModal'); 
        window.handleLogout(); 
        fetch(window.SCRIPT_URL, { method: 'POST',headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'deleteUser', username: window.currentUser }) }).catch(()=>{});
    }, "เปลี่ยนใจแล้ว");
    document.getElementById('darkConfirmBtn').className = "dark-btn danger";
}

window.showLogoutConfirm = function() { 
    const modal = document.getElementById('logoutModal'); 
    if (modal) { modal.style.display = 'flex'; } 
}

window.confirmLogout = function() { 
    document.getElementById('logoutModal').style.display = 'none';
    if (typeof window.handleLogout === "function") { window.handleLogout(); } 
    else { localStorage.removeItem('isLoggedIn'); location.reload(); }
}

window.handleLogout = function(isKicked = false) { 
    if (window.currentUser && window.currentUser.toLowerCase() !== "" && !isKicked) {
        fetch(window.SCRIPT_URL, { 
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ action: 'logout', username: window.currentUser }) 
        }).catch(() => {});
    } 
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem("mySavedProfilePic"); 
    location.reload(); 
}

// ==========================================
// 🎨 ระบบธีมสี
// ==========================================

window.initTheme = function() {
    const savedTheme = localStorage.getItem('theme_preference') || 'default';
    document.body.className = savedTheme === 'default' ? '' : savedTheme;
    window.updateThemeButtons(savedTheme);
}

window.openThemeModal = function() {
    document.getElementById('themeModal').style.display = 'flex';
    const currentTheme = localStorage.getItem('theme_preference') || 'default';
    window.updateThemeButtons(currentTheme);
}

window.selectTheme = function(themeId) {
    let oldTheme = document.body.className; 
    if (!oldTheme && localStorage.getItem('theme_preference')) { oldTheme = localStorage.getItem('theme_preference'); }

    document.body.className = themeId === 'default' ? '' : themeId;
    localStorage.setItem('theme_preference', themeId);
    window.updateThemeButtons(themeId);
    setTimeout(() => {
        let el = document.getElementById('themeModal');
        if(el) el.style.display = 'none';
    }, 200);

    if (oldTheme && oldTheme !== 'default' && oldTheme !== themeId) {
        let oldBadge = document.getElementById("count-" + oldTheme);
        if (oldBadge && parseInt(oldBadge.innerText) > 0) {
            let newVal = parseInt(oldBadge.innerText) - 1;
            oldBadge.innerText = newVal;
            if(newVal <= 0) oldBadge.style.display = 'none';
        }
    }
    if (themeId && themeId !== 'default') {
        let newBadge = document.getElementById("count-" + themeId);
        if (newBadge) {
            newBadge.innerText = parseInt(newBadge.innerText || 0) + 1;
            newBadge.style.display = 'block';
        }
    }

    if (typeof window.currentUser !== 'undefined' && window.currentUser) {
        fetch(window.SCRIPT_URL, {
            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action: "updateTheme", username: window.currentUser, theme: themeId })
        }).catch(err => console.log("ส่งข้อมูลไม่ผ่าน:", err));
    }
}

window.updateThemeButtons = function(activeId) {
    document.querySelectorAll('.theme-option-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById('btn-' + activeId);
    if(activeBtn) activeBtn.classList.add('active');
}

window.updateThemeCounts = function(dataArray) {
    let counts = null;
    dataArray.forEach(item => { if (item.__THEME_COUNTS__) counts = item.__THEME_COUNTS__; });
    if (!counts && dataArray.length > 0 && dataArray[0].theme_counts) counts = dataArray[0].theme_counts;

    if (counts) {
        document.querySelectorAll('.theme-count-badge').forEach(el => {
            el.innerText = "0"; el.style.display = "none";
        });
        for (let theme in counts) {
            let badge = document.getElementById("count-" + theme);
            if (badge && counts[theme] > 0) { 
                badge.innerText = counts[theme];
                badge.style.display = "block"; 
            }
        }
    }
}

// ==========================================
// 🚀 ระบบอัปโหลดรูปภาพ & เช็กล็อกอิน
// ==========================================

window.addEventListener('DOMContentLoaded', () => {
    // 1. โหลดธีมและเช็กล็อกอินทันที (รอให้ระบบเกมโหลดเสร็จก่อน)
    window.initTheme();
    const savedUser = localStorage.getItem('isLoggedIn');
    if (savedUser) {
        window.currentUser = savedUser;
        let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
        
        // ถ้าระบบเกมพร้อมแล้ว สั่งโชว์เกมเลย!
        if (typeof window.showGame === 'function') {
            window.showGame(savedUser, db[savedUser] ? db[savedUser].best : 0);
        } else {
            console.error("หาไฟล์ game.js ไม่เจอ! เช็ค index.html ด่วน");
        }
    }

    // 2. ระบบอัปโหลดรูปภาพผ่าน ImgBB
    let picInput = document.getElementById('profilePicInput');
    if (!picInput) {
        const fileInputHTML = '<input type="file" id="profilePicInput" accept="image/*" style="display: none;">';
        document.body.insertAdjacentHTML('beforeend', fileInputHTML);
        picInput = document.getElementById('profilePicInput');
    }

    if (picInput) {
        picInput.addEventListener('change', async function(event) {
            const file = event.target.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) { alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น!'); return; }

            if (window.IMGBB_API_KEY === "ใส่_API_KEY_ของมึงตรงนี้" || window.IMGBB_API_KEY === "") {
                alert("❌ มึงยังไม่ได้ใส่ IMGBB API KEY ในโค้ดเลย ไปใส่ก่อน!"); return;
            }

            alert("⏳ กำลังดำเนินการ โปรดรอสักครู่...");

            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', window.IMGBB_API_KEY);

            try {
                const response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.success) {
                    const imageUrl = result.data.url; 
                    document.getElementById('userProfilePic').src = imageUrl;

                    let db = JSON.parse(localStorage.getItem('typingDB_Final') || '{}');
                    if(!db[window.currentUser]) db[window.currentUser] = {};
                    db[window.currentUser].profilePic = imageUrl;
                    localStorage.setItem('typingDB_Final', JSON.stringify(db));

                    localStorage.setItem("mySavedProfilePic", imageUrl);
                    window.profileCache = window.profileCache || {};
                    window.profileCache[window.currentUser] = imageUrl;

                    if (typeof window.showRanking === "function") window.showRanking(); 

                    if (window.db && window.currentUser) {
                        import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js").then(({ doc, setDoc }) => {
                            const userRef = doc(window.db, "users", window.currentUser);
                            setDoc(userRef, { profilePic: imageUrl }, { merge: true })
                            .then(() => {
                                alert("✅ อัปโหลดและเปลี่ยนรูปสำเร็จ!");
                                window.loadAllProfilePics();
                            }).catch((error) => console.error("Firebase Error:", error));
                        });
                    }

                    if (window.SCRIPT_URL) {
                        fetch(window.SCRIPT_URL, { 
                            method: 'POST', headers: { "Content-Type": "text/plain;charset=utf-8" }, 
                            body: JSON.stringify({ action: 'updateProfilePic', username: window.currentUser, profilePic: imageUrl }) 
                        }).catch(err => console.error("Sheet Error:", err));
                    }

                } else {
                    alert("❌ อัปโหลดรูปไป ImgBB ไม่สำเร็จ: " + result.error.message);
                }
            } catch (error) {
                console.error("ImgBB Upload Error:", error);
                alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อกับ ImgBB");
            } finally {
                document.getElementById('profilePicInput').value = ""; 
            }
        });
    }
});

window.loadAllProfilePics = function() {
    if(typeof window.SCRIPT_URL === 'undefined' || !window.SCRIPT_URL) return;
    fetch(window.SCRIPT_URL + "?action=getProfiles&_t=" + Date.now())
    .then(res => res.json())
    .then(data => {
        window.profileCache = window.profileCache || {};
        for (let user in data) { window.profileCache[user] = data[user]; }
    }).catch(err => console.log("เกิดข้อผิดพลาด:", err));
}

window.openImageViewer = function(src) {
    document.getElementById('largeProfilePic').src = src;
    document.getElementById('imageViewerModal').style.display = 'flex';
}