const OrdersSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div key={idx} className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="h-4 w-32 rounded bg-neutral-200" />
            <div className="h-5 w-16 rounded-full bg-neutral-200" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-neutral-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-neutral-200" />
                <div className="h-3 w-24 rounded bg-neutral-200" />
              </div>
              <div className="h-4 w-20 rounded bg-neutral-200" />
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
            <div className="h-3 w-36 rounded bg-neutral-200" />
            <div className="h-5 w-24 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersSkeleton;
