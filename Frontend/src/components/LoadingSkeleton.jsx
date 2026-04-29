import React from "react";

const LoadingSkeleton = ({ count = 4, type }) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden glass-card">
            <div className="aspect-[2/3] shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-6 w-3/4 shimmer rounded" />
              <div className="flex justify-between">
                <div className="h-3 w-1/4 shimmer rounded" />
                <div className="h-3 w-1/4 shimmer rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 w-full shimmer rounded-lg opacity-20" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
