// ?? ?λ퉬 寃???쇱젙 ?곗씠????????????????????????????????
const EQUIPMENT_INSPECTIONS = [
  { name: 'MRI 3.0 (GE-SIGNA Pioneer)',   short: 'MRI ?뺣?', id: 'mri-precision',   type: 'precision',
    baseDate: '2026-04-02', cyclYears: 3, emoji: '?㎠', adjustable: true },
  { name: 'MRI 3.0 (GE-SIGNA Pioneer)',   short: 'MRI ?쒕쪟', id: 'mri-doc',   type: 'doc',
    baseDate: '2026-04-02', cyclYears: 1, emoji: '?뱥', adjustable: true },
  { name: 'CT (SOMATOM-Perspective)',      short: 'CT ?쒕쪟', id: 'ct-doc',    type: 'doc',
    baseDate: '2028-01-13', cyclYears: 1, emoji: '?뱥', adjustable: true },
  { name: 'MAMMO (selenia F)',             short: 'MAMMO ?쒕쪟', id: 'mammo-doc', type: 'doc',
    baseDate: '2026-03-03', cyclYears: 1, emoji: '?뱥', adjustable: true },
  { name: 'CT (SOMATOM-Perspective)',      short: 'CT ?덉쟾+?뺣?', id: 'ct-safety', type: 'safety',
    baseDate: '2028-01-13', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: 'MAMMO (selenia F)',             short: 'MAMMO ?덉쟾', id: 'mammo-safety',  type: 'safety',
    baseDate: '2026-03-03', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '珥ъ쁺?? (CDX-RD85DII)',         short: '珥ъ쁺?? ?덉쟾', id: 'cr1-safety', type: 'safety',
    baseDate: '2026-04-28', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '珥ъ쁺?? (CDX-RD85DII)',         short: '珥ъ쁺?? ?덉쟾', id: 'cr2-safety', type: 'safety',
    baseDate: '2028-03-07', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '怨⑤???(EXCELLUS=BHR-3-83)',   short: '怨⑤????덉쟾', id: 'bone-safety',  type: 'safety',
    baseDate: '2025-04-09', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '珥덉쓬?뚯뇙?앷린 (Rifle=HF-5-125)', short: '珥덉쓬?뚯뇙?앷린 ?덉쟾', id: 'uls-safety', type: 'safety',
    baseDate: '2025-04-11', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: 'C-ARM 1 (Brivo OEC 785)',      short: 'C-ARM1 ?덉쟾', id: 'carm1-safety', type: 'safety',
    baseDate: '2028-01-04', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: 'C-ARM 2 (Brivo OEC 785)',      short: 'C-ARM2 ?덉쟾', id: 'carm2-safety', type: 'safety',
    baseDate: '2028-04-29', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '蹂멸? POTABLE (MUX-10)',        short: '蹂멸?POTABLE ?덉쟾', id: 'pot-main-safety', type: 'safety',
    baseDate: '2028-12-24', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '?좊퀎 POTABLE (SIRIUS STAR)',   short: '?좊퀎POTABLE ?덉쟾', id: 'pot-sel-safety', type: 'safety',
    baseDate: '2026-09-22', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '?뚯븬 POTABLE (JADE-40)',       short: '?뚯븬POTABLE ?덉쟾', id: 'pot-neg-safety', type: 'safety',
    baseDate: '2028-02-04', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '寃吏??뚮끂?쇰쭏 (Orthophos3)',   short: '?뚮끂?쇰쭏 ?덉쟾', id: 'pan-safety',   type: 'safety',
    baseDate: '2027-02-27', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '寃吏?INNOVISION-DX',          short: 'INNOVISION ?덉쟾', id: 'inno-safety', type: 'safety',
    baseDate: '2026-05-13', cyclYears: 3, emoji: '?썳', adjustable: true },
  { name: '寃吏??꾩옣珥ъ쁺 (KXO-50N)',     short: '?꾩옣珥ъ쁺 ?덉쟾', id: 'gi-safety',   type: 'safety',
    baseDate: '2027-09-26', cyclYears: 3, emoji: '?썳', adjustable: true },
];

function getInspectionDates(baseDate, cyclYears, maxYear = 2035) {
  const dates = [];
  const base = new Date(baseDate);
  const baseYear = base.getFullYear();
  for (let y = baseYear; y <= maxYear; y += cyclYears) {
    const d = new Date(base);
    d.setFullYear(y);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// ??FIX: inspDates (not __insp_dates__)
function buildInspectionMemos() {
  const memos = {};
  const inspDates = window.schedule['inspDates'] || {};
  EQUIPMENT_INSPECTIONS.forEach((item) => {
    const dates = getInspectionDates(item.baseDate, item.cyclYears);
    dates.forEach(baseDk => {
      const storeKey = baseDk + '_' + item.id;
      const actual = inspDates[storeKey] || baseDk;
      if (!memos[actual]) memos[actual] = [];
      const typeLabel = { precision:'?뺣?寃??, safety:'?덉쟾寃??, doc:'?쒕쪟寃?? }[item.type] || item.type;
      const movedNote = actual !== baseDk ? ` ?⑷린以:${baseDk}` : '';
      memos[actual].push(`${item.emoji} [${typeLabel}] ${item.name}${movedNote}`);
    });
  });
  return memos;
}

function getUpcomingInspections(days = 15) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const limit = new Date(today); limit.setDate(today.getDate() + days);
  const results = [];
  const inspDatesU = window.schedule['inspDates'] || {};
  EQUIPMENT_INSPECTIONS.forEach((item) => {
    const dates = getInspectionDates(item.baseDate, item.cyclYears);
    dates.forEach(baseDk => {
      const dk = inspDatesU[baseDk + '_' + item.id] || baseDk;
      const d = new Date(dk);
      if (d >= today && d <= limit) {
        const diff = Math.round((d - today) / 86400000);
        const typeLabel = { precision:'?뺣?寃??, safety:'?덉쟾寃??, doc:'?쒕쪟寃?? }[item.type];
        const adjusted = dk !== baseDk ? ` (湲곗?: ${baseDk})` : '';
        results.push({ dk, diff, label: `${item.emoji} ${item.short} ${typeLabel}${adjusted}`, name: item.name });
      }
    });
  });
  results.sort((a,b) => a.diff - b.diff);
  return results;
}

// ?? 濡쒓렇?????????????????????????????????????????????
const SECRET_PIN = "6633";
function checkLoginStatus() {
  const ok = localStorage.getItem('calendar_auth') === 'true';
  document.getElementById('login-overlay').style.display = ok ? 'none' : 'flex';
  document.getElementById('app-container').style.display = ok ? 'block' : 'none';
  if (!ok) { const i = document.getElementById('pin-input'); if(i){i.value=''; updateDots('');} }
}
function onPinInput() { const v = document.getElementById('pin-input').value; updateDots(v); if (v.length === 4) setTimeout(handleLogin, 80); }
function updateDots(v) { for (let i=0;i<4;i++) { const d=document.getElementById('dot-'+i); if(d) d.classList.toggle('filled', i<v.length); } }
function handleLogin() {
  const v = document.getElementById('pin-input').value;
  if (v === SECRET_PIN) { localStorage.setItem('calendar_auth','true'); checkLoginStatus(); showToast('???낆옣 ?꾨즺!'); }
  else { const box=document.querySelector('.login-box'); box.classList.remove('login-shake'); void box.offsetWidth; box.classList.add('login-shake'); document.getElementById('pin-input').value=''; updateDots(''); showToast('鍮꾨?踰덊샇媛 ??몄뒿?덈떎'); }
}
function handleLogout() { localStorage.removeItem('calendar_auth'); checkLoginStatus(); showToast('濡쒓렇?꾩썐 ?섏뿀?듬땲??); }
window.handleLogin=handleLogin; window.handleLogout=handleLogout; window.onPinInput=onPinInput;

window.setSyncStatus = function(s) {
  const el = document.getElementById('sync-indicator'); if (!el) return;
  el.className = s;
  el.title = {saving:'???以?..',saved:'??λ맖',online:'?숆린??以?,offline:'?ㅽ봽?쇱씤'}[s]||'';
};

// ?? ?곗씠?????????????????????????????????????????????
const DOCTOR_MAP = [
  { name:'源醫낇솚', initial:'醫?, totalLeave:25, title:'?ㅼ옣' },
  { name:'?댁듅??, initial:'??, totalLeave:24, title:'怨꾩옣' },
  { name:'?대룞??, initial:'??, totalLeave:22, title:'怨꾩옣' },
  { name:'媛뺤?誘?, initial:'媛?, totalLeave:16, title:'怨꾩옣' },
  { name:'?≪꽑寃?, initial:'??, totalLeave:18, title:'二쇱엫' },
  { name:'源?꾩젙', initial:'??, totalLeave:18, title:'二쇱엫' },
  { name:'?≪슦??, initial:'??, totalLeave:16, title:'?좎깮?? },
  { name:'源?꾩꽍', initial:'??, totalLeave:16, title:'?좎깮?? },
  { name:'吏???, initial:'吏', totalLeave:15, title:'?좎깮?? },
  { name:'?≪쭊??, initial:'吏?, totalLeave:15, title:'?좎깮?? },
  { name:'議곗???, initial:'議?, totalLeave:10, title:'?좎깮?? },
  { name:'?댁슜吏?, initial:'??, totalLeave:9,  title:'?좎깮?? },
  { name:'源遊됱꽑', initial:'遊?, totalLeave:17, title:'?좎깮?? }
];

const DUTY_ROWS = [
  { id:'half_am',  label:'?ㅼ쟾諛섏감',    color:'c-orange', useName:false },
  { id:'half_pm',  label:'?ㅽ썑諛섏감',    color:'c-blue',   useName:false },
  { id:'off40',    label:'40H OFF',     color:'c-rose',   useName:false },
  { id:'vacation', label:'醫낆씪?곗감',    color:'c-purple', useName:false },
  { id:'alt_leave',label:'???李④컧X)', color:'c-emerald',useName:false },
  { id:'ctmr',     label:'CT / MR',    color:'c-teal',   useName:false },
  { id:'evening',  label:'?대툕??,      color:'c-amber',  useName:true  },
  { id:'night',    label:'?쇨컙?뱀쭅',    color:'c-indigo', useName:true  }
];

const DOT_MARKERS = {"2026-03-07":1,"2026-03-14":2,"2026-03-21":2,"2026-03-28":1,"2026-04-04":1,"2026-04-11":2,"2026-04-18":2,"2026-04-25":1,"2026-05-02":1,"2026-05-09":2,"2026-05-16":2,"2026-05-23":1,"2026-05-30":1,"2026-06-06":1,"2026-06-13":1,"2026-06-20":2,"2026-06-27":1,"2026-07-04":1,"2026-07-11":2,"2026-07-18":2,"2026-07-25":1,"2026-08-01":1};

// ?? 2026????쒕?援?怨듯쑕????
// red: true = 踰뺤젙怨듯쑕??鍮④컙??, false = ?꾩떆怨듯쑕??湲곕뀗??寃??? ?뺣낫留?
const HOLIDAYS_2026 = {
  '01-01':{name:'?좎젙',red:true},
  '02-16':{name:'?ㅻ궇 ?고쑕',red:true},
  '02-17':{name:'?ㅻ궇',red:true},
  '02-18':{name:'?ㅻ궇 ?고쑕',red:true},
  '03-01':{name:'?쇱씪??,red:true},
  '03-02':{name:'?쇱씪???泥닿났?댁씪',red:false}, // ?ш린瑜?false濡??섏젙
  '05-01':{name:'洹쇰줈?먯쓽 ??,red:true},
  '05-05':{name:'?대┛?대궇',red:true},
  '05-24':{name:'遺泥섎떂?ㅼ떊??,red:true},
  '05-25':{name:'遺泥섎떂?ㅼ떊???泥닿났?댁씪',red:false}, // ?ш린瑜?false濡??섏젙
  '06-03':{name:'吏諛⑹꽑嫄곗씪',red:false},
  '06-06':{name:'?꾩땐??,red:true},
  '08-15':{name:'愿묐났??,red:true},
  '08-17':{name:'愿묐났???泥닿났?댁씪',red:false}, // ?ш린瑜?false濡??섏젙
  '09-24':{name:'異붿꽍 ?고쑕',red:true},
  '09-25':{name:'異붿꽍',red:true},
  '09-26':{name:'異붿꽍 ?고쑕',red:true},
  '10-03':{name:'媛쒖쿇??,red:true},
  '10-05':{name:'媛쒖쿇???泥닿났?댁씪',red:false}, // ?ш린瑜?false濡??섏젙
  '10-09':{name:'?쒓???,red:true},
  '12-25':{name:'?щ━?ㅻ쭏??,red:true}
};

function getHolidayInfo(dk) {
  return HOLIDAYS_2026[dk.slice(5)] || null;
}

// ?? 蹂댁닔援먯쑁 / ?숈닠????쇱젙 ??
const EDU_EVENTS = [
  {d:'2026-03-07',org:'??쒖쁺?곸쓽?숆린?좏븰??,name:'??3李??숈닠???,time:'11:00~18:00',place:'?좎큿?몃툕???Hybrid)',fee:'?꾨궔 30,000 / 誘몃궔 60,000'},
  {d:'2026-03-07',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-03-07',org:'??쒖씤?곕깽?섏쁺?곴린?좏븰??,name:'??李?蹂댁닔援먯쑁',time:'13:00~17:00',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-04-25',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'異섍퀎?숈닠???,time:'13:00~17:00',place:'寃쎌＜ ?붾갚而⑤깽?섏꽱??,fee:'?꾨궔 60,000 / 誘몃궔 90,000'},
  {d:'2026-04-25',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'異섍퀎?숈닠???,time:'',place:'媛뺣룞寃쏀씗?蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-04-25',org:'??쒖쁺?곸쓽?숆린?좏븰??,name:'??李?蹂댁닔援먯쑁',time:'14:00~18:00',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-04-25',org:'?좊갑?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁',time:'',place:'以묒븰??숆탳蹂묒썝(Hybrid)',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-04-25',org:'??쒕갑?ъ꽑移섎즺?숉쉶',name:'異섍퀎?숈닠???,time:'13:00~17:00',place:'媛뺣쫱?꾩궛蹂묒썝(Hybrid)',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-05-15',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁(?援ъ?遺)',time:'18:30~20:30',place:'?援ш??⑤┃??숆탳蹂묒썝',fee:'?꾨궔 12,000 / 誘몃궔 27,000'},
  {d:'2026-05-15',org:'??쒖씤?곕깽?섏쁺?곴린?좏븰??,name:'??李?蹂댁닔援먯쑁(異섍퀎?곗닔媛뺤쥖)',time:'13:00~17:00',place:'遺?고빆援?젣?꾩떆而⑤깽?섏꽱??,fee:'?꾨궔 40,000 / 誘몃궔 70,000'},
  {d:'2026-05-16',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'?숆컯??숆탳',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-05-16',org:'??쒖옄湲곌났紐낃린?좏븰??,name:'??6李?異섍퀎?숈닠???,time:'14:00~18:00',place:'援곗궛?덈쭔湲덉빻踰ㅼ뀡?쇳꽣',fee:'?꾨궔 60,000 / 誘몃궔 90,000'},
  {d:'2026-05-16',org:'??쒖씤?곕깽?섏쁺?곴린?좏븰??,name:'異섍퀎?숈닠???,time:'08:00~12:00',place:'遺?고빆援?젣?꾩떆而⑤깽?섏꽱??,fee:'?꾨궔 40,000 / 誘몃궔 70,000'},
  {d:'2026-05-17',org:'??쒖옄湲곌났紐낃린?좏븰??,name:'??李?蹂댁닔援먯쑁(MR?덉쟾愿由?',time:'09:00~13:00',place:'援곗궛?덈쭔湲덉빻踰ㅼ뀡?쇳꽣',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-05-23',org:'遺?곌킅??떆??,name:'??6???숈닠???,time:'09:00~18:00',place:'?숈븘??숆탳 遺誘쇱틺?쇱뒪 ?ㅼ슦?',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-06-13',org:'??쒖쁺?곸쓽?숆린?좏븰??,name:'??李?蹂댁닔援먯쑁',time:'14:00~18:00',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-06-27',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁(?좊웾/?곸긽愿由?',time:'13:00~17:00',place:'怨좊젮??숆탳 ?덉븫蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-06-27',org:'??쒕갑?ъ꽑怨쇳븰??,name:'2026 KSRSC ?숈닠???,time:'10:00~18:00',place:'?좉뎄??숆탳',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-07-04',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'?숇궓蹂닿굔?',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-07-04',org:'??쒕뵒吏?몄쓽猷뚯쁺?곹븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-08-08',org:'??쒖옄湲곌났紐낃린?좏븰??,name:'??李?蹂댁닔援먯쑁(MR臾쇰━?낅Ц)',time:'14:00~18:00',place:'嫄닿뎅??숆탳蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-08-09',org:'??쒖옄湲곌났紐낃린?좏븰??,name:'??李?蹂댁닔援먯쑁(MR?꾩긽?낅Ц)',time:'10:00~14:00',place:'嫄닿뎅??숆탳蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-08-23',org:'??쒖쁺?곸쓽?숆린?좏븰??,name:'AI?숈닠???,time:'11:00~18:00',place:'嫄닿뎅??숆탳蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-08-28',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁(遺?곗?遺)',time:'18:30~20:30',place:'遺??醫뗭?媛뺤븞蹂묒썝',fee:'?꾨궔 12,000 / 誘몃궔 27,000'},
  {d:'2026-09-03',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁(?꾨턿吏遺)',time:'18:30~20:30',place:'?먭킅??숆탳蹂묒썝',fee:'?꾨궔 12,000 / 誘몃궔 27,000'},
  {d:'2026-09-05',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'?좉뎄??숆탳',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-09-05',org:'??쒕뵒吏?몄쓽猷뚯쁺?곹븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-10-17',org:'??쏞T?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁(議곗쁺?쒖븞?꾧?由?',time:'13:00~17:00',place:'媛?⑤┃? ?쒖슱?깅え蹂묒썝',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-10-17',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'?좉뎄??숆탳',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-10-17',org:'??쒕갑?ъ꽑移섎즺?숉쉶',name:'異붽퀎?숈닠???,time:'13:00~17:00',place:'嫄닿뎅??숆탳蹂묒썝(Hybrid)',fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-10-24',org:'遺?곌킅??떆??,name:'2李?蹂댁닔援먯쑁',time:'14:00~18:00',place:'踰≪뒪肄?,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-11-13',org:'??쒕뵒吏?몄쓽猷뚯쁺?곹븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-11-14',org:'??쒖쁺?곸쓽?숆린?좏븰??,name:'??李?蹂댁닔援먯쑁',time:'14:00~18:00',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-11-21',org:'??쒕갑?ъ꽑移섎즺?숉쉶',name:'1李?蹂댁닔援먯쑁(異⑹껌?꾨씪吏??',time:'14:00~16:00',place:'?꾨턿??숆탳蹂묒썝',fee:'?꾨궔 12,000 / 誘몃궔 27,000'},
  {d:'2026-11-28',org:'??쒖쓽猷뚯쁺?곸젙蹂닿?由ы븰??,name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-11-28',org:'?좊갑?곸긽湲곗닠?숉쉶',name:'??李?蹂댁닔援먯쑁',time:'',place:'ZOOM ?⑤씪??,fee:'?꾨궔 24,000 / 誘몃궔 54,000'},
  {d:'2026-11-28',org:'??쒕갑?ъ꽑移섎즺?숉쉶',name:'2李?蹂댁닔援먯쑁(遺?곗슱?곌꼍??',time:'14:00~16:00',place:'怨좎떊??숆탳蹂듭쓬蹂묒썝',fee:'?꾨궔 12,000 / 誘몃궔 27,000'},
];

function getEduEvents(dateKey) {
  return EDU_EVENTS.filter(e => e.d === dateKey);
}
window.schedule = {};

const _today = new Date();
let viewYear=_today.getFullYear(), viewMonth=_today.getMonth();

let selectedDateKey=null, selectedDoc=null, showScreening=false;

function isHoliday(dk) {
  const h = HOLIDAYS_2026[dk.slice(5)];
  return h ? h.red : false;
}
function showToast(msg) { const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2000); }

function getHighlightType(dateKey) {
  if (!selectedDoc) return null;
  const day = window.schedule[dateKey]; if (!day) return null;
  const isSat = new Date(dateKey).getDay()===6;
  if ((day.night||'').includes(selectedDoc.name)||(day.evening||'').includes(selectedDoc.name)) return 'blue';
  if ((day.vacation||'').includes(selectedDoc.initial)) return 'red';
  if ((day.half_am||'').includes(selectedDoc.initial)) return 'half-am';
  if ((day.off40||'').includes(selectedDoc.initial)||(day.half_pm||'').includes(selectedDoc.initial)) return isSat?'red':'half-pm';
  if (hasAltLeave(day, selectedDoc.initial)) return 'green';
  return null;
}

function hasAltLeave(dayData, initial) {
  const raw = dayData.alt_leave || '';
  return raw.split(' ').filter(Boolean).some(item => {
    const name = item.includes(':') ? item.split(':')[1] : item;
    return name === initial;
  });
}

function getAltLeaveReason(dayData, initial) {
  const raw = dayData.alt_leave || '';
  const found = raw.split(' ').filter(Boolean).find(item => {
    const name = item.includes(':') ? item.split(':')[1] : item;
    return name === initial;
  });
  if (!found) return null;
  return found.includes(':') ? found.split(':')[0] : 'rest';
}

// ?? 罹섎┛???뚮뜑 ???????????????????????????????????????
function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  const firstDay = new Date(viewYear,viewMonth,1).getDay();
  const lastDate = new Date(viewYear,viewMonth+1,0).getDate();

  for (let i=0;i<firstDay;i++) { const e=document.createElement('div'); e.className='cal-cell-empty'; grid.appendChild(e); }

  // ???깅뒫: adjMemos 猷⑦봽 諛뽰뿉????踰덈쭔 怨꾩궛
  const _adjMemos = {};
  const _inspDatesCache = window.schedule['inspDates'] || {};
  EQUIPMENT_INSPECTIONS.forEach((item, idx) => {
    const dates = getInspectionDates(item.baseDate, item.cyclYears);
    dates.forEach(baseDk => {
      const storeKey = baseDk + '_' + item.id;
      const actual = _inspDatesCache[storeKey] || baseDk;
      if (!_adjMemos[actual]) _adjMemos[actual] = [];
      const typeLabel = {precision:'?뺣?寃??,safety:'?덉쟾寃??,doc:'?쒕쪟寃??}[item.type];
      const movedNote = actual !== baseDk ? ` ?⑷린以:${baseDk}` : '';
      _adjMemos[actual].push({ text: `${item.emoji} [${typeLabel}] ${item.name}${movedNote}`, idx, base: baseDk, id: item.id });
    });
  });

  for (let d=1;d<=lastDate;d++) {
    const dateKey=`${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayData=window.schedule[dateKey]||{};
    const dow=new Date(dateKey).getDay();
    const isSun=dow===0, isSat=dow===6;

    const isCT = selectedDoc && (dayData.ctmr||'').split(' ').filter(Boolean).includes(selectedDoc.initial);
    const hl = getHighlightType(dateKey);

    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (selectedDateKey===dateKey?' selected':'') + (isCT?' ct-day':'');

    if (hl || isCT) {
      const ov = document.createElement('div');
      ov.className = 'hl-overlay';
      if (hl==='blue')    ov.style.background='rgba(59,130,246,0.22)';
      else if (hl==='green')   ov.style.background='rgba(16,185,129,0.22)';
      else if (hl==='red')    ov.style.background='rgba(239,68,68,0.22)';
      else if (hl==='half-am') ov.style.background='linear-gradient(to bottom,rgba(239,68,68,0.22) 50%,transparent 50%)';
      else if (hl==='half-pm') ov.style.background='linear-gradient(to top,rgba(239,68,68,0.22) 50%,transparent 50%)';
      if (isCT) {
        const ctLabel = document.createElement('span');
        ctLabel.style.cssText = 'font-size:36px;font-weight:900;color:rgba(13,148,136,0.22);letter-spacing:-1px;pointer-events:none;user-select:none;';
        ctLabel.textContent = (dayData.ctmr||'').includes('MR') ? 'CT쨌MR' : 'CT';
        ov.appendChild(ctLabel);
      }
      cell.appendChild(ov);
    }
    if (selectedDoc && !hl && !isCT) cell.classList.add('dimmed');

    const inner = document.createElement('div');
    inner.className = 'cell-inner';

    const dayHeaderRow = document.createElement('div');
    dayHeaderRow.className = 'day-header-row';
    const numSpan = document.createElement('span');
    // ??怨듯쑕??red)?대㈃ 鍮④컙???쒖떆
    const holidayInfo = getHolidayInfo(dateKey);
    const isRedH = holidayInfo && holidayInfo.red;
    numSpan.className = 'day-num' + ((isSun || isRedH) ? ' sun' : (isSat ? ' sat' : ''));
    numSpan.textContent = d;
    dayHeaderRow.appendChild(numSpan);

    if (dayData.memo && dayData.memo.trim()) {
      const mi = document.createElement('span');
      mi.className = 'memo-icon'; mi.title = dayData.memo;
      mi.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>`;
      dayHeaderRow.appendChild(mi);
    }

    if (_adjMemos[dateKey]) {
      const inspIcon = document.createElement('span');
      inspIcon.className = 'memo-icon insp-icon';
      inspIcon.title = _adjMemos[dateKey].map(x=>x.text).join('\n');
      inspIcon.style.color = '#ef4444'; inspIcon.style.cursor = 'pointer';
      inspIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
      const dateItems = _adjMemos[dateKey];
      inspIcon.addEventListener('click', (e) => { e.stopPropagation(); openInspMovePopup(dateKey, dateItems); });
      dayHeaderRow.appendChild(inspIcon);
    }
    inner.appendChild(dayHeaderRow);

    // ??怨듯쑕???대쫫 ?쒖떆
    if (holidayInfo) {
      const hDiv = document.createElement('div');
      hDiv.className = 'holiday-name' + (holidayInfo.red ? '' : ' info-only');
      hDiv.textContent = holidayInfo.name;
      inner.appendChild(hDiv);
    }
    // ??援먯쑁 ?쇱젙 ?쒖떆
    const eduList = getEduEvents(dateKey);
    if (eduList.length > 0) {
      const eTag = document.createElement('div');
      eTag.className = 'edu-indicator';
      eTag.textContent = '?뱴' + (eduList.length > 1 ? eduList.length + '嫄? : eduList[0].org.replace(/????숉쉶/g,'').slice(0,5));
      inner.appendChild(eTag);
    }

    const dots = DOT_MARKERS[dateKey];
    if (dots) { const dr=document.createElement('div'); dr.className='dots'; for(let x=0;x<dots;x++){const dt=document.createElement('div');dt.className='dot';dr.appendChild(dt);} inner.appendChild(dr); }
    else { const ph=document.createElement('div'); ph.style.height='10px'; inner.appendChild(ph); }

    const slots=document.createElement('div'); slots.className='badge-slots';
    const mkRow=()=>{const r=document.createElement('div');r.className='badge-row';return r;};
    const badgeClass = (initial) => { if (!isCT) return ''; return (selectedDoc && selectedDoc.initial === initial) ? ' my-badge' : ' other-badge'; };
    const tagClass = (name) => { if (!isCT) return ''; return (selectedDoc && (selectedDoc.name === name || selectedDoc.initial === name)) ? ' my-tag' : ' other-tag'; };

    const rAm=mkRow(); (dayData.half_am||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge half-am'+badgeClass(n);b.textContent='?'+n;rAm.appendChild(b);}); slots.appendChild(rAm);
    const rPm=mkRow(); (dayData.half_pm||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge half-pm'+badgeClass(n);b.textContent='?뙔'+n;rPm.appendChild(b);}); slots.appendChild(rPm);
    const rOff=mkRow(); (dayData.off40||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge '+(isSat?'off40-sat':'off40-weekday')+badgeClass(n);b.textContent=isSat?n:'40:'+n;rOff.appendChild(b);}); slots.appendChild(rOff);
    const rVac=mkRow();
    (dayData.vacation||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge vacation'+badgeClass(n);b.textContent='?룤'+n;rVac.appendChild(b);});
    (dayData.alt_leave||'').split(' ').filter(Boolean).forEach(item=>{
      const reason = item.includes(':') ? item.split(':')[0] : 'rest';
      const name   = item.includes(':') ? item.split(':')[1] : item;
      const icons  = {rest:'?뙼', reserve:'?첉', event:'?뮁', public:'?룢', 'half-am':'?截?, 'half-pm':'?뙔'};
      const classes= {rest:'alt-rest', reserve:'alt-reserve', event:'alt-event', public:'alt-public', 'half-am':'alt-half-am', 'half-pm':'alt-half-pm'};
      const b=document.createElement('span');
      b.className='badge '+(classes[reason]||'alt-rest')+badgeClass(name);
      b.textContent=(icons[reason]||'?뙼')+name;
      rVac.appendChild(b);
    });
    slots.appendChild(rVac);
    inner.appendChild(slots);

    const bottom=document.createElement('div'); bottom.className='bottom-tags';
    (dayData.evening||'').split(' ').filter(Boolean).forEach(n=>{const t=document.createElement('div');t.className='evening-tag'+tagClass(n);t.textContent=n;bottom.appendChild(t);});
    (dayData.night||'').split(' ').filter(Boolean).forEach(n=>{const t=document.createElement('div');t.className='night-tag'+tagClass(n);t.textContent=n;bottom.appendChild(t);});
    inner.appendChild(bottom);

    cell.appendChild(inner);
    cell.addEventListener('click', ()=>openPopup(dateKey));
    grid.appendChild(cell);
  }
  document.getElementById('month-text').textContent=`${viewYear}??${viewMonth+1}??;
}

// ?? 諛곕꼫 ??????????????????????????????????????????????
function renderBanner() {
  const scroll=document.getElementById('banner-scroll'); scroll.innerHTML='';
  DOCTOR_MAP.forEach(doc=>{
    const btn=document.createElement('button');
    btn.className='doc-btn'+(selectedDoc?.name===doc.name?' active':'');
    btn.innerHTML=`<span class="t">${doc.title}</span><span class="n">${doc.initial}</span>`;
    btn.onclick=()=>{ selectedDoc=selectedDoc?.name===doc.name?null:doc; renderBanner(); renderCalendar(); };
    scroll.appendChild(btn);
  });
}
function bannerScroll(dir){ document.getElementById('banner-scroll').scrollBy({left:dir*200,behavior:'smooth'}); }
window.bannerScroll=bannerScroll;

// ?? ?앹뾽 ??????????????????????????????????????????????
function openPopup(dateKey) {
  selectedDateKey=dateKey; selectedDoc=null;
  renderBanner(); renderCalendar();
  document.getElementById('popup-title').textContent=dateKey.slice(5)+' 諛곗젙';
  // ???ъ슜??硫붾え留?textarea??(寃???쇱젙? 蹂꾨룄 ?쎄린?꾩슜)
  const _userMemo = (window.schedule[dateKey]||{}).memo||'';
  document.getElementById('memo-textarea').value = _userMemo;
  const _inspMemos = buildInspectionMemos();
  const _inspText = _inspMemos[dateKey] ? _inspMemos[dateKey].join('\n') : '';
  const inspBox = document.getElementById('insp-info-box');
  if (inspBox) {
    if (_inspText) { inspBox.textContent = '?썳 ?λ퉬寃???덉젙\n' + _inspText; inspBox.style.display = 'block'; }
    else { inspBox.style.display = 'none'; }
  }
  renderPopupDocs(); renderDutyRows();
  // ??援먯쑁 ?쇱젙 ?뚮뜑留?
  const _eduEvents = getEduEvents(dateKey);
  const eduSection = document.getElementById('edu-section');
  const eduCards = document.getElementById('edu-cards');
  if (_eduEvents.length > 0) {
    eduCards.innerHTML = '';
    _eduEvents.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.innerHTML = `<div class="edu-org">${ev.org}</div><div class="edu-name">${ev.name}</div><div class="edu-detail">${ev.time ? '<b>?쒓컙</b> '+ev.time+'<br>' : ''}<b>?μ냼</b> ${ev.place}<br><b>援먯쑁鍮?/b> ${ev.fee}</div>`;
      eduCards.appendChild(card);
    });
    eduSection.style.display = 'block';
  } else {
    eduSection.style.display = 'none';
  }
  document.getElementById('popup-overlay').classList.add('open');
}

function _doClosePopup() {
  document.getElementById('popup-overlay').classList.remove('open');
  selectedDateKey=null; selectedDoc=null;
  renderBanner(); renderCalendar();
}
window.closePopup=(e)=>{ if(e.target===document.getElementById('popup-overlay'))_doClosePopup(); };
window.closePopupDirect=_doClosePopup;

function renderPopupDocs() {
  const scroll=document.getElementById('popup-doc-scroll'); scroll.innerHTML='';
  DOCTOR_MAP.forEach(doc=>{
    const btn=document.createElement('button');
    btn.className='pdoc-btn'+(selectedDoc?.name===doc.name?' active':'');
    btn.innerHTML=`<span class="t">${doc.title}</span><span class="n">${doc.initial}</span>`;
    btn.onclick=()=>{ selectedDoc=selectedDoc?.name===doc.name?null:doc; renderPopupDocs(); renderDutyRows(); renderBanner(); renderCalendar(); };
    scroll.appendChild(btn);
  });
}
function popupScroll(dir){ document.getElementById('popup-doc-scroll').scrollBy({left:dir*200,behavior:'smooth'}); }
window.popupScroll=popupScroll;

function renderDutyRows() {
  const container=document.getElementById('duty-rows'); container.innerHTML='';
  DUTY_ROWS.forEach(row=>{
    const dayData=window.schedule[selectedDateKey]||{};
    const val=dayData[row.id]||'';
    const target=row.useName?selectedDoc?.name:selectedDoc?.initial;
    const isActive=!!(selectedDoc&&target&&val.split(' ').filter(Boolean).includes(target));
    const div=document.createElement('div');
    div.className='duty-row'+(isActive?' active-row':'')+((!selectedDoc)?' no-doc':'');
    div.addEventListener('click',()=>{
      if(!selectedDoc) return;
      if(row.id==='alt_leave') openAltReasonPopup(selectedDateKey, selectedDoc);
      else toggleAssignment(selectedDateKey,row.id,selectedDoc,row.useName);
    });
    const top=document.createElement('div'); top.className='duty-row-top';
    const lbl=document.createElement('span'); lbl.className='duty-row-label '+row.color; lbl.textContent=row.label;
    top.appendChild(lbl);
    if (selectedDoc) {
      const btn=document.createElement('button');
      btn.className='assign-btn '+(isActive?'remove':'add');
      btn.textContent=isActive?'?쒓굅':'諛곗젙';
      btn.addEventListener('click',(e)=>{ e.stopPropagation(); if(row.id==='alt_leave') openAltReasonPopup(selectedDateKey, selectedDoc); else toggleAssignment(selectedDateKey,row.id,selectedDoc,row.useName); });
      top.appendChild(btn);
    } else { const hint=document.createElement('span'); hint.className='no-doc-hint'; hint.textContent='?꾩뿉??吏곸썝 ?좏깮'; top.appendChild(hint); }
    div.appendChild(top);
    const list=document.createElement('div'); list.className='assigned-list';
    const items=val.split(' ').filter(Boolean);
    if (items.length) {
      items.forEach(item=>{
        const chip=document.createElement('button'); chip.className='assigned-chip '+row.color;
        let displayText = item;
        if (row.id==='alt_leave' && item.includes(':')) { const [rsn,nm]=item.split(':'); const icons={rest:'?뙼',reserve:'?첉',event:'?뮁',public:'?룢','half-am':'?截?,'half-pm':'?뙔'}; displayText=(icons[rsn]||'?뙼')+nm; }
        chip.innerHTML=`${displayText} <span class="del-icon">??/span>`;
        chip.addEventListener('click',(e)=>{ e.stopPropagation(); removeAssignment(selectedDateKey,row.id,item); });
        list.appendChild(chip);
      });
    } else { const none=document.createElement('span'); none.className='no-assign'; none.textContent='諛곗젙 ?놁쓬'; list.appendChild(none); }
    div.appendChild(list);
    container.appendChild(div);
  });
}

function toggleAssignment(dk,rowId,doc,useName) {
  const dayData=window.schedule[dk]||{};
  const target=useName?doc.name:doc.initial;
  let items=(dayData[rowId]||'').split(' ').filter(Boolean);
  const was=items.includes(target);
  if(was) items=items.filter(x=>x!==target); else items.push(target);
  window.schedule={...window.schedule,[dk]:{...dayData,[rowId]:items.join(' ')}};
  renderDutyRows(); renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(was?`${doc.name} ?쒓굅??:`${doc.name} 諛곗젙 ?꾨즺 ??);
}

// ?? ?????????????????????????????????????????????????
let _altPopupDk = null, _altPopupDoc = null;
function openAltReasonPopup(dk, doc) {
  _altPopupDk = dk; _altPopupDoc = doc;
  const dayData = window.schedule[dk] || {};
  if (hasAltLeave(dayData, doc.initial)) {
    const raw = dayData.alt_leave || '';
    const items = raw.split(' ').filter(x => { const nm = x.includes(':') ? x.split(':')[1] : x; return nm !== doc.initial; });
    window.schedule = {...window.schedule, [dk]: {...dayData, alt_leave: items.join(' ')}};
    renderDutyRows(); renderCalendar();
    if (window.saveToCloud) window.saveToCloud(window.schedule);
    showToast(`${doc.name} ????쒓굅??);
    return;
  }
  document.getElementById('alt-reason-name').textContent = doc.name + ' ?좎깮?????ъ쑀 ?좏깮';
  document.getElementById('alt-reason-overlay').classList.add('open');
}
function closeAltReasonPopup() { document.getElementById('alt-reason-overlay').classList.remove('open'); _altPopupDk=null; _altPopupDoc=null; }
window.closeAltReasonPopup = closeAltReasonPopup;

function selectAltReason(reason) {
  if (!_altPopupDk || !_altPopupDoc) return;
  const dk=_altPopupDk, doc=_altPopupDoc;
  closeAltReasonPopup();
  const dayData=window.schedule[dk]||{};
  const existing=(dayData.alt_leave||'').split(' ').filter(Boolean);
  existing.push(reason+':'+doc.initial);
  window.schedule={...window.schedule,[dk]:{...dayData, alt_leave:existing.join(' ')}};
  renderDutyRows(); renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  const labels={rest:'???,reserve:'?덈퉬援고썕??,event:'寃쎌“??,public:'怨듦?','half-am':'諛섏씪????ㅼ쟾)','half-pm':'諛섏씪????ㅽ썑)'};
  showToast(`${doc.name} ${labels[reason]||'???} ?깅줉 ??);
}
window.selectAltReason=selectAltReason;
window.openAltReasonPopup=openAltReasonPopup;

function removeAssignment(dk,rowId,targetStr) {
  const dayData=window.schedule[dk]||{};
  const items=(dayData[rowId]||'').split(' ').filter(x=>x&&x!==targetStr);
  window.schedule={...window.schedule,[dk]:{...dayData,[rowId]:items.join(' ')}};
  renderDutyRows(); renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(`${targetStr} ?쒓굅??);
}

// ?? ?좎뵪 ??????????????????????????????????????????????
async function loadWeather() {
  const OWM_KEY = '22e3baf840c5fa55ad030accdb580d84';
  const LAT = 35.09, LON = 129.07;
  try {
    const [curRes, fcRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&lang=kr&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${OWM_KEY}&lang=kr&units=metric&cnt=40`)
    ]);
    if (!curRes.ok) throw new Error('OWM ' + curRes.status);
    const [cur, fc] = await Promise.all([curRes.json(), fcRes.json()]);
    const icon=cur.weather[0].icon, desc=cur.weather[0].description, temp=Math.round(cur.main.temp), feels=Math.round(cur.main.feels_like), humid=cur.main.humidity, windMs=Math.round(cur.wind.speed);
    const nowKST=new Date(Date.now()+9*3600*1000), todayKST=nowKST.toISOString().slice(0,10);
    const ICONS={'01d':'?截?,'01n':'?뙔','02d':'??,'02n':'?곻툘','03d':'?곻툘','03n':'?곻툘','04d':'?곻툘','04n':'?곻툘','09d':'?뙢','09n':'?뙢','10d':'?뙡','10n':'?뙢','11d':'??,'11n':'??,'13d':'?꾬툘','13n':'?꾬툘','50d':'?뙧','50n':'?뙧'};
    const BG={'01':'sunny','02':'cloudy','03':'cloudy','04':'cloudy','09':'rainy','10':'rainy','11':'thunder','13':'snowy','50':'cloudy'};
    const getIcon=ic=>ICONS[ic]||'?뙟';
    const getBg=ic=>{ if(ic.endsWith('n')&&ic.startsWith('01')) return 'night'; return BG[ic.slice(0,2)]||'cloudy'; };
    const bar=document.getElementById('weather-bar'); bar.className='weather-'+getBg(icon); bar.id='weather-bar';
    document.getElementById('weather-icon-wrap').textContent=getIcon(icon);
    document.getElementById('weather-temp').textContent=temp+'째';
    document.getElementById('weather-feels').textContent='泥닿컧 '+feels+'째';
    document.getElementById('weather-desc').textContent=desc+'  ?뮛'+humid+'%  ?뮜'+windMs+'m/s';
    const list=fc.list;
    const toKSTHour=(dt_txt)=>{ const utcDate=new Date(dt_txt.replace(' ','T')+'Z'); return (utcDate.getUTCHours()+9)%24; };
    const toKSTDate=(dt_txt)=>{ const utcDate=new Date(dt_txt.replace(' ','T')+'Z'); const kst=new Date(utcDate.getTime()+9*3600*1000); return kst.toISOString().slice(0,10); };
    const mItem=list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=7&&toKSTHour(h.dt_txt)<=9)||list.find(h=>toKSTDate(h.dt_txt)===todayKST)||list[0];
    const eItem=list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=16&&toKSTHour(h.dt_txt)<=18)||list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=14)||list[Math.min(4,list.length-1)];
    document.getElementById('wt-morning-icon').textContent=getIcon(mItem.weather[0].icon);
    document.getElementById('wt-morning-temp').textContent=Math.round(mItem.main.temp)+'째';
    document.getElementById('wt-evening-icon').textContent=getIcon(eItem.weather[0].icon);
    document.getElementById('wt-evening-temp').textContent=Math.round(eItem.main.temp)+'째';
    const alerts=[];
    const eIcon=eItem.weather[0].icon, eHour=toKSTHour(eItem.dt_txt);
    if(eIcon.startsWith('10')||eIcon.startsWith('09')) alerts.push(`?똼 ?닿렐湲?${eHour}?쒓꼍) 鍮??덈낫 ???곗궛 梨숆린?몄슂!`);
    else if(eIcon.startsWith('11')) alerts.push('???닿렐湲?泥쒕뫁踰덇컻 ?덈낫 ??議곗떖?섏꽭??');
    else if(eIcon.startsWith('13')) alerts.push('?꾬툘 ?닿렐湲????덈낫 ??誘몃걚??二쇱쓽!');
    const mTemp=Math.round(mItem.main.temp), eTemp=Math.round(eItem.main.temp);
    if(mTemp-eTemp>=8) alerts.push(`?㎘ ?ㅽ썑 湲곗삩 ${mTemp-eTemp}째C 湲됯컯????寃됱샆 梨숆린?몄슂!`);
    const alertEl=document.getElementById('weather-alert'), alertWrap=document.getElementById('weather-alert-wrap');
    if(alerts.length){ alertEl.textContent=alerts.join('  '); alertEl.classList.add('show'); if(alertWrap) alertWrap.style.display='block'; }
    else{ alertEl.classList.remove('show'); if(alertWrap) alertWrap.style.display='none'; }
    renderWeeklyForecast(list);
    document.getElementById('weather-loading').style.display='none';
    document.getElementById('weather-inner').style.display='flex';
  } catch(e) { console.warn('?좎뵪 濡쒕뱶 ?ㅽ뙣:',e); document.getElementById('weather-loading').textContent='?뙟 ?좎뵪 ?뺣낫 ?놁쓬'; }
}

function renderWeeklyForecast(list) {
  const wrap=document.getElementById('weekly-forecast-inner'); if(!wrap) return;
  const days={};
  list.forEach(h=>{ const dk=h.dt_txt.slice(0,10); if(!days[dk]) days[dk]={temps:[],icons:[],pop:0}; days[dk].temps.push(Math.round(h.main.temp)); days[dk].icons.push(h.weather[0].icon); days[dk].pop=Math.max(days[dk].pop,h.pop||0); });
  const ICONS={'01d':'?截?,'01n':'?뙔','02d':'??,'02n':'?곻툘','03d':'?곻툘','03n':'?곻툘','04d':'?곻툘','04n':'?곻툘','09d':'?뙢','09n':'?뙢','10d':'?뙡','10n':'?뙢','11d':'??,'11n':'??,'13d':'?꾬툘','13n':'?꾬툘','50d':'?뙧','50n':'?뙧'};
  const DOWS=['??,'??,'??,'??,'紐?,'湲?,'??];
  const today=new Date().toISOString().slice(0,10);
  while(wrap.children.length>1) wrap.removeChild(wrap.lastChild);
  Object.keys(days).slice(0,6).forEach(dk=>{
    const d=days[dk], high=Math.max(...d.temps), low=Math.min(...d.temps);
    const dayIcon=d.icons.find(i=>i.endsWith('d'))||d.icons[0];
    const icon=ICONS[dayIcon]||'?뙟';
    const dateObj=new Date(dk+'T00:00:00'), dow=dateObj.getDay(), dowLabel=DOWS[dow];
    const dateLabel=`${dateObj.getMonth()+1}/${dateObj.getDate()}`;
    const isToday=dk===today, rainPct=Math.round((d.pop||0)*100);
    const div=document.createElement('div'); div.className='fc-day'+(isToday?' today':'');
    const dowEl=document.createElement('div'); dowEl.className='fc-dow'+(dow===0?' sun':(dow===6?' sat':'')); dowEl.textContent=isToday?'?ㅻ뒛':dowLabel;
    const dateEl=document.createElement('div'); dateEl.className='fc-date'; dateEl.textContent=dateLabel;
    const iconEl=document.createElement('div'); iconEl.className='fc-icon'; iconEl.textContent=icon;
    const tempsEl=document.createElement('div'); tempsEl.className='fc-temps'; tempsEl.innerHTML=`<span class="fc-high">${high}째</span><span class="fc-low">${low}째</span>`;
    div.appendChild(dowEl); div.appendChild(dateEl); div.appendChild(iconEl); div.appendChild(tempsEl);
    if(rainPct>=20){ const rainEl=document.createElement('div'); rainEl.className='fc-rain'; rainEl.textContent=`?뮛${rainPct}%`; div.appendChild(rainEl); }
    wrap.appendChild(div);
  });
}

// ?? ??寃?ъ씪 議곗젙 ???ㅼ쨷 寃??吏??????????????????????
let _inspMoveBase = null;        // 湲곗???怨듯넻)
let _inspMoveItems = [];         // ?대떦 ?좎쭨??紐⑤뱺 寃??[{idx, base, id, ...}]
let _inspMoveSelected = new Set(); // ?좏깮????ぉ ?몃뜳??(EQUIPMENT_INSPECTIONS idx)

function openInspMovePopup(dateKey, dateItems) {
  _inspMoveBase = dateKey;
  _inspMoveItems = dateItems;
  _inspMoveSelected = new Set();

  // 紐⑤뱺 ??ぉ 湲곕낯 ?좏깮
  dateItems.forEach(di => {
    _inspMoveSelected.add(di.idx);
  });

  document.getElementById('insp-move-base').textContent = '湲곗??? ' + dateKey;

  // ??λ맂 ?좎쭨 ?덉쑝硫?媛?몄삤湲?
  const storedDates = window.schedule['inspDates'] || {};
  const firstAdj = dateItems.find(di => EQUIPMENT_INSPECTIONS[di.idx].adjustable);
  const storedDate = firstAdj ? (storedDates[firstAdj.base + '_' + EQUIPMENT_INSPECTIONS[firstAdj.idx].id] || dateKey) : dateKey;
  document.getElementById('insp-move-date').value = storedDate;

  // 寃??紐⑸줉 ?뚮뜑留?
  renderInspList();

  document.getElementById('insp-move-overlay').classList.add('open');
}
window.openInspMovePopup = openInspMovePopup;

function renderInspList() {
  const listEl = document.getElementById('insp-list');
  listEl.innerHTML = '';
  const storedDates = window.schedule['inspDates'] || {};

  _inspMoveItems.forEach(di => {
    const item = EQUIPMENT_INSPECTIONS[di.idx];
    const isSelected = _inspMoveSelected.has(di.idx);
    const typeLabel = {precision:'?뺣?寃??,safety:'?덉쟾寃??,doc:'?쒕쪟寃??}[item.type];
    const storeKey = di.base + '_' + item.id;
    const currentDate = storedDates[storeKey] || di.base;
    const movedNote = currentDate !== di.base ? ` ??${currentDate}` : '';

    const row = document.createElement('div');
    row.className = 'insp-list-item' + (isSelected ? ' selected' : '');

    row.innerHTML = `
      <span class="insp-emoji">${item.emoji}</span>
      <div class="insp-info">
        <div class="insp-short">${item.short}${movedNote}</div>
        <div class="insp-type">${typeLabel} 쨌 ${item.name}</div>
      </div>
      <div class="insp-check">${isSelected ? '?? : ''}</div>
    `;

    row.addEventListener('click', () => {
      if (_inspMoveSelected.has(di.idx)) _inspMoveSelected.delete(di.idx);
      else _inspMoveSelected.add(di.idx);
      renderInspList();
    });
    listEl.appendChild(row);
  });
}

function closeInspMove(e) {
  if (e && e.target !== document.getElementById('insp-move-overlay')) return;
  document.getElementById('insp-move-overlay').classList.remove('open');
}
window.closeInspMove = closeInspMove;

function saveInspDate() {
  const newDate = document.getElementById('insp-move-date').value;
  if (!newDate || !_inspMoveBase || _inspMoveSelected.size === 0) {
    showToast('?좑툘 ?대룞??寃?щ? ?좏깮?댁＜?몄슂');
    return;
  }

  // 짹21??寃利?
  const base = new Date(_inspMoveBase);
  const selected = new Date(newDate);
  const diffDays = Math.round((selected - base) / 86400000);
  if (Math.abs(diffDays) > 21) {
    showToast('?좑툘 湲곗???짹21???대궡濡??ㅼ젙?댁＜?몄슂');
    return;
  }

  // ??FIX: inspDates ???ъ슜 (Firestore ?명솚)
  const oldStored = window.schedule['inspDates'] || {};
  const newStored = Object.assign({}, oldStored);

  let movedCount = 0;
  _inspMoveSelected.forEach(idx => {
    const item = EQUIPMENT_INSPECTIONS[idx];
    // ?대떦 ?꾩씠?쒖쓽 base 李얘린
    const di = _inspMoveItems.find(x => x.idx === idx);
    if (!di) return;
    const key = di.base + '_' + item.id;
    newStored[key] = newDate;
    movedCount++;
  });

  window.schedule = Object.assign({}, window.schedule, { 'inspDates': newStored });

  document.getElementById('insp-move-overlay').classList.remove('open');
  renderCalendar();
  if (window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(`??${movedCount}嫄???${newDate}濡??대룞??);
}
window.saveInspDate = saveInspDate;

// ?? ???꾩껜 怨듭??ы빆 ??noticeData ???ъ슜 ?????????????
function loadNotice() {
  const userText = (window.schedule['noticeData'] || {}).text || '';
  const el = document.getElementById('notice-text');
  if (!el) return;

  const upcoming = getUpcomingInspections(15);
  let autoAlert = '';
  if (upcoming.length > 0) {
    const lines = upcoming.map(u => {
      const dStr = u.diff === 0 ? '?뱟 ?ㅻ뒛!' : `?뱟 D-${u.diff}`;
      return `${dStr} ${u.label} (${u.dk})`;
    });
    autoAlert = '?좑툘 ?λ퉬寃???덉젙\n' + lines.join('\n');
  }

  const finalText = [autoAlert, userText].filter(Boolean).join('\n?????????????\n');

  if (finalText.trim()) {
    el.textContent = finalText;
    el.classList.remove('empty');
    if (autoAlert) {
      const bar = document.getElementById('notice-bar');
      if (bar) bar.style.borderBottomColor = '#ef4444';
      const label = document.getElementById('notice-label');
      if (label) { label.textContent = '?좑툘 湲닿툒'; label.style.background = '#ef4444'; }
    }
  } else {
    el.textContent = '怨듭??ы빆???낅젰?섏꽭??(?륅툘 踰꾪듉)';
    el.classList.add('empty');
  }
}

function openNoticePopup() {
  const text = (window.schedule['noticeData'] || {}).text || '';
  document.getElementById('notice-edit-textarea').value = text;
  document.getElementById('notice-popup-overlay').classList.add('open');
  setTimeout(() => document.getElementById('notice-edit-textarea').focus(), 200);
}
window.openNoticePopup = openNoticePopup;

function closeNoticePopup(e) {
  if (e && e.target !== document.getElementById('notice-popup-overlay')) return;
  document.getElementById('notice-popup-overlay').classList.remove('open');
}
window.closeNoticePopup = closeNoticePopup;

function saveNotice() {
  const text = document.getElementById('notice-edit-textarea').value;
  window.schedule = { ...window.schedule, 'noticeData': { text } };
  loadNotice();
  if (window.saveToCloud) window.saveToCloud(window.schedule);
  document.getElementById('notice-popup-overlay').classList.remove('open');
  showToast(text.trim() ? '怨듭? ????꾨즺 ?뱼' : '怨듭?媛 ??젣?섏뿀?듬땲??);
}
window.saveNotice = saveNotice;

// ?? 硫붾え (?ъ슜??硫붾え留???? ??????????????????????????
window.saveMemo=function(){
  if(!selectedDateKey) return;
  const memo=document.getElementById('memo-textarea').value.trim();
  window.schedule={...window.schedule,[selectedDateKey]:{...(window.schedule[selectedDateKey]||{}),memo}};
  renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(memo?'硫붾え ????꾨즺 ?뮠':'硫붾え ??젣??);
};

// ?? ?뺤궛 ??????????????????????????????????????????????
function renderReport() {
  const yearStr=String(viewYear);
  const monthPrefix=`${viewYear}-${String(viewMonth+1).padStart(2,'0')}`;
  const data=DOCTOR_MAP.map(d=>({...d,weekdays:[],weekends:[],totalHours:0,usedVacation:0}));
  Object.keys(window.schedule).forEach(dk=>{
    if(!dk.startsWith(yearStr)||dk.length!==10) return;
    const day=window.schedule[dk];
    data.forEach(doc=>{
      if((day.vacation||'').includes(doc.initial)) doc.usedVacation+=1;
      if((day.half_am||'').includes(doc.initial)) doc.usedVacation+=0.5;
      if((day.half_pm||'').includes(doc.initial)) doc.usedVacation+=0.5;
    });
  });
  Object.keys(window.schedule).forEach(dk=>{
    if(!dk.startsWith(monthPrefix)||dk.length!==10) return;
    const day=window.schedule[dk];
    const dObj=new Date(dk); const dow=dObj.getDay();
    const isH=isHoliday(dk)||dow===0;
    const tmrw=new Date(dObj); tmrw.setDate(tmrw.getDate()+1);
    const tmrwH=isHoliday(tmrw.toISOString().split('T')[0])||tmrw.getDay()===0;
    (day.night||'').split(' ').filter(Boolean).forEach(ini=>{
      const doc=data.find(x=>x.initial===ini||x.name===ini); if(!doc) return;
      // -- June Overrides --
      if(dk==='2026-06-02'){doc.weekdays.push(dObj.getDate());doc.totalHours+=8;return;}
      if(dk==='2026-06-03'){doc.weekdays.push(dObj.getDate());doc.totalHours+=9;return;}

      // ------------------
      if(isH){doc.weekends.push(dObj.getDate());doc.totalHours+=(tmrwH||dow===6?22.5:(dow===5?18.5:(dow===0?14.5:15)));}
      else if(dow===6){doc.weekends.push(dObj.getDate());doc.totalHours+=16.5;}
      else if(tmrwH){doc.weekdays.push(dObj.getDate());doc.totalHours+=(dow===1?10.5:12);}
      else if(dow===5){doc.weekdays.push(dObj.getDate());doc.totalHours+=8;}
      else if(dow===1){doc.weekdays.push(dObj.getDate());doc.totalHours+=3;}
      else{doc.weekdays.push(dObj.getDate());doc.totalHours+=4.5;}
    });
    (day.evening||'').split(' ').filter(Boolean).forEach(ini=>{
      const doc=data.find(x=>x.initial===ini||x.name===ini); if(!doc) return;
      if(dk==='2026-06-03'){doc.weekends.push(dObj.getDate());doc.totalHours+=6;} else if(isH) doc.totalHours+=12; else if(dow===6){doc.weekends.push(dObj.getDate());doc.totalHours+=6;}
    });
  });
  const dutyTbody=document.getElementById('duty-tbody'); dutyTbody.innerHTML='';
  data.filter(r=>r.totalHours>0).forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td style="padding:12px 8px;font-weight:700;text-align:left">${r.name}<span class="title-badge">${r.title}</span></td><td style="padding:12px 8px;color:#64748b;font-size:12px">${r.weekdays.join(', ')}</td><td style="padding:12px 8px;color:#64748b;font-size:12px">${r.weekends.join(', ')}</td><td class="hours-cell" style="padding:12px 8px">${r.totalHours}h</td>`;
    dutyTbody.appendChild(tr);
  });
  const leaveTbody=document.getElementById('leave-tbody'); leaveTbody.innerHTML='';
  data.forEach(r=>{
    const usable=Math.min(r.totalLeave,20); const remain=usable-r.usedVacation; const payout=Math.max(0,r.totalLeave-20);
    const tr=document.createElement('tr');
    tr.innerHTML=`<td style="padding:12px 8px;font-weight:700;text-align:left">${r.name}<span class="title-badge">${r.title}</span></td><td class="used-cell" style="padding:12px 8px">${r.usedVacation}??/td><td class="remain-cell" style="padding:12px 8px">${remain}??{payout>0?`<span class="payout-note">?섎떦 +${payout}??/span>`:''}</td>`;
    leaveTbody.appendChild(tr);
  });
}

function switchTab(tab) {
  document.getElementById('tab-content-duty').style.display=tab==='duty'?'block':'none';
  document.getElementById('tab-content-leave').style.display=tab==='leave'?'block':'none';
  document.getElementById('tab-duty').classList.toggle('active-tab',tab==='duty');
  document.getElementById('tab-leave').classList.toggle('active-tab',tab==='leave');
}
window.switchTab=switchTab;

window.toggleScreening=function(show){
  showScreening=show??!showScreening;
  document.getElementById('calendar-section').style.display=showScreening?'none':'block';
  document.getElementById('month-header').style.display=showScreening?'none':'flex';
  const wb=document.getElementById('weather-bar'); if(wb) wb.style.display=showScreening?'none':'block';
  const nb=document.getElementById('notice-bar'); if(nb) nb.style.display=showScreening?'none':'block';
  const wf=document.getElementById('weekly-forecast'); if(wf) wf.style.display=showScreening?'none':'block';
  document.getElementById('screening').classList.toggle('visible',showScreening);
  document.getElementById('bottom-banner').style.display=showScreening?'none':'block';
  document.getElementById('btn-screening').classList.toggle('active',showScreening);
  if(showScreening) renderReport();
};

document.getElementById('btn-screening').onclick=()=>toggleScreening();
document.getElementById('btn-prev').onclick=()=>{ viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;} renderCalendar(); };
document.getElementById('btn-next').onclick=()=>{ viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;} renderCalendar(); };

renderCalendar(); renderBanner(); loadNotice(); loadWeather(); checkLoginStatus();

window.applyJuneSchedule = async function() {
  const juneData = {
    '2026-06-01': { 'ctmr': '??, 'night': '?≪쭊?? },
    '2026-06-02': { 'ctmr': '??, 'night': '?댁듅?? },
    '2026-06-03': { 'ctmr': '??, 'evening': '吏???, 'night': '?대룞?? },
    '2026-06-04': { 'ctmr': '醫?, 'night': '?≪슦?? },
    '2026-06-05': { 'ctmr': '??, 'night': '源?꾩꽍' },
    '2026-06-06': { 'ctmr': '??, 'evening': '?≪쭊??, 'night': '?≪슦?? },
    '2026-06-07': { 'ctmr': '醫?, 'evening': '?대룞??, 'night': '?댁듅?? },
    '2026-06-08': { 'ctmr': '??, 'night': '?대룞?? },
    '2026-06-09': { 'ctmr': '??, 'night': '源?꾩꽍' },
    '2026-06-10': { 'ctmr': '醫?, 'night': '?댁듅?? },
    '2026-06-11': { 'ctmr': '??, 'night': '?≪쭊?? },
    '2026-06-12': { 'ctmr': '??, 'night': '吏??? },
    '2026-06-13': { 'ctmr': '醫?, 'evening': '?≪쭊??, 'night': '源?꾩꽍', 'off40': '醫??????? },
    '2026-06-14': { 'ctmr': '醫?, 'evening': '?댁듅??, 'night': '?≪슦?? },
    '2026-06-15': { 'ctmr': '??, 'night': '?댁듅?? },
    '2026-06-16': { 'ctmr': '醫?, 'night': '吏??? },
    '2026-06-17': { 'ctmr': '??, 'night': '?≪쭊?? },
    '2026-06-18': { 'ctmr': '??, 'night': '源?꾩꽍' },
    '2026-06-19': { 'ctmr': '??, 'night': '?대룞?? },
    '2026-06-20': { 'ctmr': '??, 'evening': '源醫낇솚', 'night': '吏???, 'off40': '????吏??? },
    '2026-06-21': { 'ctmr': '醫?, 'evening': '源?꾩꽍', 'night': '?≪쭊?? },
    '2026-06-22': { 'ctmr': '醫?, 'night': '源?꾩꽍' },
    '2026-06-23': { 'ctmr': '??, 'night': '?댁듅?? },
    '2026-06-24': { 'ctmr': '醫?, 'night': '?대룞?? },
    '2026-06-25': { 'ctmr': '??, 'night': '?≪슦?? },
    '2026-06-26': { 'ctmr': '??, 'night': '?≪쭊?? },
    '2026-06-27': { 'ctmr': '??, 'evening': '?댁듅??, 'night': '源醫낇솚', 'off40': '??遊???議? },
    '2026-06-28': { 'ctmr': '醫?, 'evening': '吏???, 'night': '?대룞?? },
    '2026-06-29': { 'ctmr': '醫?, 'night': '吏??? },
    '2026-06-30': { 'ctmr': '??, 'night': '?≪슦?? }
  };
  if (!confirm('6???뱀쭅?쒕? ?곸슜?섏떆寃좎뒿?덇퉴?')) return;
  const newSchedule = { ...window.schedule, ...juneData };
  try {
    await window.saveToCloud(newSchedule);
    alert('???깃났?곸쑝濡??곸슜?섏뿀?듬땲??');
    location.reload();
  } catch (e) {
    alert('???ㅻ쪟 諛쒖깮: ' + e.message);
  }
};

// ── July 2026 Seed Data Utility ───────────────────
window.applyJulySchedule = async function() {
  const julyData = {
    '2026-07-01': { 'ctmr': '동', 'night': '이승남' },
    '2026-07-02': { 'ctmr': '송', 'night': '이동현' },
    '2026-07-03': { 'ctmr': '승', 'night': '지은열' },
    '2026-07-04': { 'ctmr': '동', 'evening': '김종환', 'night': '이승남', 'off40': '동 석 진 용' },
    '2026-07-05': { 'ctmr': '종', 'evening': '송우석', 'night': '김현석' },
    '2026-07-06': { 'ctmr': '종', 'night': '송우석' },
    '2026-07-07': { 'ctmr': '종', 'night': '이동현' },
    '2026-07-08': { 'ctmr': '송', 'night': '이승남' },
    '2026-07-09': { 'ctmr': '동', 'night': '송진우' },
    '2026-07-10': { 'ctmr': '승', 'night': '송우석' },
    '2026-07-11': { 'ctmr': '종', 'evening': '김현석', 'night': '지은열', 'off40': '종 승 조 봉' },
    '2026-07-12': { 'ctmr': '종', 'evening': '이승남', 'night': '이동현' },
    '2026-07-13': { 'ctmr': '송', 'night': '이승남' },
    '2026-07-14': { 'ctmr': '동', 'night': '김현석' },
    '2026-07-15': { 'ctmr': '종', 'night': '지은열' },
    '2026-07-16': { 'ctmr': '승', 'night': '송우석' },
    '2026-07-17': { 'ctmr': '송', 'evening': '이동현', 'night': '송진우' },
    '2026-07-18': { 'ctmr': '송', 'evening': '이승남', 'night': '김종환', 'off40': '동 송 선 지' },
    '2026-07-19': { 'ctmr': '종', 'evening': '김현석', 'night': '지은열' },
    '2026-07-20': { 'ctmr': '동', 'night': '김현석' },
    '2026-07-21': { 'ctmr': '승', 'night': '송진우' },
    '2026-07-22': { 'ctmr': '동', 'night': '송우석' },
    '2026-07-23': { 'ctmr': '종', 'night': '이동현' },
    '2026-07-24': { 'ctmr': '송', 'night': '김현석' },
    '2026-07-25': { 'ctmr': '승', 'evening': '지은열', 'night': '송진우', 'off40': '종 승 현 용' },
    '2026-07-26': { 'ctmr': '종', 'evening': '이동현', 'night': '송우석' },
    '2026-07-27': { 'ctmr': '승', 'night': '이동현' },
    '2026-07-28': { 'ctmr': '종', 'night': '이승남' },
    '2026-07-29': { 'ctmr': '송', 'night': '지은열' },
    '2026-07-30': { 'ctmr': '승', 'night': '김현석' },
    '2026-07-31': { 'ctmr': '동', 'night': '송진우' }
  };
  if (!confirm('7월 당직표를 적용하시겠습니까?')) return;
  const newSchedule = { ...window.schedule, ...julyData };
  try {
    await window.saveToCloud(newSchedule);
    alert('✅ 7월 당직표가 성공적으로 적용되었습니다!');
    location.reload();
  } catch (e) {
    alert('❌ 오류 발생: ' + e.message);
  }
};
