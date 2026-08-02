# 🛍️ Hanpla Commerce (패션 커머스 웹 애플리케이션)

> **Next.js 16 (App Router) + React 19 + Supabase Auth / PostgreSQL + Tailwind CSS v4** 기반의 미니멀리즘 패션 커머스 포트폴리오 프로젝트입니다.

---

## 🚀 주요 기능 (Features)

- **성능 최적화 캐싱**: Next.js 16 캐싱 디렉티브(`'use cache'`, `cacheLife`, `cacheTag`, `revalidateTag`) 적용
- **URL `searchParams` 기반 다중 필터링**: 카테고리, 브랜드, 가격 범위, 색상, 사이즈, 정렬 파라미터 양방향 실시간 동기화
- **실시간 검색어 자동완성**: 300ms 입력 디바운스(`useDebounce`) 및 렌더링 중 `useMemo` 기반 연관 상품 추천
- **위시리스트 Optimistic Update**: Zustand + LocalStorage 수화 안전 처리 기반 즉시 반응형 찜하기
- **OOTD 룩북 피드 & 상품 태깅**: 이미지 좌표 핀(Pin) 터치 시 착장 상품 정보 스마트 방향 팝오버 렌더링
- **Supabase Auth 회원 인증 시스템 (Phase 3 예정)**:
  - 이메일/비밀번호 회원가입 & 로그인, 소셜 로그인
  - 회원 전용 보호 라우트 (Middleware Guard)
  - 회원 전용 DB 연동 (장바구니, 위시리스트, 주문 내역, 토스페이먼츠 결제 연동)

---

## 🛠️ 기술 스택 (Tech Stack)

- **Framework**: Next.js 16.2+ (App Router, Cache Components)
- **Language**: TypeScript 5+ (Strict Mode)
- **Styling**: Tailwind CSS v4, Pretendard Variable Dynamic Subset
- **State Management**: Zustand
- **Backend & Auth**: Supabase Auth, PostgreSQL (RLS)
- **Database & Cache**: Supabase DB, Next.js 16 `'use cache'`

---

## 🗺️ 개발 페이즈 (Roadmap)

- [x] **Phase 1**: MVP 구축 (공통 레이아웃, UI 컴포넌트 라이브러리, 메인 피드, 상품 목록/상세, 기본 장바구니)
- [x] **Phase 2**: Next.js 16 `'use cache'` 인프라, URL 다중 필터링, 검색어 자동완성, 위시리스트 Optimistic Update, 룩북 OOTD 피드
- [ ] **Phase 3**: Supabase Auth 회원 인증(가입/로그인/세션), 회원 전용 장바구니/위시리스트 DB 연동, 토스페이먼츠 회원 결제 & 마이페이지
- [ ] **Phase 4**: Core Web Vitals 성능 최적화, Lighthouse 95+ 달성, Vercel 배포

---

## 💻 실행 방법 (Getting Started)

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

코드 검증 및 포맷팅:

```bash
npm run format:check  # Prettier 코드 포맷 체크
npm run lint          # ESLint 정적 분석
npm run build         # Next.js 16 빌드 검증
```
