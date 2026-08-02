import { Product, ProductColor, ProductSize } from "@/types/product";

type OptionSelectorProps = {
  options: Product["options"];
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  onSelectColor: (color: ProductColor) => void;
  onSelectSize: (size: ProductSize) => void;
};

// 로컬 헬퍼 1: 컬러 선택 서브버튼
const ColorChipButton = ({
  color,
  isSelected,
  onClick,
}: {
  color: ProductColor;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 transition-transform ${
        isSelected
          ? "scale-110 border-neutral-900 shadow-sm"
          : "border-neutral-200 hover:border-neutral-400"
      }`}
      style={{ backgroundColor: color.hex }}
      title={color.name}
    />
  );
};

// 로컬 헬퍼 2: 사이즈 선택 서브버튼
const SizeChipButton = ({
  size,
  isSelected,
  onClick,
}: {
  size: ProductSize;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
        isSelected
          ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
          : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900"
      }`}
    >
      {size}
    </button>
  );
};

// 메인 OptionSelector 컴포넌트
const OptionSelector = ({
  options,
  selectedColor,
  selectedSize,
  onSelectColor,
  onSelectSize,
}: OptionSelectorProps) => {
  const currentOptionGroup = options.find((opt) => opt.color.name === selectedColor.name);
  const availableSizes = currentOptionGroup?.sizes || [];

  return (
    <div className="flex flex-col gap-6 border-y border-neutral-200 py-4">
      {/* Color Select */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          COLOR: <strong className="text-neutral-900">{selectedColor.name}</strong>
        </span>
        <div className="flex items-center gap-3">
          {options.map((opt) => (
            <ColorChipButton
              key={opt.color.name}
              color={opt.color}
              isSelected={selectedColor.name === opt.color.name}
              onClick={() => {
                onSelectColor(opt.color);
                if (!opt.sizes.includes(selectedSize)) {
                  onSelectSize(opt.sizes[0]);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Size Select */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
          SIZE: <strong className="text-neutral-900">{selectedSize}</strong>
        </span>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <SizeChipButton
              key={size}
              size={size}
              isSelected={selectedSize === size}
              onClick={() => onSelectSize(size)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptionSelector;
