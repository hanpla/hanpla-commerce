import Link from "next/link";
import Badge from "@/components/ui/badge";
import { CategoryOption } from "@/types/product";

type CategoryTabsProps = {
  categories: CategoryOption[];
  activeCategory: string | null;
};

const CategoryTabs = ({ categories, activeCategory }: CategoryTabsProps) => {
  return (
    <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
      <Link href="/products">
        <Badge
          variant={activeCategory === null ? "dark" : "outline"}
          className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors"
        >
          전체 보기
        </Badge>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/products/${cat.id}`}>
          <Badge
            variant={activeCategory === cat.id ? "dark" : "outline"}
            className="cursor-pointer rounded-full px-4 py-2 text-xs font-semibold transition-colors"
          >
            {cat.name} ({cat.count})
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryTabs;
