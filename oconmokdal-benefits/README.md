# 오콘목달 무료특강 참여자 혜택 — 혜택 전용 · 프리미엄 클래스 신청 섹션 제외

두 버전 중 이 ZIP은 **혜택 전용 · 프리미엄 클래스 신청 섹션 제외** 버전입니다.
하나의 GitHub 저장소와 하나의 Vercel 프로젝트에 독립적으로 올릴 수 있습니다.

## 포함된 기능

- 공통 비밀번호로 혜택 4종 동시 열기
- 오리지널 코드 한 줄 봇 · 오리지널 코드 수익화 봇 · 구매과정 망설임 봇 연결
- 30일 콘텐츠 및 판매 캘린더 HTML 프롬프트 새 창 열기 및 복사
- 혜택 1·2 사용 영상, 혜택 3·4 동적 일러스트, 모바일 레이아웃
- 오콘목달 로고, 민트 #00F89A, (주)인사이트머니랩 푸터
- 헤더 신청 바로가기와 하단 신청 배너 모두 제외

## 1. GitHub에 올리기

1. ZIP을 압축 해제합니다.
2. GitHub에서 새 저장소를 만듭니다. 저장소 이름 예: `oconmokdal-benefits-only`.
3. 저장소의 Add file → Upload files에서 **압축 해제한 파일과 폴더 전체**를 올립니다.
4. 저장소 맨 위에 `vercel.json`, `README.md`, `public/`이 나란히 보여야 합니다.
5. Commit changes로 저장합니다. ZIP 파일 자체를 저장소에 올리는 방식은 사용하지 않습니다.

## 2. Vercel에서 배포하기

1. Vercel → Add New → Project → 방금 만든 GitHub 저장소를 Import합니다.
2. 아래 설정을 확인하고 Deploy를 선택합니다. `vercel.json`에도 동일하게 지정되어 있습니다.

| 항목 | 설정 |
| --- | --- |
| Framework Preset | Other |
| Root Directory | 저장소 루트 (`.`) |
| Build Command | 비워두기 |
| Output Directory | `public` |
| Install Command | 비워두기 |
| Environment Variables | 필요 없음 |

`public`을 Root Directory로 지정하지 마세요. 출력 폴더만 `public`입니다.
별도 패키지 설치, 서버 구성, 빌드 과정 없이 정적 파일을 배포합니다.

## 3. 배포 후 확인

1. Vercel이 제공한 HTTPS 주소를 엽니다.
2. 운영자가 안내한 공통 비밀번호를 입력합니다. 두 버전 모두 현재 확정한 비밀번호가 적용되어 있습니다.
3. 혜택 4종이 함께 열리는지 확인합니다.
4. 각 봇 링크가 맞는지, 네 번째 혜택의 HTML 화면과 복사 버튼이 동작하는지 확인합니다.
5. 하단에 클래스 신청 배너가 없고, 혜택 4번 다음에 푸터가 나오는지 확인합니다.



## 파일 구성

- `public/index.html`: 화면과 문구
- `public/style.css`: 반응형 디자인, 혜택 3·4 애니메이션
- `public/app.js`: 비밀번호 입력, 영상·애니메이션 재생 제어
- `public/assets/`: 로고, 폰트, 사용 영상, 미리보기 이미지, 암호화된 혜택 데이터
- `vercel.json`: 정적 배포 설정
- `.gitignore`: 로컬 설정과 임시 파일 제외

## 운영 메모

- 비밀번호와 혜택 링크·HTML은 암호화된 데이터로 연결되어 있습니다. 실제 비밀번호를 공개 저장소 README에 적지 마세요.
- `benefits.enc.json`을 삭제하거나 누락하면 혜택을 열 수 없습니다.
- 비밀번호 확인은 브라우저의 Web Crypto 기능을 사용합니다. 배포된 HTTPS 주소 또는 로컬의 `http://localhost`에서 확인하세요. HTML 파일을 더블클릭하는 `file://` 방식은 사용하지 않습니다.
- 로컬 확인: Python이 있다면 이 폴더에서 `python3 -m http.server 8000 --directory public` 실행 후 `http://localhost:8000`을 엽니다.
- 공통 비밀번호를 아는 참여자는 링크를 이용할 수 있습니다. 개별 회원 권한이나 유료 콘텐츠 접근 관리를 위한 서버 인증 시스템은 포함하지 않습니다.
- 문구·디자인을 수정하고 GitHub에 커밋하면 연결한 Vercel 프로젝트의 배포 흐름으로 업데이트할 수 있습니다.

Vercel 공식 문서: https://vercel.com/docs/builds/configure-a-build
정적 설정 문서: https://vercel.com/docs/project-configuration/vercel-json
