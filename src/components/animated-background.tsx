"use client";

import { useEffect, useRef } from "react";

// 光斑类
class GlowOrb {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  hue: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;

  constructor(
    canvas: HTMLCanvasElement | null = null,
    ctx: CanvasRenderingContext2D | null = null
  ) {
    this.x = Math.random() * canvas!.width;
    this.y = Math.random() * canvas!.height;
    this.radius = Math.random() * 300 + 200;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.hue = Math.random() * 60 + 200; // 蓝紫色调 200-260
    this.canvas = canvas;
    this.ctx = ctx;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // 边界反弹
    if (this.x < -this.radius) this.x = this.canvas!.width + this.radius;
    if (this.x > this.canvas!.width + this.radius) this.x = -this.radius;
    if (this.y < -this.radius) this.y = this.canvas!.height + this.radius;
    if (this.y > this.canvas!.height + this.radius) this.y = -this.radius;
  }

  draw() {
    if (!this.ctx) return;
    const gradient = this.ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, 0.15)`);
    gradient.addColorStop(0.5, `hsla(${this.hue}, 60%, 50%, 0.05)`);
    gradient.addColorStop(1, `hsla(${this.hue}, 50%, 40%, 0)`);

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const orbs: GlowOrb[] = [];
    for (let i = 0; i < 5; i++) {
      orbs.push(new GlowOrb(canvas, ctx));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制光斑
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 基础渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* 动态光斑 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-80"
      />

      {/* 玻璃形态装饰元素 */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 dark:from-violet-500/10 dark:to-fuchsia-500/10 blur-3xl animate-blob" />
      <div className="absolute top-[60%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 dark:from-cyan-500/10 dark:to-blue-500/10 blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-[5%] left-[30%] w-80 h-80 rounded-full bg-gradient-to-br from-rose-400/15 to-orange-400/15 dark:from-rose-500/8 dark:to-orange-500/8 blur-3xl animate-blob animation-delay-4000" />

      {/* 玻璃面板装饰 - 浅色模式使用淡彩色渐变 */}
      <div className="absolute top-[15%] right-[15%] w-64 h-64 rounded-3xl bg-gradient-to-br from-indigo-200/50 to-purple-200/40 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-xl border border-indigo-300/40 dark:border-white/10 rotate-12 animate-float shadow-xl shadow-indigo-500/10" />
      <div className="absolute bottom-[20%] left-[10%] w-48 h-48 rounded-3xl bg-gradient-to-br from-teal-200/45 to-cyan-200/35 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-xl border border-teal-300/40 dark:border-white/10 -rotate-12 animate-float-delayed shadow-xl shadow-teal-500/10" />
      <div className="absolute top-[50%] right-[5%] w-32 h-32 rounded-2xl bg-gradient-to-br from-rose-200/40 to-amber-200/35 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-lg border border-rose-300/35 dark:border-white/10 rotate-45 animate-float-slow shadow-lg shadow-rose-500/10" />

      {/* 光线效果 */}
      <div className="absolute top-0 left-1/4 w-px h-[60%] bg-gradient-to-b from-transparent via-purple-400/20 to-transparent rotate-[15deg] origin-top" />
      <div className="absolute top-0 right-1/3 w-px h-[70%] bg-gradient-to-b from-transparent via-blue-400/15 to-transparent -rotate-[20deg] origin-top" />

      {/* 噪点纹理层 */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 顶部高光 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent" />

      {/* 底部渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
