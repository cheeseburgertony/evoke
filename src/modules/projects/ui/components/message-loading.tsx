import Image from "next/image";
import { useEffect, useState } from "react";

// 循环显示加载消息
const ShimmerMessages = () => {
  // const messges = [
  //   'Thinking...',
  //   'Loading...',
  //   'Generating...',
  //   'Analyzing your request...',
  //   'Building your website...',
  //   'Crafting components...',
  //   'Optimizing layout...',
  //   'Adding final touches...',
  //   'Almost ready...'
  // ]
  const messages = [
    "思考中...",
    "加载中...",
    "生成中...",
    "正在分析您的请求...",
    "正在构建您的网站...",
    "制作组件中...",
    "优化布局中...",
    "添加最后的润色中...",
    "即将完成...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-muted-foreground animate-pulse">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

export const MessageLoading = () => {
  return (
    <div className="flex flex-col group px-2 pb-4">
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src="/logo.svg"
          alt="Evoke"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Evoke</span>
      </div>
      <div className="pl-8.5 flex flex-col gap-y-4">
        <ShimmerMessages />
      </div>
    </div>
  );
};
