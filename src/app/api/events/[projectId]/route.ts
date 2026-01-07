import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { sseManager } from "@/lib/sse-manager";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  const { projectId } = await params;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  // 创建SSE流
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // 发送初始连接消息
      const initialMessage = `data: ${JSON.stringify({
        type: "connected",
        projectId,
      })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // 注册连接处理器
      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      sseManager.addConnection(projectId, sendEvent);

      // 心跳保持连接
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30000);

      // 清理函数
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        sseManager.removeConnection(projectId, sendEvent);
        try {
          controller.close();
        } catch {
          // 忽略关闭错误
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
