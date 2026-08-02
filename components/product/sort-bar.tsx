import { SortOption } from "@/types/product";

type SortBarProps = {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
};

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "newest", label: "신상품순" },
  { id: "popular", label: "인기순" },
  { id: "price-low", label: "낮은가격순" },
  { id: "price-high", label: "높은가격순" },
];

// 로컬 헬퍼: 단일 정렬 옵션 버튼
const SortOptionButton = ({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer font-semibold transition-colors ${
        isSelected
          ? "font-bold text-neutral-900 underline underline-offset-4"
          : "text-neutral-400 hover:text-neutral-700"
      }`}
    >
      {label}
    </button>
  );
};

// 메인 SortBar 컴포넌트
const SortBar = ({ sort, onSortChange, totalCount }: SortBarProps) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 py-4">
      <span className="text-xs font-medium text-neutral-500">
        총 <strong className="text-neutral-900">{totalCount}개</strong>의 상품
      </span>
      <div className="flex items-center gap-3 text-xs">
        {SORT_OPTIONS.map((option) => (
          <SortOptionButton
            key={option.id}
            label={option.label}
            isSelected={sort === option.id}
            onClick={() => onSortChange(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SortBar;
