import { Banner, CategoryOption, Product } from "@/types/product";

export const MOCK_CATEGORIES: CategoryOption[] = [
  {
    id: "outer",
    name: "아우터",
    count: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "top",
    name: "상의",
    count: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "bottom",
    name: "하의",
    count: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "shoes",
    name: "신발",
    count: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "acc",
    name: "악세서리",
    count: 15,
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
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "고급 울 블렌드 소재로 우수한 드레이프성과 따뜻한 착용감을 제공하는 오버사이즈 트렌치 코트입니다. 더블 브레스티드 디자인과 와이드 라펠이 현대적인 실루엣을 완성합니다.",
    options: [
      {
        color: { name: "Beige", hex: "#D7C4B7" },
        sizes: ["M", "L", "XL"],
      },
      {
        color: { name: "Black", hex: "#111111" },
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    rating: 4.9,
    reviewCount: 128,
    isNew: true,
    isBest: true,
    stock: 45,
    createdAt: "2026-07-15",
  },
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
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "탄탄한 수피마 코튼 100% 옥스포드 원단으로 세탁 후에도 변형이 적으며 클래식한 데일리웨어로 안성맞춤입니다.",
    options: [
      {
        color: { name: "White", hex: "#FFFFFF" },
        sizes: ["S", "M", "L", "XL"],
      },
      {
        color: { name: "Sky Blue", hex: "#87CEEB" },
        sizes: ["M", "L"],
      },
    ],
    rating: 4.8,
    reviewCount: 94,
    isNew: false,
    isBest: true,
    stock: 80,
    createdAt: "2026-06-20",
  },
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
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "14oz 프리미엄 일본 셀비지 데님 원단을 사용한 와이드 턱 팬츠입니다. 자연스러운 딥블루 워싱과 매력적인 실루엣이 특징입니다.",
    options: [
      {
        color: { name: "Raw Indigo", hex: "#1F2937" },
        sizes: ["S", "M", "L"],
      },
      {
        color: { name: "Washed Blue", hex: "#3B82F6" },
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    rating: 4.7,
    reviewCount: 67,
    isNew: true,
    isBest: false,
    stock: 30,
    createdAt: "2026-07-28",
  },
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
    description:
      "천연 이태리 천연 카우 스웨이드 레더와 쿠셔닝 인솔을 결합하여 가볍고 유연한 착화감을 자랑하는 모던 더비 슈즈입니다.",
    options: [
      {
        color: { name: "Dark Brown", hex: "#3D2314" },
        sizes: ["M", "L"],
      },
      {
        color: { name: "Black", hex: "#111111" },
        sizes: ["S", "M", "L", "XL"],
      },
    ],
    rating: 4.9,
    reviewCount: 42,
    isNew: false,
    isBest: true,
    stock: 20,
    createdAt: "2026-05-10",
  },
  {
    id: "prod-5",
    name: "최상급 실버 925 체인 넥클리스",
    brand: "HANPLA JEWELRY",
    category: "acc",
    price: 79000,
    imageUrl:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    ],
    description:
      "법정순은 Silver 925 소재로 제작되어 알러지 걱정 없이 세련된 포인트를 줄 수 있는 펜던트 미니 체인 목걸이입니다.",
    options: [
      {
        color: { name: "Silver", hex: "#E5E7EB" },
        sizes: ["FREE"],
      },
    ],
    rating: 4.6,
    reviewCount: 31,
    isNew: true,
    isBest: false,
    stock: 50,
    createdAt: "2026-07-01",
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
    description:
      "파인 몽골리안 캐시미어 30% 함유로 부드러운 터치감과 차분한 컬러감이 매력적인 기본 니트웨어입니다.",
    options: [
      {
        color: { name: "Oatmeal", hex: "#E3DAC9" },
        sizes: ["S", "M", "L"],
      },
      {
        color: { name: "Charcoal", hex: "#36454F" },
        sizes: ["M", "L", "XL"],
      },
    ],
    rating: 4.8,
    reviewCount: 110,
    isNew: false,
    isBest: true,
    stock: 60,
    createdAt: "2026-04-12",
  },
];
