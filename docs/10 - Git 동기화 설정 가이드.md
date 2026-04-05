---
title: Git 동기화 설정 가이드
created: 2026-04-05
tags: [project/radiology-calendar, setup, git, sync, obsidian]
---

# 🔄 옵시디언 Git 동기화 설정 가이드

## 전체 구조

```
노트북 (이 PC)     ←→  GitHub  ←→  회사컴
     └── obsidian-git 플러그인 (자동 push/pull)
                        ↕
                    아이폰 (읽기)
                    └── GitHub 웹 or Working Copy 앱
```

## 1단계: 옵시디언에서 vault 열기

1. Obsidian 실행
2. "Open folder as vault" 선택
3. `c:\Users\onyulpapa\Documents\orchestra\calendar` 선택
4. 이 폴더 전체가 vault가 됨 (소스코드 + docs)

## 2단계: obsidian-git 플러그인 설치

1. 설정 → Community plugins → Browse
2. **"Obsidian Git"** 검색 → 설치 → 활성화
3. 플러그인 설정:
   - Auto pull interval: **5분**
   - Auto push after commit: **켜기**
   - Auto commit interval: **10분**
   - Commit message: `vault: {{date}}`

## 3단계: 회사컴에서도 동일 설정

```bash
git clone https://github.com/ralph8211-blip/radiology-calendar.git
```

→ 옵시디언에서 같은 폴더를 vault로 열기
→ obsidian-git 플러그인 동일 설정

## 4단계: 아이폰 (읽기 위주)

### 방법 A: GitHub 웹 (무료, 간편)
- Safari에서 GitHub 레포의 `docs/` 폴더 접근
- 마크다운 렌더링 지원

### 방법 B: Working Copy + 옵시디언 (유료, 편한)
1. Working Copy 앱 ($22, 1회 구매)
2. 레포 클론
3. 옵시디언 iOS 앱에서 Working Copy 폴더 연결

## 충돌 방지 팁

> [!warning] 동시 편집 주의
> 두 기기에서 동시에 같은 파일을 수정하면 Git 충돌 발생 가능.
> pull → 편집 → push 순서를 지키면 거의 발생하지 않음.

- 작업 시작 전: `Ctrl+P` → "Obsidian Git: Pull" 실행
- 작업 끝: 자동 push 또는 `Ctrl+P` → "Obsidian Git: Push"

## .gitignore 권장

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.obsidian/plugins/obsidian-git/data.json
```

> `.obsidian/` 폴더 자체는 push하는 게 좋음 (플러그인 설정 공유)
> 단, workspace 파일은 기기마다 달라지므로 제외

## 관련 문서

- [[00 - 프로젝트 개요]]
