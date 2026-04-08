// ── 장비 검사 일정 데이터 ──────────────────────────────
const EQUIPMENT_INSPECTIONS = [
  { name: 'MRI 3.0 (GE-SIGNA Pioneer)',   short: 'MRI 정밀', id: 'mri-precision',   type: 'precision',
    baseDate: '2026-04-02', cyclYears: 3, emoji: '🧲', adjustable: true },
  { name: 'MRI 3.0 (GE-SIGNA Pioneer)',   short: 'MRI 서류', id: 'mri-doc',   type: 'doc',
    baseDate: '2026-04-02', cyclYears: 1, emoji: '📋', adjustable: true },
  { name: 'CT (SOMATOM-Perspective)',      short: 'CT 서류', id: 'ct-doc',    type: 'doc',
    baseDate: '2028-01-13', cyclYears: 1, emoji: '📋', adjustable: true },
  { name: 'MAMMO (selenia F)',             short: 'MAMMO 서류', id: 'mammo-doc', type: 'doc',
    baseDate: '2026-03-03', cyclYears: 1, emoji: '📋', adjustable: true },
  { name: 'CT (SOMATOM-Perspective)',      short: 'CT 안전+정밀', id: 'ct-safety', type: 'safety',
    baseDate: '2028-01-13', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: 'MAMMO (selenia F)',             short: 'MAMMO 안전', id: 'mammo-safety',  type: 'safety',
    baseDate: '2026-03-03', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '촬영실1 (CDX-RD85DII)',         short: '촬영실1 안전', id: 'cr1-safety', type: 'safety',
    baseDate: '2026-04-28', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '촬영실2 (CDX-RD85DII)',         short: '촬영실2 안전', id: 'cr2-safety', type: 'safety',
    baseDate: '2028-03-07', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '골밀도 (EXCELLUS=BHR-3-83)',   short: '골밀도 안전', id: 'bone-safety',  type: 'safety',
    baseDate: '2025-04-09', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '초음파쇄석기 (Rifle=HF-5-125)', short: '초음파쇄석기 안전', id: 'uls-safety', type: 'safety',
    baseDate: '2025-04-11', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: 'C-ARM 1 (Brivo OEC 785)',      short: 'C-ARM1 안전', id: 'carm1-safety', type: 'safety',
    baseDate: '2028-01-04', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: 'C-ARM 2 (Brivo OEC 785)',      short: 'C-ARM2 안전', id: 'carm2-safety', type: 'safety',
    baseDate: '2028-04-29', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '본관 POTABLE (MUX-10)',        short: '본관POTABLE 안전', id: 'pot-main-safety', type: 'safety',
    baseDate: '2028-12-24', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '선별 POTABLE (SIRIUS STAR)',   short: '선별POTABLE 안전', id: 'pot-sel-safety', type: 'safety',
    baseDate: '2026-09-22', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '음압 POTABLE (JADE-40)',       short: '음압POTABLE 안전', id: 'pot-neg-safety', type: 'safety',
    baseDate: '2028-02-04', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '검진 파노라마 (Orthophos3)',   short: '파노라마 안전', id: 'pan-safety',   type: 'safety',
    baseDate: '2027-02-27', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '검진 INNOVISION-DX',          short: 'INNOVISION 안전', id: 'inno-safety', type: 'safety',
    baseDate: '2026-05-13', cyclYears: 3, emoji: '🛡', adjustable: true },
  { name: '검진 위장촬영 (KXO-50N)',     short: '위장촬영 안전', id: 'gi-safety',   type: 'safety',
    baseDate: '2027-09-26', cyclYears: 3, emoji: '🛡', adjustable: true },
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

// ✅ FIX: inspDates (not __insp_dates__)
function buildInspectionMemos() {
  const memos = {};
  const inspDates = window.schedule['inspDates'] || {};
  EQUIPMENT_INSPECTIONS.forEach((item) => {
    const dates = getInspectionDates(item.baseDate, item.cyclYears);
    dates.forEach(baseDk => {
      const storeKey = baseDk + '_' + item.id;
      const actual = inspDates[storeKey] || baseDk;
      if (!memos[actual]) memos[actual] = [];
      const typeLabel = { precision:'정밀검사', safety:'안전검사', doc:'서류검사' }[item.type] || item.type;
      const movedNote = actual !== baseDk ? ` ↩기준:${baseDk}` : '';
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
        const typeLabel = { precision:'정밀검사', safety:'안전검사', doc:'서류검사' }[item.type];
        const adjusted = dk !== baseDk ? ` (기준: ${baseDk})` : '';
        results.push({ dk, diff, label: `${item.emoji} ${item.short} ${typeLabel}${adjusted}`, name: item.name });
      }
    });
  });
  results.sort((a,b) => a.diff - b.diff);
  return results;
}

// ── 로그인 ───────────────────────────────────────────
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
  if (v === SECRET_PIN) { localStorage.setItem('calendar_auth','true'); checkLoginStatus(); showToast('✅ 입장 완료!'); }
  else { const box=document.querySelector('.login-box'); box.classList.remove('login-shake'); void box.offsetWidth; box.classList.add('login-shake'); document.getElementById('pin-input').value=''; updateDots(''); showToast('비밀번호가 틀렸습니다'); }
}
function handleLogout() { localStorage.removeItem('calendar_auth'); checkLoginStatus(); showToast('로그아웃 되었습니다'); }
window.handleLogin=handleLogin; window.handleLogout=handleLogout; window.onPinInput=onPinInput;

window.setSyncStatus = function(s) {
  const el = document.getElementById('sync-indicator'); if (!el) return;
  el.className = s;
  el.title = {saving:'저장 중...',saved:'저장됨',online:'동기화 중',offline:'오프라인'}[s]||'';
};

// ── 데이터 ───────────────────────────────────────────
const DOCTOR_MAP = [
  { name:'김종환', initial:'종', totalLeave:25, title:'실장' },
  { name:'이승남', initial:'승', totalLeave:24, title:'계장' },
  { name:'이동현', initial:'동', totalLeave:22, title:'계장' },
  { name:'강은미', initial:'강', totalLeave:16, title:'계장' },
  { name:'송선경', initial:'선', totalLeave:18, title:'주임' },
  { name:'김현정', initial:'현', totalLeave:18, title:'주임' },
  { name:'송우석', initial:'송', totalLeave:16, title:'선생님' },
  { name:'김현석', initial:'석', totalLeave:16, title:'선생님' },
  { name:'지은열', initial:'지', totalLeave:15, title:'선생님' },
  { name:'송진우', initial:'진', totalLeave:15, title:'선생님' },
  { name:'조지혜', initial:'조', totalLeave:10, title:'선생님' },
  { name:'이용진', initial:'용', totalLeave:9,  title:'선생님' },
  { name:'김봉선', initial:'봉', totalLeave:17, title:'선생님' }
];

const DUTY_ROWS = [
  { id:'half_am',  label:'오전반차',    color:'c-orange', useName:false },
  { id:'half_pm',  label:'오후반차',    color:'c-blue',   useName:false },
  { id:'off40',    label:'40H OFF',     color:'c-rose',   useName:false },
  { id:'vacation', label:'종일연차',    color:'c-purple', useName:false },
  { id:'alt_leave',label:'대휴(차감X)', color:'c-emerald',useName:false },
  { id:'ctmr',     label:'CT / MR',    color:'c-teal',   useName:false },
  { id:'evening',  label:'이브닝',      color:'c-amber',  useName:true  },
  { id:'night',    label:'야간당직',    color:'c-indigo', useName:true  }
];

const DOT_MARKERS = {"2026-03-07":1,"2026-03-14":2,"2026-03-21":2,"2026-03-28":1,"2026-04-04":1,"2026-04-11":2,"2026-04-18":2,"2026-04-25":1};

// ── 2026년 대한민국 공휴일 ──
// red: true = 법정공휴일(빨간날), false = 임시공휴일/기념일(검은색, 정보만)
const HOLIDAYS_2026 = {
  '01-01':{name:'신정',red:true},
  '02-16':{name:'설날 연휴',red:true},
  '02-17':{name:'설날',red:true},
  '02-18':{name:'설날 연휴',red:true},
  '03-01':{name:'삼일절',red:true},
  '03-02':{name:'삼일절 대체공휴일',red:false}, // 여기를 false로 수정
  '05-01':{name:'근로자의 날',red:true},
  '05-05':{name:'어린이날',red:true},
  '05-24':{name:'부처님오신날',red:true},
  '05-25':{name:'부처님오신날 대체공휴일',red:false}, // 여기를 false로 수정
  '06-03':{name:'지방선거일',red:false},
  '06-06':{name:'현충일',red:true},
  '08-15':{name:'광복절',red:true},
  '08-17':{name:'광복절 대체공휴일',red:false}, // 여기를 false로 수정
  '09-24':{name:'추석 연휴',red:true},
  '09-25':{name:'추석',red:true},
  '09-26':{name:'추석 연휴',red:true},
  '10-03':{name:'개천절',red:true},
  '10-05':{name:'개천절 대체공휴일',red:false}, // 여기를 false로 수정
  '10-09':{name:'한글날',red:true},
  '12-25':{name:'크리스마스',red:true}
};

function getHolidayInfo(dk) {
  return HOLIDAYS_2026[dk.slice(5)] || null;
}

// ── 보수교육 / 학술대회 일정 ──
const EDU_EVENTS = [
  {d:'2026-03-07',org:'대한영상의학기술학회',name:'제23차 학술대회',time:'11:00~18:00',place:'신촌세브란스(Hybrid)',fee:'완납 30,000 / 미납 60,000'},
  {d:'2026-03-07',org:'대한의료영상정보관리학회',name:'제1차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-03-07',org:'대한인터벤션영상기술학회',name:'제1차 보수교육',time:'13:00~17:00',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-04-25',org:'대한CT영상기술학회',name:'춘계학술대회',time:'13:00~17:00',place:'경주 화백컨벤션센터',fee:'완납 60,000 / 미납 90,000'},
  {d:'2026-04-25',org:'대한의료영상정보관리학회',name:'춘계학술대회',time:'',place:'강동경희대병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-04-25',org:'대한영상의학기술학회',name:'제1차 보수교육',time:'14:00~18:00',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-04-25',org:'유방영상기술학회',name:'제1차 보수교육',time:'',place:'중앙대학교병원(Hybrid)',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-04-25',org:'대한방사선치료학회',name:'춘계학술대회',time:'13:00~17:00',place:'강릉아산병원(Hybrid)',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-05-15',org:'대한CT영상기술학회',name:'제3차 보수교육(대구지부)',time:'18:30~20:30',place:'대구가톨릭대학교병원',fee:'완납 12,000 / 미납 27,000'},
  {d:'2026-05-15',org:'대한인터벤션영상기술학회',name:'제2차 보수교육(춘계연수강좌)',time:'13:00~17:00',place:'부산항국제전시컨벤션센터',fee:'완납 40,000 / 미납 70,000'},
  {d:'2026-05-16',org:'대한의료영상정보관리학회',name:'제2차 보수교육',time:'',place:'동강대학교',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-05-16',org:'대한자기공명기술학회',name:'제36차 춘계학술대회',time:'14:00~18:00',place:'군산새만금컨벤션센터',fee:'완납 60,000 / 미납 90,000'},
  {d:'2026-05-16',org:'대한인터벤션영상기술학회',name:'춘계학술대회',time:'08:00~12:00',place:'부산항국제전시컨벤션센터',fee:'완납 40,000 / 미납 70,000'},
  {d:'2026-05-17',org:'대한자기공명기술학회',name:'제1차 보수교육(MR안전관리)',time:'09:00~13:00',place:'군산새만금컨벤션센터',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-05-23',org:'부산광역시회',name:'제16회 학술대회',time:'09:00~18:00',place:'동아대학교 부민캠퍼스 다우홀',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-06-13',org:'대한영상의학기술학회',name:'제2차 보수교육',time:'14:00~18:00',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-06-27',org:'대한CT영상기술학회',name:'제4차 보수교육(선량/영상관리)',time:'13:00~17:00',place:'고려대학교 안암병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-06-27',org:'대한방사선과학회',name:'2026 KSRSC 학술대회',time:'10:00~18:00',place:'신구대학교',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-07-04',org:'대한의료영상정보관리학회',name:'제3차 보수교육',time:'',place:'동남보건대',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-07-04',org:'대한디지털의료영상학회',name:'제2차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-08-08',org:'대한자기공명기술학회',name:'제2차 보수교육(MR물리입문)',time:'14:00~18:00',place:'건국대학교병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-08-09',org:'대한자기공명기술학회',name:'제3차 보수교육(MR임상입문)',time:'10:00~14:00',place:'건국대학교병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-08-23',org:'대한영상의학기술학회',name:'AI학술대회',time:'11:00~18:00',place:'건국대학교병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-08-28',org:'대한CT영상기술학회',name:'제5차 보수교육(부산지부)',time:'18:30~20:30',place:'부산 좋은강안병원',fee:'완납 12,000 / 미납 27,000'},
  {d:'2026-09-03',org:'대한CT영상기술학회',name:'제6차 보수교육(전북지부)',time:'18:30~20:30',place:'원광대학교병원',fee:'완납 12,000 / 미납 27,000'},
  {d:'2026-09-05',org:'대한의료영상정보관리학회',name:'제4차 보수교육',time:'',place:'신구대학교',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-09-05',org:'대한디지털의료영상학회',name:'제3차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-10-17',org:'대한CT영상기술학회',name:'제7차 보수교육(조영제안전관리)',time:'13:00~17:00',place:'가톨릭대 서울성모병원',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-10-17',org:'대한의료영상정보관리학회',name:'제5차 보수교육',time:'',place:'신구대학교',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-10-17',org:'대한방사선치료학회',name:'추계학술대회',time:'13:00~17:00',place:'건국대학교병원(Hybrid)',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-10-24',org:'부산광역시회',name:'2차 보수교육',time:'14:00~18:00',place:'벡스코',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-11-13',org:'대한디지털의료영상학회',name:'제4차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-11-14',org:'대한영상의학기술학회',name:'제3차 보수교육',time:'14:00~18:00',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-11-21',org:'대한방사선치료학회',name:'1차 보수교육(충청전라지회)',time:'14:00~16:00',place:'전북대학교병원',fee:'완납 12,000 / 미납 27,000'},
  {d:'2026-11-28',org:'대한의료영상정보관리학회',name:'제6차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-11-28',org:'유방영상기술학회',name:'제2차 보수교육',time:'',place:'ZOOM 온라인',fee:'완납 24,000 / 미납 54,000'},
  {d:'2026-11-28',org:'대한방사선치료학회',name:'2차 보수교육(부산울산경남)',time:'14:00~16:00',place:'고신대학교복음병원',fee:'완납 12,000 / 미납 27,000'},
];

function getEduEvents(dateKey) {
  return EDU_EVENTS.filter(e => e.d === dateKey);
}
window.schedule = {};

let viewYear=2026, viewMonth=3;
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

// ── 캘린더 렌더 ───────────────────────────────────────
function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  const firstDay = new Date(viewYear,viewMonth,1).getDay();
  const lastDate = new Date(viewYear,viewMonth+1,0).getDate();

  for (let i=0;i<firstDay;i++) { const e=document.createElement('div'); e.className='cal-cell-empty'; grid.appendChild(e); }

  // ✅ 성능: adjMemos 루프 밖에서 한 번만 계산
  const _adjMemos = {};
  const _inspDatesCache = window.schedule['inspDates'] || {};
  EQUIPMENT_INSPECTIONS.forEach((item, idx) => {
    const dates = getInspectionDates(item.baseDate, item.cyclYears);
    dates.forEach(baseDk => {
      const storeKey = baseDk + '_' + item.id;
      const actual = _inspDatesCache[storeKey] || baseDk;
      if (!_adjMemos[actual]) _adjMemos[actual] = [];
      const typeLabel = {precision:'정밀검사',safety:'안전검사',doc:'서류검사'}[item.type];
      const movedNote = actual !== baseDk ? ` ↩기준:${baseDk}` : '';
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
        ctLabel.textContent = (dayData.ctmr||'').includes('MR') ? 'CT·MR' : 'CT';
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
    // ✅ 공휴일(red)이면 빨간색 표시
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

    // ✅ 공휴일 이름 표시
    if (holidayInfo) {
      const hDiv = document.createElement('div');
      hDiv.className = 'holiday-name' + (holidayInfo.red ? '' : ' info-only');
      hDiv.textContent = holidayInfo.name;
      inner.appendChild(hDiv);
    }
    // ✅ 교육 일정 표시
    const eduList = getEduEvents(dateKey);
    if (eduList.length > 0) {
      const eTag = document.createElement('div');
      eTag.className = 'edu-indicator';
      eTag.textContent = '📚' + (eduList.length > 1 ? eduList.length + '건' : eduList[0].org.replace(/대한|학회/g,'').slice(0,5));
      inner.appendChild(eTag);
    }

    const dots = DOT_MARKERS[dateKey];
    if (dots) { const dr=document.createElement('div'); dr.className='dots'; for(let x=0;x<dots;x++){const dt=document.createElement('div');dt.className='dot';dr.appendChild(dt);} inner.appendChild(dr); }
    else { const ph=document.createElement('div'); ph.style.height='10px'; inner.appendChild(ph); }

    const slots=document.createElement('div'); slots.className='badge-slots';
    const mkRow=()=>{const r=document.createElement('div');r.className='badge-row';return r;};
    const badgeClass = (initial) => { if (!isCT) return ''; return (selectedDoc && selectedDoc.initial === initial) ? ' my-badge' : ' other-badge'; };
    const tagClass = (name) => { if (!isCT) return ''; return (selectedDoc && (selectedDoc.name === name || selectedDoc.initial === name)) ? ' my-tag' : ' other-tag'; };

    const rAm=mkRow(); (dayData.half_am||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge half-am'+badgeClass(n);b.textContent='☀'+n;rAm.appendChild(b);}); slots.appendChild(rAm);
    const rPm=mkRow(); (dayData.half_pm||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge half-pm'+badgeClass(n);b.textContent='🌙'+n;rPm.appendChild(b);}); slots.appendChild(rPm);
    const rOff=mkRow(); (dayData.off40||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge '+(isSat?'off40-sat':'off40-weekday')+badgeClass(n);b.textContent=isSat?n:'40:'+n;rOff.appendChild(b);}); slots.appendChild(rOff);
    const rVac=mkRow();
    (dayData.vacation||'').split(' ').filter(Boolean).forEach(n=>{const b=document.createElement('span');b.className='badge vacation'+badgeClass(n);b.textContent='🏝'+n;rVac.appendChild(b);});
    (dayData.alt_leave||'').split(' ').filter(Boolean).forEach(item=>{
      const reason = item.includes(':') ? item.split(':')[0] : 'rest';
      const name   = item.includes(':') ? item.split(':')[1] : item;
      const icons  = {rest:'🌿', reserve:'🪖', event:'💐', public:'🏛', 'half-am':'☀️', 'half-pm':'🌙'};
      const classes= {rest:'alt-rest', reserve:'alt-reserve', event:'alt-event', public:'alt-public', 'half-am':'alt-half-am', 'half-pm':'alt-half-pm'};
      const b=document.createElement('span');
      b.className='badge '+(classes[reason]||'alt-rest')+badgeClass(name);
      b.textContent=(icons[reason]||'🌿')+name;
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
  document.getElementById('month-text').textContent=`${viewYear}년 ${viewMonth+1}월`;
}

// ── 배너 ──────────────────────────────────────────────
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

// ── 팝업 ──────────────────────────────────────────────
function openPopup(dateKey) {
  selectedDateKey=dateKey; selectedDoc=null;
  renderBanner(); renderCalendar();
  document.getElementById('popup-title').textContent=dateKey.slice(5)+' 배정';
  // ✅ 사용자 메모만 textarea에 (검사 일정은 별도 읽기전용)
  const _userMemo = (window.schedule[dateKey]||{}).memo||'';
  document.getElementById('memo-textarea').value = _userMemo;
  const _inspMemos = buildInspectionMemos();
  const _inspText = _inspMemos[dateKey] ? _inspMemos[dateKey].join('\n') : '';
  const inspBox = document.getElementById('insp-info-box');
  if (inspBox) {
    if (_inspText) { inspBox.textContent = '🛡 장비검사 예정\n' + _inspText; inspBox.style.display = 'block'; }
    else { inspBox.style.display = 'none'; }
  }
  renderPopupDocs(); renderDutyRows();
  // ✅ 교육 일정 렌더링
  const _eduEvents = getEduEvents(dateKey);
  const eduSection = document.getElementById('edu-section');
  const eduCards = document.getElementById('edu-cards');
  if (_eduEvents.length > 0) {
    eduCards.innerHTML = '';
    _eduEvents.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'edu-card';
      card.innerHTML = `<div class="edu-org">${ev.org}</div><div class="edu-name">${ev.name}</div><div class="edu-detail">${ev.time ? '<b>시간</b> '+ev.time+'<br>' : ''}<b>장소</b> ${ev.place}<br><b>교육비</b> ${ev.fee}</div>`;
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
      btn.textContent=isActive?'제거':'배정';
      btn.addEventListener('click',(e)=>{ e.stopPropagation(); if(row.id==='alt_leave') openAltReasonPopup(selectedDateKey, selectedDoc); else toggleAssignment(selectedDateKey,row.id,selectedDoc,row.useName); });
      top.appendChild(btn);
    } else { const hint=document.createElement('span'); hint.className='no-doc-hint'; hint.textContent='위에서 직원 선택'; top.appendChild(hint); }
    div.appendChild(top);
    const list=document.createElement('div'); list.className='assigned-list';
    const items=val.split(' ').filter(Boolean);
    if (items.length) {
      items.forEach(item=>{
        const chip=document.createElement('button'); chip.className='assigned-chip '+row.color;
        let displayText = item;
        if (row.id==='alt_leave' && item.includes(':')) { const [rsn,nm]=item.split(':'); const icons={rest:'🌿',reserve:'🪖',event:'💐',public:'🏛','half-am':'☀️','half-pm':'🌙'}; displayText=(icons[rsn]||'🌿')+nm; }
        chip.innerHTML=`${displayText} <span class="del-icon">✕</span>`;
        chip.addEventListener('click',(e)=>{ e.stopPropagation(); removeAssignment(selectedDateKey,row.id,item); });
        list.appendChild(chip);
      });
    } else { const none=document.createElement('span'); none.className='no-assign'; none.textContent='배정 없음'; list.appendChild(none); }
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
  showToast(was?`${doc.name} 제거됨`:`${doc.name} 배정 완료 ✓`);
}

// ── 대휴 ──────────────────────────────────────────────
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
    showToast(`${doc.name} 대휴 제거됨`);
    return;
  }
  document.getElementById('alt-reason-name').textContent = doc.name + ' 선생님 — 사유 선택';
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
  const labels={rest:'대휴',reserve:'예비군훈련',event:'경조사',public:'공가','half-am':'반일대휴(오전)','half-pm':'반일대휴(오후)'};
  showToast(`${doc.name} ${labels[reason]||'대휴'} 등록 ✓`);
}
window.selectAltReason=selectAltReason;
window.openAltReasonPopup=openAltReasonPopup;

function removeAssignment(dk,rowId,targetStr) {
  const dayData=window.schedule[dk]||{};
  const items=(dayData[rowId]||'').split(' ').filter(x=>x&&x!==targetStr);
  window.schedule={...window.schedule,[dk]:{...dayData,[rowId]:items.join(' ')}};
  renderDutyRows(); renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(`${targetStr} 제거됨`);
}

// ── 날씨 ──────────────────────────────────────────────
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
    const ICONS={'01d':'☀️','01n':'🌙','02d':'⛅','02n':'☁️','03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️','09d':'🌧','09n':'🌧','10d':'🌦','10n':'🌧','11d':'⛈','11n':'⛈','13d':'❄️','13n':'❄️','50d':'🌫','50n':'🌫'};
    const BG={'01':'sunny','02':'cloudy','03':'cloudy','04':'cloudy','09':'rainy','10':'rainy','11':'thunder','13':'snowy','50':'cloudy'};
    const getIcon=ic=>ICONS[ic]||'🌤';
    const getBg=ic=>{ if(ic.endsWith('n')&&ic.startsWith('01')) return 'night'; return BG[ic.slice(0,2)]||'cloudy'; };
    const bar=document.getElementById('weather-bar'); bar.className='weather-'+getBg(icon); bar.id='weather-bar';
    document.getElementById('weather-icon-wrap').textContent=getIcon(icon);
    document.getElementById('weather-temp').textContent=temp+'°';
    document.getElementById('weather-feels').textContent='체감 '+feels+'°';
    document.getElementById('weather-desc').textContent=desc+'  💧'+humid+'%  💨'+windMs+'m/s';
    const list=fc.list;
    const toKSTHour=(dt_txt)=>{ const utcDate=new Date(dt_txt.replace(' ','T')+'Z'); return (utcDate.getUTCHours()+9)%24; };
    const toKSTDate=(dt_txt)=>{ const utcDate=new Date(dt_txt.replace(' ','T')+'Z'); const kst=new Date(utcDate.getTime()+9*3600*1000); return kst.toISOString().slice(0,10); };
    const mItem=list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=7&&toKSTHour(h.dt_txt)<=9)||list.find(h=>toKSTDate(h.dt_txt)===todayKST)||list[0];
    const eItem=list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=16&&toKSTHour(h.dt_txt)<=18)||list.find(h=>toKSTDate(h.dt_txt)===todayKST&&toKSTHour(h.dt_txt)>=14)||list[Math.min(4,list.length-1)];
    document.getElementById('wt-morning-icon').textContent=getIcon(mItem.weather[0].icon);
    document.getElementById('wt-morning-temp').textContent=Math.round(mItem.main.temp)+'°';
    document.getElementById('wt-evening-icon').textContent=getIcon(eItem.weather[0].icon);
    document.getElementById('wt-evening-temp').textContent=Math.round(eItem.main.temp)+'°';
    const alerts=[];
    const eIcon=eItem.weather[0].icon, eHour=toKSTHour(eItem.dt_txt);
    if(eIcon.startsWith('10')||eIcon.startsWith('09')) alerts.push(`🌂 퇴근길(${eHour}시경) 비 예보 — 우산 챙기세요!`);
    else if(eIcon.startsWith('11')) alerts.push('⛈ 퇴근길 천둥번개 예보 — 조심하세요!');
    else if(eIcon.startsWith('13')) alerts.push('❄️ 퇴근길 눈 예보 — 미끄럼 주의!');
    const mTemp=Math.round(mItem.main.temp), eTemp=Math.round(eItem.main.temp);
    if(mTemp-eTemp>=8) alerts.push(`🧥 오후 기온 ${mTemp-eTemp}°C 급강하 — 겉옷 챙기세요!`);
    const alertEl=document.getElementById('weather-alert'), alertWrap=document.getElementById('weather-alert-wrap');
    if(alerts.length){ alertEl.textContent=alerts.join('  '); alertEl.classList.add('show'); if(alertWrap) alertWrap.style.display='block'; }
    else{ alertEl.classList.remove('show'); if(alertWrap) alertWrap.style.display='none'; }
    renderWeeklyForecast(list);
    document.getElementById('weather-loading').style.display='none';
    document.getElementById('weather-inner').style.display='flex';
  } catch(e) { console.warn('날씨 로드 실패:',e); document.getElementById('weather-loading').textContent='🌤 날씨 정보 없음'; }
}

function renderWeeklyForecast(list) {
  const wrap=document.getElementById('weekly-forecast-inner'); if(!wrap) return;
  const days={};
  list.forEach(h=>{ const dk=h.dt_txt.slice(0,10); if(!days[dk]) days[dk]={temps:[],icons:[],pop:0}; days[dk].temps.push(Math.round(h.main.temp)); days[dk].icons.push(h.weather[0].icon); days[dk].pop=Math.max(days[dk].pop,h.pop||0); });
  const ICONS={'01d':'☀️','01n':'🌙','02d':'⛅','02n':'☁️','03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️','09d':'🌧','09n':'🌧','10d':'🌦','10n':'🌧','11d':'⛈','11n':'⛈','13d':'❄️','13n':'❄️','50d':'🌫','50n':'🌫'};
  const DOWS=['일','월','화','수','목','금','토'];
  const today=new Date().toISOString().slice(0,10);
  while(wrap.children.length>1) wrap.removeChild(wrap.lastChild);
  Object.keys(days).slice(0,6).forEach(dk=>{
    const d=days[dk], high=Math.max(...d.temps), low=Math.min(...d.temps);
    const dayIcon=d.icons.find(i=>i.endsWith('d'))||d.icons[0];
    const icon=ICONS[dayIcon]||'🌤';
    const dateObj=new Date(dk+'T00:00:00'), dow=dateObj.getDay(), dowLabel=DOWS[dow];
    const dateLabel=`${dateObj.getMonth()+1}/${dateObj.getDate()}`;
    const isToday=dk===today, rainPct=Math.round((d.pop||0)*100);
    const div=document.createElement('div'); div.className='fc-day'+(isToday?' today':'');
    const dowEl=document.createElement('div'); dowEl.className='fc-dow'+(dow===0?' sun':(dow===6?' sat':'')); dowEl.textContent=isToday?'오늘':dowLabel;
    const dateEl=document.createElement('div'); dateEl.className='fc-date'; dateEl.textContent=dateLabel;
    const iconEl=document.createElement('div'); iconEl.className='fc-icon'; iconEl.textContent=icon;
    const tempsEl=document.createElement('div'); tempsEl.className='fc-temps'; tempsEl.innerHTML=`<span class="fc-high">${high}°</span><span class="fc-low">${low}°</span>`;
    div.appendChild(dowEl); div.appendChild(dateEl); div.appendChild(iconEl); div.appendChild(tempsEl);
    if(rainPct>=20){ const rainEl=document.createElement('div'); rainEl.className='fc-rain'; rainEl.textContent=`💧${rainPct}%`; div.appendChild(rainEl); }
    wrap.appendChild(div);
  });
}

// ── ✅ 검사일 조정 — 다중 검사 지원 ────────────────────
let _inspMoveBase = null;        // 기준일(공통)
let _inspMoveItems = [];         // 해당 날짜의 모든 검사 [{idx, base, id, ...}]
let _inspMoveSelected = new Set(); // 선택된 항목 인덱스 (EQUIPMENT_INSPECTIONS idx)

function openInspMovePopup(dateKey, dateItems) {
  _inspMoveBase = dateKey;
  _inspMoveItems = dateItems;
  _inspMoveSelected = new Set();

  // 모든 항목 기본 선택
  dateItems.forEach(di => {
    _inspMoveSelected.add(di.idx);
  });

  document.getElementById('insp-move-base').textContent = '기준일: ' + dateKey;

  // 저장된 날짜 있으면 가져오기
  const storedDates = window.schedule['inspDates'] || {};
  const firstAdj = dateItems.find(di => EQUIPMENT_INSPECTIONS[di.idx].adjustable);
  const storedDate = firstAdj ? (storedDates[firstAdj.base + '_' + EQUIPMENT_INSPECTIONS[firstAdj.idx].id] || dateKey) : dateKey;
  document.getElementById('insp-move-date').value = storedDate;

  // 검사 목록 렌더링
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
    const typeLabel = {precision:'정밀검사',safety:'안전검사',doc:'서류검사'}[item.type];
    const storeKey = di.base + '_' + item.id;
    const currentDate = storedDates[storeKey] || di.base;
    const movedNote = currentDate !== di.base ? ` → ${currentDate}` : '';

    const row = document.createElement('div');
    row.className = 'insp-list-item' + (isSelected ? ' selected' : '');

    row.innerHTML = `
      <span class="insp-emoji">${item.emoji}</span>
      <div class="insp-info">
        <div class="insp-short">${item.short}${movedNote}</div>
        <div class="insp-type">${typeLabel} · ${item.name}</div>
      </div>
      <div class="insp-check">${isSelected ? '✓' : ''}</div>
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
    showToast('⚠️ 이동할 검사를 선택해주세요');
    return;
  }

  // ±21일 검증
  const base = new Date(_inspMoveBase);
  const selected = new Date(newDate);
  const diffDays = Math.round((selected - base) / 86400000);
  if (Math.abs(diffDays) > 21) {
    showToast('⚠️ 기준일 ±21일 이내로 설정해주세요');
    return;
  }

  // ✅ FIX: inspDates 키 사용 (Firestore 호환)
  const oldStored = window.schedule['inspDates'] || {};
  const newStored = Object.assign({}, oldStored);

  let movedCount = 0;
  _inspMoveSelected.forEach(idx => {
    const item = EQUIPMENT_INSPECTIONS[idx];
    // 해당 아이템의 base 찾기
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
  showToast(`✅ ${movedCount}건 → ${newDate}로 이동됨`);
}
window.saveInspDate = saveInspDate;

// ── ✅ 전체 공지사항 — noticeData 키 사용 ─────────────
function loadNotice() {
  const userText = (window.schedule['noticeData'] || {}).text || '';
  const el = document.getElementById('notice-text');
  if (!el) return;

  const upcoming = getUpcomingInspections(15);
  let autoAlert = '';
  if (upcoming.length > 0) {
    const lines = upcoming.map(u => {
      const dStr = u.diff === 0 ? '📅 오늘!' : `📅 D-${u.diff}`;
      return `${dStr} ${u.label} (${u.dk})`;
    });
    autoAlert = '⚠️ 장비검사 예정\n' + lines.join('\n');
  }

  const finalText = [autoAlert, userText].filter(Boolean).join('\n─────────────\n');

  if (finalText.trim()) {
    el.textContent = finalText;
    el.classList.remove('empty');
    if (autoAlert) {
      const bar = document.getElementById('notice-bar');
      if (bar) bar.style.borderBottomColor = '#ef4444';
      const label = document.getElementById('notice-label');
      if (label) { label.textContent = '⚠️ 긴급'; label.style.background = '#ef4444'; }
    }
  } else {
    el.textContent = '공지사항을 입력하세요 (✏️ 버튼)';
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
  showToast(text.trim() ? '공지 저장 완료 📢' : '공지가 삭제되었습니다');
}
window.saveNotice = saveNotice;

// ── 메모 (사용자 메모만 저장) ──────────────────────────
window.saveMemo=function(){
  if(!selectedDateKey) return;
  const memo=document.getElementById('memo-textarea').value.trim();
  window.schedule={...window.schedule,[selectedDateKey]:{...(window.schedule[selectedDateKey]||{}),memo}};
  renderCalendar();
  if(window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(memo?'메모 저장 완료 💬':'메모 삭제됨');
};

// ── 정산 ──────────────────────────────────────────────
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
      if(isH){doc.weekends.push(dObj.getDate());doc.totalHours+=14.5;}
      else if(dow===6){doc.weekends.push(dObj.getDate());doc.totalHours+=16.5;}
      else if(tmrwH){doc.weekdays.push(dObj.getDate());doc.totalHours+=(dow===1?10.5:12);}
      else if(dow===5){doc.weekdays.push(dObj.getDate());doc.totalHours+=8;}
      else if(dow===1){doc.weekdays.push(dObj.getDate());doc.totalHours+=3;}
      else{doc.weekdays.push(dObj.getDate());doc.totalHours+=4.5;}
    });
    (day.evening||'').split(' ').filter(Boolean).forEach(ini=>{
      const doc=data.find(x=>x.initial===ini||x.name===ini); if(!doc) return;
      if(isH) doc.totalHours+=12; else if(dow===6){doc.weekends.push(dObj.getDate());doc.totalHours+=6;}
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
    tr.innerHTML=`<td style="padding:12px 8px;font-weight:700;text-align:left">${r.name}<span class="title-badge">${r.title}</span></td><td class="used-cell" style="padding:12px 8px">${r.usedVacation}일</td><td class="remain-cell" style="padding:12px 8px">${remain}일${payout>0?`<span class="payout-note">수당 +${payout}일</span>`:''}</td>`;
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
