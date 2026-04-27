export default function LocaleLoading() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div
        className="w-6 h-6 rounded-full border-2 animate-spin"
        style={{
          borderColor: "var(--border)",
          borderTopColor: "var(--accent)",
        }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
