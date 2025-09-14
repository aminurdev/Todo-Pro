import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoListItemSkeleton() {
  return (
    <Card className="bg-card border-border animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Status Icon skeleton */}
          <Skeleton className="h-5 w-5 rounded-full mt-1 shrink-0" />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 space-y-2">
                {/* Title skeleton */}
                <Skeleton className="h-5 w-3/4" />
                {/* Description skeleton */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Actions skeleton */}
              <Skeleton className="h-8 w-8 rounded-full ml-2 shrink-0" />
            </div>

            {/* Badges and Tags skeleton */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-18 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            {/* Footer Info skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Avatar skeleton */}
              <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}