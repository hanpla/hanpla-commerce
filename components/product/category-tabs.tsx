"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import Badge from "@/components/ui/badge";
import { CategoryOption } from "@/types/product";

type CategoryTabsProps = {
  categories: CategoryOption[];
  activeCategory: string | null;
};

// 로컬 헬퍼 1: 모바일 전용 드롭다운 셀렉터 (sm:hidden)
const MobileCategoryDropdown = ({ categories, activeCategory }: CategoryTabsProps) => {
  const router = useRouter();

  const currentPath = activeCategory ? `/products/${activeCategory}` : "/products";

  return (
    <div className="relative w-full sm:hidden">
      <select
        value={currentPath}
        onChange={(e) => router.push(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-neutral-200 bg-white py-3 pr-10 pl-4 text-xs font-bold text-neutral-900 shadow-xs focus:border-neutral-900 focus:outline-none"
      >
        <option value="/products">전체 보기</option>
        {categories.map((cat) => (
          <option key={cat.id} value={`/products/${cat.id}`}>
            {cat.name} ({cat.count ?? 0})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400">
        <ChevronDownIcon className="h-4 w-4" />
      </div>
    </div>
  );
};

// 로컬 헬퍼 2: 데스크톱 전용 수평 탭 바 (hidden sm:flex)
const DesktopCategoryTabs = ({ categories, activeCategory }: CategoryTabsProps) => {
  return (
    <div className="hidden scrollbar-none items-center gap-2 overflow-x-auto pb-2 sm:flex">
      <Link href="/products" className="shrink-0">
        <Badge
          variant={activeCategory === null ? "dark" : "outline"}
          className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          전체 보기
        </Badge>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/products/${cat.id}`} className="shrink-0">
          <Badge
            variant={activeCategory === cat.id ? "dark" : "outline"}
            className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            {cat.name} ({cat.count ?? 0})
          </Badge>
        </Link>
      ))}
    </div>
  );
};

// 메인 반응형 CategoryTabs 컴포넌트
const CategoryTabs = (props: CategoryTabsProps) => {
  return (
    <div className="w-full">
      <MobileCategoryDropdown {...props} />
      <DesktopCategoryTabs {...props} />
    </div>
  );
};

export default CategoryTabs;
