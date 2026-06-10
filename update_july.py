import re

def update_app():
    with open('app.js', 'r', encoding='utf-8') as f:
        content = f.read()

    old_dots = 'const DOT_MARKERS = {"2026-03-07":1,"2026-03-14":2,"2026-03-21":2,"2026-03-28":1,"2026-04-04":1,"2026-04-11":2,"2026-04-18":2,"2026-04-25":1,"2026-05-02":1,"2026-05-09":2,"2026-05-16":2,"2026-05-23":1,"2026-05-30":1,"2026-06-06":1,"2026-06-13":1,"2026-06-20":2,"2026-06-27":1};'
    new_dots = 'const DOT_MARKERS = {"2026-03-07":1,"2026-03-14":2,"2026-03-21":2,"2026-03-28":1,"2026-04-04":1,"2026-04-11":2,"2026-04-18":2,"2026-04-25":1,"2026-05-02":1,"2026-05-09":2,"2026-05-16":2,"2026-05-23":1,"2026-05-30":1,"2026-06-06":1,"2026-06-13":1,"2026-06-20":2,"2026-06-27":1,"2026-07-04":1,"2026-07-11":2,"2026-07-18":2,"2026-07-25":1,"2026-08-01":1};'

    if old_dots in content:
        content = content.replace(old_dots, new_dots)
    else:
        print('Warning: old_dots exact string not found. Using regex.')
        content = re.sub(r'const DOT_MARKERS = \{.*?\};', new_dots, content)

    july_func = """
// ── July 2026 Seed Data Utility ───────────────────
window.applyJulySchedule = async function() {
  const julyData = {
    "2026-07-01": { "ctmr": "동", "night": "이승남" },
    "2026-07-02": { "ctmr": "송", "night": "이동현" },
    "2026-07-03": { "ctmr": "승", "night": "지은열" },
    "2026-07-04": { "ctmr": "동", "evening": "김종환", "night": "이승남", "off40": "동 석 진 용" },
    "2026-07-05": { "ctmr": "종", "evening": "송우석", "night": "김현석" },
    "2026-07-06": { "ctmr": "종", "night": "송우석" },
    "2026-07-07": { "ctmr": "종", "night": "이동현" },
    "2026-07-08": { "ctmr": "송", "night": "이승남" },
    "2026-07-09": { "ctmr": "동", "night": "송진우" },
    "2026-07-10": { "ctmr": "승", "night": "송우석" },
    "2026-07-11": { "ctmr": "종", "evening": "김현석", "night": "지은열", "off40": "종 승 조 봉" },
    "2026-07-12": { "ctmr": "종", "evening": "이승남", "night": "이동현" },
    "2026-07-13": { "ctmr": "송", "night": "이승남" },
    "2026-07-14": { "ctmr": "동", "night": "김현석" },
    "2026-07-15": { "ctmr": "종", "night": "지은열" },
    "2026-07-16": { "ctmr": "승", "night": "송우석" },
    "2026-07-17": { "ctmr": "송", "evening": "이동현", "night": "송진우" },
    "2026-07-18": { "ctmr": "송", "evening": "이승남", "night": "김종환", "off40": "동 송 선 지" },
    "2026-07-19": { "ctmr": "종", "evening": "김현석", "night": "지은열" },
    "2026-07-20": { "ctmr": "동", "night": "김현석" },
    "2026-07-21": { "ctmr": "승", "night": "송진우" },
    "2026-07-22": { "ctmr": "동", "night": "송우석" },
    "2026-07-23": { "ctmr": "종", "night": "이동현" },
    "2026-07-24": { "ctmr": "송", "night": "김현석" },
    "2026-07-25": { "ctmr": "승", "evening": "지은열", "night": "송진우", "off40": "종 승 현 용" },
    "2026-07-26": { "ctmr": "종", "evening": "이동현", "night": "송우석" },
    "2026-07-27": { "ctmr": "승", "night": "이동현" },
    "2026-07-28": { "ctmr": "종", "night": "이승남" },
    "2026-07-29": { "ctmr": "송", "night": "지은열" },
    "2026-07-30": { "ctmr": "승", "night": "김현석" },
    "2026-07-31": { "ctmr": "동", "night": "송진우" }
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
"""

    if "window.applyJulySchedule =" not in content:
        content += july_func

    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_app()
