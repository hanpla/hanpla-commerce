const MyPageSidebarSkeleton = () => {
  return (
    <aside className="w-full shrink-0 animate-pulse rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm lg:w-64">
      <div className="mb-6 space-y-2 border-b border-neutral-100 pb-6">
        <div className="h-3 w-16 rounded bg-neutral-200" />
        <div className="h-5 w-28 rounded bg-neutral-200" />
        <div className="h-3.5 w-36 rounded bg-neutral-100" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-full rounded-xl bg-neutral-100" />
        ))}
      </div>

      <div className="mt-6 border-t border-neutral-100 pt-6">
        <div className="h-9 w-full rounded-xl bg-neutral-100" />
      </div>
    </aside>
  );
};

export default MyPageSidebarSkeleton;
