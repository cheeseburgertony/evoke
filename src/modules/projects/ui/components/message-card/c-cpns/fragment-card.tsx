import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { Fragment } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

interface IFragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

export const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: IFragmentCardProps) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 p-3 border rounded-lg bg-muted w-fit hover:bg-secondary transition-colors",
        {
          "bg-primary text-primary-foreground border-primary hover:bg-primary":
            isActiveFragment,
        }
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className="size-4 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {fragment.title}
        </span>
        <span className="text-sm">预览</span>
      </div>
      <div className="flex justify-center items-center mt-0.5">
        <ChevronRightIcon className="size-4" />
      </div>
    </button>
  );
};
