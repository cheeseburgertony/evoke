"use client";

import { useTranslations } from "next-intl";

export const PreviewLoading = () => {
  const t = useTranslations("MessageLoading");

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* 1. 升级版动态光效背景 - 保持丰富但不要太暗 */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-[120px] animate-pulse" />
        
        {/* 增加色彩斑斓的流动光点 */}
        <div className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite] opacity-50">
           <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" />
           <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-500/20 rounded-full blur-[80px] animate-pulse delay-700" />
           <div className="absolute top-2/3 left-1/2 w-56 h-56 bg-amber-400/20 rounded-full blur-[60px] animate-pulse delay-1000" />
        </div>
      </div>

      {/* 2. 核心卡片容器 - 适应亮/暗色主题 */}
      <div className="relative z-10 w-[340px] h-[480px] bg-background/60 backdrop-blur-2xl border border-primary/10 rounded-3xl shadow-2xl shadow-primary/5 overflow-hidden flex flex-col ring-1 ring-primary/5">
        
        {/* 顶部流光 */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer z-20" />
        
        {/* 模拟浏览器头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary/5 bg-primary/[0.02]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
          </div>
          {/* 地址栏模拟 */}
          <div className="h-5 w-32 bg-primary/5 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary/10" />
          </div>
        </div>

        {/* 3. 内容展示区 - 引入彩色骨架屏 */}
        <div className="flex-1 flex flex-col min-h-0 relative group">
          
          {/* 导航栏区域 */}
          <div className="h-14 border-b border-primary/5 flex items-center justify-between px-5">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/10 animate-pulse" /> {/* Logo */}
               <div className="my-auto h-3 w-16 bg-primary/10 rounded-full" />
             </div>
             <div className="flex gap-2">
               <div className="w-16 h-7 rounded bg-blue-500/10 border border-blue-500/10" /> {/* Button */}
             </div>
          </div>

          <div className="flex-1 p-5 space-y-5 overflow-hidden">
             
             {/* Hero Section - 使用透明度颜色适应主题 */}
             <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-primary/5 relative overflow-hidden group-hover:border-primary/10 transition-colors duration-500">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/20 to-transparent" />
                <div className="p-4 space-y-2">
                   <div className="w-1/2 h-4 bg-primary/10 rounded-md backdrop-blur-sm" />
                   <div className="w-3/4 h-3 bg-primary/5 rounded-md backdrop-blur-sm delay-75" />
                </div>
                {/* 装饰性元素 */}
                <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-xl animate-pulse" />
             </div>

             {/* Grid Items - 多色调微差 */}
             <div className="grid grid-cols-2 gap-3">
               {/* Item 1 - 偏蓝 */}
               <div className="aspect-[1.2] rounded-xl bg-blue-500/5 border border-primary/5 p-3 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-400/20" />
                  <div className="w-full h-2 bg-blue-400/20 rounded-full mb-1.5" />
                  <div className="w-2/3 h-2 bg-blue-400/10 rounded-full" />
               </div>
               
               {/* Item 2 - 偏橙 */}
               <div className="aspect-[1.2] rounded-xl bg-orange-500/5 border border-primary/5 p-3 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange-400/20" />
                  <div className="w-full h-2 bg-orange-400/20 rounded-full mb-1.5" />
                  <div className="w-2/3 h-2 bg-orange-400/10 rounded-full" />
               </div>
             </div>
             
             {/* List Items */}
             <div className="space-y-2.5">
               <div className="h-10 w-full rounded-lg bg-primary/[0.02] border border-primary/5 flex items-center px-3 gap-3">
                 <div className="w-6 h-6 rounded-md bg-emerald-500/10" />
                 <div className="flex-1 h-2 bg-primary/5 rounded-full" />
               </div>
             </div>

          </div>
        </div>

        {/* 底部状态栏 - 科技感升级 */}
        <div className="px-5 py-4 bg-gradient-to-t from-primary/5 to-transparent flex items-center justify-between border-t border-primary/5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground tracking-wide animate-pulse">
              {t("generating")}
            </span>
          </div>
          {/* 进度动画 - 跳动的点 */}
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-100" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce delay-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
