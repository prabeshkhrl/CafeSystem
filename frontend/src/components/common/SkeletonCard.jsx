export default function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse bg-white rounded-2xl overflow-hidden border border-gray-100 ${className}`}>
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}