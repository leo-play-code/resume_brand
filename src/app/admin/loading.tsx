export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-base flex">
      {/* Sidebar skeleton */}
      <aside className="fixed top-0 left-0 h-full w-56 border-r border-theme bg-base flex flex-col p-4 gap-3">
        <div className="animate-pulse space-y-3 mt-2">
          <div className="h-5 w-24 bg-white/[0.06] rounded" />
          <div className="h-3 w-16 bg-white/[0.04] rounded" />
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse h-8 bg-white/[0.06] rounded-lg"
            />
          ))}
        </div>
      </aside>

      {/* Content skeleton */}
      <main className="ml-56 flex-1 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/[0.06] rounded-lg" />
          <div className="h-4 w-64 bg-white/[0.04] rounded" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-white/[0.06] rounded-xl border border-white/[0.04]"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
