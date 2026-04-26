export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-white/[0.06] rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-white/[0.06] rounded-xl border border-white/[0.04]"
          />
        ))}
      </div>
    </div>
  );
}
