"use client";

import Image from "next/image";
import { dark } from "@clerk/themes";
import { PricingTable } from "@clerk/nextjs";
import { useCurrentTheme } from "@/hooks/use-current-theme";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="Evoke"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center">订阅价格</h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          选择适合你的订阅
        </p>
        <PricingTable
          appearance={{
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
            theme: currentTheme === "dark" ? dark : undefined,
          }}
        />
      </section>
    </div>
  );
};

export default Page;
