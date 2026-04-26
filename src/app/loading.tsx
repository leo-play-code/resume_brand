import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-white/30 text-sm font-mono">Loading...</p>
      </div>
    </div>
  );
}
