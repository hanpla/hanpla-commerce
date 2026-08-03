import { Banner, CategoryOption, Product } from "@/types/product";

export const MOCK_CATEGORIES: CategoryOption[] = [
  {
    id: "outer",
    name: "아우터",
    count: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "top",
    name: "상의",
    count: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bottom",
    name: "하의",
    count: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "shoes",
    name: "신발",
    count: 7,
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "acc",
    name: "악세서리",
    count: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
  },
];

export const MOCK_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "2026 SPRING / SUMMER",
    subtitle: "모던 미니멀리즘 컬렉션 런칭",
    tag: "NEW COLLECTION",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
    linkUrl: "/products/outer",
  },
  {
    id: "banner-2",
    title: "URBAN ESSENTIALS",
    subtitle: "일상의 감각을 높이는 아우터 큐레이션",
    tag: "CURATED",
    imageUrl:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
    linkUrl: "/products/top",
  },
  {
    id: "banner-3",
    title: "SILHOUETTE & DETAIL",
    subtitle: "트렌디한 핏감의 데님 & 트라우저 시리즈",
    tag: "BEST ITEM",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop",
    linkUrl: "/products/bottom",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  // Outer (7개)
  {
    id: "prod-1",
    name: "오버사이즈 울 블렌드 트렌치 코트",
    brand: "HANPLA STUDIO",
    category: "outer",
    price: 248000,
    originalPrice: 310000,
    discountRate: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "고급 울 블렌드 소재로 우수한 드레이프성과 따뜻한 착용감을 제공하는 오버사이즈 트렌치 코트입니다.",
    options: [
      { color: { name: "Beige", hex: "#D7C4B7" }, sizes: ["M", "L", "XL"] },
      { color: { name: "Black", hex: "#111111" }, sizes: ["S", "M", "L", "XL"] },
    ],
    rating: 4.9,
    reviewCount: 128,
    isNew: true,
    isBest: true,
    stock: 45,
    createdAt: "2026-07-15",
  },
  {
    id: "prod-7",
    name: "미니멀라이즈 테일러드 2버튼 자켓",
    brand: "MINIMAL HANPLA",
    category: "outer",
    price: 189000,
    originalPrice: 229000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    ],
    description: "클래식한 라인과 현대적인 피팅감이 돋보이는 테일러드 블레이저입니다.",
    options: [
      { color: { name: "Navy", hex: "#000080" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Black", hex: "#111111" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.8,
    reviewCount: 85,
    isNew: true,
    isBest: false,
    stock: 35,
    createdAt: "2026-07-20",
  },
  {
    id: "prod-8",
    name: "헤비웨이트 숏 덤블 구스다운 점퍼",
    brand: "HANPLA ATHLETIC",
    category: "outer",
    price: 289000,
    originalPrice: 349000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    ],
    description: "충전재 구스다운 90:10 비율의 풍성한 보온성을 자랑하는 숏 패딩 점퍼입니다.",
    options: [
      { color: { name: "Beige", hex: "#F5F5DC" }, sizes: ["S", "M", "L"] },
      { color: { name: "Black", hex: "#111111" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.9,
    reviewCount: 210,
    isNew: false,
    isBest: true,
    stock: 60,
    createdAt: "2026-06-10",
  },
  {
    id: "prod-9",
    name: "빈티지 레더 싱글 라이더스 자켓",
    brand: "HANPLA ARCHIVE",
    category: "outer",
    price: 329000,
    originalPrice: 399000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "이태리 프리미엄 천연 램스킨으로 은은한 광택과 뛰어난 착용감을 지닌 가죽 자켓입니다.",
    options: [
      { color: { name: "Black", hex: "#111111" }, sizes: ["M", "L"] },
      { color: { name: "Brown", hex: "#8B4513" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.7,
    reviewCount: 54,
    isNew: false,
    isBest: false,
    stock: 25,
    createdAt: "2026-05-18",
  },
  {
    id: "prod-10",
    name: "딥 인디고 워싱 데님 트러커 자켓",
    brand: "HANPLA DENIM",
    category: "outer",
    price: 139000,
    originalPrice: 169000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
    ],
    description: "탄탄한 13.5oz 데님으로 세련된 엠보 워싱과 트렌디한 핏을 연출해줍니다.",
    options: [{ color: { name: "Deep Blue", hex: "#00008B" }, sizes: ["S", "M", "L", "XL"] }],
    rating: 4.8,
    reviewCount: 92,
    isNew: true,
    isBest: false,
    stock: 50,
    createdAt: "2026-07-22",
  },

  // Top (8개)
  {
    id: "prod-2",
    name: "크루넥 헤비웨이트 옥스포드 셔츠",
    brand: "HANPLA ESSENTIAL",
    category: "top",
    price: 69000,
    originalPrice: 89000,
    discountRate: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    ],
    description: "탄탄한 수피마 코튼 100% 옥스포드 원단으로 클래식한 데일리 셔츠입니다.",
    options: [
      { color: { name: "White", hex: "#FFFFFF" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Sky Blue", hex: "#87CEEB" }, sizes: ["M", "L"] },
    ],
    rating: 4.8,
    reviewCount: 94,
    isNew: false,
    isBest: true,
    stock: 80,
    createdAt: "2026-06-20",
  },
  {
    id: "prod-6",
    name: "캐시미어 블렌드 라운드 니트",
    brand: "HANPLA ESSENTIAL",
    category: "top",
    price: 98000,
    originalPrice: 128000,
    discountRate: 23,
    imageUrl:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
    ],
    description: "부드러운 터치감과 차분한 컬러감이 매력적인 기본 라운드 니트웨어입니다.",
    options: [
      { color: { name: "Oatmeal", hex: "#E3DAC9" }, sizes: ["S", "M", "L"] },
      { color: { name: "Charcoal", hex: "#36454F" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.8,
    reviewCount: 110,
    isNew: false,
    isBest: true,
    stock: 60,
    createdAt: "2026-04-12",
  },
  {
    id: "prod-13",
    name: "피그먼트 다잉 드롭숄더 후디",
    brand: "URBAN HANPLA",
    category: "top",
    price: 89000,
    originalPrice: 109000,
    discountRate: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    ],
    description: "빈티지한 피그먼트 워싱과 여유로운 드롭숄더 핏의 헤비웨이트 후드티입니다.",
    options: [
      { color: { name: "Charcoal", hex: "#36454F" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Grey", hex: "#808080" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.9,
    reviewCount: 142,
    isNew: true,
    isBest: true,
    stock: 70,
    createdAt: "2026-07-25",
  },
  {
    id: "prod-14",
    name: "헤비 코튼 스웨트셔츠 맨투맨",
    brand: "HANPLA ATHLETIC",
    category: "top",
    price: 65000,
    originalPrice: 79000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    ],
    description: "탄탄한 시보리와 내부 기모로 따뜻하고 활동성이 우수한 맨투맨입니다.",
    options: [
      { color: { name: "Melange Grey", hex: "#D3D3D3" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Navy", hex: "#000080" }, sizes: ["M", "L"] },
    ],
    rating: 4.7,
    reviewCount: 168,
    isNew: false,
    isBest: true,
    stock: 90,
    createdAt: "2026-05-30",
  },

  // Bottom (7개)
  {
    id: "prod-3",
    name: "와이드 턱 원단 셀비지 데님 팬츠",
    brand: "HANPLA DENIM",
    category: "bottom",
    price: 119000,
    originalPrice: 139000,
    discountRate: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    ],
    description: "14oz 프리미엄 일본 셀비지 데님 원단을 사용한 와이드 턱 팬츠입니다.",
    options: [
      { color: { name: "Raw Indigo", hex: "#1F2937" }, sizes: ["S", "M", "L"] },
      { color: { name: "Washed Blue", hex: "#3B82F6" }, sizes: ["S", "M", "L", "XL"] },
    ],
    rating: 4.7,
    reviewCount: 67,
    isNew: true,
    isBest: false,
    stock: 30,
    createdAt: "2026-07-28",
  },
  {
    id: "prod-19",
    name: "원턱 핀스트라이프 와이드 슬랙스",
    brand: "HANPLA STUDIO",
    category: "bottom",
    price: 89000,
    originalPrice: 109000,
    discountRate: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    ],
    description: "체형을 커버하고 길어 보이는 와이드 드레이프 핏의 프리미엄 슬랙스입니다.",
    options: [
      { color: { name: "Black", hex: "#111111" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Charcoal", hex: "#36454F" }, sizes: ["M", "L"] },
    ],
    rating: 4.9,
    reviewCount: 134,
    isNew: true,
    isBest: true,
    stock: 65,
    createdAt: "2026-07-18",
  },
  {
    id: "prod-21",
    name: "파라슈트 유틸리티 카고 팬츠",
    brand: "URBAN HANPLA",
    category: "bottom",
    price: 95000,
    originalPrice: 115000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop",
    ],
    description: "밑단 스트링 조절로 조거와 카고 스타일을 자유롭게 넘나드는 파라슈트 팬츠입니다.",
    options: [
      { color: { name: "Khaki", hex: "#F0E68C" }, sizes: ["S", "M", "L", "XL"] },
      { color: { name: "Black", hex: "#111111" }, sizes: ["M", "L", "XL"] },
    ],
    rating: 4.9,
    reviewCount: 189,
    isNew: true,
    isBest: true,
    stock: 80,
    createdAt: "2026-07-12",
  },

  // Shoes (7개)
  {
    id: "prod-4",
    name: "스웨이드 첼시 더비 슈즈",
    brand: "ATELIER HANPLA",
    category: "shoes",
    price: 189000,
    originalPrice: 220000,
    discountRate: 14,
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
    ],
    description: "천연 이태리 카우 스웨이드 레더와 쿠셔닝 인솔을 결합한 더비 슈즈입니다.",
    options: [
      { color: { name: "Dark Brown", hex: "#3D2314" }, sizes: ["M", "L"] },
      { color: { name: "Black", hex: "#111111" }, sizes: ["S", "M", "L", "XL"] },
    ],
    rating: 4.9,
    reviewCount: 42,
    isNew: false,
    isBest: true,
    stock: 20,
    createdAt: "2026-05-10",
  },
  {
    id: "prod-26",
    name: "어반 미니멀 스웨이드 스니커즈",
    brand: "URBAN HANPLA",
    category: "shoes",
    price: 139000,
    originalPrice: 169000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    ],
    description: "내추럴 고무 아웃솔과 스웨이드 매칭이 돋보이는 독일군 스타일 스니커즈입니다.",
    options: [{ color: { name: "White/Grey", hex: "#FFFFFF" }, sizes: ["S", "M", "L", "XL"] }],
    rating: 4.9,
    reviewCount: 230,
    isNew: true,
    isBest: true,
    stock: 110,
    createdAt: "2026-07-21",
  },

  // Acc (6개)
  {
    id: "prod-5",
    name: "최상급 실버 925 체인 넥클리스",
    brand: "HANPLA JEWELRY",
    category: "acc",
    price: 79000,
    originalPrice: 99000,
    discountRate: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    ],
    description: "법정순은 Silver 925 소재로 제작되어 세련된 포인트를 주는 체인 목걸이입니다.",
    options: [{ color: { name: "Silver", hex: "#E5E7EB" }, sizes: ["FREE"] }],
    rating: 4.6,
    reviewCount: 31,
    isNew: true,
    isBest: false,
    stock: 50,
    createdAt: "2026-07-01",
  },
  {
    id: "prod-31",
    name: "모던 미니멀 이태리 레더 벨트",
    brand: "HANPLA ARCHIVE",
    category: "acc",
    price: 65000,
    originalPrice: 79000,
    discountRate: 17,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    ],
    description: "새틴 버클 디테일과 이태리 풀그레인 소가죽으로 수공예 제작된 벨트입니다.",
    options: [
      { color: { name: "Black", hex: "#111111" }, sizes: ["FREE"] },
      { color: { name: "Dark Brown", hex: "#3D2314" }, sizes: ["FREE"] },
    ],
    rating: 4.9,
    reviewCount: 125,
    isNew: true,
    isBest: true,
    stock: 80,
    createdAt: "2026-07-16",
  },
];
