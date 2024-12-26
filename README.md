# 🌎 WWE : World Wide Ewha

### ✨ 프로젝트 소개
_**World Wide Ewha**_<br>
WWE는 2024학년도 2학기 이화여자대학교 오픈SW플랫폼 오소리팀에서 탄생한 플랫폼입니다.<br>
교환학생/방문학생 등의 이유로 해외에 나가있는 학생들이 중고물품을 보다 쉽게 거래할 수 있도록 지원합니다.  
<br>
### ✨ 링크
[notion](https://www.notion.so/WWE-9daecf91d5fa4a349034219436699234?pvs=4)
[ppt](https://docs.google.com/presentation/d/1vwaE_uGfPQfEEeGfcE2KKxOqT3lrJdtg/edit?usp=share_link&ouid=108552118158799990334&rtpof=true&sd=true)
[기술블로그](https://ewha-ohsori.tistory.com)
<br><br>

### ✨ 기능
**WWE**가 제공하는 기능은 다음과 같습니다.
###### &nbsp;&nbsp;&nbsp;&nbsp;v1.0
- 상품 등록 및 삭제 기능
- 구매 시 리뷰 작성 및 조회 기능
- 대륙 별 상품 조회 기능
- 상품 검색 기능

<br>
<br>

## 🧑🏻‍💻 팀원 소개
### BACKEND
|     복지희     |     이나경     |     이소정     |
|:--------------:|:--------------:|:--------------:|
|     [@jettieb](https://github.com/jettieb)     |     [@2.or_kng](https://github.com/rinarina0429)     |     [@doleebest](https://github.com/doleebest)     |
| 리뷰 도메인 | 상품 도메인 | 회원 도메인 |

### FRONTEND
|     김기연     |     김희서     |     이나현     |
|:--------------:|:--------------:|:--------------:|
|     [@arky02](https://github.com/arky02)     |     [@his0si](https://github.com/his0si)     |     [@CSE-pebble](https://github.com/CSE-pebble)     |
| 상품 도메인 | 리뷰 도메인 | 회원 도메인 |

<br>

## 🗂 기술 스택
<!-- 버전 명시 -->
- Frontend: HTML, CSS, Javascript
- Backend: Python, Flask
- Database: Firebase
- Version Control: GitHub

<!-- ## 아키텍처 -->


## 📝 Git Convention

### Commit Convention
**Commit 예시 :**
`FEAT: 로그인 기능 구현`

|    태그    | 설명                            |
|:--------:|:------------------------------|
|   DOCS   | 문서 작성 및 수정 작업 (README, 템플릿 등) |
|   FEAT   | 새로운 기능 추가 작업                  |
|   FIX    | 에러 및 버그 수정, 기능 수정 작업          |
|  HOTFIX  | 긴급 수정                         |
| REFACTOR | 코드 리팩토링 작업 (버그 수정이나 기능 추가 X)  |
|  RENAME  | 네이밍 변경 (파일명, 변수명 등)           |
|  REMOVE  | 파일 및 코드 삭제                    |
| COMMENT  | 주석 추가                         |
|  CHORE   | 빌드 업무 및 패키지 매니저 수정 작업 등의 작업   |
|  MERGE   | 다른 브랜치 머지 작업                  |
|   TEST   | 테스트 관련 작업                     |
|  STYLE   | 코드 포맷팅                        |

<br>

### Branch Convention

**브랜치명 형식 :** `branchType/#issue`

- **예시 :** `feat/#1`

|   브랜치    | 설명           |
|:--------:|:-------------|
|   main   | 실제 프로덕트 브랜치  |
|   dev    | 신규 버전 개발 브랜치 |
|   feat   | 기능 구현 브랜치    |
|   fix    | 기능 수정 브랜치    |
| refactor | 리팩토링 브랜치     |
|  bugfix  | 버그 수정 브랜치    |

## 패키지 구조
```
📂 WWE
│  .gitignore
│  app.py
│  database.py
│  LICENSE
│  README.md
│  
├─ 📂 .github
│   └─ PULL_REQUEST_TEMPLATE.md
│
├─ 📂 authentication
│   └─ firebase_auth.json
│
├─ 📂 static
│   ├─ all_reviews.css
│   ├─ detail.css
│   ├─ detail.js
│   ├─ header.js
│   ├─ index.css
│   ├─ index.js
│   ├─ login.css
│   ├─ login.js
│   ├─ mypage.css
│   ├─ mypage.js
│   ├─ register.css
│   ├─ register.js
│   ├─ reset.css
│   ├─ review.css
│   ├─ signup.css
│   ├─ signup.js
│   ├─ styles.css
│   ├─ writereview.css
│   ├─ writereview.js
│   └─ 📂images   ▶️ 이미지 파일
│
├─ 📂 templates
│   ├─ detail.html
│   ├─ header.html
│   ├─ index.html
│   ├─ login.html
│   ├─ mypage.html
│   ├─ register.html
│   ├─ review.html
│   ├─ signup.html
│   ├─ submit_item_result.html
│   └─ writereview.html
│
└─ 📂 __pycache__
```

## 프로젝트 시작
```
git clone https://github.com/Ewha-Ohsori/WWE.git
cd WWE
conda activate OSWF # 생성한 가상환경 이름
# 설치
flask --debug run
```
## 📚 기능 예시
### 상품 등록하기  
127.0.0.1/reg_items
