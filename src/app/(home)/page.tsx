import Image from "next/image";
import { ProjectForm } from "@/modules/home/ui/components/project-form";

const Page = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Evoke"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-blod text-center">
          用Evoke来创建你的应用
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          通过和AI对话来创建你的应用和网站
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>
    </div>
  );
};

export default Page;
