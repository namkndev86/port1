"use client"

interface CMSSkeletonProps {
  count?: number
}

export default function CMSSkeleton({ count = 3 }: CMSSkeletonProps) {
  const arr = Array.from({ length: count })

  return (
    <div className="flex flex-col gap-4 w-full animate-pulse">
      {arr.map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-card-border/30 bg-[#040813]/25 p-5 flex items-start gap-4 h-24"
        >
          {/* Checkbox Skeleton */}
          <div className="w-4.5 h-4.5 rounded bg-card-border/40 shrink-0 mt-1.5" />

          {/* Content Skeleton */}
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <div className="h-4.5 bg-card-border/60 rounded-lg w-1/3" />
              <div className="h-3.5 bg-card-border/40 rounded-md w-14" />
            </div>
            <div className="h-3 bg-card-border/40 rounded-md w-2/3" />
            <div className="flex gap-3 mt-1.5">
              <div className="h-2.5 bg-card-border/30 rounded-md w-20" />
              <div className="h-2.5 bg-card-border/30 rounded-md w-24" />
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="h-8 bg-card-border/40 rounded-lg w-28 shrink-0 self-center hidden sm:block" />
        </div>
      ))}
    </div>
  )
}
