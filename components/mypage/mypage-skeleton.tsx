const MyPageSkeleton = () => {
  return (
    <div className="w-full animate-pulse space-y-6 py-6">
      <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="h-16 w-16 rounded-full bg-neutral-200" />
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-neutral-200" />
          <div className="h-4 w-48 rounded bg-neutral-100" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="h-24 rounded-2xl bg-neutral-100" />
        <div className="h-24 rounded-2xl bg-neutral-100" />
        <div className="h-24 rounded-2xl bg-neutral-100" />
      </div>
    </div>
  );
};

export default MyPageSkeleton;
