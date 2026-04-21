// ========================================================
// 📈 stats.js - ระบบยศ, EXP และข้อความด่า
// ========================================================

window.rankData = [
    { exp: 0, name: "ทหารฝึก" }, { exp: 1000, name: "พลทหาร" }, { exp: 2056, name: "สิบตรี" }, { exp: 3667, name: "สิบโท" }, { exp: 4339, name: "สิบเอก" },
    { exp: 6078, name: "จ่าสิบตรี ชั้น 1" }, { exp: 7591, name: "จ่าสิบตรี ชั้น 2" }, { exp: 8586, name: "จ่าสิบตรี ชั้น 3" }, { exp: 9570, name: "จ่าสิบตรี ชั้น 4" }, { exp: 10853, name: "จ่าสิบตรี ชั้น 5" },
    { exp: 11843, name: "จ่าสิบโท ชั้น 1" }, { exp: 13053, name: "จ่าสิบโท ชั้น 2" }, { exp: 14094, name: "จ่าสิบโท ชั้น 3" }, { exp: 15379, name: "จ่าสิบโท ชั้น 4" }, { exp: 17122, name: "จ่าสิบโท ชั้น 5" },
    { exp: 19040, name: "จ่าสิบเอก ชั้น 1" }, { exp: 21150, name: "จ่าสิบเอก ชั้น 2" }, { exp: 23470, name: "จ่าสิบเอก ชั้น 3" }, { exp: 26023, name: "จ่าสิบเอก ชั้น 4" }, { exp: 28830, name: "จ่าสิบเอก ชั้น 5" },
    { exp: 31919, name: "ร้อยตรี ชั้น 1" }, { exp: 35316, name: "ร้อยตรี ชั้น 2" }, { exp: 39393, name: "ร้อยตรี ชั้น 3" }, { exp: 44285, name: "ร้อยตรี ชั้น 4" }, { exp: 50156, name: "ร้อยตรี ชั้น 5" },
    { exp: 57201, name: "ร้อยโท ชั้น 1" }, { exp: 65655, name: "ร้อยโท ชั้น 2" }, { exp: 75799, name: "ร้อยโท ชั้น 3" }, { exp: 87973, name: "ร้อยโท ชั้น 4" }, { exp: 102581, name: "ร้อยโท ชั้น 5" },
    { exp: 120111, name: "ร้อยเอก ชั้น 1" }, { exp: 141146, name: "ร้อยเอก ชั้น 2" }, { exp: 166389, name: "ร้อยเอก ชั้น 3" }, { exp: 196681, name: "ร้อยเอก ชั้น 4" }, { exp: 223030, name: "ร้อยเอก ชั้น 5" },
    { exp: 256650, name: "พันตรี ชั้น 1" }, { exp: 298994, name: "พันตรี ชั้น 2" }, { exp: 321806, name: "พันตรี ชั้น 3" }, { exp: 357181, name: "พันตรี ชั้น 4" }, { exp: 387631, name: "พันตรี ชั้น 5" },
    { exp: 426170, name: "พันโท ชั้น 1" }, { exp: 466418, name: "พันโท ชั้น 2" }, { exp: 513715, name: "พันโท ชั้น 3" }, { exp: 555272, name: "พันโท ชั้น 4" }, { exp: 595640, name: "พันโท ชั้น 5" },
    { exp: 635421, name: "พันเอก ชั้น 1" }, { exp: 689519, name: "พันเอก ชั้น 2" }, { exp: 728437, name: "พันเอก ชั้น 3" }, { exp: 758138, name: "พันเอก ชั้น 4" }, { exp: 790179, name: "พันเอก ชั้น 5" },
    { exp: 847229, name: "พลจัตวา ชั้น 1" }, { exp: 900000, name: "พลจัตวา ชั้น 2" }, { exp: 960005, name: "พลจัตวา ชั้น 3" }, { exp: 1020000, name: "พลจัตวา ชั้น 4" }, { exp: 1076545, name: "พลจัตวา ชั้น 5" },
    { exp: 1150000, name: "พลตรี ชั้น 1" }, { exp: 1210000, name: "พลตรี ชั้น 2" }, { exp: 1280000, name: "พลตรี ชั้น 3" }, { exp: 1360000, name: "พลตรี ชั้น 4" }, { exp: 1420000, name: "พลตรี ชั้น 5" },
    { exp: 1485000, name: "พลโท ชั้น 1" }, { exp: 1565233, name: "พลโท ชั้น 2" }, { exp: 1647293, name: "พลโท ชั้น 3" }, { exp: 1720060, name: "พลโท ชั้น 4" }, { exp: 1800050, name: "พลโท ชั้น 5" },
    { exp: 1890612, name: "พลเอก ชั้น 1" }, { exp: 1985748, name: "พลเอก ชั้น 2" }, { exp: 2063398, name: "พลเอก ชั้น 3" }, { exp: 2099815, name: "พลเอก ชั้น 4" }, { exp: 2185665, name: "พลเอก ชั้น 5" },
    { exp: 2299999, name: "จอมพล ชั้น 1" }, { exp: 2399999, name: "จอมพล ชั้น 2" }, { exp: 2499999, name: "จอมพล ชั้น 3" }, { exp: 2599999, name: "จอมพล ชั้น 4" }, { exp: 2799999, name: "จอมพล ชั้น 5" }
];

window.getRankInfo = function(exp) {
    let currentRank = window.rankData[0];
    let nextRank = window.rankData[1];
    for (let i = 0; i < window.rankData.length; i++) {
        if (exp >= window.rankData[i].exp) {
            currentRank = window.rankData[i];
            nextRank = window.rankData[i + 1] ? window.rankData[i + 1] : window.rankData[i];
        } else { break; }
    }
    return { current: currentRank, next: nextRank };
}

window.rankIconUrls = {
    "ทหารฝึก": "https://i.ibb.co/hRn2gzyH/image.png",
    "พลทหาร": "https://i.ibb.co/Kj207QD9/image.png",
    "สิบตรี": "https://i.ibb.co/MyZ3Ph1Z/image.png",
    "สิบโท": "https://i.ibb.co/4996nkS/image.png",
    "สิบเอก": "https://i.ibb.co/23VzyWVZ/image.png",

    "จ่าสิบตรี ชั้น 1": "https://i.ibb.co/wNhxVYkD/image.png", "จ่าสิบตรี ชั้น 2": "https://i.ibb.co/ZR6dyJqd/image.png", "จ่าสิบตรี ชั้น 3": "https://i.ibb.co/6GDJjxB/image.png", "จ่าสิบตรี ชั้น 4": "https://i.ibb.co/s9d1xT3r/image.png", "จ่าสิบตรี ชั้น 5": "https://i.ibb.co/bMRpBbd6/image.png",
    "จ่าสิบโท ชั้น 1": "https://i.ibb.co/v4Y8jy1T/image.png", "จ่าสิบโท ชั้น 2": "https://i.ibb.co/M0WFZvm/image.png", "จ่าสิบโท ชั้น 3": "https://i.ibb.co/s9sd1kBS/image.png", "จ่าสิบโท ชั้น 4": "https://i.ibb.co/ksPc4s90/image.png", "จ่าสิบโท ชั้น 5": "https://i.ibb.co/h120Y5h4/image.png",
    "จ่าสิบเอก ชั้น 1": "https://i.ibb.co/rfFBR5Yn/image.png", "จ่าสิบเอก ชั้น 2": "https://i.ibb.co/QvnHm78z/image.png", "จ่าสิบเอก ชั้น 3": "https://i.ibb.co/0jsCY6LJ/image.png", "จ่าสิบเอก ชั้น 4": "https://i.ibb.co/N6NWbfjw/image.png", "จ่าสิบเอก ชั้น 5": "https://i.ibb.co/FbW53b9w/image.png",

    "ร้อยตรี ชั้น 1": "https://i.ibb.co/1G9K5tRg/image.png", "ร้อยตรี ชั้น 2": "https://i.ibb.co/jPwyq5QF/image.png", "ร้อยตรี ชั้น 3": "https://i.ibb.co/dw3XxkKr/image.png", "ร้อยตรี ชั้น 4": "https://i.ibb.co/gbdCzHsq/image.png", "ร้อยตรี ชั้น 5": "https://i.ibb.co/1f34hYy2/image.png",
    "ร้อยโท ชั้น 1": "https://i.ibb.co/4RbGmz5q/image.png", "ร้อยโท ชั้น 2": "https://i.ibb.co/pv3hwZ3n/image.png", "ร้อยโท ชั้น 3": "https://i.ibb.co/ksvwcCM4/image.png", "ร้อยโท ชั้น 4": "https://i.ibb.co/xS9nyLzb/image.png", "ร้อยโท ชั้น 5": "https://i.ibb.co/LDV89gHq/image.png",
    "ร้อยเอก ชั้น 1": "https://i.ibb.co/Gf3XBNHv/image.png", "ร้อยเอก ชั้น 2": "https://i.ibb.co/pB99VZYr/image.png", "ร้อยเอก ชั้น 3": "https://i.ibb.co/zHRPhVyb/image.png", "ร้อยเอก ชั้น 4": "https://i.ibb.co/QjzG7ZW9/image.png", "ร้อยเอก ชั้น 5": "https://i.ibb.co/pBCLF0VP/image.png",

    "พันตรี ชั้น 1": "https://i.ibb.co/wFhr3n15/image.png", "พันตรี ชั้น 2": "https://i.ibb.co/3mRk88sF/image.png", "พันตรี ชั้น 3": "https://i.ibb.co/8Lf1P1fK/image.png", "พันตรี ชั้น 4": "https://i.ibb.co/Bbq1KRx/image.png", "พันตรี ชั้น 5": "https://i.ibb.co/0jbT3NJt/image.png",
    "พันโท ชั้น 1": "https://i.ibb.co/4w36xdVN/image.png", "พันโท ชั้น 2": "https://i.ibb.co/xKSckVt0/image.png", "พันโท ชั้น 3": "https://i.ibb.co/Y4KmXJcM/image.png", "พันโท ชั้น 4": "https://i.ibb.co/4ZdkYPMQ/image.png", "พันโท ชั้น 5": "https://i.ibb.co/8DScQ6Nb/image.png",
    "พันเอก ชั้น 1": "https://i.ibb.co/hJb2KS65/image.png", "พันเอก ชั้น 2": "https://i.ibb.co/9kpLNNDc/image.png", "พันเอก ชั้น 3": "https://i.ibb.co/nN0vQSMW/image.png", "พันเอก ชั้น 4": "https://i.ibb.co/ymNh76zW/image.png", "พันเอก ชั้น 5": "https://i.ibb.co/jk5p04cH/image.png",

    "พลจัตวา ชั้น 1": "https://i.ibb.co/sJtZv30d/image.png", "พลจัตวา ชั้น 2": "https://i.ibb.co/XfMpvftD/image.png", "พลจัตวา ชั้น 3": "https://i.ibb.co/JWFNwsRF/image.png", "พลจัตวา ชั้น 4": "https://i.ibb.co/GrJRSv3/image.png", "พลจัตวา ชั้น 5": "https://i.ibb.co/r2pvQzgC/image.png",
    "พลตรี ชั้น 1": "https://i.ibb.co/K4QH7KS/image.png", "พลตรี ชั้น 2": "https://i.ibb.co/272twQyT/image.png", "พลตรี ชั้น 3": "https://i.ibb.co/WvVz588S/image.png", "พลตรี ชั้น 4": "https://i.ibb.co/sJcJcXL1/image.png", "พลตรี ชั้น 5": "https://i.ibb.co/kVvbN1Hv/image.png",
    "พลโท ชั้น 1": "https://i.ibb.co/mKHgfZK/image.png", "พลโท ชั้น 2": "https://i.ibb.co/1trgbcbg/image.png", "พลโท ชั้น 3": "https://i.ibb.co/KxySG719/image.png", "พลโท ชั้น 4": "https://i.ibb.co/z3WpwMB/image.png", "พลโท ชั้น 5": "https://i.ibb.co/CppRM8z5/image.png",
    "พลเอก ชั้น 1": "https://i.ibb.co/Gvx6MjB2/image.png", "พลเอก ชั้น 2": "https://i.ibb.co/Dg6c0R2J/image.png", "พลเอก ชั้น 3": "https://i.ibb.co/0Ry1YCYf/image.png", "พลเอก ชั้น 4": "https://i.ibb.co/qMwNXcVk/image.png", "พลเอก ชั้น 5": "https://i.ibb.co/FLh7dYsW/image.png",

    "จอมพล ชั้น 1": "https://i.ibb.co/LhtLFKkX/image.png", "จอมพล ชั้น 2": "https://i.ibb.co/PzDjwRy8/image.png", "จอมพล ชั้น 3": "https://i.ibb.co/ymkDBM1x/image.png", "จอมพล ชั้น 4": "https://i.ibb.co/zWhqK38P/image.png", "จอมพล ชั้น 5": "https://i.ibb.co/QWHmcWP/image.png"
};

window.getRankIcon = function(rankName, size = 60) {
    const defaultIcon = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"; 
    const imageUrl = window.rankIconUrls[rankName] || defaultIcon;
    return `<img src="${imageUrl}" width="${size}" height="${size}" style="vertical-align: middle; border-radius: 4px; object-fit: contain;">`;
}

window.updateExpUI = function(exp) {
    if (typeof window.getRankInfo !== 'function') return;
    const info = window.getRankInfo(exp);
    let rText = document.getElementById('rankTextDisplay');
    if(rText) rText.innerText = info.current.name;
    
    let rIcon = document.getElementById('rankIconSmallDisplay');
    if(rIcon) rIcon.innerHTML = window.getRankIcon(info.current.name, 40);
    
    let nText = document.getElementById('nextRankTextDisplay');
    if(nText) nText.innerText = info.next.name;
    
    let nIcon = document.getElementById('nextRankIconDisplay');
    if(nIcon) nIcon.innerHTML = window.getRankIcon(info.next.name, 24);

    let progress = 2;
    if (info.current.exp !== info.next.exp) {
        let expInCurrentLevel = exp - info.current.exp;
        let expNeededForNext = info.next.exp - info.current.exp;
        progress = (expInCurrentLevel / expNeededForNext) * 100;
        let expNum = document.getElementById('expNumbersDisplay');
        if(expNum) expNum.innerText = `${exp.toLocaleString()} / ${info.next.exp.toLocaleString()} EXP`;
    } else {
        let expNum = document.getElementById('expNumbersDisplay');
        if(expNum) expNum.innerText = `MAX LEVEL (${exp.toLocaleString()} EXP)`;
        if(nText) nText.innerText = "ตันแล้ว"; 
    }
    let expFill = document.getElementById('expBarFill');
    if(expFill) expFill.style.width = `${progress}%`;
}

window.getRankText = function(wpm) {
    if (wpm <= 30) return `พิมพ์เป็นไหมวะ กากว่ะ`;
    if (wpm <= 40) return `ไปฝึกเยอะๆ ยังอ่อนอยู่`;
    if (wpm <= 50) return `มึงกำลังหัดพิมพ์หรอ?`;
    if (wpm <= 60) return `เหยดๆ เริ่มเก่งละว่ะ`;
    if (wpm <= 65) return `โหดสัสรัสเซีย แม่เย็ด`;
    if (wpm <= 75) return `สุดจัด มึงก็พิมพ์ไวไป`;
    if (wpm <= 84) return `ไอ้เหี้ย มึงจะสุดไปละ`;
    if (wpm <= 95) return `มึงจะไวเกินไปละไอ้เวร`;
    if (wpm <= 105) return `โคตรพ่อโคตรแม่ไวจัด`;
    if (wpm <= 116) return `พิมพ์ก็ไว เสร็จก็ไวไอ้สัส`;
    if (wpm <= 129) return `เร็วสัส ใครจะสู้ได้วะแม่เย็ด`;
    if (wpm <= 139) return `เกือบจะตึงหนึ่งเดียวในบริษัทแล้ว`;        
    return `ตัวตึงหนึ่งเดียวในบริษัท`;
}