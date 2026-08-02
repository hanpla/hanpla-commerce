const AuthFormSkeleton = () => {
  return (
    <div className="w-full max-w-md animate-pulse rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="mx-auto mb-6 h-8 w-32 rounded-lg bg-neutral-200" />
      <div className="mx-auto mb-4 h-4 w-48 rounded bg-neutral-100" />
      <div className="mt-8 space-y-4">
        <div className="h-12 w-full rounded-xl bg-neutral-200" />
        <div className="h-12 w-full rounded-xl bg-neutral-200" />
        <div className="h-12 w-full rounded-xl bg-neutral-900/10" />
      </div>
      <div className="my-6 h-px w-full bg-neutral-200" />
      <div className="space-y-3">
        <div className="h-11 w-full rounded-xl bg-neutral-100" />
        <div className="h-11 w-full rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
};

export default AuthFormSkeleton;
