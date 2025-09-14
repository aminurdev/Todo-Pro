import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoCardSkeleton() {
  return (
    <Card className="bg-card border-border animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-5 w-3/4" />
            {/* Description skeleton */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          {/* More button skeleton */}
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Badges skeleton */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-18 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}