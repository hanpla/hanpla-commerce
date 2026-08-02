type CartHeaderBarProps = {
  allSelected: boolean;
  onToggleAll: (selected: boolean) => void;
  onClear: () => void;
};

const CartHeaderBar = ({ allSelected, onToggleAll, onClear }: CartHeaderBarProps) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
      <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-neutral-700 select-none">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => onToggleAll(e.target.checked)}
          className="h-4 w-4 cursor-pointer rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
        />
        전체 선택
      </label>
      <button
        onClick={onClear}
        className="cursor-pointer text-xs text-neutral-400 transition-colors hover:text-rose-600"
      >
        장바구니 비우기
      </button>
    </div>
  );
};

export default CartHeaderBar;
