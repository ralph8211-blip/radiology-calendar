const SECRET_PIN = "6633";
// ==========================================
// 📊 구글 애널리틱스 (방문자 통계) 자동 연결 코드
// ==========================================
(function() {
    // 👇 아래 "G-여기에입력하세요" 부분을 원장님이 방금 발급받은 아이디로 꼭 바꿔주세요!
    const GA_ID = "G-0GDG8P62X2"; 
    
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_ID);
    
    console.log("📊 구글 애널리틱스 장착 완료!");
})();
// ==========================================
  function checkLoginStatus() {
    const isLogged = localStorage.getItem('calendar_auth') === 'true';
    if (isLogged) {
      document.getElementById('login-overlay').style.display = 'none';
      document.getElementById('app-container').style.display = 'block';
    } else {
      document.getElementById('login-overlay').style.display = 'flex';
      document.getElementById('app-container').style.display = 'none';
      document.getElementById('pin-input').value = '';
    }
  }

  function handleLogin() {
    const input = document.getElementById('pin-input').value;
    if (input === SECRET_PIN) {
      localStorage.setItem('calendar_auth', 'true');
      showToast("로그인 성공");
      checkLoginStatus();
    } else {
      showToast("비밀번호가 일치하지 않습니다.");
      document.getElementById('pin-input').value = '';
    }
  }

  function handleLogout() {
    localStorage.removeItem('calendar_auth');
    showToast("로그아웃 되었습니다.");
    checkLoginStatus();
  }

  checkLoginStatus();


import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  apiKey:            "AIzaSyBpeLflDoGLmbvciVoYMfDJPm2lIIj9Q0I",
  authDomain:        "haedong-calendar.firebaseapp.com",
  projectId:         "haedong-calendar",
  storageBucket:     "haedong-calendar.firebasestorage.app",
  messagingSenderId: "616171070488",
  appId:             "1:616171070488:web:740f8477651ef103d18f6d"
};

let db = null, auth = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setSyncStatus('online');
      const scheduleRef = doc(db, 'radiology', 'schedule_v1');
      onSnapshot(scheduleRef, (snap) => {
        if (snap.exists()) {
          window.schedule = snap.data();
          renderCalendar();
          renderReport();
        }
      });
    }
  });

  signInAnonymously(auth).catch(e => {
    console.warn('익명 로그인 실패:', e);
    setSyncStatus('offline');
  });
} catch(e) {
  console.warn('Firebase 초기화 실패:', e);
  setSyncStatus('offline');
}

window.saveToCloud = async function(newSchedule) {
  if (!db || !auth?.currentUser) return;
  setSyncStatus('saving');
  try {
    await setDoc(doc(db, 'radiology', 'schedule_v1'), newSchedule);
    setSyncStatus('saved');
    setTimeout(() => setSyncStatus('online'), 2000);
  } catch(e) {
    console.error('저장 실패:', e);
    setSyncStatus('offline');
  }
};

function setSyncStatus(s) {
  const el = document.getElementById('sync-indicator');
  if (!el) return;
  el.className = s;
  el.title = { saving:'저장 중...', saved:'저장됨', online:'동기화 중', offline:'오프라인' }[s] || '';
}
window.setSyncStatus = setSyncStatus;


const DOCTOR_MAP = [
  { name: '김종환', initial: '종', totalLeave: 25, title: '실장' },
  { name: '이승남', initial: '승', totalLeave: 24, title: '계장' },
  { name: '이동현', initial: '동', totalLeave: 22, title: '계장' },
  { name: '강은미', initial: '강', totalLeave: 16, title: '계장' },
  { name: '송선경', initial: '선', totalLeave: 18, title: '주임' },
  { name: '김현정', initial: '현', totalLeave: 18, title: '주임' },
  { name: '송우석', initial: '송', totalLeave: 16, title: '선생님' },
  { name: '김현석', initial: '석', totalLeave: 16, title: '선생님' },
  { name: '지은열', initial: '지', totalLeave: 15, title: '선생님' },
  { name: '송진우', initial: '진', totalLeave: 15, title: '선생님' },
  { name: '조지혜', initial: '조', totalLeave: 10, title: '선생님' },
  { name: '이용진', initial: '용', totalLeave: 9,  title: '선생님' },
  { name: '김봉선', initial: '봉', totalLeave: 17, title: '선생님' },
  { name: '박용주', initial: '박', totalLeave: 25, title: '선생님' }
];

const DUTY_ROWS = [
  { id: 'half_am',  label: '오전반차',    color: 'c-orange', useName: false },
  { id: 'half_pm',  label: '오후반차',    color: 'c-blue',   useName: false },
  { id: 'off40',    label: '40H OFF',     color: 'c-rose',   useName: false },
  { id: 'vacation', label: '종일연차',    color: 'c-purple', useName: false },
  { id: 'alt_leave',label: '대휴(차감X)', color: 'c-emerald',useName: false },
  { id: 'ctmr',     label: 'CT / MR',    color: 'c-teal',   useName: false },
  { id: 'evening',  label: '이브닝',      color: 'c-amber',  useName: true  },
  { id: 'night',    label: '야간당직',    color: 'c-indigo', useName: true  }
];

const DOT_MARKERS = {
  "2026-03-07":1,"2026-03-14":2,"2026-03-21":2,"2026-03-28":1,
  "2026-04-04":1,"2026-04-11":2,"2026-04-18":2,"2026-04-25":1
};

const FIXED_HOLIDAYS = {"03-01":"삼일절","05-05":"어린이날","06-06":"현충일","08-15":"광복절"};

const DEFAULT_INSPECTIONS = {
  '2025-01-04': 'C-ARM 1 안전검사',
  '2025-01-13': 'CT 안전/정밀검사',
  '2025-02-04': '선별 POTABLE 안전검사',
  '2025-03-07': 'MAMMO 안전/정밀검사\n촬영실 2 안전검사',
  '2025-04-09': '골밀도촬영기 안전검사',
  '2025-04-11': '초음파쇄석기 안전검사',
  '2025-04-29': 'C-ARM 2 안전검사',
  '2025-12-24': '분만 POTABLE 안전검사',
  '2026-03-03': 'MAMMO 안전검사',
  '2026-04-02': 'MRI 정밀검사',
  '2026-04-28': '촬영실 1 안전검사',
  '2026-05-13': '검진 INNOVISION 안전검사',
  '2026-09-22': '음압 POTABLE 안전검사',
  '2027-02-27': '검진 파노라마 안전검사',
  '2027-09-26': '검진 위장촬영 안전검사',
  '2028-01-04': 'C-ARM 1 안전검사',
  '2028-01-13': 'CT 안전/정밀검사',
  '2028-02-04': '선별 POTABLE 안전검사',
  '2028-03-07': 'MAMMO 안전/정밀검사\n촬영실 2 안전검사',
  '2028-04-09': '골밀도촬영기 안전검사',
  '2028-04-11': '초음파쇄석기 안전검사',
  '2028-04-29': 'C-ARM 2 안전검사',
  '2028-12-24': '분만 POTABLE 안전검사'
};

window.schedule = window.schedule || {};

let viewYear = 2026, viewMonth = 2;
let selectedDateKey = null;
let selectedDoc = null;
let showScreening = false;

function isHoliday(dateKey) { return !!FIXED_HOLIDAYS[dateKey.slice(5)]; }

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2000);
}

function getEffectiveMemo(dateKey, dayData) {
  if (dayData && dayData.memo !== undefined) {
    return dayData.memo;
  }
  return DEFAULT_INSPECTIONS[dateKey] || '';
}

// ─── 캘린더 렌더 ──────────────────────────────────────
function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const e = document.createElement('div'); e.className = 'cal-cell-empty'; grid.appendChild(e);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateKey = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayData = window.schedule[dateKey] || {};
    const dow = new Date(dateKey).getDay();
    const isSun = dow === 0, isSat = dow === 6;

    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (selectedDateKey === dateKey ? ' selected' : '');

    const hl = getHighlightType(dateKey);
    if (hl) {
      const ov = document.createElement('div');
      ov.className = 'hl-overlay';
      ov.style.background =
        hl==='blue'    ? 'rgba(59,130,246,0.25)' :
        hl==='red'     ? 'rgba(239,68,68,0.25)' :
        hl==='half-am' ? 'linear-gradient(to bottom,rgba(239,68,68,0.25) 50%,transparent 50%)' :
                         'linear-gradient(to top,rgba(239,68,68,0.25) 50%,transparent 50%)';
      cell.appendChild(ov);
    }
    if (selectedDoc && !hl) cell.classList.add('dimmed');

    const inner = document.createElement('div');
    inner.className = 'cell-inner';

    const dayHeaderRow = document.createElement('div');
    dayHeaderRow.className = 'day-header-row';
    // 🛠️ 수정: 가로 정렬을 위한 CSS 추가
    dayHeaderRow.style.display = 'flex';
    dayHeaderRow.style.alignItems = 'center';

    const numSpan = document.createElement('span');
    numSpan.className = 'day-num' + (isSun?' sun':(isSat?' sat':''));
    numSpan.textContent = d;
    dayHeaderRow.appendChild(numSpan);

    // 🛠️ 수정: 장비 뱃지를 slots 영역이 아닌 날짜 바로 옆(dayHeaderRow)으로 분리 이동!
    const memoText = getEffectiveMemo(dateKey, dayData);
    if (memoText.includes('검사')) {
      let equipAbbr = '장비';
      if (memoText.match(/MAMMO/i)) equipAbbr = 'MAMMO';
      else if (memoText.match(/MRI/i)) equipAbbr = 'MRI';
      else if (memoText.match(/CT/i)) equipAbbr = 'CT';
      else if (memoText.match(/C-ARM/i)) equipAbbr = 'C-ARM';
      else if (memoText.match(/촬영실/i)) equipAbbr = '촬영실';
      else if (memoText.match(/POTABLE/i)) equipAbbr = 'POTABLE';
      else if (memoText.match(/골밀도/i)) equipAbbr = '골밀도';
      else if (memoText.match(/초음파/i)) equipAbbr = '초음파';
      else if (memoText.match(/파노라마/i)) equipAbbr = '파노라마';
      else if (memoText.match(/INNOVISION/i)) equipAbbr = 'INNOVISION';
      else if (memoText.match(/위장/i)) equipAbbr = '위장조영';

      const inspBadge = document.createElement('span');
      inspBadge.className = 'badge inspection-badge';
      inspBadge.style.marginLeft = '6px'; // 날짜와 살짝 띄우기
      inspBadge.style.fontSize = '10px';
      inspBadge.style.padding = '1px 4px';
      inspBadge.innerHTML = `🛠 ${equipAbbr}`;
      dayHeaderRow.appendChild(inspBadge);
    }

    // 스마트 메모 아이콘
    if (memoText.trim()) {
      const memoIcon = document.createElement('span');
      memoIcon.className = 'memo-icon';
      memoIcon.title = memoText;
      memoIcon.style.marginLeft = 'auto'; // 메모 아이콘은 맨 우측 끝으로 밀기
      memoIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/></svg>`;
      dayHeaderRow.appendChild(memoIcon);
    }
    inner.appendChild(dayHeaderRow);

    const dots = DOT_MARKERS[dateKey];
    if (dots) {
      const dotRow = document.createElement('div'); dotRow.className = 'dots';
      for (let x=0;x<dots;x++) { const dot=document.createElement('div'); dot.className='dot'; dotRow.appendChild(dot); }
      inner.appendChild(dotRow);
    } else {
      const ph = document.createElement('div'); ph.style.height='14px'; inner.appendChild(ph);
    }

    const slots = document.createElement('div');
    slots.className = 'badge-slots';

    // 🛠️ 수정: 모든 줄의 최소 높이를 강제 고정!
    // 오전반차 행이 비어도 18px을 차지하므로 40H OFF가 절대 위로 당겨지지 않고 행이 완벽히 정렬됩니다.
    const mkRow = () => { 
      const r = document.createElement('div'); 
      r.className = 'badge-row'; 
      r.style.minHeight = '18px'; // 핵심 고정 높이
      r.style.marginBottom = '2px';
      return r; 
    };

    const rowAm = mkRow();
    (dayData.half_am||'').split(' ').filter(Boolean).forEach(n=>{ const b=document.createElement('span'); b.className='badge half-am'; b.textContent='☀'+n; rowAm.appendChild(b); });
    slots.appendChild(rowAm);

    const rowPm = mkRow();
    (dayData.half_pm||'').split(' ').filter(Boolean).forEach(n=>{ const b=document.createElement('span'); b.className='badge half-pm'; b.textContent='🌙'+n; rowPm.appendChild(b); });
    slots.appendChild(rowPm);

    const rowOff = mkRow();
    (dayData.off40||'').split(' ').filter(Boolean).forEach(n=>{ const b=document.createElement('span'); b.className='badge '+(isSat?'off40-sat':'off40-weekday'); b.textContent=isSat?n:'40:'+n; rowOff.appendChild(b); });
    slots.appendChild(rowOff);

    const rowVac = mkRow();
    // 🛠️ 연차(vacation)와 대휴(alt_leave)는 완벽히 동일한 rowVac(4번째 줄) 안에 들어갑니다.
    (dayData.vacation||'').split(' ').filter(Boolean).forEach(n=>{ const b=document.createElement('span'); b.className='badge vacation'; b.textContent='🏝'+n; rowVac.appendChild(b); });
    (dayData.alt_leave||'').split(' ').filter(Boolean).forEach(n=>{ const b=document.createElement('span'); b.className='badge alt-leave'; b.textContent='🌿'+n; rowVac.appendChild(b); });
    slots.appendChild(rowVac);
    
    inner.appendChild(slots);

    const bottom = document.createElement('div');
    bottom.className = 'bottom-tags';

    (dayData.evening||'').split(' ').filter(Boolean).forEach(n=>{
      const doc = DOCTOR_MAP.find(d => d.name === n || d.initial === n);
      const dispName = doc ? doc.name.substring(1) : n; 
      const t=document.createElement('div');
      t.className='evening-tag';
      t.textContent='E:'+dispName;
      bottom.appendChild(t);
    });

    (dayData.night||'').split(' ').filter(Boolean).forEach(n=>{
      const doc = DOCTOR_MAP.find(d => d.name === n || d.initial === n);
      const dispName = doc ? doc.name.substring(1) : n; 
      const t=document.createElement('div');
      t.className='night-tag';
      t.textContent='N:'+dispName;
      bottom.appendChild(t);
    });

    inner.appendChild(bottom);
    cell.appendChild(inner);

    cell.addEventListener('click', () => openPopup(dateKey));
    grid.appendChild(cell);
  }

  document.getElementById('month-text').textContent = `${viewYear}년 ${viewMonth+1}월`;
}

function getHighlightType(dateKey) {
  if (!selectedDoc) return null;
  const day = window.schedule[dateKey];
  if (!day) return null;
  const isSat = new Date(dateKey).getDay() === 6;
  if ((day.night||'').includes(selectedDoc.name) || (day.evening||'').includes(selectedDoc.name)) return 'blue';
  if ((day.vacation||'').includes(selectedDoc.initial) || (isSat && (day.off40||'').includes(selectedDoc.initial))) return 'red';
  if ((day.half_am||'').includes(selectedDoc.initial)) return 'half-am';
  if ((day.half_pm||'').includes(selectedDoc.initial)) return 'half-pm';
  return null;
}

function renderBanner() {
  const scroll = document.getElementById('banner-scroll');
  scroll.innerHTML = '';
  DOCTOR_MAP.filter(d=>d.name!=='박용주').forEach(doc => {
    const btn = document.createElement('button');
    btn.className = 'doc-btn' + (selectedDoc?.name===doc.name?' active':'');
    btn.innerHTML = `<span class="t">${doc.title}</span><span class="n">${doc.initial}</span>`;
    btn.onclick = () => {
      selectedDoc = selectedDoc?.name===doc.name ? null : doc;
      renderBanner();
      renderCalendar();
    };
    scroll.appendChild(btn);
  });
}

function bannerScroll(dir) {
  document.getElementById('banner-scroll').scrollBy({left: dir*200, behavior:'smooth'});
}

function openPopup(dateKey) {
  selectedDateKey = dateKey;
  selectedDoc = null;
  renderBanner();
  renderCalendar();

  const dowKor = ['일', '월', '화', '수', '목', '금', '토'][new Date(dateKey).getDay()];
  document.getElementById('popup-title').textContent = `${dateKey.slice(5)} (${dowKor}) 배정`;

  document.getElementById('memo-textarea').value = getEffectiveMemo(dateKey, window.schedule[dateKey] || {});

  renderPopupDocs();
  renderDutyRows();
  document.getElementById('popup-overlay').classList.add('open');
}

window.closePopup = function(e) {
  if (e && e.target !== document.getElementById('popup-overlay')) return;
  document.getElementById('popup-overlay').classList.remove('open');
  selectedDateKey = null;
  renderCalendar();
};

function renderPopupDocs() {
  const scroll = document.getElementById('popup-doc-scroll');
  scroll.innerHTML = '';
  DOCTOR_MAP.forEach(doc => {
    const btn = document.createElement('button');
    btn.className = 'pdoc-btn' + (selectedDoc?.name===doc.name?' active':'');
    btn.innerHTML = `<span class="t">${doc.title}</span><span class="n">${doc.initial}</span>`;
    btn.onclick = () => {
      selectedDoc = selectedDoc?.name===doc.name ? null : doc;
      renderPopupDocs();
      renderDutyRows();
      renderBanner();
      renderCalendar();
    };
    scroll.appendChild(btn);
  });
}

function popupScroll(dir) {
  document.getElementById('popup-doc-scroll').scrollBy({left: dir*200, behavior:'smooth'});
}

function renderDutyRows() {
  const container = document.getElementById('duty-rows');
  container.innerHTML = '';

  DUTY_ROWS.forEach(row => {
    const dayData = window.schedule[selectedDateKey] || {};
    const val = dayData[row.id] || '';
    const target = row.useName ? selectedDoc?.name : selectedDoc?.initial;
    const isActive = !!(selectedDoc && target && val.includes(target));

    const div = document.createElement('div');
    div.className = 'duty-row' + (isActive?' active-row':'') + (!selectedDoc?' no-doc':'');

    div.addEventListener('click', () => {
      if (!selectedDoc) return;
      toggleAssignment(selectedDateKey, row.id, selectedDoc, row.useName);
    });

    const top = document.createElement('div');
    top.className = 'duty-row-top';

    const lbl = document.createElement('span');
    lbl.className = 'duty-row-label ' + row.color;
    lbl.textContent = row.label;
    top.appendChild(lbl);

    if (selectedDoc) {
      const btn = document.createElement('button');
      btn.className = 'assign-btn ' + (isActive ? 'remove' : 'add');
      btn.textContent = isActive ? '제거' : '배정';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAssignment(selectedDateKey, row.id, selectedDoc, row.useName);
      });
      top.appendChild(btn);
    } else {
      const hint = document.createElement('span');
      hint.className = 'no-doc-hint';
      hint.textContent = '위에서 직원 선택';
      top.appendChild(hint);
    }
    div.appendChild(top);

    const list = document.createElement('div');
    list.className = 'assigned-list';
    const items = val.split(' ').filter(Boolean);
    if (items.length) {
      items.forEach(n => {
        const chip = document.createElement('button');
        chip.className = 'assigned-chip ' + row.color;
        chip.innerHTML = `${n} <span class="del-icon">✕</span>`;
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          removeAssignment(selectedDateKey, row.id, n);
        });
        list.appendChild(chip);
      });
    } else {
      const none = document.createElement('span');
      none.className = 'no-assign';
      none.textContent = '배정 없음';
      list.appendChild(none);
    }
    div.appendChild(list);
    container.appendChild(div);
  });
}

function toggleAssignment(dk, rowId, doc, useName) {
  const dayData = window.schedule[dk] || {};
  const target = useName ? doc.name : doc.initial;
  let items = (dayData[rowId] || '').split(' ').filter(Boolean);
  const wasAssigned = items.includes(target);
  if (wasAssigned) {
    items = items.filter(x => x !== target);
  } else {
    items.push(target);
  }
  const val = items.join(' ');
  window.schedule = { ...window.schedule, [dk]: { ...dayData, [rowId]: val } };
  renderDutyRows();
  renderCalendar();
  if (window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(wasAssigned ? `${doc.name} 제거됨` : `${doc.name} 배정 완료 ✓`);
}

function removeAssignment(dk, rowId, targetStr) {
  const dayData = window.schedule[dk] || {};
  const items = (dayData[rowId] || '').split(' ').filter(x => x && x !== targetStr);
  const val = items.join(' ');
  window.schedule = { ...window.schedule, [dk]: { ...dayData, [rowId]: val } };
  renderDutyRows();
  renderCalendar();
  if (window.saveToCloud) window.saveToCloud(window.schedule);
  showToast(`${targetStr} 제거됨`);
}

window.saveMemo = function() {
  if (!selectedDateKey) return;
  const memo = document.getElementById('memo-textarea').value;
  const dayData = window.schedule[selectedDateKey] || {};

  window.schedule = { ...window.schedule, [selectedDateKey]: { ...dayData, memo } };
  renderCalendar();
  if (window.saveToCloud) window.saveToCloud(window.schedule);

  if (memo.trim() === '') {
    showToast('메모가 삭제되었습니다');
  } else {
    showToast('메모 저장 완료 💬');
  }
};

function renderReport() {
  const yearStr = String(viewYear);
  const monthPrefix = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}`;

  const data = DOCTOR_MAP.map(d => ({
    name: d.name, initial: d.initial, title: d.title, totalLeave: d.totalLeave,
    weekdays: [], weekends: [], totalHours: 0, usedVacation: 0
  }));

  Object.keys(window.schedule).forEach(dk => {
    if (!dk.startsWith(yearStr)) return;
    const day = window.schedule[dk];
    data.forEach(doc => {
      if ((day.vacation||'').includes(doc.initial)) doc.usedVacation += 1;
      if ((day.half_am||'').includes(doc.initial)) doc.usedVacation += 0.5;
      if ((day.half_pm||'').includes(doc.initial)) doc.usedVacation += 0.5;
    });
  });

  Object.keys(window.schedule).forEach(dk => {
    if (!dk.startsWith(monthPrefix)) return;
    const day = window.schedule[dk];
    const dObj = new Date(dk);
    const dow = dObj.getDay();
    const isH = isHoliday(dk) || dow === 0;
    const tmrw = new Date(dObj); tmrw.setDate(tmrw.getDate()+1);
    const tmrwKey = tmrw.toISOString().split('T')[0];
    const tmrwH = isHoliday(tmrwKey) || tmrw.getDay()===0;

    (day.night||'').split(' ').filter(Boolean).forEach(ini => {
      const doc = data.find(x=>x.initial===ini||x.name===ini);
      if (!doc) return;
      if (isH) { doc.weekends.push(dObj.getDate()); doc.totalHours += 14.5; }
      else if (dow===6) { doc.weekends.push(dObj.getDate()); doc.totalHours += 16.5; }
      else if (tmrwH) { doc.weekdays.push(dObj.getDate()); doc.totalHours += (dow===1?10.5:12); }
      else if (dow===5) { doc.weekdays.push(dObj.getDate()); doc.totalHours += 8; }
      else if (dow===1) { doc.weekdays.push(dObj.getDate()); doc.totalHours += 3; }
      else { doc.weekdays.push(dObj.getDate()); doc.totalHours += 4.5; }
    });
    (day.evening||'').split(' ').filter(Boolean).forEach(ini => {
      const doc = data.find(x=>x.initial===ini||x.name===ini);
      if (!doc) return;
      if (isH) doc.totalHours += 12;
      else if (dow===6) { doc.weekends.push(dObj.getDate()); doc.totalHours += 6; }
    });
  });

  const dutyTbody = document.getElementById('duty-tbody');
  dutyTbody.innerHTML = '';
  data.filter(r=>r.totalHours>0).forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="padding:14px 8px;font-weight:700;text-align:left">${r.name}<span class="title-badge">${r.title}</span></td><td style="padding:14px 8px;color:#64748b;font-size:13px">${r.weekdays.join(', ')}</td><td style="padding:14px 8px;color:#64748b;font-size:13px">${r.weekends.join(', ')}</td><td class="hours-cell" style="padding:14px 8px">${r.totalHours}h</td>`;
    dutyTbody.appendChild(tr);
  });

  const leaveTbody = document.getElementById('leave-tbody');
  leaveTbody.innerHTML = '';
  data.forEach(r => {
    const usable = Math.min(r.totalLeave, 20);
    const remain = usable - r.usedVacation;
    const payout = Math.max(0, r.totalLeave - 20);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="padding:14px 8px;font-weight:700;text-align:left">${r.name}<span class="title-badge">${r.title}</span></td><td class="used-cell" style="padding:14px 8px">${r.usedVacation}일</td><td class="remain-cell" style="padding:14px 8px">${remain}일${payout>0?`<span class="payout-note">수당 +${payout}일</span>`:''}</td>`;
    leaveTbody.appendChild(tr);
  });
}

function switchTab(tab) {
  document.getElementById('tab-content-duty').style.display = tab==='duty'?'block':'none';
  document.getElementById('tab-content-leave').style.display = tab==='leave'?'block':'none';
  document.getElementById('tab-duty').classList.toggle('active-tab', tab==='duty');
  document.getElementById('tab-leave').classList.toggle('active-tab', tab==='leave');
}
window.switchTab = switchTab;

window.toggleScreening = function(show) {
  showScreening = show ?? !showScreening;
  document.getElementById('calendar-section').style.display = showScreening ? 'none' : 'block';
  document.getElementById('month-header').style.display = showScreening ? 'none' : 'flex';
  document.getElementById('screening').classList.toggle('visible', showScreening);
  document.getElementById('bottom-banner').style.display = showScreening ? 'none' : 'block';
  document.getElementById('btn-screening').classList.toggle('active', showScreening);
  if (showScreening) renderReport();
};

document.getElementById('btn-screening').onclick = () => toggleScreening();
document.getElementById('btn-prev').onclick = () => { viewMonth--; if(viewMonth<0){viewMonth=11;viewYear--;} renderCalendar(); };
document.getElementById('btn-next').onclick = () => { viewMonth++; if(viewMonth>11){viewMonth=0;viewYear++;} renderCalendar(); };

renderCalendar();
renderBanner();

window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.bannerScroll = bannerScroll;
window.popupScroll = popupScroll;
window.switchTab = switchTab;
window.checkLoginStatus = checkLoginStatus;
