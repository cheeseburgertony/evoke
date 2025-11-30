import { Skeleton } from "@/components/ui/skeleton";

export const MessagesContainerSkeleton = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-3 space-y-4">
          {[...Array(4)].map((_, i) => {
            if (i % 2 === 0) {
              return (
                <div key={i} className="flex gap-2 items-start justify-end">
                  <div className="flex-1 space-y-2 text-right">
                    <Skeleton className="h-4 w-2/3 ml-auto" />
                    <Skeleton className="h-4 w-3/4 ml-auto" />
                    <Skeleton className="h-4 w-1/2 ml-auto" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              );
            } else {
              return (
                <div key={i} className="flex gap-2 items-start">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};
