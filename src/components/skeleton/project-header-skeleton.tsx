import { Skeleton } from "@/components/ui/skeleton";

export const ProjectHeaderSkeleton = () => {
  return (
    <div className="p-2 flex justify-between items-center border-b">
      <Skeleton className="h-8 w-32" />
    </div>
  );
};
