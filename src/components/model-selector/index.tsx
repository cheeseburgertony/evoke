"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type AIModelIdType,
  aiModels,
  type ModelConfig,
} from "@/lib/ai-models";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Hint } from "../hint";

interface ModelSelectorProps {
  value: AIModelIdType;
  onChange: (modelId: AIModelIdType) => void;
  className?: string;
}

export default function ModelSelector({
  value,
  onChange,
  className,
}: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<ModelConfig>(() => {
    return aiModels.find((m) => m.id === value) || aiModels[0];
  });
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  useEffect(() => {
    let model = aiModels.find((m) => m.id === value) || aiModels[0];
    if (!hasProAccess && model.pro) {
      model = aiModels.find((m) => !m.pro) || aiModels[0];
      if (model.id !== value) {
        onChange(model.id);
      }
    }
    setSelectedModel(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, hasProAccess]);

  const handleSelectModel = (model: ModelConfig) => {
    setSelectedModel(model);
    onChange(model.id);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("gap-2", className)}>
          <Hint text={selectedModel.name}>
            <Image
              src={selectedModel.icon}
              alt={selectedModel.name}
              width={20}
              height={20}
            />
            {/* <span className="hidden sm:inline">{selectedModel.name}</span> */}
            {/* <ChevronDown className="h-3 w-3 opacity-50" /> */}
          </Hint>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-66" align="end">
        <DropdownMenuGroup>
          {aiModels
            .filter((model) => !model.hidden)
            .map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => handleSelectModel(model)}
                className="cursor-pointer"
                disabled={model.pro && !hasProAccess}
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <Image
                      src={model.icon}
                      alt={model.name}
                      width={20}
                      height={20}
                    />
                    <span className="font-medium">{model.name}</span>
                  </div>
                  {selectedModel.id === model.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
