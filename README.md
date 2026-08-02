# 🛍️ Hanpla Commerce - 패션 커머스 웹 애플리케이션

> **Next.js 16 (App Router, PPR) + React 19 + Supabase Auth / PostgreSQL (RLS) + 토스페이먼츠(Toss Payments) + Tailwind CSS v4** 기반의 미니멀리즘 패션 커머스 포트폴리오 프로젝트입니다.

---

## 🔗 Live Demo & Report

- **Vercel 실서버 배포 주소**: [https://hanpla-commerce.vercel.app](https://hanpla-commerce.vercel.app)
- **Lighthouse 성능 최적화 보고서**: [docs/lighthouse_report.md](docs/lighthouse_report.md)
- **Database DDL & RLS 보안 정책**: [supabase/schema.sql](supabase/schema.sql)

---

## ⚡ Core Web Vitals & Lighthouse 측정 결과 (Performance 98점)

| 측정 페이지 (Page)                      | Performance (성능) | Accessibility (접근성) | Best Practices | SEO (검색엔진) | 비고                                       |
| :-------------------------------------- | :----------------: | :--------------------: | :------------: | :------------: | :----------------------------------------- |
| **메인 피드 (`/`)**                     |       **98**       |        **100**         |    **100**     |    **100**     | Hero LCP `fetchPriority="high"` & Blur SVG |
| **상품 카탈로그 (`/products`)**         |       **96**       |        **100**         |    **100**     |    **100**     | 반응형 `sizes` & Wishlist Selector O(1)    |
| **상품 상세 (`/products/detail/[id]`)** |       **97**       |        **100**         |    **100**     |    **100**     | 갤러리 이미지 LCP & 옵션 핀포인트 구독     |
| **룩북 OOTD (`/lookbook`)**             |       **95**       |        **100**         |    **100**     |    **100**     | 태깅 팝오버 동적 로딩 & 그리드 최적화      |
| **마이페이지 (`/mypage`)**              |       **99**       |        **100**         |    **100**     |    **100**     | PPR & `<Suspense>` 스트리밍 적용           |

- **누적 레이아웃 이동 (CLS)**: **0.00** (SVG Data URI Blur Placeholder 적용)
- **초기 JS 번들 파싱 절감**: **40% 이상 감축** (`next/dynamic` 결제 SDK & Drawer 지연 로딩)

---

## 🚀 주요 기능 (Features)

### 1. Next.js 16 Server Auth & Partial Prerendering (PPR)

- `getUserServer()` 세션 획득 및 React 19 `<Suspense>` 기반 마이페이지 사이드바 동적 스트리밍 로딩.
- 안전한 오픈 리다이렉트 방지 검증 (`getSafeRedirectPath`, `buildAuthUrl`).
- Next.js 16 캐싱 디렉티브(`'use cache'`, `cacheLife`, `cacheTag`, `connection()`) 및 `React.cache()` 적용.

### 2. Supabase Auth & PostgreSQL DB (100% 실시간 DB 연동 & RLS)

- 이메일/비밀번호 가입 & 로그인, 로그인 세션 토큰 관리.
- 회원 보호 라우트 미들웨어 가드 (`proxy.ts` / `middleware.ts`).
- 회원 전용 DB 영구 저장 (장바구니 `cart_items`, 위시리스트 `wishlist_items`, 배송지 `addresses`, 프로필 `profiles`, 주문 내역 `orders`, `order_items` 멱등 RLS 보안 정책).

### 3. Toss Payments (토스페이먼츠) 회원 전용 결제 시스템

- 주문서 작성 페이지 (`/checkout`) 및 회원 배송지 DB 자동 로드 & 선택 모달.
- 토스페이먼츠 결제창 SDK (`@tosspayments/payment-sdk`) 호출.
- 결제 승인 API Route Handler (`POST /api/payments/confirm`) 구축: DB 주문 데이터 저장 및 회원 장바구니 DB 자동 삭제.

### 4. 패션 특화 UX & 다중 필터링

- URL `searchParams` 기반 카테고리/브랜드/가격범위/색상/사이즈/정렬 다중 필터링.
- 300ms 디바운스(`useDebounce`) 및 연관 상품 추천 검색어 자동완성 (`SearchAutocomplete`).
- OOTD 룩북 피드 & 착장 상품 좌표 핀(Pin) 스마트 방향 팝오버.

---

## 🛠️ 기술 스택 (Tech Stack)

| 분류               | 기술 스택                              | 세부 설명                                                      |
| :----------------- | :------------------------------------- | :------------------------------------------------------------- |
| **Framework**      | Next.js 16.2+ (App Router)             | `cacheComponents: true` 활성화, Partial Prerendering(PPR) 적용 |
| **Language**       | TypeScript 5+                          | Strict Mode, 공유 타입은 `types/` 폴더 내 정의                 |
| **Styling**        | React 19, Tailwind CSS v4              | Pretendard Variable Dynamic Subset (`pretendard`) 적용         |
| **State Mgt**      | Zustand                                | 세션 프로필·장바구니·위시리스트 클라이언트 상태 관리           |
| **Backend / Auth** | Supabase Auth, PostgreSQL (RLS)        | 멱등 RLS 보안 정책, 실시간 DB 테이블 8개 연동                  |
| **Payment API**    | Toss Payments API                      | 결제 승인 API (`/api/payments/confirm`) 및 DB 주문 내역 저장   |
| **Optimization**   | Next.js `'use cache'`, `React.cache()` | `next/image` (WebP/AVIF, Blur Placeholder), `next/dynamic`     |

---

## 🗺️ 개발 페이즈 (Roadmap)

- [x] **Phase 1**: MVP 구축 (공통 레이아웃, UI 라이브러리, 메인 피드, 상품 목록/상세, 기본 장바구니)
- [x] **Phase 2**: Next.js 16 `'use cache'` 인프라, URL 다중 필터링, 검색어 자동완성, 위시리스트 Optimistic Update, 룩북 OOTD 피드
- [x] **Phase 3**: Supabase Auth 회원 인증 시스템, Next.js 16 Server Auth & PPR 적용, 회원 전용 DB 연동 (장바구니/위시리스트/배송지/프로필), 마이페이지 & 리팩토링
- [x] **Phase 4**: Supabase PostgreSQL 상품/카테고리 DB 구축 & 토스페이먼츠 회원 결제 연동 (`/checkout`, `/api/payments/confirm`)
- [x] **Phase 5**: Core Web Vitals 성능 최적화, Dynamic Import 코드 스플리팅, Lighthouse 98점 달성, Vercel 배포

---

## 💻 실행 방법 (Getting Started)

### 1. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 2. 코드 품질 및 검증 스크립트

```bash
npm run format:check  # Prettier 포맷 검수
npm run format        # Prettier 자동 정렬
npm run lint          # ESLint 정적 분석
npm run build         # Next.js 16 프로덕션 빌드 검증
```
