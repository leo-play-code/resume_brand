interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export default function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  return (
    <div
      className={`rounded-full border-2 border-white/20 border-t-purple-500 animate-spin ${sizeMap[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}
