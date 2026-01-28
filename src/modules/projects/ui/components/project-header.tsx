"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  SunMoonIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IProjectHeaderProps {
  projectId: string;
}

const themes = ["light", "dark", "system"] as const;

export const ProjectHeader = ({ projectId }: IProjectHeaderProps) => {
  const t = useTranslations("ProjectHeader");

  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId }),
  );
  const { theme, setTheme } = useTheme();

  const queryClient = useQueryClient();
  const [isTruncated, setIsTruncated] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [project.name]);

  const { mutate: updateProject, isPending: isUpdating } = useMutation(
    trpc.projects.update.mutationOptions({
      onSuccess: () => {
        toast.success(t("renameSuccess"));
        setIsRenaming(false);
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryOptions({ id: projectId }),
        );
      },
      onError: () => {
        toast.error(t("renameError"));
      },
    }),
  );

  const handleRename = () => {
    if (!newName.trim() || newName === project.name) {
      setIsRenaming(false);
      return;
    }
    updateProject({ id: projectId, name: newName });
  };

  const ProjectName = (
    <span ref={textRef} className="text-sm font-medium truncate max-w-[180px]">
      {project.name}
    </span>
  );

  return (
    <header className="p-2 flex justify-between items-center border-b">
      {isRenaming ? (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="pl-2! hover:bg-transparent cursor-default"
          >
            <Image src="/logo.svg" alt="Evoke" width={18} height={18} />
          </Button>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="h-7 w-[200px] text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();

              if (e.key === "Escape") setIsRenaming(false);
            }}
          />
          <div className="flex items-center gap-x-1 ml-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-100/20"
              onClick={handleRename}
              disabled={isUpdating}
            >
              <CheckIcon className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-red-100/20"
              onClick={() => setIsRenaming(false)}
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="focus:visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"
            >
              <Image
                src="/logo.svg"
                alt="Evoke"
                width={18}
                height={18}
                className="mr-2"
              />
              {isTruncated ? (
                <Hint text={project.name} side="bottom">
                  {ProjectName}
                </Hint>
              ) : (
                ProjectName
              )}
              <ChevronDownIcon className="size-4 ml-1 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/">
                <ChevronLeftIcon />
                <span>{t("backToHome")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-4 text-muted-foreground" />
                <span>{t("appearance")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    {themes.map((theme) => (
                      <DropdownMenuRadioItem
                        key={theme}
                        value={theme}
                        className="cursor-pointer"
                      >
                        <span>{t(theme)}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setNewName(project.name);
                setIsRenaming(true);
              }}
              className="cursor-pointer"
            >
              <PencilIcon className="size-4 text-muted-foreground" />
              <span>{t("rename")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};
