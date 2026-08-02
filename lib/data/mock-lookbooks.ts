import { LookbookItem } from "@/types/product";

export const MOCK_LOOKBOOKS: LookbookItem[] = [
  {
    id: "look-1",
    title: "Minimalist City Walker",
    modelName: "Elena S.",
    description:
      "도시의 조용한 골목과 현대적인 건축물에 어우러지는 아우터 중심의 미니멀 레이어드 룩입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    tags: ["TrenchCoat", "OxfordShirt", "UrbanMinimal"],
    tagSpots: [
      {
        id: "spot-1",
        x: 45,
        y: 35,
        productId: "prod-1",
      },
      {
        id: "spot-2",
        x: 52,
        y: 50,
        productId: "prod-2",
      },
    ],
    likes: 342,
    createdAt: "2026-07-20",
  },
  {
    id: "look-2",
    title: "Casual Denim & Suede",
    modelName: "David K.",
    description: "여유로운 주말 커스터마이징 데님과 따뜻한 스웨이드 더비의 클래식한 조합입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    tags: ["SelvedgeDenim", "SuedeShoes", "WeekendOutfit"],
    tagSpots: [
      {
        id: "spot-3",
        x: 40,
        y: 65,
        productId: "prod-3",
      },
      {
        id: "spot-4",
        x: 50,
        y: 85,
        productId: "prod-4",
      },
    ],
    likes: 519,
    createdAt: "2026-07-25",
  },
  {
    id: "look-3",
    title: "Monochrome & Silver Accent",
    modelName: "Sophia T.",
    description: "차분한 톤온톤 캐시미어 니트에 섬세한 실버 넥클리스로 완성한 고급스러운 센스.",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    tags: ["CashmereKnit", "Silver925", "ToneOnTone"],
    tagSpots: [
      {
        id: "spot-5",
        x: 48,
        y: 30,
        productId: "prod-5",
      },
      {
        id: "spot-6",
        x: 55,
        y: 45,
        productId: "prod-6",
      },
    ],
    likes: 284,
    createdAt: "2026-07-28",
  },
];
